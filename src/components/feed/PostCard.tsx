import React from 'react';
import { Heart, Maximize2 } from 'lucide-react';
import { Post, Comment, Member } from '../../types';
import { ReactionBar } from './ReactionBar';
import { CommentSection } from './CommentSection';

export interface PostCardProps {
  post: Post;
  currentUser: Member;
  comments: Comment[];
  onLikePost: (postId: string) => void;
  onAddComment: (postId: string, content: string) => void;
  onSharePost: (post: Post) => void;
  openLightbox: (images: string[], index: number) => void;
  getRelativeTime: (isoString: string) => string;
}

export const PostCard: React.FC<PostCardProps> = ({
  post,
  currentUser,
  comments,
  onLikePost,
  onAddComment,
  onSharePost,
  openLightbox,
  getRelativeTime
}) => {
  const hasLiked = (post.liked_by || []).includes(currentUser.id);
  const postComments = comments.filter(c => c.post_id === post.id);

  const handleCommentShortcutClick = () => {
    const input = document.getElementById(`comment_input_${post.id}`);
    if (input) {
      input.focus();
    }
  };

  const authorAvatar = post.member_avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80';

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-navy-950/5 p-4.5 space-y-3.5">
      {/* Post Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <img 
            src={authorAvatar} 
            alt={post.member_name} 
            className="w-10 h-10 rounded-full object-cover border border-[#c5a059]/20"
            referrerPolicy="no-referrer"
          />
          <div className="text-left">
            <div className="flex items-center gap-1.5">
              <h4 className="font-bold text-navy-950 text-xs uppercase tracking-wide">
                {post.member_name || 'Fraternity Member'}
              </h4>
            </div>
            <p className="text-[9px] text-navy-400 font-medium tracking-wide">
              {post.member_chapter || 'Active Chapter'} &bull; {getRelativeTime(post.created_at)}
            </p>
          </div>
        </div>
      </div>

      {/* Post Content */}
      <p className="text-navy-950/90 text-[11px] leading-relaxed text-left whitespace-pre-wrap font-sans">
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
              onClick={() => openLightbox(post.images!, idx)}
              className={`relative cursor-pointer overflow-hidden aspect-square hover:opacity-95 transition-opacity bg-navy-900 ${
                post.images!.length === 3 && idx === 0 ? 'col-span-3 aspect-[2/1]' : ''
              }`}
            >
              <img src={img} alt="Post media" className="w-full h-full object-cover" />
              <div className="absolute inset-0 bg-navy-950/0 hover:bg-navy-950/10 transition-colors flex items-center justify-center group">
                <Maximize2 className="w-5 h-5 text-white opacity-0 group-hover:opacity-100 transition-opacity drop-shadow-md" />
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Engagement counts */}
      <div className="flex items-center justify-between text-[9px] text-navy-400 font-mono border-b border-navy-950/5 pb-2 pt-1">
        <span className="flex items-center gap-1">
          <Heart className={`w-3 h-3 ${post.likes_count && post.likes_count > 0 ? 'text-rose-500 fill-rose-500' : 'text-navy-300'}`} />
          {post.likes_count || 0} {(post.likes_count || 0) === 1 ? 'Like' : 'Likes'}
        </span>
        <span>{postComments.length} {postComments.length === 1 ? 'Comment' : 'Comments'}</span>
      </div>

      {/* Action Buttons / Reaction Bar */}
      <ReactionBar
        post={post}
        hasLiked={hasLiked}
        onLikeClick={() => onLikePost(post.id)}
        onCommentClick={handleCommentShortcutClick}
        onShareClick={() => onSharePost(post)}
      />

      {/* Comment Section */}
      <CommentSection
        postId={post.id}
        comments={postComments}
        currentUser={currentUser}
        onAddComment={onAddComment}
        getRelativeTime={getRelativeTime}
      />
    </div>
  );
}
