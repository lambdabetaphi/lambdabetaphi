import React, { useState, useMemo } from 'react';
import { Search, FolderOpen, Filter, Info, X } from 'lucide-react';
import { Album, Event } from '../../types';
import { AlbumCard } from './AlbumCard';

export interface AlbumGridProps {
  albums: Album[];
  events?: Event[];
  onSelectAlbum: (albumId: string) => void;
}

export const AlbumGrid: React.FC<AlbumGridProps> = ({
  albums,
  events = [],
  onSelectAlbum
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState<'all' | 'linked' | 'general'>('all');

  // Map eventId to event title for easy lookup
  const eventMap = useMemo(() => {
    const map = new Map<string, string>();
    events.forEach(e => {
      map.set(e.id, e.title);
    });
    return map;
  }, [events]);

  // Filtered albums
  const filteredAlbums = useMemo(() => {
    return albums.filter(album => {
      // Category filter
      if (categoryFilter === 'linked' && !album.eventId) return false;
      if (categoryFilter === 'general' && album.eventId) return false;

      // Search query filter
      if (searchQuery.trim()) {
        const query = searchQuery.toLowerCase();
        const matchesTitle = album.title.toLowerCase().includes(query);
        const matchesDesc = album.description?.toLowerCase().includes(query) || false;
        const linkedEventName = album.eventId ? eventMap.get(album.eventId)?.toLowerCase() || '' : '';
        const matchesEvent = linkedEventName.includes(query);
        return matchesTitle || matchesDesc || matchesEvent;
      }

      return true;
    });
  }, [albums, categoryFilter, searchQuery, eventMap]);

  return (
    <div className="space-y-6 font-sans text-xs">
      
      {/* Controls & Search Toolbar */}
      <div className="bg-white p-4 rounded-2xl border border-navy-950/10 shadow-sm flex flex-col md:flex-row items-center justify-between gap-4">
        
        {/* Category Filter Pills */}
        <div className="flex items-center gap-1.5 overflow-x-auto w-full md:w-auto pb-1 md:pb-0 custom-scrollbar">
          <span className="text-[10px] font-mono text-navy-400 uppercase tracking-widest font-bold flex items-center gap-1 mr-1 shrink-0">
            <Filter className="w-3 h-3 text-[#c5a059]" /> Filter:
          </span>

          <button
            id="filter_album_all"
            onClick={() => setCategoryFilter('all')}
            className={`px-3 py-1.5 rounded-xl text-[10px] font-bold uppercase tracking-wider transition-all cursor-pointer whitespace-nowrap focus:outline-none focus:ring-2 focus:ring-[#c5a059] ${
              categoryFilter === 'all'
                ? 'bg-navy-950 text-gold-500 shadow-sm'
                : 'bg-navy-50/70 text-navy-700 hover:bg-navy-100'
            }`}
          >
            All Albums ({albums.length})
          </button>

          <button
            id="filter_album_linked"
            onClick={() => setCategoryFilter('linked')}
            className={`px-3 py-1.5 rounded-xl text-[10px] font-bold uppercase tracking-wider transition-all cursor-pointer whitespace-nowrap focus:outline-none focus:ring-2 focus:ring-[#c5a059] ${
              categoryFilter === 'linked'
                ? 'bg-navy-950 text-gold-500 shadow-sm'
                : 'bg-navy-50/70 text-navy-700 hover:bg-navy-100'
            }`}
          >
            Linked to Events ({albums.filter(a => a.eventId).length})
          </button>

          <button
            id="filter_album_general"
            onClick={() => setCategoryFilter('general')}
            className={`px-3 py-1.5 rounded-xl text-[10px] font-bold uppercase tracking-wider transition-all cursor-pointer whitespace-nowrap focus:outline-none focus:ring-2 focus:ring-[#c5a059] ${
              categoryFilter === 'general'
                ? 'bg-navy-950 text-gold-500 shadow-sm'
                : 'bg-navy-50/70 text-navy-700 hover:bg-navy-100'
            }`}
          >
            General Archives ({albums.filter(a => !a.eventId).length})
          </button>
        </div>

        {/* Search Input Box */}
        <div className="relative w-full md:w-72">
          <Search className="w-4 h-4 text-navy-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
          <input
            type="text"
            id="search_albums_input"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search albums or events..."
            aria-label="Search media albums"
            className="w-full pl-9 pr-8 py-2 bg-navy-50/50 border border-navy-950/10 rounded-xl text-[11px] text-navy-950 placeholder:text-navy-400 focus:outline-none focus:ring-2 focus:ring-[#c5a059] focus:bg-white transition-all"
          />
          {searchQuery && (
            <button 
              onClick={() => setSearchQuery('')}
              className="absolute right-2.5 top-1/2 -translate-y-1/2 p-0.5 text-navy-400 hover:text-navy-950 rounded-full"
              aria-label="Clear search input"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          )}
        </div>

      </div>

      {/* Albums Grid */}
      {filteredAlbums.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6" id="albums_cards_grid">
          {filteredAlbums.map((album) => {
            const eventName = album.eventId ? eventMap.get(album.eventId) : undefined;
            return (
              <AlbumCard
                key={album.id}
                album={album}
                eventName={eventName}
                onSelect={onSelectAlbum}
              />
            );
          })}
        </div>
      ) : (
        /* Empty State for Search or Filters */
        <div className="bg-white rounded-2xl p-12 border border-navy-950/10 text-center space-y-3" id="albums_empty_search">
          <div className="w-16 h-16 bg-[#fbf9f4] border border-[#c5a059]/30 rounded-full flex items-center justify-center text-[#c5a059] mx-auto shadow-xs">
            <FolderOpen className="w-8 h-8" />
          </div>
          <h4 className="font-serif font-bold text-navy-950 text-sm uppercase tracking-wider">No Media Albums Found</h4>
          <p className="text-[11px] text-navy-500 max-w-sm mx-auto">
            No chapter albums match your filter criteria or search query {searchQuery && <strong>&quot;{searchQuery}&quot;</strong>}.
          </p>
          <button
            onClick={() => { setSearchQuery(''); setCategoryFilter('all'); }}
            className="px-4 py-2 bg-navy-950 text-gold-500 text-[10px] font-bold uppercase tracking-wider rounded-xl hover:bg-navy-900 transition-colors cursor-pointer focus:outline-none focus:ring-2 focus:ring-[#c5a059]"
          >
            Reset Album Filters
          </button>
        </div>
      )}

      {/* Architecture Note Footer */}
      <div className="p-3 bg-[#fbf9f4] border border-[#c5a059]/20 rounded-xl text-[9.5px] text-navy-600 flex items-center gap-2">
        <Info className="w-4 h-4 text-[#c5a059] shrink-0" />
        <span>
          <strong>Album-Based Repository Architecture:</strong> Events modules link directly to designated photo albums for official record-keeping.
        </span>
      </div>

    </div>
  );
};

