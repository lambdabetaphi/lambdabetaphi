import React, { useState, useRef } from 'react';
import { Image, Camera, X } from 'lucide-react';
import { Member } from '../../types';

export interface PostComposerProps {
  currentUser: Member;
  onAddPost: (content: string, images: string[]) => void;
}

export function PostComposer({ currentUser, onAddPost }: PostComposerProps) {
  const [newPostText, setNewPostText] = useState('');
  const [newPostImages, setNewPostImages] = useState<string[]>([]);
  const [dragActive, setDragActive] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

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
      const filesArray = (Array.from(e.dataTransfer.files) as File[]).filter((f: File) => f.type.startsWith('image/'));
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

  const avatarUrl = currentUser.avatarUrl || currentUser.avatar_url || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80';
  const firstName = (currentUser.full_name || '').split(' ')[0] || 'Frater';

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-navy-950/5 p-4.5 mb-4">
      <form onSubmit={handleCreatePostSubmit} className="space-y-4">
        {/* Avatar + Textarea */}
        <div className="flex gap-3">
          <img 
            src={avatarUrl} 
            alt={currentUser.full_name} 
            className="w-10 h-10 rounded-full object-cover border border-navy-950/10 shadow-sm shrink-0"
            referrerPolicy="no-referrer"
          />
          <div className="flex-1">
            <textarea
              id="composer_textarea"
              value={newPostText}
              onChange={(e) => setNewPostText(e.target.value)}
              placeholder={`What's on your mind, ${firstName}?`}
              rows={2}
              className="w-full resize-none border-0 focus:ring-0 text-navy-950 text-xs placeholder-navy-400 p-1.5 focus:outline-none min-h-[55px] font-sans"
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
              : 'border-navy-950/10 hover:border-gold-500/40 bg-[#fbf9f4]/40 hover:bg-[#fbf9f4]'
          }`}
        >
          <input
            id="file_input"
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

        {/* Footer actions */}
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
  );
}
