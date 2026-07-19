import React, { useState, useRef } from 'react';
import { Heart, MessageSquare, Share2, Camera, X, Image, Send, CheckCircle, Maximize2, ChevronLeft, ChevronRight, Upload } from 'lucide-react';
import { Member, Post, Comment } from '../types';

// ==========================================
// Relative Time Helper
// ==========================================
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

interface PortalFeedProps {
  currentUser: Member;
  posts: Post[];
  comments: Comment[];
  onAddPost: (content: string, images: string[]) => void;
  onLikePost: (postId: string) => void;
  onAddComment: (postId: string, content: string) => void;
  showToast: (message: string, type?: 'success' | 'info' | 'error') => void;
}

export function PortalFeed({ currentUser, posts, comments, onAddPost, onLikePost, onAddComment, showToast }: PortalFeedProps) {
  const [newPostText, setNewPostText] = useState('');
  const [newPostImages, setNewPostImages] = useState<string[]>([]);
  const [dragActive, setDragActive] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Active Lightbox media viewer
  const [lightboxImages, setLightboxImages] = useState<string[] | null>(null);
  const [lightboxIndex, setLightboxIndex] = useState(0);

  // Comment input state map ( postId -> commentContent )
  const [commentInputs, setCommentInputs] = useState<{ [postId: string]: string }>({});

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const filesArray = Array.from(e.target.files) as File[];
      readMultipleFiles(filesArray);
    }
  };

  const readMultipleFiles = (files: File[]) => {
    files.forEach(file => {
      const reader = new FileReader();
      reader.onloadend = () => {
        setNewPostImages(prev => [...prev, reader.result as string]);
      };
      reader.readAsDataURL(file);
    });
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
    if (e.dataTransfer.files) {
      const filesArray = (Array.from(e.dataTransfer.files) as File[]).filter(f => f.type.startsWith('image/'));
      readMultipleFiles(filesArray);
    }
  };

  const handleRemoveImage = (index: number) => {
    setNewPostImages(prev => prev.filter((_, i) => i !== index));
  };

  const handleCreatePostSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newPostText.trim() && newPostImages.length === 0) return;
    
    onAddPost(newPostText.trim(), newPostImages);
    setNewPostText('');
    setNewPostImages([]);
  };

  const handleSharePost = (post: Post) => {
    // Copy a dummy community portal link to clipboard
    const simulatedLink = `${window.location.origin}/portal/post/${post.id}`;
    navigator.clipboard.writeText(simulatedLink);
    showToast('Post community permalink copied to clipboard!', 'success');
  };

  const handleCommentSubmit = (e: React.FormEvent, postId: string) => {
    e.preventDefault();
    const commentText = commentInputs[postId];
    if (!commentText || !commentText.trim()) return;

    onAddComment(postId, commentText.trim());
    setCommentInputs(prev => ({ ...prev, [postId]: '' }));
  };

  const openLightbox = (images: string[], index: number) => {
    setLightboxImages(images);
    setLightboxIndex(index);
  };

  return (
    <div className="space-y-4 font-sans text-xs">
      
      {/* 1. "What's on your mind?" Composer */}
      <div className="bg-white rounded-2xl shadow-sm border border-navy-950/5 p-4">
        <form onSubmit={handleCreatePostSubmit} className="space-y-3.5">
          <div className="flex gap-3">
            <img 
              src={currentUser.avatar_url || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80'} 
              alt={currentUser.full_name} 
              className="w-10 h-10 rounded-full object-cover border border-navy-950/10 shadow-sm shrink-0"
              referrerPolicy="no-referrer"
            />
            <div className="flex-1">
              <textarea
                value={newPostText}
                onChange={(e) => setNewPostText(e.target.value)}
                placeholder={`What's on your mind, ${(currentUser.full_name || '').split(' ')[0]}?`}
                rows={2}
                className="w-full resize-none border-0 focus:ring-0 text-navy-950 text-xs placeholder-navy-400 p-1.5 focus:outline-none min-h-[50px]"
              />
            </div>
          </div>

          {/* Multiple Photo Thumbnails Preview */}
          {newPostImages.length > 0 && (
            <div className="grid grid-cols-4 gap-2.5 p-2 bg-[#fbf9f4] border border-navy-950/5 rounded-xl">
              {newPostImages.map((img, i) => (
                <div key={i} className="relative aspect-square group rounded-lg overflow-hidden border border-navy-950/10">
                  <img src={img} alt="Thumbnail" className="w-full h-full object-cover" />
                  <button
                    type="button"
                    onClick={() => handleRemoveImage(i)}
                    className="absolute top-1 right-1 p-1 bg-navy-950/70 hover:bg-rose-600 text-white rounded-full transition-colors cursor-pointer"
                  >
                    <X className="w-3 h-3" />
                  </button>
                </div>
              ))}
            </div>
          )}

          {/* Drag & Drop Photo Area */}
          <div 
            onDragEnter={handleDrag}
            onDragOver={handleDrag}
            onDragLeave={handleDrag}
            onDrop={handleDrop}
            onClick={() => fileInputRef.current?.click()}
            className={`flex flex-col items-center justify-center border-2 border-dashed rounded-xl py-3 text-center transition-all cursor-pointer ${
              dragActive 
                ? 'border-gold-500 bg-gold-50/20' 
                : 'border-navy-950/10 hover:border-gold-500/40 bg-white'
            }`}
          >
            <input
              type="file"
              ref={fileInputRef}
              accept="image/*"
              multiple
              onChange={handleFileSelect}
              className="hidden"
            />
            <div className="flex items-center gap-2">
              <Image className="w-4 h-4 text-[#c5a059]" />
              <p className="text-[10px] font-bold text-navy-900 uppercase tracking-wide">
                Drag & drop or browse photos
              </p>
            </div>
          </div>

          <div className="flex items-center justify-between pt-2 border-t border-navy-950/5">
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className="flex items-center gap-1.5 px-3 py-1.5 hover:bg-navy-50/50 rounded-lg text-navy-500 transition-colors cursor-pointer font-bold uppercase tracking-wider text-[9px]"
            >
              <Camera className="w-4 h-4 text-[#c5a059]" />
              Add Photo
            </button>
            <button
              type="submit"
              disabled={!newPostText.trim() && newPostImages.length === 0}
              className="px-5 py-2 bg-navy-950 text-gold-500 hover:bg-navy-900 transition-colors cursor-pointer text-[10px] font-bold uppercase tracking-widest rounded-lg disabled:opacity-40"
            >
              Broadcast
            </button>
          </div>
        </form>
      </div>

      {/* 2. Chronological Posts Feed */}
      <div className="space-y-4">
        {posts.length > 0 ? (
          posts.map(post => {
            const hasLiked = (post.liked_by || []).includes(currentUser.id);
            const postComments = comments.filter(c => c.post_id === post.id);

            return (
              <div key={post.id} className="bg-white rounded-2xl shadow-sm border border-navy-950/5 p-4.5 space-y-3">
                
                {/* Post Header */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <img 
                      src={post.member_avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80'} 
                      alt="" 
                      className="w-10 h-10 rounded-full object-cover border border-[#c5a059]/20"
                      referrerPolicy="no-referrer"
                    />
                    <div>
                      <div className="flex items-center gap-1.5">
                        <h4 className="font-bold text-navy-950 text-xs uppercase tracking-wide">{post.member_name || 'Fraternity Member'}</h4>
                      </div>
                      <p className="text-[9px] text-navy-400 font-medium tracking-wide">
                        {post.member_chapter || 'Active Chapter'} &bull; {getRelativeTime(post.created_at)}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Post Content */}
                <p className="text-navy-950/90 text-[11px] leading-relaxed whitespace-pre-wrap font-sans">
                  {post.content}
                </p>

                {/* Multiple Images Facebook Layout */}
                {post.images && post.images.length > 0 && (
                  <div className={`grid gap-1.5 rounded-xl overflow-hidden border border-navy-950/5 mt-2 ${
                    post.images.length === 1 
                      ? 'grid-cols-1' 
                      : post.images.length === 2 
                        ? 'grid-cols-2' 
                        : 'grid-cols-3'
                  }`}>
                    {post.images.map((img, idx) => (
                      <div 
                        key={idx} 
                        onClick={() => openLightbox(post.images, idx)}
                        className={`relative cursor-pointer overflow-hidden aspect-square hover:opacity-95 transition-opacity bg-navy-900 ${
                          post.images.length === 3 && idx === 0 ? 'col-span-3 aspect-[2/1]' : ''
                        }`}
                      >
                        <img src={img} alt="Post media" className="w-full h-full object-cover" />
                        <div className="absolute inset-0 bg-navy-950/0 hover:bg-navy-950/10 transition-colors flex items-center justify-center group">
                          <Maximize2 className="w-6 h-6 text-white opacity-0 group-hover:opacity-100 transition-opacity drop-shadow-md" />
                        </div>
                      </div>
                    ))}
                  </div>
                )}

                {/* Engagement counts */}
                <div className="flex items-center justify-between text-[9px] text-navy-400 font-mono border-b border-navy-950/5 pb-2 pt-1">
                  <span className="flex items-center gap-1">
                    <Heart className={`w-3 h-3 ${post.likes_count > 0 ? 'text-rose-500 fill-rose-500' : 'text-navy-300'}`} />
                    {post.likes_count} {post.likes_count === 1 ? 'Like' : 'Likes'}
                  </span>
                  <span>{postComments.length} {postComments.length === 1 ? 'Comment' : 'Comments'}</span>
                </div>

                {/* Action Buttons */}
                <div className="flex items-center justify-between border-b border-navy-950/5 pb-1">
                  <button
                    onClick={() => onLikePost(post.id)}
                    className={`flex-1 py-1.5 flex items-center justify-center gap-1.5 hover:bg-navy-50/50 rounded-lg transition-colors cursor-pointer text-[10px] font-bold uppercase tracking-wider ${
                      hasLiked ? 'text-rose-600' : 'text-navy-500'
                    }`}
                  >
                    <Heart className={`w-4 h-4 ${hasLiked ? 'fill-rose-600 text-rose-600 animate-pulse' : ''}`} />
                    Like
                  </button>
                  <button
                    onClick={() => {
                      // Autofocus comment input
                      const el = document.getElementById(`comment_input_${post.id}`);
                      el?.focus();
                    }}
                    className="flex-1 py-1.5 flex items-center justify-center gap-1.5 hover:bg-navy-50/50 rounded-lg text-navy-500 transition-colors cursor-pointer text-[10px] font-bold uppercase tracking-wider"
                  >
                    <MessageSquare className="w-4 h-4" />
                    Comment
                  </button>
                  <button
                    onClick={() => handleSharePost(post)}
                    className="flex-1 py-1.5 flex items-center justify-center gap-1.5 hover:bg-navy-50/50 rounded-lg text-navy-500 transition-colors cursor-pointer text-[10px] font-bold uppercase tracking-wider"
                  >
                    <Share2 className="w-4 h-4" />
                    Share
                  </button>
                </div>

                {/* Comments List */}
                {postComments.length > 0 && (
                  <div className="space-y-2.5 pt-2 max-h-[220px] overflow-y-auto">
                    {postComments.map(c => (
                      <div key={c.id} className="flex gap-2 text-[10.5px]">
                        <img 
                          src={c.member_avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80'} 
                          alt="" 
                          className="w-7 h-7 rounded-full object-cover shrink-0 border border-navy-950/5 mt-0.5"
                          referrerPolicy="no-referrer"
                        />
                        <div className="bg-[#fbf9f4] p-2.5 rounded-2xl flex-1 max-w-[85%] border border-navy-950/5">
                          <div className="flex items-center justify-between gap-2">
                            <span className="font-bold text-navy-950 uppercase text-[9px]">{c.member_name || 'Anonymous'}</span>
                            <span className="text-[8px] text-navy-400 font-mono">{getRelativeTime(c.created_at)}</span>
                          </div>
                          <p className="text-navy-950/80 leading-relaxed font-sans mt-0.5 whitespace-pre-wrap">{c.comment}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                )}

                {/* Add Comment Input Form */}
                <form 
                  onSubmit={(e) => handleCommentSubmit(e, post.id)} 
                  className="flex gap-2 items-center pt-1.5"
                >
                  <img src={currentUser.avatar_url} alt="" className="w-7 h-7 rounded-full object-cover shrink-0" />
                  <input
                    id={`comment_input_${post.id}`}
                    type="text"
                    placeholder="Write a private comment..."
                    value={commentInputs[post.id] || ''}
                    onChange={(e) => setCommentInputs(prev => ({ ...prev, [post.id]: e.target.value }))}
                    className="flex-1 px-3 py-2 bg-[#f3f4f6] focus:bg-white rounded-full border-0 focus:ring-1 focus:ring-gold-500 focus:outline-none text-navy-950 text-xs placeholder-navy-400 font-sans"
                  />
                  <button
                    type="submit"
                    disabled={!commentInputs[post.id]?.trim()}
                    className="p-2 bg-navy-950 text-gold-500 rounded-full hover:bg-navy-900 transition-colors disabled:opacity-30 cursor-pointer"
                  >
                    <Send className="w-3.5 h-3.5" />
                  </button>
                </form>

              </div>
            );
          })
        ) : (
          <div className="bg-white rounded-2xl p-8 border border-navy-950/5 text-center text-navy-400">
            <Image className="w-12 h-12 text-navy-200 mx-auto mb-2" />
            <p className="font-bold uppercase tracking-wider text-xs text-navy-950">No community posts yet</p>
            <p className="text-[10px] mt-1 text-navy-400 max-w-xs mx-auto">Be the first to connect with your brothers and sisters by writing a post above.</p>
          </div>
        )}
      </div>

      {/* 3. Lighbox Media Viewer Modal */}
      {lightboxImages && (
        <div className="fixed inset-0 bg-navy-950/95 z-50 flex items-center justify-center p-4 select-none animate-fade-in">
          {/* Top controllers */}
          <div className="absolute top-4 left-4 right-4 flex items-center justify-between text-white z-10">
            <span className="text-[10px] font-mono tracking-widest uppercase">
              Photo {lightboxIndex + 1} of {lightboxImages.length}
            </span>
            <button
              onClick={() => setLightboxImages(null)}
              className="p-1.5 hover:bg-white/10 rounded-full transition-colors text-white cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Left Arrow */}
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
