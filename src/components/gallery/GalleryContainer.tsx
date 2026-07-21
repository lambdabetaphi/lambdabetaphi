import React, { useState, useMemo } from 'react';
import { FolderOpen, Plus, Image as ImageIcon } from 'lucide-react';
import { Member, GalleryItem } from '../../types';
import { GalleryGrid } from './GalleryGrid';
import { MediaUploader } from './MediaUploader';
import { Lightbox } from './Lightbox';

export interface GalleryContainerProps {
  gallery: GalleryItem[];
  currentUser: Member;
  onAddGalleryItem: (item: Omit<GalleryItem, 'id' | 'created_at'>) => Promise<void> | void;
  showToast: (message: string, type?: 'success' | 'info' | 'error') => void;
}

export function GalleryContainer({
  gallery,
  currentUser,
  onAddGalleryItem,
  showToast
}: GalleryContainerProps) {
  const [activeAlbum, setActiveAlbum] = useState('All');
  const [isUploading, setIsUploading] = useState(false);
  
  // Lightbox view state
  const [lightboxImages, setLightboxImages] = useState<string[] | null>(null);
  const [lightboxIndex, setLightboxIndex] = useState(0);

  // Constants
  const defaultAlbums = useMemo(() => ['General', 'Chapter Assemblies', 'Initiation Rites', 'Civic Service'], []);

  // Derive unique list of albums
  const albums = useMemo(() => {
    const galleryAlbums = Array.from(new Set(gallery.map(item => item.album).filter(Boolean)));
    return ['All', ...Array.from(new Set([...defaultAlbums, ...galleryAlbums]))];
  }, [gallery, defaultAlbums]);

  // Filter gallery items by active album selection
  const filteredItems = useMemo(() => {
    if (activeAlbum === 'All') return gallery;
    return gallery.filter(item => item.album === activeAlbum);
  }, [gallery, activeAlbum]);

  const handleOpenLightbox = (index: number) => {
    setLightboxImages(filteredItems.map(item => item.image_url));
    setLightboxIndex(index);
  };

  const handlePrevLightbox = () => {
    if (!lightboxImages) return;
    setLightboxIndex(prev => (prev === 0 ? lightboxImages.length - 1 : prev - 1));
  };

  const handleNextLightbox = () => {
    if (!lightboxImages) return;
    setLightboxIndex(prev => (prev === lightboxImages.length - 1 ? 0 : prev + 1));
  };

  return (
    <div className="space-y-4 font-sans text-xs">
      
      {/* Top Banner & Control Block */}
      <div className="bg-white rounded-2xl shadow-sm border border-navy-950/5 p-4 flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="text-left w-full md:w-auto">
          <h3 className="font-serif font-black text-navy-950 text-base uppercase tracking-wide flex items-center gap-2">
            <FolderOpen className="w-5 h-5 text-[#c5a059]" />
            Chapter Media Archives
          </h3>
          <p className="text-[10px] text-navy-400 uppercase tracking-widest font-semibold mt-0.5">Sovereign Photographic Registry</p>
        </div>

        <button
          id="open_uploader_modal_btn"
          onClick={() => setIsUploading(true)}
          className="w-full md:w-auto px-5 py-2.5 bg-navy-950 text-gold-500 text-[10px] font-bold uppercase tracking-widest rounded-lg hover:bg-navy-900 transition-colors cursor-pointer flex items-center justify-center gap-1.5"
        >
          <Plus className="w-4 h-4" />
          Archive New Photos
        </button>
      </div>

      {/* Main Gallery Grid layout */}
      <GalleryGrid
        filteredItems={filteredItems}
        activeAlbum={activeAlbum}
        albums={albums}
        onAlbumChange={setActiveAlbum}
        onPhotoClick={handleOpenLightbox}
        isLoading={false}
        error={null}
      />

      {/* Media Multi-Uploader Drawer Overlay */}
      {isUploading && (
        <MediaUploader
          currentUser={currentUser}
          defaultAlbums={defaultAlbums}
          onAddGalleryItem={onAddGalleryItem}
          onClose={() => setIsUploading(false)}
          showToast={showToast}
        />
      )}

      {/* Full-screen Lightbox overlay */}
      {lightboxImages && (
        <Lightbox
          images={lightboxImages}
          currentIndex={lightboxIndex}
          onClose={() => setLightboxImages(null)}
          onPrev={handlePrevLightbox}
          onNext={handleNextLightbox}
        />
      )}

    </div>
  );
}
