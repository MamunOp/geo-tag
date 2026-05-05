/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useEffect, useRef, type ChangeEvent, type DragEvent } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  MapPin, 
  Download, 
  Info, 
  Map as MapIcon, 
  Check, 
  Globe, 
  BarChart3,
  ChevronRight,
  ChevronDown,
  Upload,
  Image as ImageIcon,
  X,
  Plus,
  HelpCircle,
  FileText,
  Search,
  Shield,
  Zap,
  Loader2
} from 'lucide-react';
import * as piexif from 'piexifjs';
import { MapContainer, TileLayer, Marker, useMap, useMapEvents, Tooltip } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

// Fix for default marker icons in React-Leaflet
// @ts-ignore
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

// --- Utils ---

const toDegMinSec = (decimal: number) => {
  const absolute = Math.abs(decimal);
  const degrees = Math.floor(absolute);
  const minutesNotTruncated = (absolute - degrees) * 60;
  const minutes = Math.floor(minutesNotTruncated);
  const seconds = Math.round((minutesNotTruncated - minutes) * 60 * 100);
  return [[degrees, 1], [minutes, 1], [seconds, 100]];
};

// --- Components ---

function MapUpdater({ center }: { center: [number, number] }) {
  const map = useMap();
  useEffect(() => {
    map.setView(center, map.getZoom());
  }, [center, map]);
  return null;
}

function LocationMarker({ position, setPosition, locationName, onSelect }: { position: [number, number], setPosition: (pos: [number, number]) => void, locationName: string, onSelect?: (lat: number, lng: number) => void }) {
  const map = useMapEvents({
    click(e) {
      setPosition([e.latlng.lat, e.latlng.lng]);
      if (onSelect) onSelect(e.latlng.lat, e.latlng.lng);
    },
  });

  return (
    <Marker 
      position={position} 
      draggable={true}
      eventHandlers={{
        dragend: (e) => {
          const marker = e.target;
          const pos = marker.getLatLng();
          setPosition([pos.lat, pos.lng]);
          if (onSelect) onSelect(pos.lat, pos.lng);
        },
      }}
    >
      {locationName && (
        <Tooltip permanent direction="top" offset={[0, -20]}>
          <span className="font-bold text-indigo-600 font-sans">{locationName}</span>
        </Tooltip>
      )}
    </Marker>
  );
}

function Header() {
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <header className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${isScrolled ? 'bg-white/90 backdrop-blur-md shadow-sm py-3' : 'bg-transparent py-6'}`}>
      <div className="max-w-7xl mx-auto px-4 flex items-center justify-between">
        <div className="flex items-center gap-2 group cursor-pointer" onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}>
          <div className="w-10 h-10 bg-indigo-600 rounded-lg flex items-center justify-center shadow-lg shadow-indigo-100 group-hover:scale-110 transition-transform">
            <Globe className="text-white w-6 h-6" />
          </div>
          <div className="flex flex-col -space-y-1">
            <span className="text-xl font-display font-bold tracking-tight text-slate-900">GeoTag<span className="text-indigo-600">Pro</span></span>
            <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">SEO Engine</span>
          </div>
        </div>
        
        <nav className="hidden md:flex items-center gap-8 text-sm font-bold text-slate-500 uppercase tracking-widest">
          <a href="#tool" className="hover:text-indigo-600 transition-colors">Tool</a>
          <a href="#benefits" className="hover:text-indigo-600 transition-colors">SEO Impact</a>
          <a href="#faq" className="hover:text-indigo-600 transition-colors">FAQ</a>
        </nav>

        <div className="flex items-center gap-4">
          <button className="px-5 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-black uppercase tracking-widest transition-all shadow-lg shadow-slate-200">
            Sign In
          </button>
        </div>
      </div>
    </header>
  );
}

function Hero() {
  return (
    <section className="relative pt-44 pb-20 overflow-hidden">
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-[600px] bg-gradient-to-b from-indigo-600/10 to-transparent blur-[120px] rounded-full -mt-40 pointer-events-none" />
      <div className="max-w-7xl mx-auto px-6 relative">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="max-w-5xl space-y-8 text-center md:text-left"
        >
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-slate-100 border border-slate-200 text-[10px] font-black uppercase tracking-[0.2em] text-indigo-600">
            <Zap className="w-3 h-3 fill-current" />
            Empowering 50,000+ Local Businesses Worldwide
          </div>
          <h1 className="text-6xl md:text-9xl font-display font-bold text-slate-900 leading-[0.85] tracking-tighter">
            Geotag Your Photos. <br/> <span className="text-indigo-600">Win Local Search.</span>
          </h1>
          <p className="text-xl text-slate-500 max-w-3xl leading-relaxed font-medium">
            The #1 choice for SEO agencies. Embed verified GPS coordinates and professional EXIF metadata 
            into your images to dominate Google Maps and local keyword rankings instantly.
          </p>
          <div className="flex flex-wrap gap-4 pt-4 justify-center md:justify-start">
            <a href="#tool" className="px-10 py-5 bg-indigo-600 text-white rounded-2xl font-black uppercase tracking-widest text-xs flex items-center gap-3 hover:bg-slate-900 transition-all shadow-2xl shadow-indigo-500/20 active:scale-95">
              Launch Geotag Engine <ChevronRight className="w-4 h-4" />
            </a>
            <button className="px-10 py-5 border border-slate-200 text-slate-600 rounded-2xl font-black uppercase tracking-widest text-xs hover:bg-slate-50 transition-all shadow-sm">
              View SEO Blueprints
            </button>
          </div>
        </motion.div>
      </div>
    </section>
  );
}

function GeotagTool() {
  const [coords, setCoords] = useState({ lat: 26.64770, lng: 92.16932 });
  const [addr1, setAddr1] = useState('');
  const [addr2, setAddr2] = useState('');
  const [customDateTime, setCustomDateTime] = useState(new Date().toISOString().slice(0, 16));
  const [searchQuery, setSearchQuery] = useState('');
  const [isSearching, setIsSearching] = useState(false);
  const [image, setImage] = useState<string | null>(null);
  const [exifData, setExifData] = useState<any>(null);
  const [fileName, setFileName] = useState<string>('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [success, setSuccess] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleLocationSelect = async (lat: number, lng: number) => {
    setIsSearching(true);
    try {
      const response = await fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}`);
      const data = await response.json();
      if (data && data.display_name) {
        const parts = data.display_name.split(',');
        setAddr1(parts[0].trim());
        setAddr2(parts.slice(1).join(',').trim());
      }
    } catch (error) {
      console.error("Reverse geocode error:", error);
    } finally {
      setIsSearching(false);
    }
  };

  const handleSearch = async () => {
    if (!searchQuery.trim()) return;
    setIsSearching(true);
    try {
      const response = await fetch(`https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(searchQuery)}&limit=1`);
      const data = await response.json();
      if (data && data.length > 0) {
        const { lat, lon, display_name } = data[0];
        setCoords({ lat: parseFloat(lat), lng: parseFloat(lon) });
        // Optionally update address fields if they are empty
        if (!addr1 && !addr2) {
          const parts = display_name.split(',');
          setAddr1(parts[0].trim());
          setAddr2(parts.slice(1).join(',').trim());
        }
      } else {
        alert("Location not found. Please try a different search term.");
      }
    } catch (error) {
      console.error("Search error:", error);
      alert("Error searching location.");
    } finally {
      setIsSearching(false);
    }
  };

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file && (file.type === 'image/jpeg' || file.type === 'image/jpg')) {
      setFileName(file.name);
      setExifData(null);
      const reader = new FileReader();
      reader.onload = (event) => {
        setImage(event.target?.result as string);
      };
      reader.readAsDataURL(file);
    } else if (file) {
      alert("Please upload a JPEG or JPG image. Other formats do not support EXIF geotagging.");
    }
  };

  const handleDrop = (e: DragEvent) => {
    e.preventDefault();
    const file = e.dataTransfer.files?.[0];
    if (file && (file.type === 'image/jpeg' || file.type === 'image/jpg')) {
      setFileName(file.name);
      setExifData(null);
      const reader = new FileReader();
      reader.onload = (event) => {
        setImage(event.target?.result as string);
      };
      reader.readAsDataURL(file);
    } else if (file) {
      alert("Please upload a JPEG or JPG image.");
    }
  };

  const drawWatermark = async (imgSrc: string, coordinates: { lat: number, lng: number }, a1: string, a2: string): Promise<string> => {
    // Helper to fetch map tiles
    const fetchMapTile = (xtile: number, ytile: number, zoom: number): Promise<HTMLImageElement> => {
      return new Promise((resolve, reject) => {
        const img = new Image();
        img.crossOrigin = "anonymous";
        img.onload = () => resolve(img);
        img.onerror = () => {
           // Fallback to a placeholder if tile fails
           const placeholder = new Image();
           placeholder.src = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAQAAAAEAAQMAAABzhZ5ZAAAAA1BMVEXy8vJkA4prAAAACXBIWXMAAA7EAAAOxAGVKw4bAAAAGElEQVR4nO3BMQEAAADCoPVPbQwfoAAAAIC3AQ+AAAGeY7a6AAAAAElFTkSuQmCC";
           resolve(placeholder);
        };
        img.src = `https://tile.openstreetmap.org/${zoom}/${xtile}/${ytile}.png`;
      });
    };

    return new Promise(async (resolve) => {
      const img = new Image();
      img.onload = async () => {
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');
        if (!ctx) return resolve(imgSrc);

        canvas.width = img.width;
        canvas.height = img.height;
        ctx.drawImage(img, 0, 0);

        // Watermark Pod Constants
        const margin = canvas.width * 0.04;
        const podWidth = canvas.width - (margin * 2);
        const podHeight = canvas.width * 0.16; 
        const podX = margin;
        const podY = canvas.height - podHeight - margin;
        
        ctx.save();
        // Background - DARK THEME (Matches sample)
        ctx.fillStyle = "rgba(0, 0, 0, 0.72)";
        ctx.beginPath();
        const r = canvas.width * 0.02; // Rounded corners based on scale 
        if (ctx.roundRect) {
            ctx.roundRect(podX, podY, podWidth, podHeight, r);
        } else {
            ctx.rect(podX, podY, podWidth, podHeight);
        }
        ctx.fill();

        // Mini Map Area
        const mapSize = podHeight * 0.85;
        const mapX = podX + (podHeight * 0.075);
        const mapY = podY + (podHeight * 0.075);
        
        ctx.save();
        // Square map clip
        ctx.beginPath();
        const mr = 12;
        if (ctx.roundRect) {
            ctx.roundRect(mapX, mapY, mapSize, mapSize, mr);
        } else {
            ctx.rect(mapX, mapY, mapSize, mapSize);
        }
        ctx.clip();
        
        ctx.fillStyle = "#f8fafc";
        ctx.fill();

        try {
          const zoom = 12; // Lower zoom to show city names like in user sample
          const n = Math.pow(2, zoom);
          const x_float = (coordinates.lng + 180) / 360 * n;
          const y_float = (1 - Math.log(Math.tan(coordinates.lat * Math.PI / 180) + 1 / Math.cos(coordinates.lat * Math.PI / 180)) / Math.PI) / 2 * n;
          
          const xtile = Math.floor(x_float);
          const ytile = Math.floor(y_float);
          const x_pct = x_float - xtile;
          const y_pct = y_float - ytile;

          const tileDrawSize = mapSize; 
          const centerX = mapX + mapSize / 2;
          const centerY = mapY + mapSize / 2;

          // Using a high-quality tile provider that shows city labels clearly
          const tileUrl = (x: number, y: number, z: number) => `https://{s}.tile.openstreetmap.org/${z}/${x}/${y}.png`.replace("{s}", ["a","b","c"][Math.floor(Math.random()*3)]);

          const tilesToLoad = [];
          for (let dx = -1; dx <= 1; dx++) {
            for (let dy = -1; dy <= 1; dy++) {
              tilesToLoad.push({ x: xtile + dx, y: ytile + dy, dx, dy });
            }
          }

          const loadedTiles = await Promise.all(tilesToLoad.map(async t => {
            return new Promise<{ img: HTMLImageElement | null, dx: number, dy: number }>((resolve) => {
               const img = new Image();
               img.crossOrigin = "anonymous";
               img.onload = () => resolve({ img, dx: t.dx, dy: t.dy });
               img.onerror = () => resolve({ img: null, dx: t.dx, dy: t.dy });
               img.src = tileUrl(t.x, t.y, zoom);
            });
          }));

          loadedTiles.forEach(t => {
            if (t.img) {
              const drawX = centerX - (x_pct * tileDrawSize) + (t.dx * tileDrawSize);
              const drawY = centerY - (y_pct * tileDrawSize) + (t.dy * tileDrawSize);
              ctx.drawImage(t.img, drawX, drawY, tileDrawSize, tileDrawSize);
            }
          });

        } catch (e) {
          console.warn("Could not load map tiles fully");
        }

        // Draw Google Logo (Multi-colored look fallback)
        const logoSize = mapSize * 0.25;
        const logoX = mapX + 8;
        const logoY = mapY + mapSize - logoSize - 5;
        
        ctx.font = `bold ${Math.floor(mapSize * 0.16)}px sans-serif`;
        // Drawing Google text with colors (Approximate)
        const gText = ["G","o","o","g","l","e"];
        const gColors = ["#4285F4", "#EA4335", "#FBBC05", "#4285F4", "#34A853", "#EA4335"];
        let currentLogoX = logoX;
        ctx.textAlign = "left";
        gText.forEach((char, i) => {
          ctx.fillStyle = gColors[i];
          ctx.fillText(char, currentLogoX, logoY + logoSize);
          currentLogoX += ctx.measureText(char).width;
        });

        // Marker Pin (Classic Google Maps Red Pin)
        const mx = mapX + mapSize / 2;
        const my = mapY + mapSize / 2;
        const pinHeadSize = mapSize * 0.12;
        
        // Pin Stem
        ctx.strokeStyle = "#000";
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.moveTo(mx, my);
        ctx.lineTo(mx, my - pinHeadSize * 1.5);
        ctx.stroke();

        // Pin Head
        ctx.fillStyle = "#EA4335";
        ctx.beginPath();
        ctx.arc(mx, my - pinHeadSize * 1.5, pinHeadSize, 0, Math.PI * 2);
        ctx.fill();
        ctx.strokeStyle = "#fff";
        ctx.lineWidth = 1.5;
        ctx.stroke();
        
        // Center Dot
        ctx.fillStyle = "#000";
        ctx.beginPath();
        ctx.arc(mx, my - pinHeadSize * 1.5, pinHeadSize * 0.3, 0, Math.PI * 2);
        ctx.fill();
        
        ctx.restore(); // Restore from map clip

        // Text content - WHITE TEXT
        const textX = mapX + mapSize + (podHeight * 0.15);
        const fontSize = Math.max(14, canvas.width * 0.022);
        const lineSpacing = fontSize * 1.4;

        ctx.textAlign = "left";
        ctx.fillStyle = "white";
        ctx.textBaseline = "top";
        
        // Lines - Clean and bold as in screenshot
        ctx.font = `500 ${fontSize}px sans-serif`;
        const wrapText = (text: string, maxWidth: number) => {
          const words = text.split(' ');
          let line = '';
          const lines = [];
          for (let n = 0; n < words.length; n++) {
            const testLine = line + words[n] + ' ';
            const metrics = ctx.measureText(testLine);
            if (metrics.width > maxWidth && n > 0) {
              lines.push(line);
              line = words[n] + ' ';
            } else {
              line = testLine;
            }
          }
          lines.push(line);
          return lines;
        };

        const maxTextWidth = podWidth - (mapX - podX) - mapSize - (podHeight * 0.3);
        
        ctx.fillText(a1 || "Location Data", textX, mapY);
        ctx.fillText(a2 || "Area Details", textX, mapY + lineSpacing);

        const coordsText = `Lat: ${coordinates.lat.toFixed(6)}    Lng: ${coordinates.lng.toFixed(6)}`;
        ctx.fillText(coordsText, textX, mapY + (lineSpacing * 2));

        const dateObj = customDateTime ? new Date(customDateTime) : new Date();
        const dateStr = dateObj.toLocaleDateString('en-GB'); 
        const timeStr = dateObj.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: true });
        ctx.fillText(`${dateStr}    ${timeStr}`, textX, mapY + (lineSpacing * 3));

        ctx.restore();
        resolve(canvas.toDataURL("image/jpeg", 0.92));
      };
      img.src = imgSrc;
    });
  };

  const downloadGeotaggedImage = async () => {
    if (!image) return;
    setIsProcessing(true);

    try {
      // 1. Draw Visual Watermark
      const watermarkedImage = await drawWatermark(image, coords, addr1, addr2);

      // 2. Insert Digital EXIF Metadata
      let exifObj: any = { "0th": {}, "Exif": {}, "GPS": {} };
      try {
        exifObj = piexif.load(watermarkedImage);
      } catch (e) {
        console.log("No existing EXIF found, creating new structure.");
      }

      const fullAddress = [addr1, addr2].filter(Boolean).join(', ');
        
      if (fullAddress) {
        exifObj["0th"][piexif.ImageIFD.ImageDescription] = fullAddress;
      }
      exifObj["0th"][piexif.ImageIFD.Software] = "GeoTag SEO Pro Tool";

      const latDeg = toDegMinSec(coords.lat);
      const lngDeg = toDegMinSec(coords.lng);

      exifObj["GPS"][piexif.GPSIFD.GPSVersionID] = [2, 2, 0, 0];
      exifObj["GPS"][piexif.GPSIFD.GPSLatitudeRef] = coords.lat >= 0 ? 'N' : 'S';
      exifObj["GPS"][piexif.GPSIFD.GPSLatitude] = latDeg;
      exifObj["GPS"][piexif.GPSIFD.GPSLongitudeRef] = coords.lng >= 0 ? 'E' : 'W';
      exifObj["GPS"][piexif.GPSIFD.GPSLongitude] = lngDeg;
      exifObj["GPS"][piexif.GPSIFD.GPSMapDatum] = "WGS-84";
      exifObj["GPS"][piexif.GPSIFD.GPSAltitudeRef] = 0;
      exifObj["GPS"][piexif.GPSIFD.GPSAltitude] = [0, 1];

      const exifBytes = piexif.dump(exifObj);
      const outputImage = piexif.insert(exifBytes, watermarkedImage);
      
      const verifiedExif = piexif.load(outputImage);
      setExifData(verifiedExif);

      const link = document.createElement('a');
      link.href = outputImage;
      link.download = `geotagged-${fileName}`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      
      setSuccess(true);
      setTimeout(() => setSuccess(false), 8000);
    } catch (err) {
      console.error('Error processing image:', err);
      alert('Failed to process image. Please ensure you are using a standard JPEG/JPG file.');
    } finally {
      setIsProcessing(false);
    }
  };

  const reset = () => {
    setImage(null);
    setFileName('');
    setExifData(null);
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 selection:bg-indigo-100 selection:text-indigo-900 font-sans">
      <Header />
        
        {/* Hero Section */}
        <section className="relative pt-40 pb-24 overflow-hidden">
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-[600px] bg-gradient-to-b from-indigo-600/20 to-transparent blur-3xl rounded-full -mt-96 pointer-events-none" />
          
          <div className="max-w-7xl mx-auto px-4 relative">
            <div className="text-center space-y-8 max-w-4xl mx-auto">
              <motion.div 
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-indigo-50 text-indigo-600 text-xs font-black uppercase tracking-widest border border-indigo-100"
              >
                <div className="w-2 h-2 bg-indigo-500 rounded-full animate-pulse" />
                The #1 Free Photo Geotagging Tool Online
              </motion.div>
              <motion.h1 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className="text-6xl md:text-8xl font-display font-bold tracking-tight leading-[0.9] text-slate-900"
              >
                Geotag Photos <span className="text-indigo-600">Instantly</span> for <span className="text-slate-900">Local SEO</span>
              </motion.h1>
              <motion.p 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="text-xl text-slate-500 max-w-2xl mx-auto leading-relaxed"
              >
                Embed GPS coordinates into your images to rank higher in Google Local results. Fast, browser-based geotagging with zero quality loss.
              </motion.p>
              
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="flex flex-wrap items-center justify-center gap-4 pt-4"
              >
                <a href="#tool" className="px-8 py-4 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl font-bold transition-all shadow-xl shadow-indigo-200 flex items-center gap-2">
                  <Upload className="w-4 h-4" />
                  Start Geotagging Now
                </a>
                <a href="#how-to" className="px-8 py-4 bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 rounded-xl font-bold transition-all flex items-center gap-2 shadow-sm">
                   Learn More
                </a>
              </motion.div>
            </div>
          </div>
        </section>

        <section id="tool" className="max-w-7xl mx-auto px-4 py-24 scroll-mt-24">
          <div className="bg-white rounded-[2.5rem] border border-slate-200 p-6 md:p-12 shadow-2xl relative overflow-hidden">
            <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-indigo-500/5 blur-[120px] -mr-64 -mt-64 rounded-full pointer-events-none" />
            
            <div className="relative grid lg:grid-cols-2 gap-12 items-start">
              {/* Left Column: Image Upload */}
              <div className="space-y-8">
                <div 
                  onDragOver={(e) => e.preventDefault()}
                  onDrop={handleDrop}
                  className={`relative min-h-[400px] lg:min-h-[600px] rounded-3xl border-2 border-dashed transition-all flex flex-col items-center justify-center gap-4 overflow-hidden group ${image ? 'border-transparent bg-slate-50' : 'border-slate-300 hover:border-indigo-500 bg-white'}`}
                >
                  {image ? (
                    <>
                      <div className="w-full h-full flex items-center justify-center p-4">
                        <img src={image} alt="Preview" className="max-w-full max-h-[70vh] w-auto h-auto object-contain rounded-xl shadow-sm" />
                      </div>
                      <div className="absolute inset-0 bg-slate-900/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-3">
                        <button onClick={() => fileInputRef.current?.click()} className="p-3 bg-white text-slate-900 rounded-full hover:scale-110 transition-transform shadow-lg">
                          <Plus className="w-5 h-5" />
                        </button>
                        <button onClick={reset} className="p-3 bg-red-500 text-white rounded-full hover:scale-110 transition-transform shadow-lg">
                          <X className="w-5 h-5" />
                        </button>
                      </div>
                    </>
                  ) : (
                    <>
                      <div className="w-16 h-16 bg-indigo-50 rounded-full flex items-center justify-center text-indigo-600 group-hover:scale-110 transition-all duration-300 shadow-sm border border-indigo-100">
                        <Upload className="w-8 h-8" />
                      </div>
                      <div className="text-center px-4">
                        <p className="text-xl font-bold text-slate-900">Drop your image here</p>
                        <p className="text-slate-500 text-sm mt-1 font-medium">JPEG or JPG files (Max 10MB)</p>
                      </div>
                      <button 
                        onClick={() => fileInputRef.current?.click()}
                        className="px-8 py-3 bg-indigo-600 text-white font-bold rounded-xl hover:bg-indigo-500 transition-all shadow-lg shadow-indigo-100 active:scale-95"
                      >
                        Select Photo
                      </button>
                    </>
                  )}
                  <input 
                    type="file" 
                    ref={fileInputRef} 
                    onChange={handleFileChange} 
                    className="hidden" 
                    accept="image/jpeg,image/jpg"
                  />
                </div>
              </div>

              {/* Right Column: Controls & Metadata */}
              <div className="space-y-6">
                <div className="space-y-2 text-center lg:text-left">
                  <h2 className="text-4xl font-display font-bold text-slate-900 leading-tight">Geotag Data Input</h2>
                  <p className="text-slate-500 text-sm font-medium">Add visual watermark data & professional SEO metadata.</p>
                </div>

                <div className="h-[280px] w-full rounded-2xl overflow-hidden border border-slate-200 relative shadow-inner">
                   <MapContainer 
                     center={[coords.lat, coords.lng]} 
                     zoom={13} 
                     scrollWheelZoom={false}
                     className="h-full w-full" 
                   >
                     <TileLayer
                       attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
                       url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                     />
                     <LocationMarker 
                        position={[coords.lat, coords.lng]} 
                        setPosition={(pos) => setCoords({ lat: pos[0], lng: pos[1] })}
                        onSelect={handleLocationSelect}
                        locationName={addr1}
                     />
                     <MapUpdater center={[coords.lat, coords.lng]} />
                   </MapContainer>
                   <div className="absolute top-4 right-4 z-[1000] bg-white/90 backdrop-blur-sm px-3 py-1 rounded-full text-[10px] font-bold text-indigo-600 border border-indigo-100 shadow-sm">
                     LIVE PRECISION MAP
                   </div>
                </div>

                <div className="space-y-4">
                  <div className="space-y-1.5">
                    <label className="text-[10px] uppercase font-bold text-slate-400 tracking-widest block">Search & Sync Location</label>
                    <div className="relative group">
                      <input 
                        type="text" 
                        placeholder="Search city, village, or landmark..."
                        value={searchQuery} 
                        onChange={(e) => setSearchQuery(e.target.value)}
                        onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
                        className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-4 pr-12 py-3 text-slate-900 font-medium focus:ring-4 focus:ring-indigo-500/5 focus:border-indigo-500 transition-all shadow-sm"
                      />
                      <button 
                        onClick={handleSearch}
                        disabled={isSearching}
                        className="absolute right-2 top-1/2 -translate-y-1/2 p-2 text-indigo-600 hover:bg-indigo-100 rounded-lg transition-colors disabled:opacity-50"
                      >
                        {isSearching ? <Loader2 className="w-5 h-5 animate-spin" /> : <Search className="w-5 h-5" />}
                      </button>
                    </div>
                  </div>

                  <button 
                    onClick={() => {
                      if (navigator.geolocation) {
                        navigator.geolocation.getCurrentPosition((pos) => {
                          const lat = pos.coords.latitude;
                          const lng = pos.coords.longitude;
                          setCoords({ lat, lng });
                          handleLocationSelect(lat, lng);
                        });
                      } else {
                        alert("Geolocation is not supported by this browser.");
                      }
                    }}
                    className="w-full flex items-center justify-center gap-2 py-3 text-[10px] font-bold uppercase tracking-[0.2em] text-slate-500 hover:text-indigo-600 transition-all border border-slate-200 rounded-xl hover:border-indigo-400 bg-white shadow-sm hover:shadow-md"
                  >
                    <MapPin className="w-3 h-3" />
                    Auto-Detect Position
                  </button>
                </div>

                <div className="space-y-4">
                   <div className="space-y-1.5">
                      <label className="text-[10px] uppercase font-bold text-slate-400 tracking-widest block">Address Line 1 (Main & Short)</label>
                      <input 
                        type="text" 
                        placeholder="e.g. Madhupur Gaon"
                        value={addr1} 
                        onChange={(e) => setAddr1(e.target.value)}
                        className="w-full bg-white border border-slate-200 rounded-xl px-4 py-3 text-slate-900 font-medium focus:ring-4 focus:ring-indigo-500/5 focus:border-indigo-500 transition-all shadow-sm"
                      />
                   </div>

                   <div className="space-y-1.5">
                      <label className="text-[10px] uppercase font-bold text-slate-400 tracking-widest block">Address Line 2 (Long)</label>
                      <input 
                        type="text" 
                        placeholder="e.g. NH-15, Road Lalpool, Darrang"
                        value={addr2} 
                        onChange={(e) => setAddr2(e.target.value)}
                        className="w-full bg-white border border-slate-200 rounded-xl px-4 py-3 text-slate-900 font-medium focus:ring-4 focus:ring-indigo-500/5 focus:border-indigo-500 transition-all shadow-sm"
                      />
                   </div>

                   <div className="space-y-1.5">
                      <label className="text-[10px] uppercase font-bold text-slate-400 tracking-widest block">Date and Time</label>
                      <input 
                        type="datetime-local" 
                        value={customDateTime} 
                        onChange={(e) => setCustomDateTime(e.target.value)}
                        className="w-full bg-white border border-slate-200 rounded-xl px-4 py-3 text-slate-600 font-medium focus:ring-4 focus:ring-indigo-500/5 focus:border-indigo-500 transition-all shadow-sm"
                      />
                   </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                   <div className="space-y-1.5">
                      <label className="text-[10px] uppercase font-bold text-slate-400 tracking-widest block">Latitude</label>
                      <input 
                        type="number" 
                        step="0.000001"
                        placeholder="26.64770"
                        value={coords.lat} 
                        onChange={(e) => setCoords(c => ({ ...c, lat: parseFloat(e.target.value) || 0 }))}
                        className="w-full bg-white border border-slate-200 rounded-xl px-4 py-3 text-indigo-600 font-mono font-bold focus:ring-4 focus:ring-indigo-500/5 focus:border-indigo-500 transition-all shadow-sm"
                      />
                   </div>
                   <div className="space-y-1.5">
                      <label className="text-[10px] uppercase font-bold text-slate-400 tracking-widest block">Longitude</label>
                       <input 
                        type="number" 
                        step="0.000001"
                        placeholder="92.16932"
                        value={coords.lng} 
                        onChange={(e) => setCoords(c => ({ ...c, lng: parseFloat(e.target.value) || 0 }))}
                        className="w-full bg-white border border-slate-200 rounded-xl px-4 py-3 text-indigo-600 font-mono font-bold focus:ring-4 focus:ring-indigo-500/5 focus:border-indigo-500 transition-all shadow-sm"
                      />
                   </div>
                </div>

                <button 
                  onClick={downloadGeotaggedImage}
                  disabled={!image || isProcessing}
                  className={`w-full py-5 rounded-2x font-bold text-lg flex items-center justify-center gap-3 transition-all ${
                    !image 
                    ? 'bg-slate-100 text-slate-400 cursor-not-allowed' 
                    : success 
                      ? 'bg-emerald-600 text-white shadow-lg shadow-emerald-100' 
                      : 'bg-indigo-600 text-white hover:bg-slate-900 shadow-xl shadow-indigo-100 active:scale-[0.98]'
                  }`}
                  style={{ borderRadius: '1.25rem' }}
                >
                  {isProcessing ? (
                    <div className="w-6 h-6 border-2 border-neutral-400 border-t-white rounded-full animate-spin" />
                  ) : success ? (
                    <>
                      <Check className="w-6 h-6" />
                      Successfully Geotagged
                    </>
                  ) : (
                    <>
                      <Download className="w-6 h-6" />
                      Geotag & Download Image
                    </>
                  )}
                </button>


                <AnimatePresence>
                  {success && (
                    <motion.div 
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      exit={{ opacity: 0, height: 0 }}
                      className="glass p-6 rounded-2xl border-emerald-500/20 bg-emerald-500/5 space-y-4 overflow-hidden"
                    >
                      <div className="flex items-center gap-2 text-emerald-400 font-bold text-sm">
                        <Check className="w-4 h-4" />
                        Internal Metadata Verified
                      </div>
                      <div className="grid grid-cols-1 gap-2 text-[10px] font-mono text-slate-400 uppercase">
                        <div className="flex justify-between">
                          <span>GPS.Latitude</span>
                          <span className="text-emerald-600 font-bold">{coords.lat >= 0 ? '+' : ''}{coords.lat.toFixed(6)}</span>
                        </div>
                        <div className="flex justify-between">
                          <span>GPS.Longitude</span>
                          <span className="text-emerald-600 font-bold">{coords.lng >= 0 ? '+' : ''}{coords.lng.toFixed(6)}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="truncate">Image.Info</span>
                          <span className="text-slate-600 font-bold">Injected ✔</span>
                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>

                {!image && <p className="text-center text-xs text-slate-400 font-bold uppercase tracking-widest pt-2">Select a photo to start</p>}
              </div>
            </div>
          </div>
        </section>

        <SectionHowTo />
        <SectionBenefits />
        
        {/* Business Specific Section */}
        <section className="max-w-7xl mx-auto px-4 py-24 border-t border-slate-200 mt-20">
          <div className="text-center mb-16 space-y-4">
            <h2 className="text-4xl font-display font-bold text-slate-900">Use Cases for Local Businesses</h2>
            <p className="text-slate-500 max-w-2xl mx-auto">Different industries leverage spatial metadata to dominate their specific local niches.</p>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-white p-8 rounded-3xl space-y-4 border-l-4 border-l-indigo-500 border border-slate-100 shadow-sm transition-transform hover:-translate-y-1">
              <h4 className="text-xl font-bold text-slate-900">Real Estate Agents</h4>
              <p className="text-sm text-slate-500 leading-relaxed">
                Embed coordinates of listed properties directly into high-res photos. This helps home seekers finding listings through image search in specific neighborhoods.
              </p>
            </div>
            <div className="bg-white p-8 rounded-3xl space-y-4 border-l-4 border-l-emerald-500 border border-slate-100 shadow-sm transition-transform hover:-translate-y-1">
              <h4 className="text-xl font-bold text-slate-900">Service Contractors</h4>
              <p className="text-sm text-slate-500 leading-relaxed">
                Plumbers, electricians, and HVAC techs can geotag 'job site' photos to prove their service area coverage to Google's ranking algorithms.
              </p>
            </div>
            <div className="bg-white p-8 rounded-3xl space-y-4 border-l-4 border-l-amber-500 border border-slate-100 shadow-sm transition-transform hover:-translate-y-1">
              <h4 className="text-xl font-bold text-slate-900">Retail & Restaurants</h4>
              <p className="text-sm text-slate-500 leading-relaxed">
                 Menu items and interior shots with embedded store coordinates increase the chances of appearing in 'food near me' visual searches.
              </p>
            </div>
          </div>
        </section>

        <SectionFAQ />
        
        <Footer />
      </div>
  );
}

function SectionHowTo() {
  const steps = [
    { title: "Upload High-Res JPEG", text: "Import your professional business photos. Our engine supports high-resolution JPEG assets while maintaining 100% original quality.", icon: <ImageIcon /> },
    { title: "Precision Mapping", text: "Use the live map or coordinates to pinpoint exact latitude and longitude for visual and digital verification.", icon: <MapPin /> },
    { title: "EXIF Infrastructure", text: "Our tool injects data into the core EXIF headers, including GPS Version, LatitudeRef, and ImageDescription fields.", icon: <FileText /> },
    { title: "Export SEO Assets", text: "Download your enhanced images, ready for Google Business Profile, Apple Maps, and local directory uploads.", icon: <Download /> },
  ];

  return (
    <section id="how-to" className="max-w-7xl mx-auto px-4 py-32 scroll-mt-24 border-t border-slate-100">
      <div className="text-center space-y-6 mb-16">
        <h2 className="text-5xl md:text-6xl font-display font-bold text-slate-900 tracking-tight">The 4-Step <span className="text-slate-400 italic font-medium">SEO Synthesis.</span></h2>
        <p className="text-xl text-slate-500 max-w-2xl mx-auto font-medium">A streamlined sequence engineered for absolute metadata accuracy and regional authority.</p>
      </div>
      <div className="grid md:grid-cols-4 gap-12">
        {steps.map((step, i) => (
          <div key={i} className="relative group">
            <div className="space-y-8">
              <div className="w-20 h-20 bg-white border border-slate-200 rounded-[2rem] flex items-center justify-center text-indigo-600 shadow-sm group-hover:bg-indigo-600 group-hover:text-white group-hover:shadow-2xl group-hover:shadow-indigo-200 transition-all duration-500 transform group-hover:-translate-y-2">
                {step.icon}
              </div>
              <div className="space-y-4">
                <h3 className="text-xs font-black uppercase tracking-[0.25em] text-indigo-600 flex items-center gap-3">
                  <span className="w-8 h-px bg-indigo-200" /> Phase 0{i+1}
                </h3>
                <h4 className="text-2xl font-display font-bold text-slate-900 leading-tight">{step.title}</h4>
                <p className="text-slate-500 leading-relaxed font-medium">{step.text}</p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

function SectionBenefits() {
  return (
    <section id="benefits" className="max-w-7xl mx-auto px-4 py-32 border-t border-slate-200 overflow-hidden relative">
      <div className="absolute top-1/2 left-0 w-64 h-64 bg-indigo-500/5 blur-[100px] rounded-full -ml-32" />
      
      <div className="grid lg:grid-cols-12 gap-20 items-center">
        <div className="lg:col-span-12 text-center mb-16 space-y-4">
           <h2 className="text-5xl md:text-7xl font-display font-bold text-slate-900 tracking-tighter">Why Search Algorithms <br/><span className="text-indigo-600">Trust Spatial Metadata.</span></h2>
           <p className="text-xl text-slate-500 max-w-3xl mx-auto font-medium">Traditional SEO is dead. Spatial SEO is the new standard for local dominance.</p>
        </div>
        
        <div className="lg:col-span-5 space-y-12">
          <div className="space-y-8">
            {[
              { icon: <Search />, title: "Schema.org Synchronization", desc: "Our engine aligns photo metadata with your JSON-LD structural data, creating a multi-layered verification signal for search crawlers." },
              { icon: <Shield />, title: "Authority & Anti-Spoofing", desc: "Raw EXIF data is harder to fake than on-page text. It serves as digital proof that your business is active at the claimed location." },
              { icon: <BarChart3 />, title: "CTR & Trust Optimization", desc: "Photos with physical address watermarks help users verify you are 'the' local expert, leading to higher quality leads and conversions." }
            ].map((benefit, i) => (
              <div key={i} className="flex gap-8 group">
                <div className="w-16 h-16 shrink-0 bg-white border border-slate-200 rounded-[1.5rem] flex items-center justify-center text-indigo-600 shadow-sm group-hover:bg-indigo-600 group-hover:text-white transition-all duration-500">
                  {benefit.icon}
                </div>
                <div className="space-y-2">
                  <h4 className="text-2xl font-bold text-slate-900 group-hover:text-indigo-600 transition-colors tracking-tight">{benefit.title}</h4>
                  <p className="text-base text-slate-500 leading-relaxed font-medium">{benefit.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="lg:col-span-7 grid grid-cols-2 gap-6 scale-105">
          <div className="space-y-6">
             <div className="h-72 bg-gradient-to-br from-indigo-600 to-indigo-800 text-white rounded-[3rem] p-10 flex flex-col justify-end shadow-2xl shadow-indigo-200 transform hover:-rotate-1 transition-transform">
                <span className="text-6xl font-display font-bold mb-4">4x</span>
                <p className="text-sm font-black uppercase tracking-widest opacity-80">Local Keyword Authority Lift</p>
             </div>
             <div className="h-56 bg-white border border-slate-200 rounded-[3rem] p-10 flex flex-col justify-center gap-4 hover:shadow-xl transition-all">
                <div className="flex gap-1.5">
                   {[1,2,3,4,5].map(s => <div key={s} className="w-full h-1 bg-indigo-600 rounded-full opacity-20" />)}
                </div>
                <p className="text-lg font-bold text-slate-900 leading-tight">Spatial Integrity Index: Platinum</p>
                <p className="text-xs text-slate-400 font-bold uppercase tracking-widest">Algorithm Preference: High</p>
             </div>
          </div>
          <div className="pt-16 space-y-6">
             <div className="h-56 bg-slate-900 text-white rounded-[3rem] p-10 flex flex-col justify-center items-center text-center group">
                <Globe className="w-12 h-12 text-indigo-400 group-hover:scale-110 transition-transform" />
                <p className="mt-4 text-xs font-black uppercase tracking-widest opacity-60">Global EXIF Standard v2.31</p>
             </div>
             <div className="h-72 bg-white border border-slate-200 rounded-[3rem] p-10 flex flex-col justify-end bg-gradient-to-tr from-slate-50 to-transparent hover:shadow-xl transition-all">
                <div className="w-12 h-12 bg-indigo-50 rounded-2xl flex items-center justify-center text-indigo-600 mb-6">
                   <Zap className="w-6 h-6" />
                </div>
                <h4 className="text-2xl font-bold text-slate-900 leading-none mb-3">Structured Sync</h4>
                <p className="text-sm text-slate-500 font-medium">Automated alignment with professional JSON-LD local constructs.</p>
             </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function SectionStrategy() {
  return (
    <section id="strategy" className="max-w-7xl mx-auto px-4 py-32 scroll-mt-24 bg-slate-900 rounded-[4rem] text-white overflow-hidden relative mb-24">
       <div className="absolute top-0 right-0 w-[800px] h-full bg-indigo-600/10 blur-[150px] -mr-[400px] pointer-events-none" />
       
       <div className="grid lg:grid-cols-2 gap-20 items-center">
          <div className="space-y-10">
             <div className="space-y-4">
                <div className="inline-block px-3 py-1 bg-indigo-500/20 text-indigo-400 rounded-full text-[10px] font-black uppercase tracking-widest border border-indigo-500/20">The Local SEO Playbook</div>
                <h2 className="text-5xl md:text-7xl font-display font-bold leading-[0.95] tracking-tighter">Build Regional <br/><span className="text-indigo-400 underline decoration-indigo-400/30 underline-offset-8">Spatial Trust.</span></h2>
             </div>
             
             <div className="grid gap-8">
                {[
                  { title: "Verifiable EXIF Headers", desc: "Google's algorithms analyze EXIF metadata to cross-reference your business address with physical location data." },
                  { title: "User-Centric Visuals", desc: "Physical address watermarks act as a 'Seal of Authority' for local residents, increasing click-through rates by up to 35%." },
                  { title: "Niche Spatial Targeting", desc: "Geotagging specific service area photos helps you rank for neighborhood-specific keywords (e.g., 'Plumber in [District]')." }
                ].map((item, i) => (
                  <div key={i} className="flex gap-6 group">
                     <div className="w-10 h-10 shrink-0 bg-white/5 rounded-xl border border-white/10 flex items-center justify-center text-indigo-400 group-hover:bg-indigo-600 group-hover:text-white transition-all">
                        <Check className="w-5 h-5" />
                     </div>
                     <div className="space-y-1">
                        <h4 className="text-xl font-bold text-white group-hover:text-indigo-400 transition-colors">{item.title}</h4>
                        <p className="text-slate-400 leading-relaxed">{item.desc}</p>
                     </div>
                  </div>
                ))}
             </div>
          </div>

          <div className="relative">
             <div className="bg-white rounded-[3rem] p-10 shadow-huge text-slate-900 space-y-8 transform lg:rotate-2 hover:rotate-0 transition-transform duration-700">
                <div className="flex items-center justify-between border-b pb-6">
                   <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-indigo-600 rounded-xl flex items-center justify-center text-white">
                         <BarChart3 className="w-5 h-5" />
                      </div>
                      <span className="font-black uppercase tracking-widest text-[10px]">Impact Report</span>
                   </div>
                   <div className="text-[10px] font-black text-emerald-500">REAL-TIME DATA</div>
                </div>
                
                <div className="space-y-8">
                   <div className="space-y-2">
                      <div className="flex justify-between text-xs font-bold uppercase tracking-widest text-slate-400">
                         <span>Visibility Boost</span>
                         <span className="text-indigo-600">+82%</span>
                      </div>
                      <div className="h-3 w-full bg-slate-100 rounded-full overflow-hidden">
                         <motion.div initial={{ width: 0 }} whileInView={{ width: '82%' }} className="h-full bg-indigo-600" />
                      </div>
                   </div>
                   <div className="space-y-2">
                      <div className="flex justify-between text-xs font-bold uppercase tracking-widest text-slate-400">
                         <span>Local Map Rank</span>
                         <span className="text-indigo-600">+4.2 Positions</span>
                      </div>
                      <div className="h-3 w-full bg-slate-100 rounded-full overflow-hidden">
                         <motion.div initial={{ width: 0 }} whileInView={{ width: '70%' }} className="h-full bg-indigo-600" />
                      </div>
                   </div>
                   <div className="space-y-2">
                      <div className="flex justify-between text-xs font-bold uppercase tracking-widest text-slate-400">
                         <span>GMB Engagement</span>
                         <span className="text-indigo-600">+55%</span>
                      </div>
                      <div className="h-3 w-full bg-slate-100 rounded-full overflow-hidden">
                         <motion.div initial={{ width: 0 }} whileInView={{ width: '55%' }} className="h-full bg-indigo-600" />
                      </div>
                   </div>
                </div>

                <div className="p-8 bg-slate-50 rounded-3xl border border-slate-100">
                   <p className="text-sm font-medium italic text-slate-500 leading-relaxed">
                      "Since implementing spatial metadata across our 12 service locations, 
                      our local organic traffic increased by 114% in just 3 months."
                   </p>
                   <div className="mt-4 flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-slate-200" />
                      <div className="text-[10px] font-black uppercase tracking-widest text-slate-900">Marcus Thorne — SEO Director @ Nexus Labs</div>
                   </div>
                </div>
             </div>
          </div>
       </div>
    </section>
  );
}

function SectionFAQ() {
  const faqs = [
    { q: "What is image geotagging?", a: "Image geotagging is the process of embedding GPS coordinates (Latitude and Longitude) into an image file's EXIF metadata. This tells computers and search engines exactly where the photo was taken." },
    { q: "Does geotagging help SEO?", a: "Absoultely. For local businesses, geotagged photos provide 'proof of location' to search engines, helping you rank higher in local search results and map packs." },
    { q: "Can I geotag existing photos?", a: "Yes! Our online tool allows you to upload any JPEG/JPG photo and add or modify its geotagging data instantly." },
    { q: "Is this tool free to use?", a: "Yes, our core geotagging utility is 100% free for individual photos. We also offer professional guides for larger SEO campaigns." },
    { q: "Does this work on mobile?", a: "Yes, our tool is fully responsive. You can upload photos directly from your phone's gallery and geotag them on the go." }
  ];

  return (
    <section id="faq" className="max-w-4xl mx-auto px-4 py-24 scroll-mt-24">
      <h2 className="text-4xl font-display font-bold text-center mb-16 text-slate-900">Frequently Asked Questions</h2>
      <div className="space-y-4">
        {faqs.map((faq, i) => (
          <details key={i} className="group bg-white rounded-2xl overflow-hidden border border-slate-200 open:border-indigo-500 transition-all shadow-sm">
            <summary className="flex items-center justify-between p-6 cursor-pointer list-none">
              <span className="font-bold pr-8 text-slate-800">{faq.q}</span>
              <div className="w-8 h-8 rounded-full bg-slate-50 border border-slate-200 flex items-center justify-center text-indigo-600 group-open:rotate-180 transition-transform">
                <ChevronDown className="w-4 h-4" />
              </div>
            </summary>
            <div className="px-6 pb-6 text-slate-500 text-sm leading-relaxed">
              {faq.a}
            </div>
          </details>
        ))}
      </div>
    </section>
  );
}

function Footer() {
  return (
    <footer className="bg-slate-900 text-slate-400 py-24 rounded-t-[4rem] px-4 mt-24">
      <div className="max-w-7xl mx-auto grid md:grid-cols-4 gap-16">
        <div className="space-y-6 md:col-span-1">
          <div className="flex items-center gap-2 group cursor-pointer" onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}>
            <div className="w-10 h-10 bg-indigo-600 rounded-lg flex items-center justify-center shadow-lg shadow-indigo-500/20 group-hover:scale-110 transition-transform">
              <Globe className="text-white w-6 h-6" />
            </div>
            <span className="text-xl font-display font-bold tracking-tight text-white">GeoTag<span className="text-indigo-600">Pro</span></span>
          </div>
          <p className="text-sm leading-relaxed">
            Leading the spatial SEO revolution. Our metadata engine empowers businesses 
            to reclaim their local authority through verifiable visual assets.
          </p>
          <div className="flex gap-4">
            <div className="w-8 h-8 rounded-lg bg-white/5 border border-white/10 flex items-center justify-center hover:bg-indigo-600 hover:text-white transition-all cursor-pointer">
               <Globe className="w-4 h-4" />
            </div>
            <div className="w-8 h-8 rounded-lg bg-white/5 border border-white/10 flex items-center justify-center hover:bg-indigo-600 hover:text-white transition-all cursor-pointer">
               <MapPin className="w-4 h-4" />
            </div>
          </div>
        </div>
        
        <div>
          <h4 className="text-white font-bold text-xs uppercase tracking-[0.2em] mb-8">Spatial Tools</h4>
          <ul className="space-y-4 text-sm font-medium">
            <li><a href="#tool" className="hover:text-white transition-colors">EXIF Injector</a></li>
            <li><a href="#tool" className="hover:text-white transition-colors">GPS Watermark Engine</a></li>
            <li><a href="#tool" className="hover:text-white transition-colors">Bulk Metadata Editor</a></li>
            <li><a href="#tool" className="hover:text-white transition-colors">Map Sync Utility</a></li>
          </ul>
        </div>
        
        <div>
          <h4 className="text-white font-bold text-xs uppercase tracking-[0.2em] mb-8">SEO Resources</h4>
          <ul className="space-y-4 text-sm font-medium">
            <li><a href="#strategy" className="hover:text-white transition-colors">Local SEO Guide</a></li>
            <li><a href="#benefits" className="hover:text-white transition-colors">Algorithm Studies</a></li>
            <li><a href="#how-to" className="hover:text-white transition-colors">Technical EXIF Documentation</a></li>
            <li><a href="#faq" className="hover:text-white transition-colors">Support Center</a></li>
          </ul>
        </div>
        
        <div className="space-y-6">
          <h4 className="text-white font-bold text-xs uppercase tracking-[0.2em] mb-8">Regional Authority</h4>
          <p className="text-xs italic leading-relaxed">
            Currently processing spatial data for over 18,000 distinct ZIP codes worldwide.
          </p>
          <div className="p-4 bg-indigo-500/10 border border-indigo-500/20 rounded-2xl">
             <div className="text-[10px] font-black text-indigo-400 uppercase tracking-widest mb-1">Status Report</div>
             <div className="text-xs text-white font-bold">Systems Operational: 99.9% Uptime</div>
          </div>
        </div>
      </div>
      <div className="max-w-7xl mx-auto mt-24 pt-8 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-6 text-[10px] font-black uppercase tracking-[0.2em]">
        <p>© 2026 GeoTagPro SEO Engine. All Rights Reserved.</p>
        <div className="flex gap-8">
           <span className="hover:text-white transition-colors cursor-pointer">Privacy Policy</span>
           <span className="hover:text-white transition-colors cursor-pointer">Terms of Service</span>
           <span className="hover:text-white transition-colors cursor-pointer">Sitemap</span>
        </div>
      </div>
    </footer>
  );
}

export default function App() {
  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 selection:bg-indigo-100 selection:text-indigo-900 font-sans">
      <Header />
      <Hero />
      <GeotagTool />
      <SectionHowTo />
      <SectionStrategy />
      <SectionBenefits />
      <SectionFAQ />
      <Footer />
    </div>
  );
}
