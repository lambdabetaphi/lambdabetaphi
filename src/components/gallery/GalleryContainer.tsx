import React, { useState, useEffect, useMemo } from 'react';
import { FolderOpen, Plus, Info, Layers, RefreshCw } from 'lucide-react';
import { Member, Album, AlbumPhoto, Event, GalleryItem } from '../../types';
import { AlbumGrid } from './AlbumGrid';
import { AlbumDetail } from './AlbumDetail';
import { dbService } from '../../lib/dbService';

export interface GalleryContainerProps {
  gallery?: GalleryItem[];
  currentUser: Member;
  events?: Event[];
  onAddGalleryItem?: (item: Omit<GalleryItem, 'id' | 'created_at'>) => Promise<void> | void;
  showToast: (message: string, type?: 'success' | 'info' | 'error') => void;
}

export function GalleryContainer({
  currentUser,
  events = [],
  showToast
}: GalleryContainerProps) {
  const [albums, setAlbums] = useState<Album[]>([]);
  const [photos, setPhotos] = useState<AlbumPhoto[]>([]);
  const [loading, setLoading] = useState(true);

  // Navigation View state: 'albums' or 'detail'
  const [activeView, setActiveView] = useState<'albums' | 'detail'>('albums');
  const [selectedAlbumId, setSelectedAlbumId] = useState<string | null>(null);

  // Fetch albums & photos from dbService
  useEffect(() => {
    async function loadGalleryData() {
      setLoading(true);
      try {
        const fetchedAlbums = await dbService.getAlbums();
        const fetchedPhotos = await dbService.getAllAlbumPhotos();
        setAlbums(fetchedAlbums);
        setPhotos(fetchedPhotos);
      } catch (err) {
        console.warn('Error loading album data:', err);
      } finally {
        setLoading(false);
      }
    }
    loadGalleryData();
  }, []);

  // Selected Album Object & Photos
  const selectedAlbum = useMemo(() => {
    if (!selectedAlbumId) return null;
    return albums.find(a => a.id === selectedAlbumId) || null;
  }, [albums, selectedAlbumId]);

  const selectedAlbumPhotos = useMemo(() => {
    if (!selectedAlbumId) return [];
    return photos.filter(p => p.albumId === selectedAlbumId);
  }, [photos, selectedAlbumId]);

  const selectedAlbumLinkedEvent = useMemo(() => {
    if (!selectedAlbum || !selectedAlbum.eventId) return undefined;
    return events.find(e => e.id === selectedAlbum.eventId);
  }, [selectedAlbum, events]);

  const handleSelectAlbum = (albumId: string) => {
    setSelectedAlbumId(albumId);
    setActiveView('detail');
  };

  const handleBackToAlbums = () => {
    setActiveView('albums');
    setSelectedAlbumId(null);
  };

  const handleUploadPlaceholderClick = () => {
    showToast('Event photo uploads and album management will be enabled in Sprint 9.', 'info');
  };

  return (
    <div className="space-y-6 font-sans text-xs" id="gallery_container">
      
      {/* Top Banner & Title Block */}
      <div className="bg-white rounded-2xl shadow-sm border border-navy-950/10 p-5 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div className="text-left space-y-1">
          <div className="flex items-center gap-2">
            <span className="px-2 py-0.5 bg-[#fbf9f4] border border-[#c5a059]/40 text-[#c5a059] text-[9px] font-mono font-bold uppercase tracking-widest rounded-md flex items-center gap-1">
              <Layers className="w-3 h-3" /> Album Repository Architecture
            </span>
            <span className="px-2 py-0.5 bg-navy-950 text-gold-500 text-[9px] font-mono font-bold uppercase tracking-widest rounded-md">
              Sprint 8.1
            </span>
          </div>

          <h3 className="font-serif font-black text-navy-950 text-lg sm:text-xl uppercase tracking-wide flex items-center gap-2">
            <FolderOpen className="w-6 h-6 text-[#c5a059]" />
            Chapter Media Gallery
          </h3>
          <p className="text-[10px] text-navy-500 uppercase tracking-widest font-semibold">
            Centralized Photo Album Archive for Lambda Beta Phi
          </p>
        </div>

        {/* Action Button & Future Notice */}
        <div className="flex items-center gap-2 w-full md:w-auto">
          <button
            id="open_uploader_modal_btn"
            onClick={handleUploadPlaceholderClick}
            className="w-full md:w-auto px-5 py-2.5 bg-navy-950 hover:bg-navy-900 text-gold-500 text-[10px] font-bold uppercase tracking-widest rounded-xl transition-all cursor-pointer flex items-center justify-center gap-2 shadow-sm border border-gold-500/20 active:scale-[0.98] focus:outline-none focus:ring-2 focus:ring-[#c5a059]"
          >
            <Plus className="w-4 h-4 text-gold-400" />
            <span>Create Album / Add Photos</span>
          </button>
        </div>
      </div>

      {/* Main Content Area */}
      {loading ? (
        /* Lightweight Skeleton UI */
        <div className="space-y-6">
          <div className="h-14 bg-white rounded-2xl border border-navy-950/10 animate-pulse" />
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <div key={i} className="bg-white rounded-2xl border border-navy-950/10 h-72 animate-pulse p-4 flex flex-col justify-between">
                <div className="w-full aspect-[16/10] bg-navy-100 rounded-xl" />
                <div className="space-y-2 pt-3">
                  <div className="h-4 bg-navy-100 rounded w-3/4" />
                  <div className="h-3 bg-navy-50 rounded w-1/2" />
                </div>
              </div>
            ))}
          </div>
        </div>
      ) : activeView === 'detail' && selectedAlbum ? (
        <AlbumDetail
          album={selectedAlbum}
          photos={selectedAlbumPhotos}
          linkedEvent={selectedAlbumLinkedEvent}
          onBack={handleBackToAlbums}
        />
      ) : (
        <AlbumGrid
          albums={albums}
          events={events}
          onSelectAlbum={handleSelectAlbum}
        />
      )}

    </div>
  );
}
