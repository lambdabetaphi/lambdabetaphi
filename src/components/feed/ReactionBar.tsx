import React from 'react';
import { Heart, MessageSquare, Share2 } from 'lucide-react';
import { Post } from '../../types';

export interface ReactionBarProps {
  post: Post;
  hasLiked: boolean;
  onLikeClick: () => void;
  onCommentClick: () => void;
  onShareClick: () => void;
}

export function ReactionBar({
  post,
  hasLiked,
  onLikeClick,
  onCommentClick,
  onShareClick
}: ReactionBarProps) {
  return (
    <div className="flex items-center justify-between border-t border-b border-navy-950/5 py-1">
      <button
        id={`like_btn_${post.id}`}
        onClick={onLikeClick}
        className={`flex-1 py-1.5 flex items-center justify-center gap-1.5 hover:bg-navy-50/50 rounded-lg transition-colors cursor-pointer text-[10px] font-bold uppercase tracking-wider ${
          hasLiked ? 'text-rose-600 font-extrabold' : 'text-navy-500'
        }`}
      >
        <Heart className={`w-4 h-4 transition-transform active:scale-125 ${hasLiked ? 'fill-rose-600 text-rose-600 animate-pulse' : ''}`} />
        Like
      </button>
      <button
        id={`comment_focus_btn_${post.id}`}
        onClick={onCommentClick}
        className="flex-1 py-1.5 flex items-center justify-center gap-1.5 hover:bg-navy-50/50 rounded-lg text-navy-500 transition-colors cursor-pointer text-[10px] font-bold uppercase tracking-wider"
      >
        <MessageSquare className="w-4 h-4" />
        Comment
      </button>
      <button
        id={`share_btn_${post.id}`}
        onClick={onShareClick}
        className="flex-1 py-1.5 flex items-center justify-center gap-1.5 hover:bg-navy-50/50 rounded-lg text-navy-500 transition-colors cursor-pointer text-[10px] font-bold uppercase tracking-wider"
      >
        <Share2 className="w-4 h-4" />
        Share
      </button>
    </div>
  );
}
