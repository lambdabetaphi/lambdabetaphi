import React, { useEffect } from 'react';
import { X, ChevronLeft, ChevronRight } from 'lucide-react';

export interface LightboxProps {
  images: string[];
  currentIndex: number;
  onClose: () => void;
  onPrev: () => void;
  onNext: () => void;
}

export function Lightbox({
  images,
  currentIndex,
  onClose,
  onPrev,
  onNext
}: LightboxProps) {
  // Add keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      } else if (e.key === 'ArrowLeft') {
        onPrev();
      } else if (e.key === 'ArrowRight') {
        onNext();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    // Prevent background scrolling while lightbox is active
    document.body.style.overflow = 'hidden';

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = '';
    };
  }, [onClose, onPrev, onNext]);

  if (!images || images.length === 0) return null;

  return (
    <div 
      className="fixed inset-0 bg-navy-950/95 z-50 flex items-center justify-center p-4 select-none animate-fade-in"
      role="dialog"
      aria-modal="true"
      aria-label="Media viewer"
    >
      {/* Top controllers */}
      <div className="absolute top-4 left-4 right-4 flex items-center justify-between text-white z-10 font-mono text-[9px] uppercase tracking-widest">
        <span>Archive Photo {currentIndex + 1} of {images.length}</span>
        <button
          id="close_lightbox"
          onClick={onClose}
          className="p-1.5 hover:bg-white/10 rounded-full transition-colors text-white cursor-pointer focus:outline-none focus:ring-1 focus:ring-gold-500"
          aria-label="Close viewer"
        >
          <X className="w-5 h-5" />
        </button>
      </div>

      {/* Left Arrow */}
      {images.length > 1 && (
        <button
          id="prev_lightbox"
          onClick={(e) => {
            e.stopPropagation();
            onPrev();
          }}
          className="absolute left-4 p-2 bg-navy-950/50 hover:bg-white/10 text-white rounded-full transition-colors cursor-pointer focus:outline-none focus:ring-1 focus:ring-gold-500"
          aria-label="Previous photo"
        >
          <ChevronLeft className="w-6 h-6" />
        </button>
      )}

      {/* Main Photo Zoomed */}
      <div 
        className="max-w-4xl max-h-[80vh] flex items-center justify-center"
        onClick={(e) => e.stopPropagation()}
      >
        <img 
          src={images[currentIndex]} 
          alt={`Zoomed image ${currentIndex + 1}`} 
          className="max-w-full max-h-[75vh] object-contain shadow-2xl border border-white/5 rounded-lg" 
          referrerPolicy="no-referrer"
        />
      </div>

      {/* Right Arrow */}
      {images.length > 1 && (
        <button
          id="next_lightbox"
          onClick={(e) => {
            e.stopPropagation();
            onNext();
          }}
          className="absolute right-4 p-2 bg-navy-950/50 hover:bg-white/10 text-white rounded-full transition-colors cursor-pointer focus:outline-none focus:ring-1 focus:ring-gold-500"
          aria-label="Next photo"
        >
          <ChevronRight className="w-6 h-6" />
        </button>
      )}
    </div>
  );
}
