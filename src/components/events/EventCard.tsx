import React, { useMemo } from 'react';
import { Calendar, MapPin, Clock, Users, CheckCircle } from 'lucide-react';
import { Event, Member } from '../../types';
import { formatEventDateTime } from '../../utils/date';

export interface EventCardProps {
  event: Event;
  currentUser: Member;
  allMembers?: Member[];
  onRsvp: (eventId: string) => void;
  onSelect: (event: Event) => void;
}

export const EventCard: React.FC<EventCardProps> = React.memo(({
  event,
  currentUser,
  allMembers = [],
  onRsvp,
  onSelect
}) => {
  const rsvpsList = event.rsvps || [];
  const isRsvpd = rsvpsList.includes(currentUser.id) || (currentUser.email && rsvpsList.includes(currentUser.email));

  // Extract date details using shared utility
  const dateDetails = useMemo(() => {
    const formatted = formatEventDateTime(event.event_date || event.date, event.time);
    return {
      ...formatted,
      displayDate: formatted.displayDateShort
    };
  }, [event.event_date, event.date, event.time]);

  // Fallback image based on event title/category to make it look outstanding
  const eventImage = useMemo(() => {
    if (event.image) return event.image;
    // Elegant fallbacks depending on name
    const titleLower = event.title.toLowerCase();
    if (titleLower.includes('meeting') || titleLower.includes('chapter') || titleLower.includes('conclave')) {
      return 'https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?auto=format&fit=crop&w=600&q=80';
    }
    if (titleLower.includes('gala') || titleLower.includes('dinner') || titleLower.includes('banquet')) {
      return 'https://images.unsplash.com/photo-1511795409834-ef04bbd61622?auto=format&fit=crop&w=600&q=80';
    }
    if (titleLower.includes('service') || titleLower.includes('charity') || titleLower.includes('volunteer')) {
      return 'https://images.unsplash.com/photo-1488521787991-ed7bbaae773c?auto=format&fit=crop&w=600&q=80';
    }
    return 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?auto=format&fit=crop&w=600&q=80';
  }, [event.image, event.title]);

  // Find RSVP'd member profiles to render quick thumbnail stack
  const rsvpedMembers = useMemo(() => {
    return allMembers.filter(m => rsvpsList.includes(m.id) || (m.email && rsvpsList.includes(m.email))).slice(0, 4);
  }, [allMembers, rsvpsList]);

  // Handle keyboard events to open details modal
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      onSelect(event);
    }
  };

  return (
    <div 
      className="bg-white rounded-2xl overflow-hidden border border-navy-950/5 flex flex-col group hover:shadow-md transition-all duration-300 text-left focus-within:ring-2 focus-within:ring-[#c5a059]/40"
      id={`event-card-${event.id}`}
    >
      {/* Cover Image & Date Badge */}
      <div className="h-44 relative bg-navy-900 overflow-hidden cursor-pointer" onClick={() => onSelect(event)}>
        <img 
          src={eventImage} 
          alt={event.title} 
          className="w-full h-full object-cover opacity-85 group-hover:scale-105 transition-transform duration-500" 
          referrerPolicy="no-referrer"
        />
        <div className="absolute top-4 left-4 bg-white/95 px-3 py-2 rounded-xl text-center shadow-md border border-navy-950/5">
          <p className="text-[10px] font-mono font-black text-[#c5a059] uppercase tracking-wider leading-none">
            {dateDetails.month}
          </p>
          <p className="text-lg font-serif font-black text-navy-950 leading-none mt-1">
            {dateDetails.day}
          </p>
        </div>

        {/* Attendance status badge */}
        {isRsvpd && (
          <div className="absolute top-4 right-4 bg-emerald-500 text-white px-2.5 py-1 rounded-full text-[9px] font-bold uppercase tracking-wider shadow-sm flex items-center gap-1">
            <CheckCircle className="w-3 h-3" />
            Secured
          </div>
        )}
      </div>

      {/* Contents */}
      <div className="p-5 flex-1 flex flex-col justify-between">
        <div>
          {/* Title & Metadata */}
          <div className="space-y-1">
            <h4 
              tabIndex={0}
              onKeyDown={handleKeyDown}
              onClick={() => onSelect(event)}
              className="font-serif font-black text-navy-950 text-sm uppercase tracking-wide leading-snug cursor-pointer hover:text-[#c5a059] transition-colors focus:outline-none"
            >
              {event.title}
            </h4>
            <p className="text-[10px] font-mono text-navy-400 uppercase tracking-widest">{event.location}</p>
          </div>

          <p className="text-[10.5px] text-navy-600 mt-3 line-clamp-2 leading-relaxed">
            {event.description}
          </p>
          
          {/* Logistics */}
          <div className="mt-4 pt-4 border-t border-navy-950/5 space-y-2 text-[10.5px] text-navy-600 font-medium">
            <div className="flex items-center gap-2.5">
              <Clock className="w-3.5 h-3.5 text-[#c5a059]" /> 
              <span>{dateDetails.displayDate} @ {dateDetails.time}</span>
            </div>
            <div className="flex items-center gap-2.5">
              <MapPin className="w-3.5 h-3.5 text-[#c5a059] shrink-0" /> 
              <span className="truncate">{event.location}</span>
            </div>
          </div>
        </div>

        {/* Footer Area with RSVP Stack & RSVP Action */}
        <div className="pt-4 border-t border-navy-950/5 mt-5 flex items-center justify-between">
          
          {/* Attendee Thumbs and Count */}
          <div className="flex items-center gap-2">
            {rsvpedMembers.length > 0 ? (
              <div className="flex -space-x-1.5">
                {rsvpedMembers.map((member) => {
                  const avatar = member.avatar_url || member.avatarUrl || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=100&q=80';
                  return (
                    <img 
                      key={member.id}
                      src={avatar}
                      alt={member.full_name}
                      title={member.full_name}
                      className="w-5 h-5 rounded-full object-cover border border-white"
                      referrerPolicy="no-referrer"
                    />
                  );
                })}
              </div>
            ) : (
              <Users className="w-3.5 h-3.5 text-navy-300" />
            )}
            <span className="text-[9.5px] text-navy-500 font-mono font-bold uppercase tracking-wider">
              {rsvpsList.length} RSVP{rsvpsList.length !== 1 ? 's' : ''}
            </span>
          </div>

          {/* Action buttons */}
          <div className="flex items-center gap-1.5">
            <button
              onClick={() => onSelect(event)}
              className="px-2.5 py-1.5 text-[9px] font-mono font-black text-navy-500 uppercase tracking-wider hover:text-[#c5a059] transition-colors focus:outline-none focus:ring-1 focus:ring-[#c5a059]/40 rounded"
            >
              Details
            </button>
            <button
              onClick={() => onRsvp(event.id)}
              aria-label={isRsvpd ? `Retract RSVP from ${event.title}` : `RSVP to ${event.title}`}
              className={`px-3.5 py-1.5 text-[9.5px] font-bold uppercase tracking-wider rounded-lg transition-all cursor-pointer ${
                isRsvpd 
                  ? 'bg-emerald-50 border border-emerald-200 text-emerald-700 hover:bg-emerald-100' 
                  : 'bg-navy-950 text-gold-500 hover:bg-navy-900'
              }`}
            >
              {isRsvpd ? 'Going ✓' : 'RSVP'}
            </button>
          </div>

        </div>
      </div>
    </div>
  );
});

EventCard.displayName = 'EventCard';
