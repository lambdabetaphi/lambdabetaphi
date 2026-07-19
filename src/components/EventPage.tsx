import React, { useState } from 'react';
import { 
  Calendar, 
  Clock, 
  MapPin, 
  PlusCircle, 
  UserCheck, 
  Users, 
  CheckCircle,
  Sparkles,
  Info
} from 'lucide-react';
import { Event, Member } from '../types';

interface EventPageProps {
  events: Event[];
  currentUser: Member | null;
  onRsvpEvent: (eventId: string) => void;
  onPublishEvent: (newEvent: Omit<Event, 'id' | 'rsvps'>) => void;
  members: Member[];
}

export default function EventPage({ events, currentUser, onRsvpEvent, onPublishEvent, members }: EventPageProps) {
  const [isCreatingEvent, setIsCreatingEvent] = useState(false);

  // Form States
  const [newTitle, setNewTitle] = useState('');
  const [newDesc, setNewDesc] = useState('');
  const [newDate, setNewDate] = useState('');
  const [newLocation, setNewLocation] = useState('');

  const handleCreateSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim() || !newDesc.trim() || !newDate || !newLocation.trim()) return;

    onPublishEvent({
      title: newTitle.trim(),
      description: newDesc.trim(),
      event_date: newDate,
      location: newLocation.trim(),
      created_by: currentUser?.id
    });

    // Reset
    setNewTitle('');
    setNewDesc('');
    setNewDate('');
    setNewLocation('');
    setIsCreatingEvent(false);
  };

  // Helper: map member IDs to avatar images
  const getAvatarForMemberId = (memberId: string) => {
    const matched = members.find(m => m.id === memberId);
    return matched?.avatar_url || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=100&q=80';
  };

  const getNameForMemberId = (memberId: string) => {
    const matched = members.find(m => m.id === memberId);
    return matched?.full_name || 'Initiate Member';
  };

  return (
    <div className="py-12 bg-navy-50 animate-fade-in min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* HEADER */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-12">
          <div>
            <span className="text-[10px] font-bold tracking-widest text-[#c5a059] uppercase block mb-2 font-mono">Chapter Engagements</span>
            <h1 className="text-3xl md:text-4xl font-serif font-black text-navy-950 uppercase tracking-tight">
              Assemblies Calendar
            </h1>
            <p className="text-xs text-navy-950/60 mt-1 font-sans">RSVP to active chapter meetings, assemblies, philanthropy drives, and social mixers.</p>
          </div>

          {currentUser && (
            <button
              onClick={() => setIsCreatingEvent(!isCreatingEvent)}
              className={`flex items-center gap-2 text-[10px] font-bold py-3.5 px-6 rounded-none uppercase tracking-widest transition-all cursor-pointer font-sans border ${
                isCreatingEvent
                  ? 'bg-red-50 text-red-600 border-red-200 hover:bg-red-100'
                  : 'bg-navy-950 text-gold-500 border-navy-950 hover:bg-navy-800'
              }`}
            >
              <PlusCircle className="w-4 h-4" />
              {isCreatingEvent ? 'Cancel Assembly Setup' : 'Schedule Chapter Assembly'}
            </button>
          )}
        </div>

        {/* CREATE EVENT DRAWER */}
        {isCreatingEvent && currentUser && (
          <div className="bg-white p-6 md:p-8 rounded-2xl border border-navy-950/5 shadow-sm mb-12 animate-slide-up max-w-3xl mx-auto font-sans">
            <div className="flex items-center gap-2 text-[#c5a059] mb-6 pb-2 border-b border-navy-950/10">
              <Sparkles className="w-5 h-5 text-gold-500" />
              <h3 className="font-serif font-black text-base text-navy-950 uppercase tracking-wider">Schedule Chapter Assembly</h3>
            </div>

            <form onSubmit={handleCreateSubmit} className="space-y-5 text-xs md:text-sm">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <div>
                  <label className="block text-[10px] font-bold text-navy-950 uppercase mb-1.5 font-mono">Assembly Title</label>
                  <input
                    type="text"
                    placeholder="e.g., Joint Formal Winter Banquet"
                    value={newTitle}
                    onChange={(e) => setNewTitle(e.target.value)}
                    className="w-full p-3 rounded-lg border border-navy-950/15 focus:outline-none focus:ring-1 focus:ring-gold-500 bg-white text-navy-950"
                    required
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-bold text-navy-950 uppercase mb-1.5 font-mono">Date and Time</label>
                  <input
                    type="datetime-local"
                    value={newDate}
                    onChange={(e) => setNewDate(e.target.value)}
                    className="w-full p-3 rounded-lg border border-navy-950/15 focus:outline-none focus:ring-1 focus:ring-gold-500 bg-white text-navy-950"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-[10px] font-bold text-navy-950 uppercase mb-1.5 font-mono">Location</label>
                <input
                  type="text"
                  placeholder="e.g., Grand Ballroom, University Campus / Online Zoom Link"
                  value={newLocation}
                  onChange={(e) => setNewLocation(e.target.value)}
                  className="w-full p-3 rounded-lg border border-navy-950/15 focus:outline-none focus:ring-1 focus:ring-gold-500 bg-white text-navy-950"
                  required
                />
              </div>

              <div>
                <label className="block text-[10px] font-bold text-navy-950 uppercase mb-1.5 font-mono">Assembly Description</label>
                <textarea
                  rows={4}
                  placeholder="Describe the objective, guidelines, attire, and agenda of this assembly..."
                  value={newDesc}
                  onChange={(e) => setNewDesc(e.target.value)}
                  className="w-full p-3 rounded-lg border border-navy-950/15 focus:outline-none focus:ring-1 focus:ring-gold-500 bg-white text-navy-950 font-sans"
                  required
                />
              </div>

              <div className="pt-3 border-t border-navy-950/5 flex justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setIsCreatingEvent(false)}
                  className="px-5 py-2.5 border border-navy-950/10 text-navy-950 text-[10px] font-bold uppercase tracking-widest hover:bg-navy-50 rounded-lg transition-colors cursor-pointer"
                >
                  Dismiss
                </button>
                <button
                  type="submit"
                  className="px-6 py-2.5 bg-navy-950 text-gold-500 text-[10px] font-bold uppercase tracking-widest hover:bg-navy-900 rounded-lg shadow-sm transition-colors cursor-pointer"
                >
                  Publish Assembly
                </button>
              </div>
            </form>
          </div>
        )}

        {/* EVENTS LIST GRID */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 font-sans">
          {events.length === 0 ? (
            <div className="col-span-full text-center py-20 bg-white rounded-2xl border border-navy-950/5 p-8">
              <Calendar className="w-12 h-12 text-navy-200 mx-auto mb-4 animate-pulse" />
              <p className="text-navy-950 font-serif font-black uppercase tracking-wider text-sm">No Scheduled Assemblies</p>
              <p className="text-navy-500 text-xs mt-1">Please sign in as an officer or administrator to schedule the first assembly.</p>
            </div>
          ) : (
            events.map((event) => {
              const rsvpList = event.rsvps || [];
              const isRsvpd = currentUser && rsvpList.includes(currentUser.id);
              const formattedDate = new Date(event.event_date).toLocaleDateString(undefined, {
                weekday: 'long',
                year: 'numeric',
                month: 'long',
                day: 'numeric'
              });
              const formattedTime = new Date(event.event_date).toLocaleTimeString(undefined, {
                hour: '2-digit',
                minute: '2-digit'
              });

              return (
                <div 
                  key={event.id}
                  className="bg-white rounded-2xl overflow-hidden border border-navy-950/5 shadow-sm hover:border-[#c5a059]/30 transition-all duration-300 flex flex-col justify-between"
                >
                  <div className="p-6 md:p-8 space-y-4">
                    <div className="space-y-2">
                      <h3 className="font-serif font-black text-navy-950 text-base md:text-lg leading-tight uppercase tracking-wide">
                        {event.title}
                      </h3>
                      
                      <div className="flex flex-col gap-1.5 text-navy-950/60 text-[10px] font-bold uppercase tracking-widest font-mono">
                        <div className="flex items-center gap-2">
                          <Calendar className="w-3.5 h-3.5 text-gold-600 shrink-0" />
                          <span>{formattedDate}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Clock className="w-3.5 h-3.5 text-gold-600 shrink-0" />
                          <span>{formattedTime}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <MapPin className="w-3.5 h-3.5 text-gold-600 shrink-0" />
                          <span className="truncate">{event.location}</span>
                        </div>
                      </div>

                      <p className="text-navy-950/70 text-xs leading-relaxed font-sans pt-2">
                        {event.description}
                      </p>
                    </div>

                    {/* RSVP list tracker */}
                    <div className="space-y-3 pt-4 border-t border-navy-950/5">
                      <div className="flex justify-between items-center text-[10px] font-bold text-navy-950 uppercase tracking-wider font-mono">
                        <span className="flex items-center gap-1.5">
                          <Users className="w-3.5 h-3.5 text-navy-400" />
                          {rsvpList.length} Attending
                        </span>
                      </div>

                      {/* Attendee Avatars */}
                      {rsvpList.length > 0 && (
                        <div className="flex items-center gap-2 py-1">
                          <div className="flex -space-x-1.5 overflow-hidden">
                            {rsvpList.slice(0, 5).map((mId, idx) => (
                              <img
                                key={idx}
                                src={getAvatarForMemberId(mId)}
                                alt={getNameForMemberId(mId)}
                                title={getNameForMemberId(mId)}
                                className="inline-block h-6 w-6 rounded-full border border-white ring-1 ring-[#c5a059] object-cover bg-white"
                                referrerPolicy="no-referrer"
                              />
                            ))}
                            {rsvpList.length > 5 && (
                              <div className="inline-flex h-6 w-6 items-center justify-center rounded-full bg-navy-950 text-[9px] font-black text-gold-500 border border-white font-mono">
                                +{rsvpList.length - 5}
                              </div>
                            )}
                          </div>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Actions footer */}
                  <div className="bg-navy-50/50 p-4 border-t border-navy-950/5">
                    {currentUser ? (
                      <button
                        onClick={() => onRsvpEvent(event.id)}
                        className={`w-full py-2.5 rounded-xl text-[10px] font-bold uppercase tracking-widest transition-all flex items-center justify-center gap-1.5 cursor-pointer font-sans border ${
                          isRsvpd
                            ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                            : 'bg-navy-950 text-gold-500 hover:bg-navy-900 border-navy-950'
                        }`}
                      >
                        {isRsvpd ? (
                          <>
                            <CheckCircle className="w-3.5 h-3.5 text-emerald-600" />
                            Registered ✓ Cancel Ticket
                          </>
                        ) : (
                          <>
                            <UserCheck className="w-3.5 h-3.5" />
                            Secure My Ticket
                          </>
                        )}
                      </button>
                    ) : (
                      <div className="text-center py-2.5 bg-[#fbf9f4] border border-[#c5a059]/20 text-[10px] font-bold uppercase tracking-widest text-[#c5a059] rounded-xl font-mono">
                        Sign In to Secure RSVP Ticket
                      </div>
                    )}
                  </div>
                </div>
              );
            })
          )}
        </div>

      </div>
    </div>
  );
}
