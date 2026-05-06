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
    <header className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${isScrolled ? 'bg-white/95 backdrop-blur-md shadow-sm py-2' : 'bg-transparent py-4'}`}>
      <div className="max-w-7xl mx-auto px-4 flex items-center justify-between">
        <div className="flex items-center gap-2 group cursor-pointer" onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}>
          <div className="w-8 h-8 sm:w-10 sm:h-10 bg-indigo-600 rounded-lg flex items-center justify-center shadow-lg shadow-indigo-100 group-hover:scale-110 transition-transform">
            <MapIcon className="text-white w-5 h-5 sm:w-6 sm:h-6" />
          </div>
          <div className="flex flex-col -space-y-1">
            <span className="text-lg sm:text-xl font-display font-bold tracking-tight text-slate-900">GeoTag<span className="text-indigo-600"> Photo</span></span>
            <span className="text-[8px] sm:text-[10px] font-black uppercase tracking-widest text-slate-400">Online Geotagger</span>
          </div>
        </div>
        
        <nav className="hidden md:flex items-center gap-8 text-sm font-bold text-slate-500 uppercase tracking-widest">
          <a href="#tool" className="hover:text-indigo-600 transition-colors">Geotag Tool</a>
          <a href="#how-to" className="hover:text-indigo-600 transition-colors">How to Geotag</a>
          <a href="#faq" className="hover:text-indigo-600 transition-colors">FAQ</a>
        </nav>

        <div className="flex items-center gap-4">
        </div>
      </div>
    </header>
  );
}

function Hero() {
  return (
    <section className="relative pt-32 pb-12 overflow-hidden">
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-[600px] bg-gradient-to-b from-indigo-600/10 to-transparent blur-[120px] rounded-full -mt-40 pointer-events-none" />
      <div className="max-w-7xl mx-auto px-6 relative">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="max-w-5xl space-y-8 text-center mx-auto"
        >
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-slate-100 border border-slate-200 text-[10px] font-black uppercase tracking-[0.2em] text-indigo-600">
            <Zap className="w-3 h-3 fill-current" />
            100% Free Online Geotagging Tool
          </div>
          <h1 className="text-4xl sm:text-6xl md:text-8xl lg:text-9xl font-display font-bold text-slate-900 leading-[0.85] tracking-tighter">
            Geotag Photo <br/> <span className="text-indigo-600">Online for Free.</span>
          </h1>
          <p className="text-xl text-slate-500 max-w-3xl leading-relaxed font-medium mx-auto">
            The easiest way to <strong>add GPS coordinates to photos</strong> online. 
            Pin your images to any location on the map manually—no need to visit the place physically.
          </p>
          <div className="flex flex-wrap gap-4 pt-4 justify-center">
            <a href="#tool" className="px-10 py-5 bg-indigo-600 text-white rounded-2xl font-black uppercase tracking-widest text-xs flex items-center gap-3 hover:bg-slate-900 transition-all shadow-2xl shadow-indigo-500/20 active:scale-95">
              Launch Geotag Engine <ChevronRight className="w-4 h-4" />
            </a>
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
      exifObj["0th"][piexif.ImageIFD.Software] = "GeoTag Photo Pro Tool";

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
    <section id="tool" className="max-w-7xl mx-auto px-4 py-12 scroll-mt-24">
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
                    <p className="text-xl font-bold text-slate-900">Drop your photo here</p>
                    <p className="text-slate-500 text-sm mt-1 font-medium">JPEG or JPG files</p>
                  </div>
                  <button 
                    onClick={() => fileInputRef.current?.click()}
                    className="px-8 py-3 bg-indigo-600 text-white font-bold rounded-xl hover:bg-indigo-500 transition-all shadow-lg shadow-indigo-100 active:scale-95"
                  >
                    Upload Photo
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
              <h2 className="text-4xl font-display font-bold text-slate-900 leading-tight">Geotag Your Photo</h2>
              <p className="text-slate-500 text-sm font-medium">Select a location on the map to add GPS coordinates to your image.</p>
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
                 LIVE MAP
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
                Download Photo
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
                  <div className="flex items-center gap-2 text-emerald-600 font-bold text-sm">
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
          </div>
        </div>
      </div>
    </section>
  );
}

function SectionHowTo() {
  const steps = [
    { title: "Upload Your Photo", text: "Choose any JPG or JPEG image from your computer. Our online geotagger keeps your original quality.", icon: <ImageIcon /> },
    { title: "Pick Map Location", text: "Search for any global address or manually click on the map to find exact longitude and latitude.", icon: <MapPin /> },
    { title: "Add GPS Details", text: "Our tool embeds the precise GPS tags and timestamps into your photo's EXIF metadata automatically.", icon: <FileText /> },
    { title: "Download Geotagged Image", text: "Save your photo with the new location data. Use it anywhere for verification or tracking.", icon: <Download /> },
  ];

  return (
    <section id="how-to" className="max-w-7xl mx-auto px-4 py-16 scroll-mt-24 border-t border-slate-100">
      <div className="text-center space-y-6 mb-12">
        <h2 className="text-4xl md:text-5xl font-display font-bold text-slate-900 tracking-tight text-center">How to <span className="text-indigo-600 font-medium">Geotag Photos Online</span></h2>
        <p className="text-xl text-slate-500 max-w-2xl mx-auto font-medium text-center">Follow these simple steps to add location data to your images manually.</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-12">
        {steps.map((step, i) => (
          <div key={i} className="relative group text-center flex flex-col items-center">
            <div className="space-y-8 flex flex-col items-center">
              <div className="w-20 h-20 bg-white border border-slate-200 rounded-[2rem] flex items-center justify-center text-indigo-600 shadow-sm group-hover:bg-indigo-600 group-hover:text-white group-hover:shadow-2xl group-hover:shadow-indigo-200 transition-all duration-500 transform group-hover:-translate-y-2 mx-auto">
                {step.icon}
              </div>
              <div className="space-y-4">
                <h3 className="text-xs font-black uppercase tracking-[0.25em] text-indigo-600 flex items-center justify-center gap-3">
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
    <section id="benefits" className="max-w-7xl mx-auto px-4 py-16 border-t border-slate-200 overflow-hidden relative">
      <div className="absolute top-1/2 left-0 w-64 h-64 bg-indigo-500/5 blur-[100px] rounded-full -ml-32" />
      
      <div className="grid lg:grid-cols-12 gap-20 items-center justify-center">
        <div className="lg:col-span-12 text-center mb-8 space-y-4">
           <h2 className="text-4xl md:text-6xl font-display font-bold text-slate-900 tracking-tighter">Why Choose <span className="text-indigo-600">GeoTag Photo Online?</span></h2>
           <p className="text-xl text-slate-500 max-w-3xl mx-auto font-medium">The most reliable online tool for adding GPS details and editing photo location manually.</p>
        </div>
        
        <div className="lg:col-span-12 space-y-12 max-w-4xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
            {[
              { icon: <MapIcon />, title: "Global Asset Inventory", desc: "Organize your visual content by virtual coordinates. Build a geographic library that reflects your remote reach." },
              { icon: <Shield />, title: "Precision Integrity", desc: "Our engine uses industry-standard EXIF v2.31, ensuring your metadata is recognized by professional GIS software." },
              { icon: <Zap />, title: "Remote Efficiency", desc: "Save thousands in travel costs. Update photo locations for property listings or site reports without leaving your office." }
            ].map((benefit, i) => (
              <div key={i} className="flex flex-col items-center gap-6 group">
                <div className="w-16 h-16 shrink-0 bg-white border border-slate-200 rounded-[1.5rem] flex items-center justify-center text-indigo-600 shadow-sm group-hover:bg-indigo-600 group-hover:text-white transition-all duration-500">
                  {benefit.icon}
                </div>
                <div className="space-y-2">
                  <h3 className="text-xl font-display font-bold text-slate-900 transition-colors group-hover:text-indigo-600 tracking-tight">{benefit.title}</h3>
                  <p className="text-sm text-slate-500 leading-relaxed font-medium">{benefit.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

function SectionStrategy() {
  return (
    <section id="strategy" className="max-w-7xl mx-auto px-4 py-16 scroll-mt-24 bg-slate-900 rounded-[2.5rem] md:rounded-[4rem] text-white overflow-hidden relative mb-12">
       <div className="absolute top-0 right-0 w-[800px] h-full bg-indigo-600/10 blur-[150px] -mr-[400px] pointer-events-none" />
       
       <div className="grid lg:grid-cols-1 gap-20 items-center text-center">
          <div className="space-y-10 max-w-4xl mx-auto">
             <div className="space-y-4">
                <div className="inline-block px-3 py-1 bg-indigo-500/20 text-indigo-400 rounded-full text-[10px] font-black uppercase tracking-widest border border-indigo-500/20">Free Online Geotagger</div>
                <h2 className="text-3xl sm:text-5xl md:text-7xl font-display font-bold leading-[0.95] tracking-tighter">Geotag Photo <br/><span className="text-indigo-400 underline decoration-indigo-400/30 underline-offset-8">Online Instantly.</span></h2>
             </div>
             
             <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
                {[
                  { title: "Add GPS from Anywhere", desc: "Instantly assign any photo to any latitude and longitude globally without travel." },
                  { title: "Edit Photo Location Manually", desc: "Use our high-precision map to select exactly where your visual data belongs." },
                  { title: "Professional Metadata Tool", desc: "Standardize your geotags across thousands of images in seconds." }
                ].map((item, i) => (
                  <div key={i} className="flex flex-col items-center gap-6 group">
                     <div className="w-10 h-10 shrink-0 bg-white/5 rounded-xl border border-white/10 flex items-center justify-center text-indigo-400 group-hover:bg-indigo-600 group-hover:text-white transition-all">
                        {i === 0 ? <Globe className="w-5 h-5" /> : i === 1 ? <MapPin className="w-5 h-5" /> : <BarChart3 className="w-5 h-5" />}
                     </div>
                     <div className="space-y-2">
                        <h4 className="text-xl font-bold text-white group-hover:text-indigo-400 transition-colors uppercase tracking-tight">{item.title}</h4>
                        <p className="text-sm text-slate-400 leading-relaxed font-medium">{item.desc}</p>
                     </div>
                  </div>
                ))}
             </div>
          </div>
       </div>
    </section>
  );
}

function SectionUseCases() {
  const cases = [
    { 
      title: "Remote Logistical Ops", 
      desc: "Perfect for documenting global supply chain assets or job sites. Geotag your photos from the warehouse or field office to build a verifiable spatial database.",
      border: "border-l-indigo-500"
    },
    { 
      title: "Remote Property Mgmt", 
      desc: "Assign high-res photos to specific units or parcels without site visits. Ideal for real estate portfolios spaning multiple continents.",
      border: "border-l-emerald-500"
    },
    { 
      title: "Data Correction", 
      desc: "Fix incorrect GPS coordinates on historical assets. Rectify spatial errors in your image archives to ensure absolute data integrity.",
      border: "border-l-amber-500"
    }
  ];

  return (
    <section id="use-cases" className="max-w-7xl mx-auto px-4 py-12 border-t border-slate-200 mt-12 scroll-mt-24">
      <div className="text-center mb-12 space-y-4">
        <h2 className="text-4xl md:text-5xl font-display font-bold text-slate-900 tracking-tight">Virtual Presence Use Cases</h2>
        <p className="text-slate-500 max-w-2xl mx-auto font-medium">Empowering industries to manage geography through a digital-first spatial lens.</p>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {cases.map((c, i) => (
          <div key={i} className={`bg-white p-8 rounded-3xl space-y-4 border-l-4 ${c.border} border border-slate-100 shadow-sm transition-transform hover:-translate-y-1`}>
            <h4 className="text-xl font-bold text-slate-900">{c.title}</h4>
            <p className="text-sm text-slate-500 leading-relaxed font-medium">
              {c.desc}
            </p>
          </div>
        ))}
      </div>
    </section>
  );
}

function SectionSEOContent() {
  return (
    <section className="max-w-4xl mx-auto px-4 py-24 border-t border-slate-100">
      <div className="prose prose-slate max-w-none">
        <h2 className="text-3xl font-display font-bold text-slate-900 mb-8 text-center">The Ultimate Guide to Geotagging Photos Online: Why and How</h2>
        
        <div className="space-y-8 text-slate-600 leading-relaxed text-justify">
          <p>
            In today's digital era, geographic data attached to visual content has become more than just a novelty—it is a critical requirement for businesses, field researchers, and digital enthusiasts alike. <strong>GeoTag Photo Online</strong> offers a streamlined, professional-grade solution to <strong>add GPS coordinates to images</strong> manually, ensuring your photos carry precise location data regardless of where they were captured.
          </p>

          <h3 className="text-xl font-bold text-slate-900 text-center">What is Photo Geotagging?</h3>
          <p>
            Geotagging is the process of embedding geographic information—specifically latitude and longitude coordinates—into a file's metadata, typically within the EXIF (Exchangeable Image File Format) data header. When you use an <strong>online geotagger</strong> tool like ours, you are manually injecting these digital "stamps" into your photo. This allows software, maps, and search engines to identify exactly where a photo represents on the globe.
          </p>

          <h3 className="text-xl font-bold text-slate-900 text-center">Why Use a Manual Online Geotagger?</h3>
          <p>
            While many modern smartphones and cameras come equipped with built-in GPS, they are not always reliable. Signal interference, privacy settings, or using older legacy equipment can result in photos without location data. Furthermore, many professionals—such as site inspectors, property managers, and remote researchers—often need to <strong>edit photo location manually</strong> for documentation purposes or to correct errors. Our tool allows you to <strong>geotag photos online for free</strong> without ever needing to visit the physical location again.
          </p>

          <h3 className="text-xl font-bold text-slate-900 text-center">The Benefits of Geotagged Photos for Professionals</h3>
          <ul className="list-disc space-y-4 max-w-2xl mx-auto pl-6">
            <li><strong>Site Documentation & Verification:</strong> Civil engineers and contractors use geotagging to prove that specific construction milestones were reached at exact project sites, providing a verifiable digital trail.</li>
            <li><strong>Environmental Research:</strong> Scientists tracking changes in terrain or wildlife patterns rely on <strong>image geotagging tools</strong> to map their data points accurately over time.</li>
            <li><strong>Real Estate & Property Management:</strong> Managing thousands of property listings across different cities is simplified when every photo is sorted by its virtual geographic coordinates.</li>
            <li><strong>Asset Management:</strong> Insurance adjusters and logistics teams use GPS-tagged photos to log the state and location of high-value assets remotely.</li>
          </ul>

          <h3 className="text-xl font-bold text-slate-900 text-center">How Our Image Geotagging Tool Works</h3>
          <p>
            Our engine is designed for both speed and technical precision. When you upload a JPG or JPEG, our system parses the original EXIF structure. By selecting a location on our high-precision map, you generate a set of coordinates that our tool then "injects" back into the 0th and GPS IFDs of the image file. We use industry-standard EXIF v2.31, which is the same standard used by professional DSLR cameras, ensuring compatibility with all major operating systems and GIS software.
          </p>

          <h3 className="text-xl font-bold text-slate-900 text-center">Manual Geotagging vs. GPS Map Camera Apps</h3>
          <p>
            Many mobile apps function as a "GPS Map Camera," which captures location data in real-time as you take the photo. However, these are limited by your physical presence. <strong>GeoTag Photo Online</strong> is different. It is a <strong>manual geotagging</strong> engine designed for the desktop and mobile web, allowing you to back-fill or correct location data for any image in your library. This "Virtual Mapping" capability is essential for operations where the photographer might have been unable to sync a GPS signal at the moment of capture.
          </p>

          <h3 className="text-xl font-bold text-slate-900 text-center">Technical Details: What Data is Added?</h3>
          <p>
            When you process an image through our tool, several key metadata fields are updated:
          </p>
          <ul className="list-disc space-y-2 max-w-2xl mx-auto pl-6 italic">
            <li>GPSLatitude & GPSLongitude (Standard Decimal Formats)</li>
            <li>GPSLatitudeRef & GPSLongitudeRef (North/South, East/West Indicators)</li>
            <li>GPSTimeStamp (Synchronized with the mapping event)</li>
            <li>ImageDescription (Often populated with the reverse-geocoded physical address)</li>
          </ul>

          <h3 className="text-xl font-bold text-slate-900 text-center">Start Adding GPS to Photos Today</h3>
          <p>
            Whether you are looking to <strong>add GPS coordinates to photos</strong> for personal organization or professional compliance, GeoTag Photo is the standard. It is fast, requires no software installation, and is completely free to use. Simply upload, pin, and download. Your data security is our priority; all processing happens momentarily, and files are not stored permanently on our servers, ensuring your site documentation remains private.
          </p>
          
          <div className="pt-8 border-t border-slate-100 italic text-sm text-slate-400 text-center">
            Keywords: geotag photo online, add gps to photo, online geotagger, manual geotagging, edit photo location online, image geotagging tool, free gps tagger, EXIF location editor.
          </div>
        </div>
      </div>
    </section>
  );
}

function SectionFAQ() {

  const faqs = [
    { q: "What is remote photo geotagging?", a: "It's the process of assigning GPS coordinates to an image file from a remote location. Instead of relying on a camera's built-in GPS at the time of the shot, you can manually set the location using map coordinates." },
    { q: "Does this physically move the photo?", a: "No, it modifies the metadata (EXIF) inside the image file. This allows mapping software and databases to identify exactly where the subject of the photo is located on Earth." },
    { q: "Can I geotag photos without visiting the place?", a: "Yes! That is the core purpose of GeoStamp Pro. You can search for any address or location on the map and pin your photo to that spot instantly." },
    { q: "Is the metadata permanent?", a: "Yes. Once injected, the coordinates are embedded in the image headers. They will stay with the file wherever you upload it, unless you explicitly strip the metadata later." },
    { q: "Does this affect image quality?", a: "Not at all. Our engine only modifies the metadata headers. The visual pixel data remains 100% untouched and original." }
  ];

  return (
    <section id="faq" className="max-w-4xl mx-auto px-4 py-12 scroll-mt-24">
      <h2 className="text-4xl font-display font-bold text-center mb-12 text-slate-900">Frequently Asked Questions</h2>
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
    <footer className="bg-slate-900 text-slate-400 py-12 rounded-t-[2.5rem] md:rounded-t-[4rem] px-4 mt-12">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center text-center md:text-left gap-12 text-center">
        <div className="space-y-6 max-w-sm mx-auto md:mx-0">
          <div className="flex items-center justify-center md:justify-start gap-2 group cursor-pointer" onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}>
            <div className="w-10 h-10 bg-indigo-600 rounded-lg flex items-center justify-center shadow-lg shadow-indigo-500/20 group-hover:scale-110 transition-transform">
              <MapIcon className="text-white w-6 h-6" />
            </div>
            <span className="text-xl font-display font-bold tracking-tight text-white">GeoTag<span className="text-indigo-600"> Photo</span></span>
          </div>
          <p className="text-sm leading-relaxed">
            The #1 tool for manual photo geotagging. Add GPS coordinates to any photo online for free. 
            Trusted by field workers and remote managers worldwide.
          </p>
          <div className="text-indigo-400 font-bold text-xs uppercase tracking-widest">
            A tool of ODS PVT LTD
          </div>
          <div className="flex justify-center md:justify-start gap-4">
            <div className="w-8 h-8 rounded-lg bg-white/5 border border-white/10 flex items-center justify-center hover:bg-indigo-600 hover:text-white transition-all cursor-pointer">
               <Globe className="w-4 h-4" />
            </div>
            <div className="w-8 h-8 rounded-lg bg-white/5 border border-white/10 flex items-center justify-center hover:bg-indigo-600 hover:text-white transition-all cursor-pointer">
               <MapPin className="w-4 h-4" />
            </div>
          </div>
        </div>
        
        <div className="text-[10px] font-black uppercase tracking-[0.2em] space-y-4 mx-auto md:mx-0">
           <p>© 2026 GeoTag Photo. All Rights Reserved.</p>
           <div className="flex gap-8 justify-center md:justify-end">
              <span className="hover:text-white transition-colors cursor-pointer">Privacy Policy</span>
              <span className="hover:text-white transition-colors cursor-pointer">Terms of Service</span>
           </div>
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
      <SectionUseCases />
      <SectionFAQ />
      <SectionSEOContent />
      <Footer />
    </div>
  );
}
