import React, { useState } from 'react';
import { Shield, Check, X, Trash2, AlertCircle, UserMinus, UserCheck, Volume2, Plus, Calendar, Award } from 'lucide-react';
import { Member, Announcement, Event } from '../types';

interface PortalAdminProps {
  members: Member[];
  announcements: Announcement[];
  events: Event[];
  onApproveMember: (id: string) => void;
  onRejectMember: (id: string) => void;
  onSuspendMember: (id: string) => void;
  onDeleteMember: (id: string) => void;
  onAddAnnouncement: (title: string, content: string, isPinned: boolean) => void;
  onAddEvent: (eventData: { title: string; event_date: string; location: string; description: string }) => void;
  onDeleteAnnouncement: (id: string) => void;
  onDeleteEvent: (id: string) => void;
  showToast: (message: string, type?: 'success' | 'info' | 'error') => void;
}

export default function PortalAdmin({
  members,
  announcements,
  events,
  onApproveMember,
  onRejectMember,
  onSuspendMember,
  onDeleteMember,
  onAddAnnouncement,
  onAddEvent,
  onDeleteAnnouncement,
  onDeleteEvent,
  showToast
}: PortalAdminProps) {
  
  // Tabs within admin panel
  const [adminSection, setAdminSection] = useState<'pending' | 'roster' | 'announcements' | 'events'>('pending');

  // Input states for Announcement
  const [annTitle, setAnnTitle] = useState('');
  const [annContent, setAnnContent] = useState('');
  const [annPinned, setAnnPinned] = useState(false);

  // Input states for Event
  const [evtTitle, setEvtTitle] = useState('');
  const [evtDate, setEvtDate] = useState('');
  const [evtLocation, setEvtLocation] = useState('');
  const [evtDesc, setEvtDesc] = useState('');

  // Segregating lists
  const pendingMembers = members.filter(m => m.status === 'Pending');
  const activeMembers = members.filter(m => m.status !== 'Pending');

  const handleCreateAnnouncement = (e: React.FormEvent) => {
    e.preventDefault();
    if (!annTitle.trim() || !annContent.trim()) {
      showToast('Title and content are required.', 'error');
      return;
    }
    onAddAnnouncement(annTitle.trim(), annContent.trim(), annPinned);
    setAnnTitle('');
    setAnnContent('');
    setAnnPinned(false);
    showToast('Notice broadcasted to all active members.', 'success');
  };

  const handleCreateEvent = (e: React.FormEvent) => {
    e.preventDefault();
    if (!evtTitle.trim() || !evtDate || !evtLocation.trim()) {
      showToast('Title, date, and location are required.', 'error');
      return;
    }
    onAddEvent({
      title: evtTitle.trim(),
      event_date: evtDate,
      location: evtLocation.trim(),
      description: evtDesc.trim()
    });
    setEvtTitle('');
    setEvtDate('');
    setEvtLocation('');
    setEvtDesc('');
    showToast('New event cataloged on community calendar.', 'success');
  };

  return (
    <div className="space-y-4 font-sans text-xs">
      
      {/* Executive Suite Header Card */}
      <div className="bg-gradient-to-r from-navy-950 to-navy-900 rounded-2xl shadow-sm border border-[#c5a059]/20 p-5 text-white">
        <div className="flex items-center gap-3">
          <Shield className="w-6 h-6 text-[#c5a059] animate-pulse" />
          <div>
            <h3 className="font-serif font-black text-gold-400 text-base uppercase tracking-wider">
              Executive Administration Suite
            </h3>
            <p className="text-[10px] text-navy-300 uppercase tracking-widest font-semibold mt-0.5">
              Lambda Beta Phi Chapter Ledger & Registry Control
            </p>
          </div>
        </div>
      </div>

      {/* Navigation Sub-Menu */}
      <div className="flex gap-2 overflow-x-auto pb-1">
        <button
          onClick={() => setAdminSection('pending')}
          className={`px-4 py-2 rounded-xl text-[10px] font-bold uppercase tracking-wider border transition-all cursor-pointer whitespace-nowrap flex items-center gap-1.5 ${
            adminSection === 'pending'
              ? 'bg-navy-950 border-navy-950 text-gold-500 shadow-sm'
              : 'bg-white border-navy-950/10 text-navy-950 hover:bg-navy-50'
          }`}
        >
          Pending Registrations
          {pendingMembers.length > 0 && (
            <span className="bg-rose-500 text-white rounded-full px-1.5 py-0.5 text-[8px] animate-pulse font-mono">
              {pendingMembers.length}
            </span>
          )}
        </button>

        <button
          onClick={() => setAdminSection('roster')}
          className={`px-4 py-2 rounded-xl text-[10px] font-bold uppercase tracking-wider border transition-all cursor-pointer whitespace-nowrap ${
            adminSection === 'roster'
              ? 'bg-navy-950 border-navy-950 text-gold-500 shadow-sm'
              : 'bg-white border-navy-950/10 text-navy-950 hover:bg-navy-50'
          }`}
        >
          Manage Member Roster
        </button>

        <button
          onClick={() => setAdminSection('announcements')}
          className={`px-4 py-2 rounded-xl text-[10px] font-bold uppercase tracking-wider border transition-all cursor-pointer whitespace-nowrap ${
            adminSection === 'announcements'
              ? 'bg-navy-950 border-navy-950 text-gold-500 shadow-sm'
              : 'bg-white border-navy-950/10 text-navy-950 hover:bg-navy-50'
          }`}
        >
          Broadcast Bulletins
        </button>

        <button
          onClick={() => setAdminSection('events')}
          className={`px-4 py-2 rounded-xl text-[10px] font-bold uppercase tracking-wider border transition-all cursor-pointer whitespace-nowrap ${
            adminSection === 'events'
              ? 'bg-navy-950 border-navy-950 text-gold-500 shadow-sm'
              : 'bg-white border-navy-950/10 text-navy-950 hover:bg-navy-50'
          }`}
        >
          Schedule Assemblies
        </button>
      </div>

      {/* Admin Panels content */}
      <div className="bg-white rounded-2xl border border-navy-950/5 p-4.5 min-h-[300px]">
        
        {/* =======================================
            PENDING APPLICANTS SECTION
            ======================================= */}
        {adminSection === 'pending' && (
          <div className="space-y-4">
            <h4 className="font-serif font-black text-navy-950 uppercase tracking-wider text-[11px] border-b border-navy-950/5 pb-2">
              Applicants Requiring Chapter Review ({pendingMembers.length})
            </h4>

            {pendingMembers.length > 0 ? (
              <div className="space-y-3">
                {pendingMembers.map(user => (
                  <div key={user.id} className="p-3.5 bg-[#fbf9f4] border border-[#c5a059]/15 rounded-xl flex flex-col md:flex-row items-center gap-4 justify-between">
                    <div className="flex items-center gap-3 w-full md:w-auto text-left">
                      <img 
                        src={user.avatar_url || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80'} 
                        alt="" 
                        className="w-11 h-11 object-cover rounded-full border border-[#c5a059]/30 shadow-sm shrink-0"
                        referrerPolicy="no-referrer"
                      />
                      <div className="min-w-0">
                        <p className="font-bold text-navy-950 uppercase text-xs truncate leading-tight">{user.full_name}</p>
                        <p className="text-[9.5px] text-rose-600 font-mono font-bold uppercase mt-0.5">ROLE: {user.role}</p>
                        <p className="text-[9px] text-navy-500 font-mono mt-0.5 truncate uppercase">
                          {user.chapter || 'No Chapter'} &bull; {user.batch || 'No Batch'} &bull; {user.phone || 'No Phone'}
                        </p>
                      </div>
                    </div>

                    <div className="flex gap-2 w-full md:w-auto justify-end">
                      <button
                        onClick={() => onRejectMember(user.id)}
                        className="px-3.5 py-2 hover:bg-rose-50 border border-rose-200 text-rose-600 font-bold uppercase tracking-wider rounded-lg transition-colors flex items-center gap-1 cursor-pointer"
                      >
                        <X className="w-3.5 h-3.5" />
                        Reject
                      </button>
                      <button
                        onClick={() => onApproveMember(user.id)}
                        className="px-4 py-2 bg-navy-950 hover:bg-navy-900 text-gold-500 font-bold uppercase tracking-wider rounded-lg shadow-sm transition-colors flex items-center gap-1 cursor-pointer"
                      >
                        <Check className="w-3.5 h-3.5 text-gold-500" />
                        Seal Registry
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="py-12 text-center text-navy-400">
                <UserCheck className="w-12 h-12 text-[#c5a059]/20 mx-auto mb-2" />
                <p className="font-bold uppercase text-xs text-navy-950">No Pending Applications</p>
                <p className="text-[10px] text-navy-400 mt-0.5">The chapter registry ledger is fully processed.</p>
              </div>
            )}
          </div>
        )}

        {/* =======================================
            ROSTER DIRECTORY SECTION
            ======================================= */}
        {adminSection === 'roster' && (
          <div className="space-y-4">
            <h4 className="font-serif font-black text-navy-950 uppercase tracking-wider text-[11px] border-b border-navy-950/5 pb-2">
              Sealed Fraternity & Sorority Members ({activeMembers.length})
            </h4>

            <div className="space-y-2.5 max-h-[500px] overflow-y-auto pr-1">
              {activeMembers.map(user => (
                <div key={user.id} className="p-3 bg-white border border-navy-950/5 rounded-xl flex items-center justify-between gap-4">
                  <div className="flex items-center gap-3 text-left min-w-0">
                    <img 
                      src={user.avatar_url || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80'} 
                      alt="" 
                      className="w-9 h-9 rounded-full object-cover border border-navy-950/10 shrink-0"
                      referrerPolicy="no-referrer"
                    />
                    <div className="min-w-0">
                      <div className="flex items-center gap-1.5 leading-tight">
                        <p className="font-bold text-navy-950 text-xs truncate uppercase">{user.full_name}</p>
                        <span className="text-[8px] font-mono font-bold uppercase tracking-wider bg-[#fbf9f4] border border-[#c5a059]/20 text-[#c5a059] px-1 rounded">
                          {user.role}
                        </span>
                      </div>
                      <p className="text-[9px] text-navy-400 mt-0.5 truncate uppercase">
                        STATUS: <span className="font-mono text-gold-600 font-bold">{user.status}</span> &bull; {user.chapter || 'No Chapter'} &bull; {user.batch || 'No Batch'}
                      </p>
                    </div>
                  </div>

                  <div className="flex gap-1.5 shrink-0">
                    <button
                      onClick={() => onSuspendMember(user.id)}
                      title="Suspend Access"
                      className="p-1.5 hover:bg-amber-50 border border-amber-200 text-amber-700 rounded-md transition-colors cursor-pointer"
                    >
                      <UserMinus className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={() => onDeleteMember(user.id)}
                      title="Delete Registry"
                      className="p-1.5 hover:bg-rose-50 border border-rose-200 text-rose-600 rounded-md transition-colors cursor-pointer"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* =======================================
            ANNONS EDITOR SECTION
            ======================================= */}
        {adminSection === 'announcements' && (
          <div className="space-y-4">
            <h4 className="font-serif font-black text-navy-950 uppercase tracking-wider text-[11px] border-b border-navy-950/5 pb-2">
              Broadcast Official Directives
            </h4>

            <form onSubmit={handleCreateAnnouncement} className="space-y-3 max-w-lg">
              <div>
                <label className="block text-[9px] font-bold text-navy-950 uppercase tracking-widest mb-1">
                  Bulletin Title
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Chapter Assembly Mandate"
                  value={annTitle}
                  onChange={(e) => setAnnTitle(e.target.value)}
                  className="w-full p-2.5 rounded-lg border border-navy-950/15 focus:outline-none focus:ring-1 focus:ring-gold-500 bg-white text-navy-950 font-sans"
                />
              </div>

              <div>
                <label className="block text-[9px] font-bold text-navy-950 uppercase tracking-widest mb-1">
                  Directive Body Content
                </label>
                <textarea
                  required
                  placeholder="Enter high level private directives for the fraternity and sorority..."
                  value={annContent}
                  onChange={(e) => setAnnContent(e.target.value)}
                  rows={4}
                  className="w-full p-2.5 rounded-lg border border-navy-950/15 focus:outline-none focus:ring-1 focus:ring-gold-500 bg-white text-navy-950 font-sans resize-none"
                />
              </div>

              <div className="flex items-center gap-2">
                <input
                  id="pin_ann"
                  type="checkbox"
                  checked={annPinned}
                  onChange={(e) => setAnnPinned(e.target.checked)}
                  className="rounded text-[#c5a059] focus:ring-gold-500"
                />
                <label htmlFor="pin_ann" className="text-[10px] font-bold text-navy-900 uppercase tracking-widest cursor-pointer select-none">
                  Pin announcement to top of feed
                </label>
              </div>

              <button
                type="submit"
                className="px-5 py-2.5 bg-navy-950 hover:bg-navy-900 text-gold-500 text-[10px] font-bold uppercase tracking-widest rounded-lg transition-colors cursor-pointer"
              >
                Publish Directive
              </button>
            </form>

            <div className="pt-4 border-t border-navy-950/5 space-y-2">
              <p className="font-bold uppercase tracking-wider text-[10px] text-navy-950">Active Bulletins Registry ({announcements.length})</p>
              <div className="space-y-2 max-h-[200px] overflow-y-auto">
                {announcements.map(ann => (
                  <div key={ann.id} className="p-2.5 bg-[#fbf9f4] border border-navy-950/5 rounded-lg flex items-center justify-between">
                    <div>
                      <p className="font-bold text-navy-950">{ann.title}</p>
                      <p className="text-[8.5px] text-navy-400 font-mono mt-0.5">
                        BY: {members.find(m => m.id === ann.created_by)?.full_name || 'Administrator'} &bull; {new Date(ann.created_at).toLocaleDateString()}
                      </p>
                    </div>
                    <button
                      onClick={() => onDeleteAnnouncement(ann.id)}
                      className="p-1 hover:bg-rose-50 border border-rose-100 text-rose-500 rounded-md transition-colors"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* =======================================
            EVENTS EDITOR SECTION
            ======================================= */}
        {adminSection === 'events' && (
          <div className="space-y-4">
            <h4 className="font-serif font-black text-navy-950 uppercase tracking-wider text-[11px] border-b border-navy-950/5 pb-2">
              Schedule Private Assemblies
            </h4>

            <form onSubmit={handleCreateEvent} className="space-y-3 max-w-lg">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[9px] font-bold text-navy-950 uppercase tracking-widest mb-1">
                    Assembly Title
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Chapter Banquet"
                    value={evtTitle}
                    onChange={(e) => setEvtTitle(e.target.value)}
                    className="w-full p-2.5 rounded-lg border border-navy-950/15 focus:outline-none focus:ring-1 focus:ring-gold-500 bg-white text-navy-950 font-sans"
                  />
                </div>
                <div>
                  <label className="block text-[9px] font-bold text-navy-950 uppercase tracking-widest mb-1">
                    Date & Time of Assembly
                  </label>
                  <input
                    type="datetime-local"
                    required
                    value={evtDate}
                    onChange={(e) => setEvtDate(e.target.value)}
                    className="w-full p-2.5 rounded-lg border border-navy-950/15 focus:outline-none focus:ring-1 focus:ring-gold-500 bg-white text-navy-950 font-sans"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[9px] font-bold text-navy-950 uppercase tracking-widest mb-1">
                  Physical Location
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Grand Ceremonial Hall"
                  value={evtLocation}
                  onChange={(e) => setEvtLocation(e.target.value)}
                  className="w-full p-2.5 rounded-lg border border-navy-950/15 focus:outline-none focus:ring-1 focus:ring-gold-500 bg-white text-navy-950 font-sans"
                />
              </div>

              <div>
                <label className="block text-[9px] font-bold text-navy-950 uppercase tracking-widest mb-1">
                  Assembly Dossier Details
                </label>
                <textarea
                  placeholder="Enter full information including rites, dress codes, and requirements..."
                  value={evtDesc}
                  onChange={(e) => setEvtDesc(e.target.value)}
                  rows={3}
                  className="w-full p-2.5 rounded-lg border border-navy-950/15 focus:outline-none focus:ring-1 focus:ring-gold-500 bg-white text-navy-950 font-sans resize-none"
                />
              </div>

              <button
                type="submit"
                className="px-5 py-2.5 bg-navy-950 hover:bg-navy-900 text-gold-500 text-[10px] font-bold uppercase tracking-widest rounded-lg transition-colors cursor-pointer"
              >
                Schedule Assembly
              </button>
            </form>

            <div className="pt-4 border-t border-navy-950/5 space-y-2">
              <p className="font-bold uppercase tracking-wider text-[10px] text-navy-950">Cataloged Assemblies ({events.length})</p>
              <div className="space-y-2 max-h-[200px] overflow-y-auto">
                {events.map(e => (
                  <div key={e.id} className="p-2.5 bg-[#fbf9f4] border border-navy-950/5 rounded-lg flex items-center justify-between">
                    <div>
                      <p className="font-bold text-navy-950">{e.title}</p>
                      <p className="text-[8.5px] text-navy-400 font-mono mt-0.5">
                        DATE: {e.event_date} &bull; LOC: {e.location} &bull; RSVPS: {e.rsvps?.length || 0}
                      </p>
                    </div>
                    <button
                      onClick={() => onDeleteEvent(e.id)}
                      className="p-1 hover:bg-rose-50 border border-rose-100 text-rose-500 rounded-md transition-colors"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

      </div>

    </div>
  );
}
