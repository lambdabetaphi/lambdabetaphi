import React, { useState, useMemo, useCallback } from 'react';
import { 
  Calendar, 
  List, 
  Search, 
  Filter, 
  Users, 
  CheckCircle, 
  CalendarDays,
  Clock, 
  MapPin,
  RotateCcw,
  Sparkles,
  Award
} from 'lucide-react';
import { Event, Member } from '../../types';
import { EventCalendarView } from './EventCalendarView';
import { EventListView } from './EventListView';
import { EventDetailsModal } from './EventDetailsModal';

export interface EventContainerProps {
  events: Event[];
  currentUser: Member;
  allMembers: Member[];
  onRsvp: (eventId: string) => void;
}

export const EventContainer: React.FC<EventContainerProps> = ({
  events = [],
  currentUser,
  allMembers = [],
  onRsvp
}) => {
  // View states: 'list' or 'calendar'
  const [viewMode, setViewMode] = useState<'list' | 'calendar'>('list');
  
  // Filter states
  const [searchQuery, setSearchQuery] = useState('');
  const [rsvpFilter, setRsvpFilter] = useState<'all' | 'attending' | 'not_attending'>('all');
  const [timeframeFilter, setTimeframeFilter] = useState<'all' | 'upcoming' | 'past'>('upcoming');

  // Selected event modal state
  const [selectedEvent, setSelectedEvent] = useState<Event | null>(null);

  // Helper to check if user has RSVP'd to an event
  const isUserRsvped = useCallback((event: Event) => {
    const rsvps = event.rsvps || [];
    return rsvps.includes(currentUser.id) || (currentUser.email && rsvps.includes(currentUser.email));
  }, [currentUser]);

  // Compute stats for metrics dashboard
  const stats = useMemo(() => {
    const total = events.length;
    const attendingCount = events.filter(isUserRsvped).length;
    const attendanceRate = total > 0 ? Math.round((attendingCount / total) * 100) : 0;
    
    // Find next upcoming event
    const upcoming = events
      .filter(e => {
        const rawDate = e.event_date || e.date;
        if (!rawDate) return false;
        try {
          return new Date(rawDate).getTime() >= Date.now();
        } catch {
          return false;
        }
      })
      .sort((a, b) => {
        const aDate = new Date(a.event_date || a.date || '').getTime();
        const bDate = new Date(b.event_date || b.date || '').getTime();
        return aDate - bDate;
      });

    return {
      total,
      attendingCount,
      attendanceRate,
      nextEvent: upcoming[0] || null
    };
  }, [events, isUserRsvped]);

  // Filter and sort events for list presentation
  const filteredEvents = useMemo(() => {
    return events
      .filter(event => {
        // Search text match
        const matchesSearch = 
          event.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
          event.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
          event.location.toLowerCase().includes(searchQuery.toLowerCase());

        // RSVP Filter match
        const rsvped = isUserRsvped(event);
        const matchesRsvp = 
          rsvpFilter === 'all' ||
          (rsvpFilter === 'attending' && rsvped) ||
          (rsvpFilter === 'not_attending' && !rsvped);

        // Timeframe Filter match
        let matchesTimeframe = true;
        const rawDate = event.event_date || event.date;
        if (rawDate) {
          try {
            const eventTime = new Date(rawDate).getTime();
            const nowTime = Date.now();
            
            if (timeframeFilter === 'upcoming') {
              matchesTimeframe = eventTime >= nowTime;
            } else if (timeframeFilter === 'past') {
              matchesTimeframe = eventTime < nowTime;
            }
          } catch {
            // Include on error
          }
        }

        return matchesSearch && matchesRsvp && matchesTimeframe;
      })
      .sort((a, b) => {
        // Sort chronologically (closest first for upcoming, reverse for past)
        const aTime = new Date(a.event_date || a.date || '').getTime();
        const bTime = new Date(b.event_date || b.date || '').getTime();
        
        if (timeframeFilter === 'past') {
          return bTime - aTime; // Newest past first
        }
        return aTime - bTime; // Soonest upcoming first
      });
  }, [events, searchQuery, rsvpFilter, timeframeFilter, isUserRsvped]);

  // Check if any filters are currently active
  const isFiltered = useMemo(() => {
    return searchQuery !== '' || rsvpFilter !== 'all' || timeframeFilter !== 'upcoming';
  }, [searchQuery, rsvpFilter, timeframeFilter]);

  // Reset all search and dropdown filters
  const handleResetFilters = () => {
    setSearchQuery('');
    setRsvpFilter('all');
    setTimeframeFilter('all');
  };

  // Sync selected event state if it receives an RSVP update in the modal
  const activeEventDetails = useMemo(() => {
    if (!selectedEvent) return null;
    return events.find(e => e.id === selectedEvent.id) || selectedEvent;
  }, [selectedEvent, events]);

  return (
    <div className="space-y-6 text-left font-sans">
      
      {/* 1. Header Banner & View Toggle */}
      <div className="bg-white rounded-3xl p-5 border border-navy-950/5 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h3 className="font-serif font-black text-navy-950 text-base uppercase tracking-wide flex items-center gap-2.5">
            <Calendar className="w-5.5 h-5.5 text-[#c5a059]" />
            Assemblies & Conclaves
          </h3>
          <p className="text-[10px] text-navy-400 uppercase tracking-widest font-black mt-0.5">Sovereign Chapters Hub Calendar & RSVP Hub</p>
        </div>

        {/* View Mode Toggle Switcher */}
        <div className="flex items-center gap-1.5 self-start sm:self-center">
          <div className="flex bg-navy-50 border border-navy-950/5 p-1 rounded-xl">
            <button
              onClick={() => setViewMode('list')}
              aria-label="List view"
              className={`px-3 py-1.5 rounded-lg text-[10px] font-bold uppercase tracking-wider transition-all flex items-center gap-1.5 cursor-pointer ${
                viewMode === 'list' 
                  ? 'bg-white text-navy-950 shadow-sm' 
                  : 'text-navy-400 hover:text-navy-600'
              }`}
            >
              <List className="w-3.5 h-3.5" />
              Roster
            </button>
            <button
              onClick={() => setViewMode('calendar')}
              aria-label="Calendar view"
              className={`px-3 py-1.5 rounded-lg text-[10px] font-bold uppercase tracking-wider transition-all flex items-center gap-1.5 cursor-pointer ${
                viewMode === 'calendar' 
                  ? 'bg-white text-navy-950 shadow-sm' 
                  : 'text-navy-400 hover:text-navy-600'
              }`}
            >
              <CalendarDays className="w-3.5 h-3.5" />
              Calendar
            </button>
          </div>
        </div>
      </div>

      {/* 2. Metrics Statistics Board */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4" id="events-metrics-grid">
        {/* Total Events */}
        <div className="bg-white p-4 rounded-2xl border border-navy-950/5 flex items-center gap-4 shadow-sm">
          <div className="p-3 bg-navy-50 rounded-xl text-navy-950">
            <Calendar className="w-5 h-5" />
          </div>
          <div>
            <span className="text-[9px] font-mono font-black text-navy-400 uppercase tracking-widest leading-none block">Scheduled Assemblies</span>
            <span className="text-xl font-serif font-black text-navy-950 block mt-1">{stats.total}</span>
          </div>
        </div>

        {/* Registered Events */}
        <div className="bg-white p-4 rounded-2xl border border-navy-950/5 flex items-center gap-4 shadow-sm">
          <div className="p-3 bg-emerald-50 rounded-xl text-emerald-600">
            <CheckCircle className="w-5 h-5" />
          </div>
          <div>
            <span className="text-[9px] font-mono font-black text-navy-400 uppercase tracking-widest leading-none block">Secured Tickets</span>
            <span className="text-xl font-serif font-black text-navy-950 block mt-1">{stats.attendingCount} Attending</span>
          </div>
        </div>

        {/* Attendance Rate */}
        <div className="bg-white p-4 rounded-2xl border border-navy-950/5 flex items-center gap-4 shadow-sm">
          <div className="p-3 bg-[#c5a059]/10 rounded-xl text-[#c5a059]">
            <Award className="w-5 h-5" />
          </div>
          <div>
            <span className="text-[9px] font-mono font-black text-navy-400 uppercase tracking-widest leading-none block">Participation Rate</span>
            <span className="text-xl font-serif font-black text-navy-950 block mt-1">{stats.attendanceRate}%</span>
          </div>
        </div>
      </div>

      {/* 3. Next Highlighted Event Promo Banner */}
      {stats.nextEvent && (
        <div 
          onClick={() => setSelectedEvent(stats.nextEvent)}
          className="bg-gradient-to-r from-navy-950 via-navy-900 to-navy-950 rounded-3xl p-6 text-white border border-[#c5a059]/20 relative overflow-hidden shadow-md flex flex-col md:flex-row md:items-center justify-between gap-5 cursor-pointer hover:border-[#c5a059]/40 transition-all duration-300 group"
          id="next-conclave-highlight-banner"
        >
          {/* Subtle backgrounds */}
          <div className="absolute -right-20 -top-20 w-48 h-48 bg-[#c5a059]/10 rounded-full blur-[40px] pointer-events-none" />
          <div className="absolute -left-20 -bottom-20 w-48 h-48 bg-[#c5a059]/5 rounded-full blur-[40px] pointer-events-none" />

          <div className="space-y-2.5 max-w-xl text-left relative z-10">
            <div className="flex items-center gap-2">
              <span className="bg-[#c5a059]/20 border border-[#c5a059]/30 text-gold-400 px-2.5 py-0.5 rounded-full text-[8.5px] font-mono font-black uppercase tracking-widest flex items-center gap-1">
                <Sparkles className="w-3 h-3 text-gold-400 animate-pulse" /> Urgent: Next Assembly
              </span>
              <span className="text-[8.5px] text-navy-300 font-mono font-bold uppercase tracking-wider">
                {new Date(stats.nextEvent.event_date || stats.nextEvent.date || '').toLocaleDateString(undefined, { weekday: 'short', month: 'short', day: 'numeric' })}
              </span>
            </div>

            <h4 className="font-serif font-black text-white text-base md:text-lg group-hover:text-gold-300 transition-colors uppercase tracking-wide leading-tight">
              {stats.nextEvent.title}
            </h4>
            
            <p className="text-[10.5px] text-navy-200 line-clamp-2 leading-relaxed">
              {stats.nextEvent.description}
            </p>

            <div className="flex flex-wrap items-center gap-x-5 gap-y-1.5 text-[10px] text-navy-300 font-medium pt-1">
              <span className="flex items-center gap-1.5"><Clock className="w-3.5 h-3.5 text-[#c5a059]" /> {stats.nextEvent.time || 'TBD'}</span>
              <span className="flex items-center gap-1.5"><MapPin className="w-3.5 h-3.5 text-[#c5a059]" /> {stats.nextEvent.location}</span>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 shrink-0 relative z-10 self-start md:self-center">
            {isUserRsvped(stats.nextEvent) ? (
              <span className="px-4 py-2 bg-emerald-500/20 border border-emerald-500/30 text-emerald-300 text-[10px] font-black uppercase tracking-wider rounded-xl text-center">
                ✓ Attendance Secured
              </span>
            ) : (
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onRsvp(stats.nextEvent!.id);
                }}
                className="px-5 py-2.5 bg-[#c5a059] hover:bg-[#b08e4b] text-white text-[10px] font-black uppercase tracking-widest rounded-xl shadow-md transition-all cursor-pointer text-center"
              >
                Secure Gate Pass
              </button>
            )}
            <button
              onClick={() => setSelectedEvent(stats.nextEvent)}
              className="px-4 py-2.5 bg-white/10 hover:bg-white/20 text-white text-[10px] font-black uppercase tracking-widest rounded-xl transition-all cursor-pointer text-center"
            >
              Examine Directive
            </button>
          </div>
        </div>
      )}

      {/* 4. Filter Panel (Available only in List view, or for general search) */}
      <div className="bg-white rounded-3xl p-4.5 border border-navy-950/5 shadow-sm flex flex-col md:flex-row gap-3 items-stretch md:items-center justify-between" id="events-filter-bar">
        {/* Search Input bar */}
        <div className="relative flex-1">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-navy-400" />
          <input
            type="text"
            placeholder="Search assemblies by title, details, or chambers..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2 text-[10.5px] bg-[#fbf9f4]/40 border border-navy-950/5 focus:border-[#c5a059]/50 rounded-xl focus:outline-none focus:ring-1 focus:ring-[#c5a059]/20"
          />
        </div>

        {/* Selection Dropdowns */}
        <div className="flex flex-wrap items-center gap-2.5">
          {/* Timeframe Dropdown */}
          <div className="flex items-center gap-1 bg-white border border-navy-950/5 rounded-xl px-2.5 py-1.5">
            <Clock className="w-3.5 h-3.5 text-[#c5a059]" />
            <select
              value={timeframeFilter}
              onChange={(e) => setTimeframeFilter(e.target.value as 'all' | 'upcoming' | 'past')}
              className="text-[10px] font-bold text-navy-700 bg-transparent focus:outline-none cursor-pointer uppercase tracking-wider"
            >
              <option value="all">All Schedules</option>
              <option value="upcoming">Upcoming Conclaves</option>
              <option value="past">Past Record archives</option>
            </select>
          </div>

          {/* RSVP Attendance Filter */}
          <div className="flex items-center gap-1 bg-white border border-navy-950/5 rounded-xl px-2.5 py-1.5">
            <Filter className="w-3.5 h-3.5 text-[#c5a059]" />
            <select
              value={rsvpFilter}
              onChange={(e) => setRsvpFilter(e.target.value as 'all' | 'attending' | 'not_attending')}
              className="text-[10px] font-bold text-navy-700 bg-transparent focus:outline-none cursor-pointer uppercase tracking-wider"
            >
              <option value="all">All Registrations</option>
              <option value="attending">My Secured Gates (Going)</option>
              <option value="not_attending">Not Registered Yet</option>
            </select>
          </div>

          {/* Reset Filters */}
          {isFiltered && (
            <button
              onClick={handleResetFilters}
              aria-label="Reset filters"
              className="p-2 bg-navy-50 hover:bg-navy-100 text-navy-500 rounded-xl transition-colors cursor-pointer"
            >
              <RotateCcw className="w-3.5 h-3.5" />
            </button>
          )}
        </div>
      </div>

      {/* 5. Sub-views rendering */}
      {viewMode === 'calendar' ? (
        <EventCalendarView
          events={filteredEvents}
          currentUser={currentUser}
          onSelectEvent={setSelectedEvent}
        />
      ) : (
        <EventListView
          events={filteredEvents}
          currentUser={currentUser}
          allMembers={allMembers}
          onRsvp={onRsvp}
          onSelectEvent={setSelectedEvent}
          onClearFilters={handleResetFilters}
          isFiltered={isFiltered}
        />
      )}

      {/* 6. Selected Event Details Modal */}
      {activeEventDetails && (
        <EventDetailsModal
          event={activeEventDetails}
          currentUser={currentUser}
          allMembers={allMembers}
          onClose={() => setSelectedEvent(null)}
          onRsvp={onRsvp}
        />
      )}
      
    </div>
  );
};
export default EventContainer;
