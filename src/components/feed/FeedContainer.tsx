import React, { useState } from 'react';
import { Image as ImageIcon, X, ChevronLeft, ChevronRight } from 'lucide-react';
import { Member, Post, Comment } from '../../types';
import { PostComposer } from './PostComposer';
import { PostCard } from './PostCard';

// Relative Time Helper
export function getRelativeTime(isoString: string): string {
  try {
    const now = new Date();
    const past = new Date(isoString);
    const diffMs = now.getTime() - past.getTime();
    if (diffMs < 0) return 'Just now';
    
    const diffSec = Math.floor(diffMs / 1000);
    if (diffSec < 60) return 'Just now';
    
    const diffMin = Math.floor(diffSec / 60);
    if (diffMin < 60) return `${diffMin}m ago`;
    
    const diffHours = Math.floor(diffMin / 60);
    if (diffHours < 24) return `${diffHours}h ago`;
    
    const diffDays = Math.floor(diffHours / 24);
    if (diffDays === 1) return 'Yesterday';
    if (diffDays < 30) return `${diffDays}d ago`;
    
    return past.toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' });
  } catch (e) {
    return 'Some time ago';
  }
}

export interface FeedContainerProps {
  currentUser: Member;
  posts: Post[];
  comments: Comment[];
  onAddPost: (content: string, images: string[]) => void;
  onLikePost: (postId: string) => void;
  onAddComment: (postId: string, content: string) => void;
  showToast: (message: string, type?: 'success' | 'info' | 'error') => void;
}

export function FeedContainer({
  currentUser,
  posts,
  comments,
  onAddPost,
  onLikePost,
  onAddComment,
  showToast
}: FeedContainerProps) {
  // Active Lightbox media viewer
  const [lightboxImages, setLightboxImages] = useState<string[] | null>(null);
  const [lightboxIndex, setLightboxIndex] = useState(0);

  const handleSharePost = (post: Post) => {
    // Copy a dummy community portal link to clipboard
    const simulatedLink = `${window.location.origin}/portal/post/${post.id}`;
    navigator.clipboard.writeText(simulatedLink);
    showToast('Post community permalink copied to clipboard!', 'success');
  };

  const openLightbox = (images: string[], index: number) => {
    setLightboxImages(images);
    setLightboxIndex(index);
  };

  return (
    <div className="space-y-4 font-sans text-xs">
      {/* 1. What's on your mind? Post Composer */}
      <PostComposer currentUser={currentUser} onAddPost={onAddPost} />

      {/* 2. List of Chronological Posts */}
      <div className="space-y-4">
        {posts.length > 0 ? (
          posts.map(post => (
            <PostCard
              key={post.id}
              post={post}
              currentUser={currentUser}
              comments={comments}
              onLikePost={onLikePost}
              onAddComment={onAddComment}
              onSharePost={handleSharePost}
              openLightbox={openLightbox}
              getRelativeTime={getRelativeTime}
            />
          ))
        ) : (
          <div className="bg-white rounded-2xl p-8 border border-navy-950/5 text-center text-navy-400">
            <ImageIcon className="w-12 h-12 text-navy-200 mx-auto mb-2" />
            <p className="font-bold uppercase tracking-wider text-xs text-navy-950">No community posts yet</p>
            <p className="text-[10px] mt-1 text-navy-400 max-w-xs mx-auto">Be the first to connect with your brothers and sisters by writing a post above.</p>
          </div>
        )}
      </div>

      {/* 3. Lightbox Media Viewer Modal */}
      {lightboxImages && (
        <div className="fixed inset-0 bg-navy-950/95 z-50 flex items-center justify-center p-4 select-none animate-fade-in">
          {/* Top controllers */}
          <div className="absolute top-4 left-4 right-4 flex items-center justify-between text-white z-10">
            <span className="text-[10px] font-mono tracking-widest uppercase">
              Photo {lightboxIndex + 1} of {lightboxImages.length}
            </span>
            <button
              id="close_lightbox"
              onClick={() => setLightboxImages(null)}
              className="p-1.5 hover:bg-white/10 rounded-full transition-colors text-white cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Left Arrow */}
          {lightboxImages.length > 1 && (
            <button
              id="prev_lightbox"
              onClick={(e) => {
                e.stopPropagation();
                setLightboxIndex(prev => (prev === 0 ? lightboxImages.length - 1 : prev - 1));
              }}
              className="absolute left-4 p-2 bg-navy-950/50 hover:bg-white/10 text-white rounded-full transition-colors cursor-pointer"
            >
              <ChevronLeft className="w-6 h-6" />
            </button>
          )}

          {/* Main Photo Zoomed */}
          <div className="max-w-4xl max-h-[85vh] flex items-center justify-center">
            <img 
              src={lightboxImages[lightboxIndex]} 
              alt="Zoomed" 
              className="max-w-full max-h-[80vh] object-contain shadow-2xl border border-white/5" 
            />
          </div>

          {/* Right Arrow */}
          {lightboxImages.length > 1 && (
            <button
              id="next_lightbox"
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
