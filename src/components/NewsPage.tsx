import React, { useState } from 'react';
import { 
  Calendar, 
  ChevronLeft, 
  Sparkles,
  Newspaper,
  Volume2,
  VolumeX,
  User,
  Shield
} from 'lucide-react';
import { Announcement, Member } from '../types';

interface NewsPageProps {
  announcements: Announcement[];
  currentUser: Member | null;
  members: Member[];
}

export default function NewsPage({ announcements, currentUser, members }: NewsPageProps) {
  const [expandedId, setExpandedId] = useState<string | null>(null);

  const expandedItem = announcements.find(item => item.id === expandedId);

  const getAuthorName = (created_by: string) => {
    const matched = members.find(m => m.id === created_by);
    return matched?.full_name || 'Chapter Administrator';
  };

  const getAuthorRole = (created_by: string) => {
    const matched = members.find(m => m.id === created_by);
    return matched?.position || matched?.role || 'Officer';
  };

  const getAuthorAvatar = (created_by: string) => {
    const matched = members.find(m => m.id === created_by);
    return matched?.avatar_url || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=100&q=80';
  };

  return (
    <div className="py-12 bg-navy-50 animate-fade-in min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 font-sans">
        
        {/* Detail Mode */}
        {expandedItem ? (
          <div className="bg-white rounded-2xl border border-navy-950/5 shadow-sm max-w-3xl mx-auto overflow-hidden animate-scale-up">
            
            {/* Back button header */}
            <div className="p-5 border-b border-navy-950/5 bg-[#fbf9f4] flex items-center justify-between">
              <button 
                onClick={() => setExpandedId(null)}
                className="flex items-center gap-2 text-navy-950 hover:text-[#c5a059] font-bold text-[10px] uppercase tracking-widest cursor-pointer"
              >
                <ChevronLeft className="w-4 h-4" />
                Back to Announcements
              </button>
              {expandedItem.is_pinned && (
                <span className="text-[8px] bg-amber-100 text-amber-800 font-bold px-2.5 py-1 rounded-md uppercase tracking-wider font-mono">
                  Pinned Directive
                </span>
              )}
            </div>

            {/* Content Body */}
            <div className="p-8 space-y-6">
              <div className="space-y-3">
                <h1 className="text-2xl md:text-3xl font-serif font-black text-navy-950 uppercase tracking-tight">
                  {expandedItem.title}
                </h1>
                
                <div className="flex items-center gap-3 pt-2">
                  <img 
                    src={getAuthorAvatar(expandedItem.created_by)} 
                    alt="" 
                    className="w-10 h-10 rounded-full object-cover border border-[#c5a059]/30"
                    referrerPolicy="no-referrer"
                  />
                  <div>
                    <p className="text-xs font-bold text-navy-950">{getAuthorName(expandedItem.created_by)}</p>
                    <p className="text-[10px] text-[#c5a059] font-mono uppercase tracking-wider font-bold">
                      {getAuthorRole(expandedItem.created_by)} &bull; {new Date(expandedItem.created_at).toLocaleDateString()}
                    </p>
                  </div>
                </div>
              </div>

              <p className="text-navy-950/80 text-sm leading-relaxed whitespace-pre-wrap font-sans font-light">
                {expandedItem.content}
              </p>
            </div>
          </div>
        ) : (
          /* List Mode */
          <>
            {/* HEADER */}
            <div className="mb-12">
              <span className="text-[10px] font-bold tracking-widest text-[#c5a059] uppercase block mb-2 font-mono">Official Dispatches</span>
              <h1 className="text-3xl md:text-4xl font-serif font-black text-navy-950 uppercase tracking-tight">
                Directives & Bulletins
              </h1>
              <p className="text-xs text-navy-950/60 mt-1">Official fraternity communications, event briefs, chapter milestones, and general council notices.</p>
            </div>

            {/* List Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {announcements.length === 0 ? (
                <div className="col-span-full text-center py-20 bg-white rounded-2xl border border-navy-950/5 p-8">
                  <Newspaper className="w-12 h-12 text-navy-200 mx-auto mb-4 animate-pulse" />
                  <p className="text-navy-950 font-serif font-black uppercase tracking-wider text-sm">No Bulletins Issued</p>
                  <p className="text-navy-500 text-xs mt-1">Check back later for official announcements and directives from the chapter officers.</p>
                </div>
              ) : (
                [...announcements]
                  .sort((a, b) => {
                    if (a.is_pinned && !b.is_pinned) return -1;
                    if (!a.is_pinned && b.is_pinned) return 1;
                    return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
                  })
                  .map((ann) => (
                    <div 
                      key={ann.id}
                      onClick={() => setExpandedId(ann.id)}
                      className={`bg-white rounded-2xl p-6 border transition-all duration-300 flex flex-col justify-between hover:border-[#c5a059]/40 hover:shadow-md cursor-pointer ${
                        ann.is_pinned 
                          ? 'border-amber-200 bg-amber-50/20' 
                          : 'border-navy-950/5'
                      }`}
                    >
                      <div className="space-y-4">
                        <div className="flex items-center justify-between gap-2">
                          <span className={`text-[8px] font-bold px-2 py-0.5 rounded uppercase tracking-wider font-mono ${
                            ann.is_pinned 
                              ? 'bg-amber-100 text-amber-800' 
                              : 'bg-navy-150 text-navy-800'
                          }`}>
                            {ann.is_pinned ? 'Pinned' : 'Dispatch'}
                          </span>
                          <span className="text-[9px] text-navy-400 font-mono">
                            {new Date(ann.created_at).toLocaleDateString()}
                          </span>
                        </div>

                        <div className="space-y-2">
                          <h3 className="font-serif font-black text-navy-950 text-base leading-snug uppercase tracking-wide line-clamp-2">
                            {ann.title}
                          </h3>
                          <p className="text-navy-500 text-xs font-light line-clamp-3 leading-relaxed">
                            {ann.content}
                          </p>
                        </div>
                      </div>

                      <div className="flex items-center gap-2 pt-4 mt-4 border-t border-navy-950/5">
                        <img 
                          src={getAuthorAvatar(ann.created_by)} 
                          alt="" 
                          className="w-6 h-6 rounded-full object-cover border border-[#c5a059]/20"
                          referrerPolicy="no-referrer"
                        />
                        <div className="min-w-0">
                          <p className="text-[10px] font-bold text-navy-950 truncate leading-none">
                            {getAuthorName(ann.created_by)}
                          </p>
                          <p className="text-[8px] text-navy-400 uppercase tracking-widest font-semibold font-mono leading-none mt-1">
                            {getAuthorRole(ann.created_by)}
                          </p>
                        </div>
                      </div>
                    </div>
                  ))
              )}
            </div>
          </>
        )}

      </div>
    </div>
  );
}
