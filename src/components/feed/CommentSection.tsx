import React, { useState } from 'react';
import { Send } from 'lucide-react';
import { Comment, Member } from '../../types';

export interface CommentSectionProps {
  postId: string;
  comments: Comment[];
  currentUser: Member;
  onAddComment: (postId: string, content: string) => void;
  getRelativeTime: (isoString: string) => string;
}

export function CommentSection({
  postId,
  comments,
  currentUser,
  onAddComment,
  getRelativeTime
}: CommentSectionProps) {
  const [commentText, setCommentText] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!commentText.trim()) return;
    onAddComment(postId, commentText.trim());
    setCommentText('');
  };

  const avatarUrl = currentUser.avatarUrl || currentUser.avatar_url || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80';

  return (
    <div className="space-y-3.5 pt-2">
      {/* Comments list if present */}
      {comments.length > 0 && (
        <div className="space-y-3 max-h-[220px] overflow-y-auto pr-1 scrollbar-thin">
          {comments.map(c => {
            const commentAvatar = c.member_avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80';
            return (
              <div key={c.id} className="flex gap-2 text-[10.5px]">
                <img 
                  src={commentAvatar} 
                  alt="" 
                  className="w-7 h-7 rounded-full object-cover shrink-0 border border-navy-950/5 mt-0.5"
                  referrerPolicy="no-referrer"
                />
                <div className="bg-[#fbf9f4] p-2.5 rounded-2xl flex-1 max-w-[85%] border border-navy-950/5 text-left">
                  <div className="flex items-center justify-between gap-2">
                    <span className="font-bold text-navy-950 uppercase text-[9px]">{c.member_name || 'Anonymous'}</span>
                    <span className="text-[8px] text-navy-400 font-mono">{getRelativeTime(c.created_at)}</span>
                  </div>
                  <p className="text-navy-950/80 leading-relaxed font-sans mt-0.5 whitespace-pre-wrap">{c.comment}</p>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Write Comment Form */}
      <form onSubmit={handleSubmit} className="flex gap-2 items-center pt-1.5">
        <img 
          src={avatarUrl} 
          alt="" 
          className="w-7 h-7 rounded-full object-cover shrink-0 border border-navy-950/10 shadow-sm"
          referrerPolicy="no-referrer"
        />
        <input
          id={`comment_input_${postId}`}
          type="text"
          placeholder="Write a private comment..."
          value={commentText}
          onChange={(e) => setCommentText(e.target.value)}
          className="flex-1 px-3.5 py-2 bg-[#f3f4f6] focus:bg-white rounded-full border-0 focus:ring-1 focus:ring-gold-500 focus:outline-none text-navy-950 text-xs placeholder-navy-400 font-sans shadow-inner"
        />
        <button
          type="submit"
          disabled={!commentText.trim()}
          className="p-2 bg-navy-950 text-gold-500 rounded-full hover:bg-navy-900 transition-colors disabled:opacity-30 cursor-pointer shrink-0 shadow-sm"
        >
          <Send className="w-3.5 h-3.5" />
        </button>
      </form>
    </div>
  );
}
