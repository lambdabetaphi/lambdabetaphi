import React from 'react';
import { Image as ImageIcon, Maximize2, AlertCircle } from 'lucide-react';
import { GalleryItem } from '../../types';

export interface GalleryGridProps {
  filteredItems: GalleryItem[];
  activeAlbum: string;
  albums: string[];
  onAlbumChange: (albumName: string) => void;
  onPhotoClick: (index: number) => void;
  isLoading?: boolean;
  error?: string | null;
}

export function GalleryGrid({
  filteredItems,
  activeAlbum,
  albums,
  onAlbumChange,
  onPhotoClick,
  isLoading = false,
  error = null
}: GalleryGridProps) {
  
  // 1. Loading state (Skeleton Grid)
  if (isLoading) {
    return (
      <div className="space-y-4 font-sans text-xs" id="gallery_grid_loading">
        {/* Skeleton Album Filter */}
        <div className="flex gap-2 overflow-x-auto pb-1 select-none">
          {Array.from({ length: 5 }).map((_, idx) => (
            <div 
              key={idx} 
              className="px-6 py-4.5 w-24 bg-navy-50 rounded-xl animate-pulse shrink-0 border border-navy-950/5" 
            />
          ))}
        </div>

        {/* Skeleton Photo Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
          {Array.from({ length: 8 }).map((_, idx) => (
            <div 
              key={idx}
              className="bg-white rounded-2xl overflow-hidden border border-navy-950/5 p-0 space-y-2.5 animate-pulse"
            >
              <div className="aspect-square bg-navy-50" />
              <div className="p-2.5 space-y-2">
                <div className="h-3 bg-navy-50 rounded w-3/4" />
                <div className="flex justify-between">
                  <div className="h-2 bg-navy-50 rounded w-1/3" />
                  <div className="h-2 bg-navy-50 rounded w-1/4" />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  // 2. Error state
  if (error) {
    return (
      <div className="bg-rose-50 border border-rose-200 rounded-2xl p-8 text-center text-rose-800 space-y-2" id="gallery_grid_error">
        <AlertCircle className="w-10 h-10 text-rose-600 mx-auto mb-1" />
        <h4 className="font-bold uppercase tracking-wider text-xs">Failed to load media assets</h4>
        <p className="text-[10px] text-rose-600/80 max-w-sm mx-auto">{error}</p>
      </div>
    );
  }

  return (
    <div className="space-y-4 font-sans text-xs">
      {/* Albums Filter Navigation */}
      <div className="flex gap-2 overflow-x-auto pb-1 select-none" id="album_navigation_container">
        {albums.map((albumName, idx) => {
          const isActive = activeAlbum === albumName;
          return (
            <button
              key={idx}
              id={`album_tab_${albumName.replace(/\s+/g, '_')}`}
              onClick={() => onAlbumChange(albumName)}
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

      {/* Photos Grid / Empty State */}
      {filteredItems.length > 0 ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4" id="gallery_photos_grid">
          {filteredItems.map((item, idx) => (
            <div 
              key={item.id}
              id={`gallery_photo_card_${item.id}`}
              onClick={() => onPhotoClick(idx)}
              className="bg-white rounded-2xl overflow-hidden border border-navy-950/5 hover:border-[#c5a059]/40 hover:shadow-md transition-all cursor-pointer group"
            >
              <div className="aspect-square relative overflow-hidden bg-navy-950">
                <img 
                  src={item.image_url} 
                  alt={item.caption || "Gallery item"} 
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  referrerPolicy="no-referrer"
                />
                <div className="absolute inset-0 bg-navy-950/0 hover:bg-navy-950/20 transition-colors flex items-center justify-center">
                  <Maximize2 className="w-5 h-5 text-white opacity-0 group-hover:opacity-100 transition-opacity drop-shadow-md" />
                </div>
              </div>
              <div className="p-2.5">
                <p className="font-bold text-navy-950 truncate max-w-full leading-tight text-[10px] text-left">
                  {item.caption || 'Untitled Assembly Photo'}
                </p>
                <div className="flex justify-between items-center text-[8px] text-navy-400 font-mono mt-1.5 uppercase">
                  <span className="truncate max-w-[65px] text-left">{item.uploaded_by_name || 'Anonymous'}</span>
                  <span className="shrink-0 text-right">{item.album}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="bg-white rounded-2xl p-12 border border-navy-950/5 text-center text-navy-400" id="gallery_empty_state">
          <ImageIcon className="w-12 h-12 text-navy-200 mx-auto mb-2" />
          <p className="font-bold uppercase tracking-wider text-xs text-navy-950">Empty Album Category</p>
          <p className="text-[10px] text-navy-400 mt-1">Be the first to upload historical images to this category using the button above.</p>
        </div>
      )}
    </div>
  );
}
