import React, { useMemo, useEffect, useRef } from 'react';
import { X, Calendar, MapPin, Clock, Users, ArrowRight, ShieldCheck, FolderOpen, Camera, Info } from 'lucide-react';
import { Event, Member } from '../../types';
import { formatEventDateTime } from '../../utils/date';

export interface EventDetailsModalProps {
  event: Event;
  currentUser: Member;
  allMembers?: Member[];
  onClose: () => void;
  onRsvp: (eventId: string) => void;
}

export const EventDetailsModal: React.FC<EventDetailsModalProps> = ({
  event,
  currentUser,
  allMembers = [],
  onClose,
  onRsvp
}) => {
  const modalRef = useRef<HTMLDivElement>(null);
  const closeButtonRef = useRef<HTMLButtonElement>(null);

  const rsvpsList = event.rsvps || [];
  const isRsvpd = rsvpsList.includes(currentUser.id) || (currentUser.email && rsvpsList.includes(currentUser.email));

  // Access date components using shared utility
  const dateDetails = useMemo(() => {
    const formatted = formatEventDateTime(event.event_date || event.date, event.time);
    return {
      ...formatted,
      displayDate: formatted.displayDateLong
    };
  }, [event.event_date, event.date, event.time]);

  // Map RSVP ids to actual Member structures
  const attendeeMembers = useMemo(() => {
    return allMembers.filter(m => rsvpsList.includes(m.id) || (m.email && rsvpsList.includes(m.email)));
  }, [allMembers, rsvpsList]);

  // Banner image with fallback
  const eventImage = useMemo(() => {
    if (event.image) return event.image;
    const titleLower = event.title.toLowerCase();
    if (titleLower.includes('meeting') || titleLower.includes('chapter') || titleLower.includes('conclave')) {
      return 'https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?auto=format&fit=crop&w=1200&q=80';
    }
    if (titleLower.includes('gala') || titleLower.includes('dinner') || titleLower.includes('banquet')) {
      return 'https://images.unsplash.com/photo-1511795409834-ef04bbd61622?auto=format&fit=crop&w=1200&q=80';
    }
    if (titleLower.includes('service') || titleLower.includes('charity') || titleLower.includes('volunteer')) {
      return 'https://images.unsplash.com/photo-1488521787991-ed7bbaae773c?auto=format&fit=crop&w=1200&q=80';
    }
    return 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?auto=format&fit=crop&w=1200&q=80';
  }, [event.image, event.title]);

  // Focus trap and key listener
  useEffect(() => {
    // Focus close button on mount
    closeButtonRef.current?.focus();

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }

      // Simple focus trap tab trapping
      if (e.key === 'Tab' && modalRef.current) {
        const focusables = modalRef.current.querySelectorAll(
          'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
        );
        const first = focusables[0] as HTMLElement;
        const last = focusables[focusables.length - 1] as HTMLElement;

        if (e.shiftKey) {
          if (document.activeElement === first) {
            last.focus();
            e.preventDefault();
          }
        } else {
          if (document.activeElement === last) {
            first.focus();
            e.preventDefault();
          }
        }
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    document.body.style.overflow = 'hidden';

    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = '';
    };
  }, [onClose]);

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-navy-950/40 backdrop-blur-sm"
      role="dialog"
      aria-modal="true"
      aria-labelledby="modal-event-title"
    >
      {/* Click-outside glass shield overlay */}
      <div className="absolute inset-0" onClick={onClose} />

      {/* Main Modal container */}
      <div 
        ref={modalRef}
        className="relative bg-[#fbf9f4] w-full max-w-2xl rounded-3xl overflow-hidden shadow-2xl border border-navy-950/10 max-h-[90vh] flex flex-col focus:outline-none"
        id="event-details-modal"
      >
        {/* Absolute header buttons */}
        <button 
          ref={closeButtonRef}
          onClick={onClose}
          aria-label="Close details"
          className="absolute top-4 right-4 z-10 bg-white/90 hover:bg-white text-navy-950 hover:scale-105 p-2 rounded-full shadow-lg border border-navy-950/5 transition-all cursor-pointer focus:outline-none focus:ring-2 focus:ring-[#c5a059]"
        >
          <X className="w-4 h-4" />
        </button>

        {/* Scrollable Container */}
        <div className="overflow-y-auto flex-1 text-left">
          {/* Prominent Header Banner */}
          <div className="h-56 relative bg-navy-950">
            <img 
              src={eventImage} 
              alt={event.title} 
              className="w-full h-full object-cover opacity-80"
              referrerPolicy="no-referrer"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-[#fbf9f4] via-transparent to-black/35" />
            
            {/* Overlay Event Title & Location Label */}
            <div className="absolute bottom-6 left-6 right-6">
              <span className="bg-[#c5a059] text-white px-2.5 py-1 rounded-md text-[9px] font-mono font-bold uppercase tracking-wider shadow-sm">
                Chapter Assembly
              </span>
              <h2 
                id="modal-event-title" 
                className="font-serif font-black text-white text-xl sm:text-2xl mt-2 leading-tight drop-shadow-md uppercase tracking-wide"
              >
                {event.title}
              </h2>
            </div>
          </div>

          {/* Core Info & Grid Block */}
          <div className="p-6 space-y-6">
            
            {/* Key Metadata Row */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="bg-white p-4.5 rounded-2xl border border-navy-950/5 flex items-start gap-3 shadow-sm">
                <div className="p-2 bg-[#fbf9f4] rounded-xl text-[#c5a059]">
                  <Calendar className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-[10px] text-navy-400 uppercase tracking-widest font-black leading-none mb-1">Schedule & Time</h4>
                  <p className="font-sans text-[11px] font-semibold text-navy-950">{dateDetails.displayDate}</p>
                  <p className="font-mono text-[9.5px] text-navy-500 font-bold mt-1 flex items-center gap-1">
                    <Clock className="w-3 h-3 text-[#c5a059]/80" /> {dateDetails.time}
                  </p>
                </div>
              </div>

              <div className="bg-white p-4.5 rounded-2xl border border-navy-950/5 flex items-start gap-3 shadow-sm">
                <div className="p-2 bg-[#fbf9f4] rounded-xl text-[#c5a059]">
                  <MapPin className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-[10px] text-navy-400 uppercase tracking-widest font-black leading-none mb-1">Rendezvous Location</h4>
                  <p className="font-sans text-[11px] font-semibold text-navy-950">{event.location}</p>
                  <p className="text-[9.5px] text-[#c5a059] font-mono uppercase tracking-widest font-bold mt-1">Sovereign Conclave Chamber</p>
                </div>
              </div>
            </div>

            {/* Description Card */}
            <div className="bg-white p-5 rounded-2xl border border-navy-950/5 shadow-sm space-y-2.5">
              <h4 className="text-[10px] text-navy-400 uppercase tracking-widest font-black flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-[#c5a059]" /> Assembly Directive & Details
              </h4>
              <p className="font-sans text-[11.5px] text-navy-700 leading-relaxed whitespace-pre-line">
                {event.description}
              </p>
            </div>

            {/* Linked Event Photo Album Section */}
            <div className="bg-white p-5 rounded-2xl border border-navy-950/5 shadow-sm space-y-3">
              <div className="flex items-center justify-between">
                <h4 className="text-[10px] text-navy-400 uppercase tracking-widest font-black flex items-center gap-2">
                  <FolderOpen className="w-4 h-4 text-[#c5a059]" /> Event Photo Album
                </h4>
                <span className="text-[8.5px] font-mono text-emerald-800 uppercase font-black bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                  Media Registry Linked
                </span>
              </div>

              <div className="p-3.5 bg-[#fbf9f4] rounded-xl border border-[#c5a059]/20 flex items-center gap-3">
                <div className="w-9 h-9 bg-navy-950 text-gold-500 rounded-lg flex items-center justify-center shrink-0 shadow-sm">
                  <Camera className="w-5 h-5" />
                </div>
                <div className="flex-1 text-left">
                  <p className="text-[11px] font-bold text-navy-950 font-serif">
                    {event.albumId ? 'Official Event Album Active' : `Photos Archive for ${event.title}`}
                  </p>
                  <p className="text-[9.5px] text-navy-600 font-sans mt-0.5">
                    Browse and inspect high-resolution event photography in the central Chapter Media Gallery tab.
                  </p>
                </div>
              </div>
            </div>

            {/* Roster list of RSVP'D Members */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <h4 className="text-[10px] text-navy-400 uppercase tracking-widest font-black flex items-center gap-2">
                  <Users className="w-4 h-4 text-[#c5a059]" /> 
                  Roster of Attendances ({attendeeMembers.length})
                </h4>
                <span className="text-[8.5px] font-mono text-navy-400 uppercase font-black">Secure Gate Access List</span>
              </div>

              <div className="bg-white rounded-2xl border border-navy-950/5 shadow-sm overflow-hidden divide-y divide-navy-950/5">
                {attendeeMembers.length > 0 ? (
                  <div className="max-h-52 overflow-y-auto divide-y divide-navy-950/5 custom-scrollbar">
                    {attendeeMembers.map((member) => {
                      const avatar = member.avatar_url || member.avatarUrl || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=100&q=80';
                      return (
                        <div key={member.id} className="p-3 flex items-center justify-between hover:bg-navy-50/10 transition-colors">
                          <div className="flex items-center gap-3">
                            <img 
                              src={avatar} 
                              alt={member.full_name} 
                              className="w-7 h-7 rounded-full object-cover ring-2 ring-[#c5a059]/10"
                              referrerPolicy="no-referrer"
                            />
                            <div>
                              <p className="text-[11px] font-sans font-black text-navy-950 leading-none">{member.full_name}</p>
                              <p className="text-[8.5px] font-mono text-[#c5a059] uppercase tracking-wider mt-1 font-bold">
                                {member.position || member.role}
                              </p>
                            </div>
                          </div>
                          
                          {/* Chapter Info */}
                          <div className="text-right">
                            <p className="text-[9.5px] font-semibold text-navy-800 leading-none">{member.chapter || 'Sovereign Chapter'}</p>
                            {member.batch && (
                              <p className="text-[8px] font-mono text-navy-400 uppercase tracking-widest mt-1">Batch: {member.batch}</p>
                            )}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                ) : (
                  <div className="py-8 text-center text-navy-400 italic text-[10px]">
                    No registrations recorded for this conclave assembly yet.
                  </div>
                )}
              </div>
            </div>

          </div>
        </div>

        {/* Modal Action Footer bar */}
        <div className="p-5 bg-white border-t border-navy-950/5 flex items-center justify-between rounded-b-3xl">
          <div className="text-left">
            <span className="text-[8.5px] font-mono text-navy-400 uppercase font-black block leading-none">Security Status</span>
            <p className="text-[10px] font-sans font-semibold text-navy-700 mt-1 flex items-center gap-1">
              {isRsvpd ? (
                <>
                  <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full inline-block animate-pulse"></span>
                  Attendance secured for {currentUser.full_name}
                </>
              ) : (
                <>
                  <span className="w-1.5 h-1.5 bg-amber-500 rounded-full inline-block"></span>
                  Requires RSVP gate registration
                </>
              )}
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={onClose}
              className="px-4 py-2.5 text-[10px] font-mono font-black text-navy-500 uppercase tracking-wider hover:bg-navy-50 rounded-xl transition-colors cursor-pointer"
            >
              Dismiss
            </button>
            <button
              onClick={() => onRsvp(event.id)}
              className={`px-5 py-2.5 text-[10px] font-bold uppercase tracking-wider rounded-xl shadow-sm transition-all cursor-pointer flex items-center gap-1.5 hover:scale-[1.01] ${
                isRsvpd 
                  ? 'bg-emerald-50 border border-emerald-200 text-emerald-700 hover:bg-emerald-100' 
                  : 'bg-navy-950 text-gold-500 hover:bg-navy-900'
              }`}
            >
              {isRsvpd ? 'Going ✓' : 'Register RSVP'} <ArrowRight className="w-3 h-3" />
            </button>
          </div>
        </div>

      </div>
    </div>
  );
};
