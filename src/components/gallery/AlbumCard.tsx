import React from 'react';
import { Folder, Calendar, Image as ImageIcon, Link as LinkIcon, ChevronRight } from 'lucide-react';
import { Album } from '../../types';

export interface AlbumCardProps {
  album: Album;
  eventName?: string;
  onSelect: (albumId: string) => void;
}

export const AlbumCard: React.FC<AlbumCardProps> = ({ album, eventName, onSelect }) => {
  const formattedDate = new Date(album.createdAt).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric'
  });

  const defaultCover = 'https://images.unsplash.com/photo-1511795409834-ef04bbd61622?auto=format&fit=crop&w=800&q=80';

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      onSelect(album.id);
    }
  };

  return (
    <div 
      id={`album_card_${album.id}`}
      role="button"
      tabIndex={0}
      onClick={() => onSelect(album.id)}
      onKeyDown={handleKeyDown}
      aria-label={`Open album: ${album.title}`}
      className="bg-white rounded-2xl border border-navy-950/10 hover:border-[#c5a059] shadow-sm hover:shadow-lg hover:-translate-y-1 transition-all duration-300 overflow-hidden cursor-pointer group flex flex-col h-full focus:outline-none focus:ring-2 focus:ring-[#c5a059] focus:ring-offset-2"
    >
      {/* Cover Image Container */}
      <div className="relative aspect-[16/10] overflow-hidden bg-navy-950 shrink-0">
        <img 
          src={album.coverPhoto || defaultCover} 
          alt={album.title} 
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 ease-out"
          referrerPolicy="no-referrer"
          loading="lazy"
        />
        
        {/* Overlay Gradients */}
        <div className="absolute inset-0 bg-gradient-to-t from-navy-950/90 via-navy-950/30 to-transparent" />

        {/* Top Badges */}
        <div className="absolute top-3 left-3 right-3 flex items-center justify-between gap-2">
          <span className="px-2.5 py-1 bg-navy-950/85 backdrop-blur-md text-gold-400 border border-gold-500/30 text-[9px] font-mono font-bold uppercase tracking-wider rounded-md flex items-center gap-1 shadow-md">
            <ImageIcon className="w-3 h-3 text-[#c5a059]" />
            {album.photoCount} {album.photoCount === 1 ? 'Photo' : 'Photos'}
          </span>

          {(album.eventId || eventName) && (
            <span className="px-2.5 py-1 bg-emerald-950/85 backdrop-blur-md text-emerald-300 border border-emerald-500/30 text-[8.5px] font-mono font-bold uppercase tracking-wider rounded-md flex items-center gap-1 shadow-md truncate max-w-[150px]">
              <LinkIcon className="w-2.5 h-2.5 text-emerald-400 shrink-0" />
              <span className="truncate">Linked Event</span>
            </span>
          )}
        </div>

        {/* Bottom Title on Image */}
        <div className="absolute bottom-3 left-3 right-3">
          <div className="flex items-center gap-1.5 text-amber-300 text-[9px] font-mono uppercase tracking-widest font-semibold mb-0.5">
            <Folder className="w-3 h-3 text-[#c5a059]" />
            <span>Album Archive</span>
          </div>
          <h4 className="font-serif font-bold text-white text-sm sm:text-base leading-snug group-hover:text-gold-300 transition-colors line-clamp-1">
            {album.title}
          </h4>
        </div>
      </div>

      {/* Card Content & Metadata */}
      <div className="p-4 flex flex-col justify-between flex-1 space-y-3">
        {album.description ? (
          <p className="text-[11px] text-navy-600 line-clamp-2 leading-relaxed font-sans">
            {album.description}
          </p>
        ) : (
          <p className="text-[11px] text-navy-400 italic font-sans">
            No album description provided.
          </p>
        )}

        {eventName && (
          <div className="p-2 bg-[#fbf9f4] border border-[#c5a059]/20 rounded-lg text-[10px] text-navy-800 flex items-center gap-1.5 font-medium">
            <LinkIcon className="w-3 h-3 text-[#c5a059] shrink-0" />
            <span className="truncate">Event: <strong className="text-navy-950">{eventName}</strong></span>
          </div>
        )}

        <div className="pt-2 border-t border-navy-950/5 flex items-center justify-between text-[9.5px] font-mono text-navy-400 uppercase">
          <div className="flex items-center gap-1">
            <Calendar className="w-3 h-3 text-[#c5a059]" />
            <span>Created {formattedDate}</span>
          </div>

          <span className="text-[#c5a059] font-bold group-hover:translate-x-1 transition-transform flex items-center gap-0.5">
            View Album <ChevronRight className="w-3 h-3" />
          </span>
        </div>
      </div>
    </div>
  );
};

