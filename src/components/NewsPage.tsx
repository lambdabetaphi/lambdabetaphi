import React, { useState } from 'react';
import { 
  Heart, 
  MessageSquare, 
  PlusCircle, 
  Tag, 
  User, 
  Calendar, 
  ChevronLeft, 
  Send,
  Sparkles,
  Newspaper
} from 'lucide-react';
import { NewsItem, Member } from '../types';

interface NewsPageProps {
  news: NewsItem[];
  currentUser: Member | null;
  onLikeNews: (id: string) => void;
  onAddComment: (newsId: string, commentContent: string) => void;
  onPublishNews: (newItem: Omit<NewsItem, 'id' | 'likes' | 'likedBy' | 'comments'>) => void;
}

export default function NewsPage({ news, currentUser, onLikeNews, onAddComment, onPublishNews }: NewsPageProps) {
  const [activeCategory, setActiveCategory] = useState<string>('all');
  const [expandedNewsId, setExpandedNewsId] = useState<string | null>(null);
  const [commentInput, setCommentInput] = useState<string>('');
  const [isPublishing, setIsPublishing] = useState(false);
  
  // Publication Form States
  const [newTitle, setNewTitle] = useState('');
  const [newBrief, setNewBrief] = useState('');
  const [newContent, setNewContent] = useState('');
  const [newCategory, setNewCategory] = useState<'Announcement' | 'Philanthropy' | 'Academic' | 'Alumni' | 'Milestone'>('Announcement');
  const [newImage, setNewImage] = useState('');

  const categories = ['all', 'Announcement', 'Philanthropy', 'Academic', 'Alumni', 'Milestone'];

  const filteredNews = activeCategory === 'all' 
    ? news 
    : news.filter(item => item.category === activeCategory);

  const expandedItem = news.find(item => item.id === expandedNewsId);

  const handleCommentSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!commentInput.trim() || !expandedNewsId) return;
    onAddComment(expandedNewsId, commentInput);
    setCommentInput('');
  };

  const handlePublishSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim() || !newBrief.trim() || !newContent.trim()) return;

    const defaultImage = newImage.trim() || 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?auto=format&fit=crop&w=800&q=80';

    onPublishNews({
      title: newTitle,
      brief: newBrief,
      content: newContent,
      author: currentUser?.name || 'Anonymous Member',
      authorRole: currentUser?.role || 'Active Member',
      date: new Date().toISOString().split('T')[0],
      category: newCategory,
      image: defaultImage
    });

    // Reset Form
    setNewTitle('');
    setNewBrief('');
    setNewContent('');
    setNewCategory('Announcement');
    setNewImage('');
    setIsPublishing(false);
  };

  return (
    <div className="py-12 bg-navy-50 animate-fade-in min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* News Detail Mode */}
        {expandedItem ? (
          <div className="bg-white rounded-none border border-navy-950/10 shadow-none max-w-4xl mx-auto animate-scale-up">
            
            {/* Back button header */}
            <div className="p-4 md:p-6 border-b border-navy-950/10 bg-[#fbf9f4] flex items-center justify-between">
              <button 
                onClick={() => setExpandedNewsId(null)}
                className="flex items-center gap-2 text-navy-950 hover:text-gold-500 font-bold text-xs uppercase tracking-widest cursor-pointer"
              >
                <ChevronLeft className="w-4 h-4" />
                Back to Newsfeed
              </button>
              <span className="text-[10px] bg-navy-950 text-gold-500 font-bold px-3 py-1 rounded-none uppercase tracking-widest border border-gold-500/20">
                {expandedItem.category}
              </span>
            </div>

            {/* Main cover banner */}
            <div className="h-64 md:h-80 w-full relative">
              <img 
                src={expandedItem.image} 
                alt={expandedItem.title} 
                className="w-full h-full object-cover"
                referrerPolicy="no-referrer"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-navy-950/70 via-navy-950/10 to-transparent"></div>
              <div className="absolute bottom-0 left-0 p-6 md:p-10 text-white">
                <h1 className="text-xl md:text-3xl font-serif font-black tracking-wide leading-tight uppercase">
                  {expandedItem.title}
                </h1>
              </div>
            </div>

            {/* Article Contents */}
            <div className="p-6 md:p-10 grid grid-cols-1 md:grid-cols-12 gap-8 md:gap-12">
              
              {/* Left Main column */}
              <div className="md:col-span-8 space-y-6">
                
                {/* Author Info and Meta */}
                <div className="flex items-center gap-3 p-4 bg-[#fbf9f4] border border-navy-950/10 rounded-none">
                  <div className="w-10 h-10 rounded-none bg-navy-950 text-gold-500 flex items-center justify-center font-serif font-bold text-lg">
                    {expandedItem.author.charAt(0)}
                  </div>
                  <div>
                    <p className="text-xs font-bold text-navy-950 uppercase tracking-wider">{expandedItem.author}</p>
                    <p className="text-[10px] text-navy-400 font-bold uppercase tracking-widest mt-0.5">{expandedItem.authorRole} &bull; {expandedItem.date}</p>
                  </div>
                </div>

                {/* Main Paragraph Texts */}
                <div className="text-navy-950/80 text-xs md:text-sm leading-relaxed space-y-4 font-sans font-light whitespace-pre-line">
                  {expandedItem.content}
                </div>

                {/* Likes panel */}
                <div className="pt-6 border-t border-navy-950/10 flex items-center justify-between">
                  <button 
                    onClick={() => onLikeNews(expandedItem.id)}
                    className={`flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest py-2 px-4 rounded-none border transition-all cursor-pointer ${
                      currentUser && expandedItem.likedBy.includes(currentUser.email)
                        ? 'bg-gold-500/10 text-gold-700 border-gold-500/40'
                        : 'bg-white text-navy-950 border-navy-950/15 hover:bg-navy-950/5'
                    }`}
                  >
                    <Heart className={`w-3.5 h-3.5 ${currentUser && expandedItem.likedBy.includes(currentUser.email) ? 'fill-current text-red-500' : ''}`} />
                    {expandedItem.likes} {expandedItem.likes === 1 ? 'Like' : 'Likes'}
                  </button>
                  <span className="text-[9px] text-navy-400 uppercase tracking-widest font-mono">
                    Official Chapter Communication
                  </span>
                </div>
              </div>

              {/* Right Comments column */}
              <div className="md:col-span-4 space-y-6">
                <h3 className="font-serif font-bold text-navy-950 text-sm uppercase tracking-wider border-b border-navy-950/10 pb-3 flex items-center gap-2">
                  <MessageSquare className="w-4 h-4 text-gold-500" />
                  Comments ({expandedItem.comments.length})
                </h3>

                {/* Comment lists */}
                <div className="space-y-4 max-h-80 overflow-y-auto pr-2">
                  {expandedItem.comments.length === 0 ? (
                    <p className="text-[10px] text-navy-400 uppercase tracking-widest italic text-center py-6">
                      No comments posted yet.
                    </p>
                  ) : (
                    expandedItem.comments.map((comment) => (
                      <div key={comment.id} className="p-3.5 bg-[#fbf9f4] border border-navy-950/10 rounded-none text-xs">
                        <div className="flex justify-between mb-1.5 font-bold text-navy-950 text-[10px] uppercase tracking-wider">
                          <span>{comment.authorName}</span>
                          <span className="text-navy-400">{comment.date}</span>
                        </div>
                        <p className="text-navy-950/80 leading-normal font-sans font-light text-[11px]">{comment.content}</p>
                      </div>
                    ))
                  )}
                </div>

                {/* Add comment Form */}
                {currentUser ? (
                  <form onSubmit={handleCommentSubmit} className="space-y-3 pt-4 border-t border-navy-950/10">
                    <textarea
                      placeholder="Write a supportive comment..."
                      rows={3}
                      value={commentInput}
                      onChange={(e) => setCommentInput(e.target.value)}
                      className="w-full text-xs p-3 rounded-none border border-navy-950/15 focus:ring-1 focus:ring-gold-500 focus:outline-none bg-white text-navy-950 font-sans text-[11px]"
                      required
                    />
                    <button 
                      type="submit"
                      className="w-full bg-navy-950 text-gold-500 font-bold text-[10px] py-2.5 px-4 rounded-none flex items-center justify-center gap-1.5 hover:bg-navy-800 transition-colors uppercase tracking-widest cursor-pointer"
                    >
                      <Send className="w-3.5 h-3.5" />
                      Post Comment
                    </button>
                  </form>
                ) : (
                  <div className="bg-gold-500/5 p-4 rounded-none border border-gold-500/20 text-center text-xs text-navy-950 space-y-2">
                    <p className="font-bold text-[10px] uppercase tracking-wider">Please login to reply.</p>
                  </div>
                )}
              </div>

            </div>
          </div>
        ) : (
          /* Normal News Listing mode */
          <div>
            
            {/* Header / publishing button */}
            <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6 mb-12">
              <div>
                <span className="text-[10px] font-bold tracking-widest text-[#c5a059] uppercase block mb-2">Announcements Hub</span>
                <h1 className="text-3xl md:text-4xl font-serif font-black text-navy-950 uppercase tracking-tight">
                  Chapter News & Media
                </h1>
                <p className="text-xs text-navy-950/60 mt-1 font-sans">Official releases, philanthropic milestones, academic spotlights, and internal notes.</p>
              </div>

              {currentUser && (
                <button
                  onClick={() => setIsPublishing(!isPublishing)}
                  className={`flex items-center gap-2 text-[10px] font-bold py-3.5 px-6 rounded-none shadow-none uppercase tracking-widest transition-all cursor-pointer ${
                    isPublishing 
                      ? 'bg-red-50 text-red-600 border border-red-200 hover:bg-red-100' 
                      : 'bg-navy-950 text-gold-500 border border-navy-950 hover:bg-navy-800'
                  }`}
                >
                  <PlusCircle className="w-4 h-4" />
                  {isPublishing ? 'Cancel Draft' : 'Publish Announcement'}
                </button>
              )}
            </div>

            {/* PUBLISHING FORM DRAWER */}
            {isPublishing && currentUser && (
              <div className="bg-white p-6 md:p-8 rounded-none border-2 border-gold-500 shadow-none mb-12 animate-slide-up max-w-3xl mx-auto">
                <div className="flex items-center gap-2 text-gold-600 mb-6 pb-2 border-b border-navy-950/10">
                  <Sparkles className="w-5 h-5 text-gold-500" />
                  <h3 className="font-serif font-black text-base text-navy-950 uppercase tracking-wider">Publish Chapter Announcement</h3>
                </div>

                <form onSubmit={handlePublishSubmit} className="space-y-5 text-xs md:text-sm">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                    <div>
                      <label className="block text-[10px] font-bold text-navy-950 uppercase mb-1.5">Article Title</label>
                      <input
                        type="text"
                        placeholder="e.g., Spring 2026 Honor Roll Highlights"
                        value={newTitle}
                        onChange={(e) => setNewTitle(e.target.value)}
                        className="w-full p-3 rounded-none border border-navy-950/15 focus:outline-none focus:ring-1 focus:ring-gold-500 bg-white text-navy-950 font-sans"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-[10px] font-bold text-navy-950 uppercase mb-1.5">Category</label>
                      <select
                        value={newCategory}
                        onChange={(e) => setNewCategory(e.target.value as any)}
                        className="w-full p-3 rounded-none border border-navy-950/15 focus:outline-none focus:ring-1 focus:ring-gold-500 bg-white text-navy-950 font-sans text-xs"
                      >
                        <option value="Announcement">Announcement</option>
                        <option value="Philanthropy">Philanthropy</option>
                        <option value="Academic">Academic</option>
                        <option value="Alumni">Alumni</option>
                        <option value="Milestone">Milestone</option>
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="block text-[10px] font-bold text-navy-950 uppercase mb-1.5">Brief Summary</label>
                    <input
                      type="text"
                      placeholder="Provide a one-sentence teaser for the card feed..."
                      value={newBrief}
                      onChange={(e) => setNewBrief(e.target.value)}
                      className="w-full p-3 rounded-none border border-navy-950/15 focus:outline-none focus:ring-1 focus:ring-gold-500 bg-white text-navy-950 font-sans"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-[10px] font-bold text-navy-950 uppercase mb-1.5">Full Article Content</label>
                    <textarea
                      placeholder="Write your paragraphs here. Registered members will see this expanded."
                      rows={6}
                      value={newContent}
                      onChange={(e) => setNewContent(e.target.value)}
                      className="w-full p-3 rounded-none border border-navy-950/15 focus:outline-none focus:ring-1 focus:ring-gold-500 bg-white text-navy-950 font-sans text-xs"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-[10px] font-bold text-navy-950 uppercase mb-1.5">Cover Image URL (Optional)</label>
                    <input
                      type="url"
                      placeholder="https://images.unsplash.com/... or leave blank for default griffin cover"
                      value={newImage}
                      onChange={(e) => setNewImage(e.target.value)}
                      className="w-full p-3 rounded-none border border-navy-950/15 focus:outline-none focus:ring-1 focus:ring-gold-500 bg-white text-navy-950 font-sans"
                    />
                  </div>

                  <div className="flex items-center gap-3 justify-end pt-3">
                    <button
                      type="button"
                      onClick={() => setIsPublishing(false)}
                      className="px-5 py-2.5 rounded-none border border-navy-950/15 text-navy-700 hover:bg-navy-50 font-bold text-[10px] uppercase tracking-widest"
                    >
                      Dismiss Draft
                    </button>
                    <button
                      type="submit"
                      className="px-6 py-2.5 rounded-none bg-[#c5a059] text-white hover:bg-gold-600 font-bold text-[10px] uppercase tracking-widest"
                    >
                      Publish to Feed
                    </button>
                  </div>
                </form>
              </div>
            )}

            {/* CATEGORY BAR */}
            <div className="flex overflow-x-auto gap-2 pb-6 mb-8 border-b border-navy-950/10 scrollbar-none">
              {categories.map((cat) => (
                <button
                  key={cat}
                  onClick={() => setActiveCategory(cat)}
                  className={`px-4 py-2 rounded-none text-[10px] font-bold tracking-widest uppercase shrink-0 transition-all cursor-pointer ${
                    activeCategory === cat
                      ? 'bg-navy-950 text-gold-500 shadow-none border border-navy-950'
                      : 'bg-white text-navy-950 border border-navy-950/10 hover:border-gold-500'
                  }`}
                >
                  {cat === 'all' ? 'All Updates' : cat}
                </button>
              ))}
            </div>

            {/* NEWS GRID LIST */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {filteredNews.length === 0 ? (
                <div className="col-span-1 md:col-span-3 text-center py-20 bg-white rounded-none border border-navy-950/10">
                  <Newspaper className="w-10 h-10 text-navy-300 mx-auto mb-4" />
                  <p className="text-navy-950 font-bold uppercase tracking-widest text-xs">No updates in this category yet.</p>
                </div>
              ) : (
                filteredNews.map((item) => (
                  <div
                    key={item.id}
                    className="bg-white rounded-none overflow-hidden border border-navy-950/10 shadow-none hover:border-gold-500 transition-all duration-300 flex flex-col justify-between"
                  >
                    <div>
                      {/* Image header with tag badge */}
                      <div className="h-44 w-full relative overflow-hidden">
                        <img 
                          src={item.image} 
                          alt={item.title} 
                          className="w-full h-full object-cover transition-transform duration-500 hover:scale-105"
                          referrerPolicy="no-referrer"
                        />
                        <span className="absolute top-4 left-4 bg-navy-950 text-gold-500 text-[9px] font-black uppercase tracking-widest px-3 py-1 border border-gold-500/20">
                          {item.category}
                        </span>
                      </div>

                      {/* Content panel */}
                      <div className="p-6 space-y-3">
                        <div className="flex items-center gap-1.5 text-navy-400 text-[9px] font-bold uppercase tracking-widest">
                          <Calendar className="w-3 h-3 text-gold-600" />
                          <span>{item.date}</span>
                          <span>&bull;</span>
                          <User className="w-3 h-3 text-gold-600" />
                          <span className="truncate max-w-[80px]">{item.author.split(' ')[0]}</span>
                        </div>
                        
                        <h3 className="font-serif font-bold text-navy-950 text-sm md:text-base line-clamp-2 leading-tight uppercase tracking-wide">
                          {item.title}
                        </h3>
                        
                        <p className="text-navy-950/70 text-xs leading-relaxed font-sans line-clamp-3 font-light">
                          {item.brief}
                        </p>
                      </div>
                    </div>

                    {/* Footer metrics and button */}
                    <div className="p-6 pt-0 border-t border-navy-950/5 flex items-center justify-between">
                      <div className="flex items-center gap-4 text-navy-500 text-xs">
                        <button 
                          onClick={() => onLikeNews(item.id)}
                          className={`flex items-center gap-1 hover:text-red-500 transition-colors ${
                            currentUser && item.likedBy.includes(currentUser.email) ? 'text-red-500' : ''
                          }`}
                        >
                          <Heart className={`w-3.5 h-3.5 ${currentUser && item.likedBy.includes(currentUser.email) ? 'fill-current' : ''}`} />
                          <span className="font-mono text-[10px]">{item.likes}</span>
                        </button>
                        <div className="flex items-center gap-1">
                          <MessageSquare className="w-3.5 h-3.5" />
                          <span className="font-mono text-[10px]">{item.comments.length}</span>
                        </div>
                      </div>

                      <button
                        onClick={() => setExpandedNewsId(item.id)}
                        className="text-[10px] font-bold text-gold-600 uppercase tracking-widest hover:text-gold-700 cursor-pointer"
                      >
                        Read Article &rarr;
                      </button>
                    </div>

                  </div>
                ))
              )}
            </div>

          </div>
        )}

      </div>
    </div>
  );
}
