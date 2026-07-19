import React, { useState } from 'react';
import { FolderOpen, Upload, X, Maximize2, Plus, ChevronLeft, ChevronRight, Image, CheckCircle } from 'lucide-react';
import { Member, GalleryItem } from '../types';

interface PortalGalleryProps {
  gallery: GalleryItem[];
  currentUser: Member;
  onAddGalleryItem: (item: Omit<GalleryItem, 'id' | 'created_at'>) => void;
  showToast: (message: string, type?: 'success' | 'info' | 'error') => void;
}

export default function PortalGallery({ gallery, currentUser, onAddGalleryItem, showToast }: PortalGalleryProps) {
  const [activeAlbum, setActiveAlbum] = useState('All');
  const [isUploading, setIsUploading] = useState(false);
  
  // Photo Upload States
  const [uploadImage, setUploadImage] = useState('');
  const [uploadAlbum, setUploadAlbum] = useState('General');
  const [uploadCaption, setUploadCaption] = useState('');
  const [customAlbum, setCustomAlbum] = useState('');
  const [dragActive, setDragActive] = useState(false);

  // Lightbox view state
  const [lightboxImages, setLightboxImages] = useState<string[] | null>(null);
  const [lightboxIndex, setLightboxIndex] = useState(0);

  // Derive unique albums list (All, General, Chapter Gatherings, etc)
  const defaultAlbums = ['General', 'Chapter Assemblies', 'Initiation Rites', 'Civic Service'];
  const galleryAlbums = Array.from(new Set(gallery.map(item => item.album).filter(Boolean)));
  const albums = ['All', ...Array.from(new Set([...defaultAlbums, ...galleryAlbums]))];

  const filteredItems = activeAlbum === 'All' 
    ? gallery 
    : gallery.filter(item => item.album === activeAlbum);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      const reader = new FileReader();
      reader.onloadend = () => {
        setUploadImage(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const file = e.dataTransfer.files[0];
      const reader = new FileReader();
      reader.onloadend = () => {
        setUploadImage(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleUploadSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!uploadImage) {
      showToast('Please select or drop an image file first.', 'error');
      return;
    }

    const targetAlbum = customAlbum.trim() ? customAlbum.trim() : uploadAlbum;

    onAddGalleryItem({
      album: targetAlbum,
      image_url: uploadImage,
      caption: uploadCaption.trim() || undefined,
      uploaded_by_name: currentUser.name
    });

    setUploadImage('');
    setUploadCaption('');
    setCustomAlbum('');
    setIsUploading(false);
    showToast('Photo secured and compiled into chapter digital archive!', 'success');
  };

  const openLightbox = (items: GalleryItem[], index: number) => {
    setLightboxImages(items.map(item => item.image_url));
    setLightboxIndex(index);
  };

  return (
    <div className="space-y-4 font-sans text-xs">
      
      {/* Top action block */}
      <div className="bg-white rounded-2xl shadow-sm border border-navy-950/5 p-4 flex flex-col md:flex-row items-center justify-between gap-4">
        <div>
          <h3 className="font-serif font-black text-navy-950 text-base uppercase tracking-wide flex items-center gap-2">
            <FolderOpen className="w-5 h-5 text-[#c5a059]" />
            Chapter Media Archives
          </h3>
          <p className="text-[10px] text-navy-400 uppercase tracking-widest font-semibold mt-0.5">Sovereign Photographic Registry</p>
        </div>

        <button
          onClick={() => setIsUploading(true)}
          className="px-5 py-2.5 bg-navy-950 text-gold-500 text-[10px] font-bold uppercase tracking-widest rounded-lg hover:bg-navy-900 transition-colors cursor-pointer flex items-center gap-1.5"
        >
          <Plus className="w-4 h-4" />
          Archive New Photo
        </button>
      </div>

      {/* Albums Filter Navigation */}
      <div className="flex gap-2 overflow-x-auto pb-1 select-none">
        {albums.map((albumName, idx) => {
          const isActive = activeAlbum === albumName;
          return (
            <button
              key={idx}
              onClick={() => setActiveAlbum(albumName)}
              className={`px-4 py-2 rounded-xl text-[10px] font-bold uppercase tracking-wider border transition-all cursor-pointer whitespace-nowrap ${
                isActive 
                  ? 'bg-navy-950 border-navy-950 text-gold-500 shadow-sm' 
                  : 'bg-white border-navy-950/10 text-navy-950 hover:bg-navy-50'
              }`}
            >
              {albumName}
            </button>
          );
        })}
      </div>

      {/* Photos Grid */}
      {filteredItems.length > 0 ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
          {filteredItems.map((item, idx) => (
            <div 
              key={item.id}
              onClick={() => openLightbox(filteredItems, idx)}
              className="bg-white rounded-2xl overflow-hidden border border-navy-950/5 hover:border-[#c5a059]/40 hover:shadow-md transition-all cursor-pointer group"
            >
              <div className="aspect-square relative overflow-hidden bg-navy-950">
                <img 
                  src={item.image_url} 
                  alt={item.caption || "Gallery item"} 
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" 
                />
                <div className="absolute inset-0 bg-navy-950/0 hover:bg-navy-950/20 transition-colors flex items-center justify-center">
                  <Maximize2 className="w-5 h-5 text-white opacity-0 group-hover:opacity-100 transition-opacity drop-shadow-md" />
                </div>
              </div>
              <div className="p-2.5">
                <p className="font-bold text-navy-950 truncate max-w-full leading-tight text-[10px]">
                  {item.caption || 'Untitled Assembly Photo'}
                </p>
                <div className="flex justify-between items-center text-[8px] text-navy-400 font-mono mt-1.5 uppercase">
                  <span className="truncate max-w-[65px]">{item.uploaded_by_name}</span>
                  <span className="shrink-0">{item.album}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="bg-white rounded-2xl p-12 border border-navy-950/5 text-center text-navy-400">
          <Image className="w-12 h-12 text-navy-200 mx-auto mb-2" />
          <p className="font-bold uppercase tracking-wider text-xs text-navy-950">Empty Album Category</p>
          <p className="text-[10px] text-navy-400 mt-1">Be the first to upload historical images to this category using the button above.</p>
        </div>
      )}

      {/* Upload Modal Drawer */}
      {isUploading && (
        <div className="fixed inset-0 bg-navy-950/60 backdrop-blur-sm flex items-center justify-center p-4 z-50 animate-fade-in">
          <div className="bg-white rounded-2xl shadow-2xl border border-[#c5a059]/20 w-full max-w-md overflow-hidden relative">
            <div className="absolute top-0 left-0 right-0 h-1 bg-[#c5a059]"></div>
            
            <div className="flex items-center justify-between p-4 border-b border-navy-950/5">
              <h3 className="font-serif font-black text-navy-950 text-sm uppercase tracking-wide">
                Archive Event Photo
              </h3>
              <button 
                onClick={() => setIsUploading(false)}
                className="p-1 rounded-full text-navy-400 hover:text-navy-950 transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleUploadSubmit} className="p-5 space-y-4 text-xs">
              
              {/* Photo Upload area */}
              <div>
                <label className="block text-[9px] font-bold text-navy-950 uppercase tracking-widest mb-1.5">
                  Visual Asset File
                </label>
                <div 
                  onDragEnter={handleDrag}
                  onDragOver={handleDrag}
                  onDragLeave={handleDrag}
                  onDrop={handleDrop}
                  className={`relative flex flex-col items-center justify-center border-2 border-dashed p-4 text-center transition-all min-h-[110px] rounded-lg ${
                    dragActive 
                      ? 'border-gold-500 bg-gold-50/20' 
                      : uploadImage 
                        ? 'border-[#c5a059]/40 bg-[#fbf9f4]' 
                        : 'border-navy-950/15 hover:border-[#c5a059]/50 bg-white'
                  }`}
                >
                  {uploadImage ? (
                    <div className="flex items-center gap-3.5 w-full">
                      <img 
                        src={uploadImage} 
                        alt="Preview" 
                        className="w-14 h-14 object-cover rounded-lg border border-navy-950/20 shadow-sm"
                      />
                      <div className="flex-1 text-left">
                        <p className="text-[10px] font-bold text-emerald-800 uppercase tracking-wider flex items-center gap-1">
                          <CheckCircle className="w-3.5 h-3.5 text-emerald-600" />
                          Photo Selected
                        </p>
                        <p className="text-[8px] text-navy-500 uppercase tracking-wider font-mono">Archive file loaded</p>
                      </div>
                      <button
                        type="button"
                        onClick={() => setUploadImage('')}
                        className="p-1.5 hover:bg-rose-50 border border-rose-200 text-rose-600 rounded-md transition-colors"
                      >
                        <X className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  ) : (
                    <label className="cursor-pointer flex flex-col items-center justify-center w-full h-full py-3">
                      <Upload className="w-5.5 h-5.5 text-navy-400 mb-1" />
                      <p className="text-[10px] font-bold text-navy-950 uppercase tracking-wider">
                        Upload Asset Image
                      </p>
                      <p className="text-[8px] text-navy-400 uppercase tracking-wider font-mono mt-0.5">
                        Drag & Drop or Click
                      </p>
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleFileChange}
                        className="hidden"
                      />
                    </label>
                  )}
                </div>
              </div>

              {/* Album Selection */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[9px] font-bold text-navy-950 uppercase tracking-widest mb-1">
                    Select Album Category
                  </label>
                  <select
                    value={uploadAlbum}
                    onChange={(e) => setUploadAlbum(e.target.value)}
                    className="w-full p-2.5 rounded-lg border border-navy-950/15 focus:outline-none focus:ring-1 focus:ring-gold-500 bg-white text-navy-950 font-sans"
                  >
                    {defaultAlbums.map((dalb, idx) => (
                      <option key={idx} value={dalb}>{dalb}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-[9px] font-bold text-navy-950 uppercase tracking-widest mb-1">
                    Or New Custom Album
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. Summer Camp 2026"
                    value={customAlbum}
                    onChange={(e) => setCustomAlbum(e.target.value)}
                    className="w-full p-2.5 rounded-lg border border-navy-950/15 focus:outline-none focus:ring-1 focus:ring-gold-500 bg-white text-navy-950 font-sans"
                  />
                </div>
              </div>

              {/* Caption */}
              <div>
                <label className="block text-[9px] font-bold text-navy-950 uppercase tracking-widest mb-1">
                  Photo Caption
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Chapter executive board team building session..."
                  value={uploadCaption}
                  onChange={(e) => setUploadCaption(e.target.value)}
                  className="w-full p-2.5 rounded-lg border border-navy-950/15 focus:outline-none focus:ring-1 focus:ring-gold-500 bg-white text-navy-950 font-sans"
                />
              </div>

              <div className="flex items-center justify-end gap-3 pt-3 border-t border-navy-950/5">
                <button
                  type="button"
                  onClick={() => setIsUploading(false)}
                  className="px-5 py-2 border border-navy-950/10 text-navy-950 text-[10px] font-bold uppercase tracking-widest rounded-lg hover:bg-navy-50 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-2 bg-navy-950 text-gold-500 text-[10px] font-bold uppercase tracking-widest rounded-lg hover:bg-navy-900 transition-colors cursor-pointer"
                >
                  Archive Asset
                </button>
              </div>

            </form>
          </div>
        </div>
      )}

      {/* Full-screen Lightbox visualizer */}
      {lightboxImages && (
        <div className="fixed inset-0 bg-navy-950/95 z-50 flex items-center justify-center p-4 select-none animate-fade-in">
          <div className="absolute top-4 left-4 right-4 flex items-center justify-between text-white z-10 font-mono text-[9px] uppercase tracking-widest">
            <span>Archive Photo {lightboxIndex + 1} of {lightboxImages.length}</span>
            <button
              onClick={() => setLightboxImages(null)}
              className="p-1.5 hover:bg-white/10 rounded-full transition-colors text-white cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {lightboxImages.length > 1 && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                setLightboxIndex(prev => (prev === 0 ? lightboxImages.length - 1 : prev - 1));
              }}
              className="absolute left-4 p-2 bg-navy-950/50 hover:bg-white/10 text-white rounded-full transition-colors cursor-pointer"
            >
              <ChevronLeft className="w-6 h-6" />
            </button>
          )}

          <div className="max-w-4xl max-h-[80vh] flex items-center justify-center">
            <img 
              src={lightboxImages[lightboxIndex]} 
              alt="Zoomed" 
              className="max-w-full max-h-[75vh] object-contain shadow-2xl border border-white/5" 
            />
          </div>

          {lightboxImages.length > 1 && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                setLightboxIndex(prev => (prev === lightboxImages.length - 1 ? 0 : prev + 1));
              }}
              className="absolute right-4 p-2 bg-navy-950/50 hover:bg-white/10 text-white rounded-full transition-colors cursor-pointer"
            >
              <ChevronRight className="w-6 h-6" />
            </button>
          )}
        </div>
      )}

    </div>
  );
}
