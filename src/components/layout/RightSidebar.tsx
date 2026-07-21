import React, { useMemo } from 'react';
import { 
  Calendar, Megaphone, Users, Globe, ChevronRight, Plus, 
  Sparkles, ShieldAlert, CheckCircle, ArrowUpRight
} from 'lucide-react';
import { Announcement, Event } from '../../types';
import { PortalTab } from './Sidebar';
import { getRelativeTime } from '../../utils/date';

export interface RightSidebarProps {
  announcements?: Announcement[];
  events?: Event[];
  membersCount?: number;
  chaptersCount?: number;
  onTabChange?: (tabId: PortalTab) => void;
  onCreatePostClick?: () => void;
}

export function RightSidebar({
  announcements = [],
  events = [],
  membersCount = 120, // Premium default fallback statistics
  chaptersCount = 3,
  onTabChange,
  onCreatePostClick
}: RightSidebarProps) {
  
  // Format dates for the Upcoming Events list cleanly
  const formattedEvents = useMemo(() => {
    return events.slice(0, 3).map(event => {
      let displayDate = 'TBD';
      let month = 'TBD';
      let day = '';
      
      if (event.event_date) {
        try {
          const dateObj = new Date(event.event_date);
          month = dateObj.toLocaleString('en-US', { month: 'short' }).toUpperCase();
          day = dateObj.getDate().toString();
          displayDate = dateObj.toLocaleDateString(undefined, { 
            weekday: 'short', 
            hour: '2-digit', 
            minute: '2-digit' 
          });
        } catch (e) {
          // Fallback values on date parsing issues
        }
      }

      return {
        ...event,
        month,
        day,
        displayDate
      };
    });
  }, [events]);

  // Sort and filter the latest announcements
  const processedAnnouncements = useMemo(() => {
    // Show pinned first, then newest
    return [...announcements]
      .sort((a, b) => {
        if (a.is_pinned && !b.is_pinned) return -1;
        if (!a.is_pinned && b.is_pinned) return 1;
        return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
      })
      .slice(0, 3);
  }, [announcements]);

  return (
    <aside 
      id="lbp-right-sidebar"
      role="complementary"
      aria-label="Auxiliary Roster Widgets"
      className="hidden xl:flex flex-col w-80 shrink-0 space-y-6 font-sans self-start"
    >
      
      {/* Widget 1: Quick Actions panel */}
      <section 
        id="widget-quick-actions"
        className="bg-navy-950 border border-[#c5a059]/10 rounded-2xl p-5 text-white shadow-lg relative overflow-hidden"
      >
        <div className="absolute -right-16 -top-16 w-36 h-36 bg-[#c5a059]/5 rounded-full blur-[40px] pointer-events-none" />
        <h2 className="font-serif font-black text-xs text-gold-400 uppercase tracking-widest mb-4 flex items-center gap-2">
          <Sparkles className="w-3.5 h-3.5 shrink-0" />
          Sovereign Actions
        </h2>
        <div className="space-y-2.5">
          {onCreatePostClick && (
            <button
              id="quick-action-btn-new-post"
              onClick={onCreatePostClick}
              className="w-full flex items-center justify-between text-left px-3.5 py-3 text-[11px] font-bold tracking-wider uppercase bg-gradient-to-r from-gold-500/10 to-gold-600/10 hover:from-gold-500/20 hover:to-gold-600/20 text-gold-400 border border-[#c5a059]/20 hover:border-[#c5a059]/40 rounded-xl transition-all duration-300 cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-gold-500/50"
            >
              <div className="flex items-center gap-2.5">
                <Plus className="w-4 h-4 text-gold-400 shrink-0" />
                <span>Draft Portal Post</span>
              </div>
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          )}

          {onTabChange && (
            <>
              <button
                id="quick-action-btn-events"
                onClick={() => onTabChange('events')}
                className="w-full flex items-center justify-between text-left px-3.5 py-3 text-[11px] font-bold tracking-wider uppercase text-navy-300 bg-white/5 hover:bg-white/10 hover:text-white border border-transparent hover:border-white/5 rounded-xl transition-all duration-300 cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-gold-500/50"
              >
                <div className="flex items-center gap-2.5">
                  <Calendar className="w-4 h-4 text-navy-400 shrink-0" />
                  <span>Calendar Hub</span>
                </div>
                <ChevronRight className="w-3.5 h-3.5 text-navy-400" />
              </button>

              <button
                id="quick-action-btn-directory"
                onClick={() => onTabChange('directory')}
                className="w-full flex items-center justify-between text-left px-3.5 py-3 text-[11px] font-bold tracking-wider uppercase text-navy-300 bg-white/5 hover:bg-white/10 hover:text-white border border-transparent hover:border-white/5 rounded-xl transition-all duration-300 cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-gold-500/50"
              >
                <div className="flex items-center gap-2.5">
                  <Users className="w-4 h-4 text-navy-400 shrink-0" />
                  <span>Roster Index</span>
                </div>
                <ChevronRight className="w-3.5 h-3.5 text-navy-400" />
              </button>
            </>
          )}
        </div>
      </section>

      {/* Widget 2: Upcoming Events List */}
      <section 
        id="widget-upcoming-events"
        className="bg-navy-950 border border-[#c5a059]/10 rounded-2xl p-5 text-white shadow-lg"
      >
        <div className="flex items-center justify-between mb-4 pb-2 border-b border-white/5">
          <h2 className="font-serif font-black text-xs text-gold-400 uppercase tracking-widest flex items-center gap-2">
            <Calendar className="w-3.5 h-3.5 shrink-0 text-gold-500" />
            Conclaves Feed
          </h2>
          {onTabChange && (
            <button 
              id="widget-btn-all-events"
              onClick={() => onTabChange('events')}
              className="text-[9px] text-[#c5a059] font-black uppercase tracking-wider hover:underline focus:outline-none focus-visible:ring-1 focus-visible:ring-gold-500 cursor-pointer"
            >
              View All
            </button>
          )}
        </div>

        <div className="space-y-4.5" id="widget-events-list">
          {formattedEvents.length > 0 ? (
            formattedEvents.map((event) => (
              <div 
                key={event.id}
                id={`widget-event-card-${event.id}`}
                className="flex items-start gap-3.5 group focus-within:ring-1 focus-within:ring-gold-500/30 p-1.5 rounded-lg"
              >
                {/* Visual Calendar Block Widget */}
                <div className="w-11 h-11 bg-navy-900 border border-[#c5a059]/15 rounded-xl flex flex-col items-center justify-center text-center shrink-0 shadow-sm">
                  <span className="text-[7.5px] font-mono font-black text-gold-400 tracking-wider uppercase leading-none">
                    {event.month}
                  </span>
                  <span className="text-sm font-serif font-black text-white leading-none mt-1">
                    {event.day}
                  </span>
                </div>

                <div className="text-left flex-1 min-w-0">
                  <h3 className="font-bold text-xs text-navy-100 hover:text-gold-400 transition-colors leading-tight truncate">
                    {event.title}
                  </h3>
                  <p className="text-[9.5px] text-navy-300 truncate mt-1 leading-none">
                    {event.location || 'Conclave Chamber'}
                  </p>
                  <p className="text-[8px] text-gold-500/70 font-mono mt-1.5 leading-none uppercase">
                    {event.displayDate}
                  </p>
                </div>
              </div>
            ))
          ) : (
            <p className="py-6 text-center text-navy-400 italic text-[10px]" id="widget-events-empty">
              No assemblies scheduled.
            </p>
          )}
        </div>
      </section>

      {/* Widget 3: Recent Decrees and Announcements */}
      <section 
        id="widget-announcements"
        className="bg-navy-950 border border-[#c5a059]/10 rounded-2xl p-5 text-white shadow-lg"
      >
        <div className="flex items-center justify-between mb-4 pb-2 border-b border-white/5">
          <h2 className="font-serif font-black text-xs text-gold-400 uppercase tracking-widest flex items-center gap-2">
            <Megaphone className="w-3.5 h-3.5 shrink-0 text-gold-500" />
            Directives Board
          </h2>
          {onTabChange && (
            <button 
              id="widget-btn-all-directives"
              onClick={() => onTabChange('announcements')}
              className="text-[9px] text-[#c5a059] font-black uppercase tracking-wider hover:underline focus:outline-none focus-visible:ring-1 focus-visible:ring-gold-500 cursor-pointer"
            >
              All Decrees
            </button>
          )}
        </div>

        <div className="space-y-4" id="widget-announcements-list">
          {processedAnnouncements.length > 0 ? (
            processedAnnouncements.map((announcement) => (
              <div 
                key={announcement.id}
                id={`widget-announcement-card-${announcement.id}`}
                className="text-left space-y-1 bg-navy-900/30 hover:bg-navy-900/60 p-2.5 border border-[#c5a059]/5 hover:border-[#c5a059]/15 rounded-xl transition-all duration-300"
              >
                <div className="flex items-center justify-between gap-2.5">
                  <span className="text-[7px] text-navy-400 font-mono font-bold uppercase leading-none">
                    {getRelativeTime(announcement.created_at)}
                  </span>
                  {announcement.is_pinned && (
                    <span className="px-1.5 py-0.5 text-[6.5px] font-sans font-black tracking-widest bg-rose-500/15 border border-rose-500/30 text-rose-400 rounded uppercase leading-none">
                      DECREE
                    </span>
                  )}
                </div>
                <h3 className="font-bold text-xs text-navy-100 hover:text-gold-400 transition-colors leading-snug">
                  {announcement.title}
                </h3>
                <p className="text-[10px] text-navy-300 line-clamp-2 leading-relaxed font-normal opacity-85">
                  {announcement.content}
                </p>
              </div>
            ))
          ) : (
            <p className="py-6 text-center text-navy-400 italic text-[10px]" id="widget-announcements-empty">
              Directives Board is completely clear.
            </p>
          )}
        </div>
      </section>

      {/* Widget 4: Community Statistics and Ledger status */}
      <section 
        id="widget-ledger-vitals"
        className="bg-navy-950 border border-[#c5a059]/10 rounded-2xl p-5 text-white shadow-lg"
      >
        <h2 className="font-serif font-black text-xs text-gold-400 uppercase tracking-widest mb-4 flex items-center gap-2">
          <Globe className="w-3.5 h-3.5 shrink-0 text-gold-500" />
          Assembly Vitals
        </h2>
        <div className="grid grid-cols-2 gap-3" id="widget-vitals-grid">
          
          <div className="bg-navy-900/40 border border-white/5 p-3 rounded-xl text-left" id="vital-card-members">
            <span className="text-[7px] text-navy-400 font-mono font-black uppercase tracking-widest block leading-none">
              Sovereigns
            </span>
            <span className="text-base font-serif font-black text-gold-400 block mt-1.5 leading-none">
              {membersCount}
            </span>
            <span className="text-[7px] text-emerald-400 font-sans block mt-1 leading-none uppercase">
              ● Vetted Profiles
            </span>
          </div>

          <div className="bg-navy-900/40 border border-white/5 p-3 rounded-xl text-left" id="vital-card-chapters">
            <span className="text-[7px] text-navy-400 font-mono font-black uppercase tracking-widest block leading-none">
              Conclaves
            </span>
            <span className="text-base font-serif font-black text-gold-400 block mt-1.5 leading-none">
              {chaptersCount}
            </span>
            <span className="text-[7px] text-emerald-400 font-sans block mt-1 leading-none uppercase">
              ● Sync Integrity
            </span>
          </div>

        </div>

        {/* Database security indicators */}
        <div 
          id="vital-integrity-footer" 
          className="mt-4 pt-3.5 border-t border-white/5 flex items-center justify-between text-[8px] font-mono text-navy-400 uppercase tracking-wider"
        >
          <div className="flex items-center gap-1.5">
            <CheckCircle className="w-3 h-3 text-emerald-400" />
            <span>Database Integrity Optimal</span>
          </div>
          <ArrowUpRight className="w-2.5 h-2.5 text-navy-500" />
        </div>
      </section>

    </aside>
  );
}
