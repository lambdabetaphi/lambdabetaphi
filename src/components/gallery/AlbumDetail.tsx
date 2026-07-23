import React, { useState } from 'react';
import { ArrowLeft, Calendar, Image as ImageIcon, Link as LinkIcon, User, Camera, Info, Maximize2 } from 'lucide-react';
import { Album, AlbumPhoto, Event } from '../../types';
import { Lightbox } from './Lightbox';

export interface AlbumDetailProps {
  album: Album;
  photos: AlbumPhoto[];
  linkedEvent?: Event;
  onBack: () => void;
}

export const AlbumDetail: React.FC<AlbumDetailProps> = ({
  album,
  photos,
  linkedEvent,
  onBack
}) => {
  // Lightbox State
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);

  const formattedDate = new Date(album.createdAt).toLocaleDateString('en-US', {
    month: 'long',
    day: 'numeric',
    year: 'numeric'
  });

  const photoImages = photos.map(p => p.imageUrl);

  const handlePhotoKeyDown = (e: React.KeyboardEvent, index: number) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      setLightboxIndex(index);
    }
  };

  return (
    <div className="space-y-6 font-sans text-xs">
      
      {/* Back Navigation Bar */}
      <div className="flex items-center justify-between">
        <button
          id="back_to_albums_btn"
          onClick={onBack}
          className="px-4 py-2 bg-white hover:bg-navy-50 text-navy-950 border border-navy-950/15 rounded-xl font-mono text-[10px] font-bold uppercase tracking-wider transition-all cursor-pointer flex items-center gap-2 shadow-sm focus:outline-none focus:ring-2 focus:ring-[#c5a059] active:scale-95"
          aria-label="Back to Media Albums"
        >
          <ArrowLeft className="w-4 h-4 text-[#c5a059]" />
          Back to Media Albums
        </button>

        <span className="text-[9.5px] font-mono text-navy-400 uppercase tracking-widest font-bold hidden sm:inline-block">
          Sovereign Photographic Registry &bull; {album.id}
        </span>
      </div>

      {/* Album Header Banner */}
      <div className="bg-white rounded-2xl border border-navy-950/10 p-5 sm:p-6 shadow-sm space-y-4">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 pb-4 border-b border-navy-950/5">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="px-2.5 py-0.5 bg-navy-950 text-gold-500 text-[8.5px] font-mono font-bold uppercase tracking-widest rounded-md">
                Album Directory
              </span>
              {linkedEvent && (
                <span className="px-2.5 py-0.5 bg-emerald-50 border border-emerald-200 text-emerald-800 text-[8.5px] font-mono font-bold uppercase tracking-widest rounded-md flex items-center gap-1">
                  <LinkIcon className="w-2.5 h-2.5 text-emerald-600" />
                  Linked Event
                </span>
              )}
            </div>
            
            <h2 className="font-serif font-black text-navy-950 text-xl sm:text-2xl tracking-tight">
              {album.title}
            </h2>
          </div>

          <div className="flex items-center gap-3 shrink-0">
            <div className="px-4 py-2 bg-[#fbf9f4] border border-[#c5a059]/30 rounded-xl text-center shadow-xs">
              <span className="block text-navy-950 font-serif font-bold text-lg leading-none">
                {photos.length}
              </span>
              <span className="text-[8.5px] font-mono text-navy-500 uppercase tracking-wider font-bold">
                Archived Photos
              </span>
            </div>
          </div>
        </div>

        {/* Description & Event Context */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-[11px] text-navy-700">
          <div className="md:col-span-2 space-y-1.5">
            <h4 className="text-[9.5px] font-mono font-bold uppercase tracking-widest text-navy-400">
              Album Summary
            </h4>
            <p className="leading-relaxed font-sans text-navy-800">
              {album.description || 'No descriptive summary provided for this archive folder.'}
            </p>
          </div>

          <div className="bg-navy-50/50 p-3.5 rounded-xl border border-navy-950/5 space-y-2 font-mono text-[9.5px]">
            <div className="flex items-center gap-1.5 text-navy-600">
              <Calendar className="w-3.5 h-3.5 text-[#c5a059]" />
              <span>Created: <strong>{formattedDate}</strong></span>
            </div>

            {linkedEvent && (
              <div className="flex items-center gap-1.5 text-navy-800 pt-1.5 border-t border-navy-950/5">
                <LinkIcon className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                <span className="truncate">Event: <strong>{linkedEvent.title}</strong></span>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Album Photo Gallery Grid OR Empty State */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <h3 className="font-serif font-bold text-navy-950 text-sm uppercase tracking-wider flex items-center gap-2">
            <ImageIcon className="w-4 h-4 text-[#c5a059]" />
            Album Photo Collection ({photos.length})
          </h3>
          <span className="text-[9px] font-mono text-navy-400 uppercase tracking-widest hidden sm:inline-block">
            Click image to expand view
          </span>
        </div>

        {photos.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4" id="album_photos_grid">
            {photos.map((photo, index) => (
              <div
                key={photo.id}
                id={`album_photo_${photo.id}`}
                role="button"
                tabIndex={0}
                onClick={() => setLightboxIndex(index)}
                onKeyDown={(e) => handlePhotoKeyDown(e, index)}
                aria-label={`View photo ${index + 1}: ${photo.caption || 'Untitled Photo'}`}
                className="bg-white rounded-2xl overflow-hidden border border-navy-950/10 hover:border-[#c5a059] hover:shadow-md transition-all duration-200 cursor-pointer group flex flex-col focus:outline-none focus:ring-2 focus:ring-[#c5a059] focus:ring-offset-2"
              >
                {/* Image Container */}
                <div className="aspect-[4/3] relative overflow-hidden bg-navy-950">
                  <img
                    src={photo.imageUrl}
                    alt={photo.caption || 'Album Photo'}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    referrerPolicy="no-referrer"
                    loading="lazy"
                  />
                  <div className="absolute inset-0 bg-navy-950/0 group-hover:bg-navy-950/30 transition-colors flex items-center justify-center">
                    <Maximize2 className="w-5 h-5 text-white opacity-0 group-hover:opacity-100 transition-opacity drop-shadow-md" />
                  </div>
                </div>

                {/* Caption & Metadata */}
                <div className="p-3 space-y-1.5 flex-1 flex flex-col justify-between">
                  <p className="font-sans text-[11px] font-medium text-navy-950 line-clamp-2 leading-snug">
                    {photo.caption || 'Untitled Assembly Record'}
                  </p>

                  <div className="pt-2 border-t border-navy-950/5 flex items-center justify-between text-[8.5px] font-mono text-navy-400 uppercase">
                    <span className="truncate max-w-[100px] flex items-center gap-1">
                      <User className="w-2.5 h-2.5 text-[#c5a059]" />
                      {photo.uploadedBy}
                    </span>
                    <span>{new Date(photo.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          /* Empty Album State - Vertically Centered & Clean */
          <div className="bg-white rounded-2xl p-12 sm:p-16 border border-navy-950/10 text-center flex flex-col items-center justify-center space-y-3 min-h-[300px]" id="album_empty_photos_state">
            <div className="w-16 h-16 bg-[#fbf9f4] border border-[#c5a059]/30 rounded-full flex items-center justify-center text-[#c5a059] shadow-xs">
              <Camera className="w-8 h-8" />
            </div>
            <div className="space-y-1">
              <h4 className="font-serif font-bold text-navy-950 text-base uppercase tracking-wider">
                No Photos Uploaded Yet
              </h4>
              <p className="text-[11px] text-navy-500 max-w-sm mx-auto leading-relaxed">
                No photographic records have been uploaded to this album yet. Photos will be available soon.
              </p>
            </div>
            <div className="pt-2">
              <div className="inline-flex items-center gap-1.5 px-3.5 py-1.5 bg-navy-50 text-navy-700 text-[10px] font-mono font-semibold rounded-lg border border-navy-950/10">
                <Info className="w-3.5 h-3.5 text-[#c5a059]" />
                <span>Event photo uploads will be enabled in Sprint 9.</span>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Lightbox Modal */}
      {lightboxIndex !== null && (
        <Lightbox
          images={photoImages}
          currentIndex={lightboxIndex}
          onClose={() => setLightboxIndex(null)}
          onPrev={() => setLightboxIndex(prev => (prev === null || prev === 0 ? photoImages.length - 1 : prev - 1))}
          onNext={() => setLightboxIndex(prev => (prev === null || prev === photoImages.length - 1 ? 0 : prev + 1))}
        />
      )}

    </div>
  );
};

