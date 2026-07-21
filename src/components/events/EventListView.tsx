import React from 'react';
import { Calendar, SearchCheck } from 'lucide-react';
import { Event, Member } from '../../types';
import { EventCard } from './EventCard';

export interface EventListViewProps {
  events: Event[];
  currentUser: Member;
  allMembers?: Member[];
  onRsvp: (eventId: string) => void;
  onSelectEvent: (event: Event) => void;
  onClearFilters?: () => void;
  isFiltered?: boolean;
}

export const EventListView: React.FC<EventListViewProps> = ({
  events,
  currentUser,
  allMembers = [],
  onRsvp,
  onSelectEvent,
  onClearFilters,
  isFiltered = false
}) => {
  if (events.length === 0) {
    return (
      <div className="bg-white rounded-3xl border border-navy-950/5 shadow-sm p-12 text-center flex flex-col items-center justify-center space-y-4">
        <div className="p-4 bg-amber-50 rounded-full text-[#c5a059] border border-amber-100">
          <Calendar className="w-8 h-8" />
        </div>
        <div className="space-y-1.5 max-w-sm">
          <h4 className="font-serif font-black text-navy-950 text-base uppercase tracking-wide">
            No assemblies discovered
          </h4>
          <p className="text-[11px] text-navy-500 leading-relaxed">
            {isFiltered 
              ? "We couldn't find any assemblies matching your search parameters. Try clearing filters or revising terms." 
              : "No upcoming conclave assemblies have been announced yet. Please check back later."}
          </p>
        </div>

        {isFiltered && onClearFilters && (
          <button
            onClick={onClearFilters}
            className="px-4 py-2 bg-navy-950 text-gold-500 text-[10px] font-bold uppercase tracking-widest rounded-lg hover:bg-navy-900 transition-all cursor-pointer"
          >
            Clear Search Filters
          </button>
        )}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 gap-5" id="events-list-grid">
      {events.map((event) => (
        <EventCard
          key={event.id}
          event={event}
          currentUser={currentUser}
          allMembers={allMembers}
          onRsvp={onRsvp}
          onSelect={onSelectEvent}
        />
      ))}
    </div>
  );
};
