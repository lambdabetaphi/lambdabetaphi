import React, { useState } from 'react';
import { 
  Calendar, 
  Clock, 
  MapPin, 
  PlusCircle, 
  UserCheck, 
  Users, 
  ChevronRight, 
  CheckCircle,
  HelpCircle,
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
  const [activeCategory, setActiveCategory] = useState<string>('all');
  const [isCreatingEvent, setIsCreatingEvent] = useState(false);

  // Form States
  const [newTitle, setNewTitle] = useState('');
  const [newDesc, setNewDesc] = useState('');
  const [newCat, setNewCat] = useState<'Social' | 'Service' | 'Professional' | 'Academic' | 'Ritual' | 'Alumni'>('Social');
  const [newDate, setNewDate] = useState('');
  const [newTime, setNewTime] = useState('');
  const [newLocation, setNewLocation] = useState('');
  const [newImage, setNewImage] = useState('');
  const [newCapacity, setNewCapacity] = useState<number>(100);
  const [newHighlights, setNewHighlights] = useState('');

  const categories = ['all', 'Social', 'Service', 'Professional', 'Academic', 'Ritual', 'Alumni'];

  const filteredEvents = activeCategory === 'all'
    ? events
    : events.filter(e => e.category === activeCategory);

  const handleCreateSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim() || !newDesc.trim() || !newDate || !newTime || !newLocation.trim()) return;

    const defaultImage = newImage.trim() || 'https://images.unsplash.com/photo-1511795409834-ef04bbd61622?auto=format&fit=crop&w=800&q=80';

    onPublishEvent({
      title: newTitle,
      description: newDesc,
      category: newCat,
      date: newDate,
      time: newTime,
      location: newLocation,
      image: defaultImage,
      capacity: newCapacity,
      highlights: newHighlights.trim() || undefined
    });

    // Reset
    setNewTitle('');
    setNewDesc('');
    setNewCat('Social');
    setNewDate('');
    setNewTime('');
    setNewLocation('');
    setNewImage('');
    setNewCapacity(100);
    setNewHighlights('');
    setIsCreatingEvent(false);
  };

  // Helper: map member emails to avatar images
  const getAvatarForEmail = (email: string) => {
    const matched = members.find(m => m.email === email);
    return matched ? matched.avatarUrl : 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=100&q=80';
  };

  const getNameForEmail = (email: string) => {
    const matched = members.find(m => m.email === email);
    return matched ? matched.name : email;
  };

  return (
    <div className="py-12 bg-navy-50 animate-fade-in min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* HEADER */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-12">
          <div>
            <span className="text-[10px] font-bold tracking-widest text-[#c5a059] uppercase block mb-2">Chapter Engagements</span>
            <h1 className="text-3xl md:text-4xl font-serif font-black text-navy-950 uppercase tracking-tight">
              Events Calendar
            </h1>
            <p className="text-xs text-navy-950/60 mt-1 font-sans">RSVP to active philanthropy drives, honor banquets, academic councils, and community sessions.</p>
          </div>

          {currentUser && (
            <button
              onClick={() => setIsCreatingEvent(!isCreatingEvent)}
              className={`flex items-center gap-2 text-[10px] font-bold py-3.5 px-6 rounded-none shadow-none uppercase tracking-widest transition-all cursor-pointer ${
                isCreatingEvent
                  ? 'bg-red-50 text-red-600 border border-red-200 hover:bg-red-100'
                  : 'bg-navy-950 text-gold-500 border border-navy-950 hover:bg-navy-800'
              }`}
            >
              <PlusCircle className="w-4 h-4" />
              {isCreatingEvent ? 'Cancel Event Setup' : 'Schedule Chapter Event'}
            </button>
          )}
        </div>

        {/* CREATE EVENT DRAWER */}
        {isCreatingEvent && currentUser && (
          <div className="bg-white p-6 md:p-8 rounded-none border-2 border-gold-500 shadow-none mb-12 animate-slide-up max-w-3xl mx-auto">
            <div className="flex items-center gap-2 text-[#c5a059] mb-6 pb-2 border-b border-navy-950/10">
              <Sparkles className="w-5 h-5 text-gold-500" />
              <h3 className="font-serif font-black text-base text-navy-950 uppercase tracking-wider">Schedule Chapter Event</h3>
            </div>

            <form onSubmit={handleCreateSubmit} className="space-y-5 text-xs md:text-sm">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <div>
                  <label className="block text-[10px] font-bold text-navy-950 uppercase mb-1.5">Event Title</label>
                  <input
                    type="text"
                    placeholder="e.g., Joint Formal Winter Banquet"
                    value={newTitle}
                    onChange={(e) => setNewTitle(e.target.value)}
                    className="w-full p-3 rounded-none border border-navy-950/15 focus:outline-none focus:ring-1 focus:ring-gold-500 bg-white text-navy-950 font-sans"
                    required
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-bold text-navy-950 uppercase mb-1.5">Category</label>
                  <select
                    value={newCat}
                    onChange={(e) => setNewCat(e.target.value as any)}
                    className="w-full p-3 rounded-none border border-navy-950/15 focus:outline-none focus:ring-1 focus:ring-gold-500 bg-white text-navy-950 font-sans text-xs"
                  >
                    <option value="Social">Social / Mixer</option>
                    <option value="Service">Philanthropy / Service</option>
                    <option value="Professional">Professional Development</option>
                    <option value="Academic">Academic / Scholastic</option>
                    <option value="Ritual">Ritual / Formal Chapter</option>
                    <option value="Alumni">Alumni Reunion</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-[10px] font-bold text-navy-950 uppercase mb-1.5">Description</label>
                <textarea
                  placeholder="Outline the purpose of the event, expectations, dress code, etc."
                  rows={4}
                  value={newDesc}
                  onChange={(e) => setNewDesc(e.target.value)}
                  className="w-full p-3 rounded-none border border-navy-950/15 focus:outline-none focus:ring-1 focus:ring-gold-500 bg-white text-navy-950 font-sans text-xs"
                  required
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                <div>
                  <label className="block text-[10px] font-bold text-navy-950 uppercase mb-1.5">Date</label>
                  <input
                    type="date"
                    value={newDate}
                    onChange={(e) => setNewDate(e.target.value)}
                    className="w-full p-3 rounded-none border border-navy-950/15 focus:outline-none focus:ring-1 focus:ring-gold-500 bg-white text-navy-950 font-sans"
                    required
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-bold text-navy-950 uppercase mb-1.5">Time Frame</label>
                  <input
                    type="text"
                    placeholder="e.g., 18:00 - 21:00"
                    value={newTime}
                    onChange={(e) => setNewTime(e.target.value)}
                    className="w-full p-3 rounded-none border border-navy-950/15 focus:outline-none focus:ring-1 focus:ring-gold-500 bg-white text-navy-950 font-sans"
                    required
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-bold text-navy-950 uppercase mb-1.5">Event Capacity</label>
                  <input
                    type="number"
                    min={10}
                    value={newCapacity}
                    onChange={(e) => setNewCapacity(Number(e.target.value))}
                    className="w-full p-3 rounded-none border border-navy-950/15 focus:outline-none focus:ring-1 focus:ring-gold-500 bg-white text-navy-950 font-sans"
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <div>
                  <label className="block text-[10px] font-bold text-navy-950 uppercase mb-1.5">Location</label>
                  <input
                    type="text"
                    placeholder="e.g., Chapter Lounge or Grand Hotel"
                    value={newLocation}
                    onChange={(e) => setNewLocation(e.target.value)}
                    className="w-full p-3 rounded-none border border-navy-950/15 focus:outline-none focus:ring-1 focus:ring-gold-500 bg-white text-navy-950 font-sans"
                    required
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-bold text-navy-950 uppercase mb-1.5">Cover Image URL</label>
                  <input
                    type="url"
                    placeholder="e.g., https://images.unsplash.com/..."
                    value={newImage}
                    onChange={(e) => setNewImage(e.target.value)}
                    className="w-full p-3 rounded-none border border-navy-950/15 focus:outline-none focus:ring-1 focus:ring-gold-500 bg-white text-navy-950 font-sans"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[10px] font-bold text-navy-950 uppercase mb-1.5">Event Highlights (Dress Code, details)</label>
                <input
                  type="text"
                  placeholder="e.g., Cocktail attire required. Networking reception begins 30 mins prior."
                  value={newHighlights}
                  onChange={(e) => setNewHighlights(e.target.value)}
                  className="w-full p-3 rounded-none border border-navy-950/15 focus:outline-none focus:ring-1 focus:ring-gold-500 bg-white text-navy-950 font-sans"
                />
              </div>

              <div className="flex items-center gap-3 justify-end pt-3">
                <button
                  type="button"
                  onClick={() => setIsCreatingEvent(false)}
                  className="px-5 py-2.5 rounded-none border border-navy-950/15 text-navy-700 hover:bg-navy-50 font-bold text-[10px] uppercase tracking-widest"
                >
                  Dismiss
                </button>
                <button
                  type="submit"
                  className="px-6 py-2.5 rounded-none bg-[#c5a059] text-white hover:bg-gold-600 font-bold text-[10px] uppercase tracking-widest"
                >
                  Create Event
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
              {cat === 'all' ? 'All Activities' : cat}
            </button>
          ))}
        </div>

        {/* EVENTS LIST GRID */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {filteredEvents.length === 0 ? (
            <div className="col-span-1 lg:col-span-2 text-center py-20 bg-white rounded-none border border-navy-950/10">
              <Calendar className="w-10 h-10 text-navy-300 mx-auto mb-4" />
              <p className="text-navy-950 font-bold uppercase tracking-widest text-xs">No scheduled events in this category.</p>
            </div>
          ) : (
            filteredEvents.map((event) => {
              const isRsvpd = currentUser && event.rsvps.includes(currentUser.email);
              const spotsFilled = event.rsvps.length;
              const maxCapacity = event.capacity || 100;
              const fillPercentage = Math.min((spotsFilled / maxCapacity) * 100, 100);

              return (
                <div 
                  key={event.id}
                  className="bg-white rounded-none overflow-hidden border border-navy-950/10 shadow-none hover:border-gold-500/40 transition-all duration-300 grid grid-cols-1 md:grid-cols-12"
                >
                  
                  {/* Left Column: Cover Banner */}
                  <div className="md:col-span-5 h-56 md:h-full relative overflow-hidden">
                    <img 
                      src={event.image} 
                      alt={event.title} 
                      className="w-full h-full object-cover transition-transform duration-500 hover:scale-105"
                      referrerPolicy="no-referrer"
                    />
                    <span className="absolute top-4 left-4 bg-navy-950 text-gold-500 text-[9px] font-black uppercase tracking-widest px-3 py-1 border border-gold-500/20">
                      {event.category}
                    </span>
                  </div>

                  {/* Right Column: Information Body */}
                  <div className="md:col-span-7 p-6 md:p-8 flex flex-col justify-between space-y-4">
                    
                    <div className="space-y-2">
                      <h3 className="font-serif font-black text-navy-950 text-base md:text-lg leading-tight uppercase tracking-wide">
                        {event.title}
                      </h3>
                      
                      <div className="flex flex-col gap-1.5 text-navy-950/60 text-[10px] font-bold uppercase tracking-widest">
                        <div className="flex items-center gap-2">
                          <Calendar className="w-3.5 h-3.5 text-gold-600 shrink-0" />
                          <span>{event.date}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Clock className="w-3.5 h-3.5 text-gold-600 shrink-0" />
                          <span>{event.time}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <MapPin className="w-3.5 h-3.5 text-gold-600 shrink-0" />
                          <span className="truncate">{event.location}</span>
                        </div>
                      </div>

                      <p className="text-navy-950/70 text-xs font-light leading-relaxed font-sans line-clamp-3">
                        {event.description}
                      </p>
                    </div>

                    {/* RSVP and Progress Area */}
                    <div className="space-y-3 pt-3 border-t border-navy-950/5">
                      
                      {/* Spots Capacity tracker */}
                      <div className="flex justify-between text-[10px] font-bold text-navy-950 uppercase tracking-wider">
                        <span className="flex items-center gap-1">
                          <Users className="w-3.5 h-3.5 text-navy-400" />
                          {spotsFilled} / {maxCapacity} Reserved
                        </span>
                        <span>{Math.round(fillPercentage)}% Capacity</span>
                      </div>

                      {/* Progress Bar */}
                      <div className="w-full h-1 bg-navy-100 rounded-none overflow-hidden">
                        <div 
                          className="h-full bg-gold-500 transition-all duration-500"
                          style={{ width: `${fillPercentage}%` }}
                        />
                      </div>

                      {/* RSVP User Avatars (Square Pile) */}
                      {event.rsvps.length > 0 && (
                        <div className="flex items-center gap-2">
                          <div className="flex -space-x-1.5 overflow-hidden">
                            {event.rsvps.slice(0, 5).map((email, idx) => (
                              <img
                                key={idx}
                                src={getAvatarForEmail(email)}
                                alt={getNameForEmail(email)}
                                title={getNameForEmail(email)}
                                className="inline-block h-6 w-6 rounded-none border border-gold-500 object-cover object-center bg-white"
                                referrerPolicy="no-referrer"
                              />
                            ))}
                            {event.rsvps.length > 5 && (
                              <div className="inline-flex h-6 w-6 items-center justify-center rounded-none bg-navy-950 text-[9px] font-black text-gold-500 border border-gold-500/30">
                                +{event.rsvps.length - 5}
                              </div>
                            )}
                          </div>
                          <span className="text-[9px] uppercase tracking-widest text-navy-400 font-bold">attending</span>
                        </div>
                      )}

                      {/* Highlight snippet info box */}
                      {event.highlights && (
                        <div className="bg-[#fbf9f4] p-2 rounded-none border border-navy-950/5 flex items-start gap-1.5 text-[9px] text-navy-600 font-medium">
                          <Info className="w-3.5 h-3.5 text-navy-500 shrink-0 mt-0.5" />
                          <span>{event.highlights}</span>
                        </div>
                      )}

                      {/* Action trigger button */}
                      {currentUser ? (
                        <button
                          onClick={() => onRsvpEvent(event.id)}
                          className={`w-full py-2.5 rounded-none text-[10px] font-bold uppercase tracking-widest transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
                            isRsvpd
                              ? 'bg-gold-500/10 text-gold-700 border border-gold-500/30'
                              : 'bg-navy-950 text-white hover:bg-gold-500 hover:text-navy-950'
                          }`}
                        >
                          {isRsvpd ? (
                            <>
                              <CheckCircle className="w-3.5 h-3.5 text-green-600" />
                              RSVP Checked &bull; Retract Ticket
                            </>
                          ) : (
                            <>
                              <UserCheck className="w-3.5 h-3.5" />
                              Secure My Event Ticket
                            </>
                          )}
                        </button>
                      ) : (
                        <div className="text-center p-2.5 bg-gold-500/5 border border-gold-500/20 text-[10px] font-bold uppercase tracking-widest text-navy-950">
                          Please sign in above to reserve tickets.
                        </div>
                      )}

                    </div>

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
