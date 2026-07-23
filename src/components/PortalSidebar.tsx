import React, { useState, useEffect } from 'react';
import { User, Landmark, Shield, Calendar, Clock, Volume2, Award, Users, PenSquare, X, CheckCircle, Loader2, AlertCircle } from 'lucide-react';
import { Member, Announcement, Event, getAvatarUrl, DEFAULT_AVATAR } from '../types';
import { dbService } from '../lib/dbService';

interface LeftSidebarProps {
  currentUser: Member;
  onUpdateProfile: (updated: Member) => Promise<void> | void;
}

export function LeftSidebar({ currentUser, onUpdateProfile }: LeftSidebarProps) {
  const [isEditing, setIsEditing] = useState(false);
  
  // Edit Profile States
  const [editName, setEditName] = useState(currentUser.full_name || currentUser.name || '');
  const [editChapter, setEditChapter] = useState(currentUser.chapter || '');
  const [editBatch, setEditBatch] = useState(currentUser.batch || '');
  const [editBio, setEditBio] = useState(currentUser.bio || currentUser.slaveName || '');
  const [editPhone, setEditPhone] = useState(currentUser.phone || '');
  const [editAvatar, setEditAvatar] = useState(currentUser.avatar_url || currentUser.avatarUrl || '');
  
  // File upload and progress states
  const [avatarFile, setAvatarFile] = useState<File | null>(null);
  const [dragActive, setDragActive] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [saveError, setSaveError] = useState<string | null>(null);
  const [progressMsg, setProgressMsg] = useState<string>('');

  // Synchronize local form state with currentUser whenever edit modal opens or currentUser updates
  useEffect(() => {
    if (isEditing) {
      setEditName(currentUser.full_name || currentUser.name || '');
      setEditChapter(currentUser.chapter || '');
      setEditBatch(currentUser.batch || '');
      setEditBio(currentUser.bio || currentUser.slaveName || '');
      setEditPhone(currentUser.phone || '');
      setEditAvatar(currentUser.avatar_url || currentUser.avatarUrl || '');
      setAvatarFile(null);
      setSaveError(null);
      setProgressMsg('');
    }
  }, [isEditing, currentUser]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setAvatarFile(file);
      setSaveError(null);
      const previewUrl = URL.createObjectURL(file);
      setEditAvatar(previewUrl);
    }
  };

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const file = e.dataTransfer.files[0];
      setAvatarFile(file);
      setSaveError(null);
      const previewUrl = URL.createObjectURL(file);
      setEditAvatar(previewUrl);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    setSaveError(null);

    try {
      const finalAvatarUrl = editAvatar || currentUser.avatar_url || currentUser.avatarUrl || DEFAULT_AVATAR;

      // Persist profile fields to Supabase Database
      setProgressMsg('Updating profile ledger in Supabase...');
      const updatedUser: Member = {
        ...currentUser,
        full_name: editName.trim(),
        name: editName.trim(),
        chapter: editChapter.trim(),
        batch: editBatch.trim(),
        bio: editBio.trim(),
        slaveName: editBio.trim(),
        phone: editPhone.trim(),
        avatar_url: finalAvatarUrl,
        avatarUrl: finalAvatarUrl
      };

      await onUpdateProfile(updatedUser);
      setIsEditing(false);
    } catch (err: any) {
      console.error('Profile update failed:', err);
      setSaveError(err?.message || 'Failed to save profile modifications. Please check your network connection.');
    } finally {
      setIsSaving(false);
      setProgressMsg('');
    }
  };

  return (
    <div className="space-y-4">
      {/* 1. Member Profile Card */}
      <div className="bg-white rounded-2xl shadow-sm border border-navy-950/5 overflow-hidden">
        {/* Decorative Golden Background */}
        <div className="h-16 bg-gradient-to-r from-navy-950 via-[#c5a059]/20 to-navy-900 relative">
          <div className="absolute top-2 right-3 px-2 py-0.5 bg-gold-500/90 text-navy-950 text-[8px] font-bold uppercase tracking-widest rounded-full">
            {currentUser.status}
          </div>
        </div>
        
        <div className="px-5 pb-5 text-center relative">
          {/* Avatar frame */}
          <div className="flex justify-center -mt-10 mb-2 relative z-10">
            <div className="p-1 bg-white rounded-full shadow-md border-2 border-[#c5a059]">
              <img 
                src={getAvatarUrl(currentUser.avatar_url || currentUser.avatarUrl)} 
                alt={currentUser.full_name} 
                className="w-16 h-16 rounded-full object-cover"
                referrerPolicy="no-referrer"
              />
            </div>
          </div>

          <h3 className="font-serif font-black text-navy-950 text-base tracking-wide uppercase leading-tight">
            {currentUser.full_name}
          </h3>
          <p className="text-[10px] text-gold-600 font-bold uppercase tracking-wider mt-0.5">
            {currentUser.position || 'Initiate Member'}
          </p>

          <div className="mt-4 pt-3 border-t border-navy-950/5 text-left text-xs space-y-2 text-navy-950/80">
            <div className="flex items-center gap-2">
              <Landmark className="w-3.5 h-3.5 text-navy-400 shrink-0" />
              <span className="truncate"><strong>Chapter:</strong> {currentUser.chapter || 'No Chapter'}</span>
            </div>
            <div className="flex items-center gap-2">
              <Shield className="w-3.5 h-3.5 text-navy-400 shrink-0" />
              <span className="truncate"><strong>Batch:</strong> {currentUser.batch || 'No Batch'}</span>
            </div>
            {currentUser.bio && (
              <div className="flex items-start gap-2">
                <User className="w-3.5 h-3.5 text-navy-400 shrink-0 mt-0.5" />
                <span className="line-clamp-2"><strong>Bio:</strong> {currentUser.bio}</span>
              </div>
            )}
            <div className="flex items-center gap-2">
              <Calendar className="w-3.5 h-3.5 text-navy-400 shrink-0" />
              <span className="truncate"><strong>Joined:</strong> {currentUser.created_at ? new Date(currentUser.created_at).toLocaleDateString() : 'New'}</span>
            </div>
          </div>

          <button
            onClick={() => setIsEditing(true)}
            className="mt-5 w-full py-2 bg-[#fbf9f4] border border-[#c5a059]/30 text-navy-950 hover:bg-[#c5a059]/10 text-[10px] font-bold uppercase tracking-widest rounded-lg transition-colors cursor-pointer flex items-center justify-center gap-1.5"
          >
            <PenSquare className="w-3.5 h-3.5 text-[#c5a059]" />
            Edit Chapter Profile
          </button>
        </div>
      </div>

      {/* 2. Edit Profile Modal */}
      {isEditing && (
        <div className="fixed inset-0 bg-navy-950/60 backdrop-blur-sm flex items-center justify-center p-4 z-50 animate-fade-in font-sans">
          <div className="bg-white rounded-2xl shadow-2xl border border-[#c5a059]/20 w-full max-w-md overflow-hidden relative">
            <div className="absolute top-0 left-0 right-0 h-1 bg-[#c5a059]"></div>
            
            <div className="flex items-center justify-between p-4 border-b border-navy-950/5">
              <h3 className="font-serif font-black text-navy-950 text-sm uppercase tracking-wide">
                Modify Registry Ledger
              </h3>
              <button 
                onClick={() => setIsEditing(false)}
                className="p-1 rounded-full text-navy-400 hover:text-navy-950 transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-5 space-y-3.5 text-xs max-h-[80vh] overflow-y-auto">
              {/* Error Notification Banner */}
              {saveError && (
                <div className="p-3 bg-rose-50 border border-rose-200 rounded-xl text-rose-800 text-xs flex items-start gap-2.5 animate-shake">
                  <AlertCircle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
                  <div className="flex-1">
                    <p className="font-bold text-[10px] uppercase tracking-wider">Save Failed</p>
                    <p className="text-[11px] leading-tight mt-0.5">{saveError}</p>
                  </div>
                  <button type="button" onClick={() => setSaveError(null)} className="text-rose-500 hover:text-rose-800">
                    <X className="w-3.5 h-3.5" />
                  </button>
                </div>
              )}

              {/* Progress Indicator */}
              {isSaving && (
                <div className="p-3 bg-gold-50/50 border border-[#c5a059]/30 rounded-xl text-navy-950 text-xs flex items-center gap-2.5">
                  <Loader2 className="w-4 h-4 text-[#c5a059] animate-spin shrink-0" />
                  <span className="font-medium text-[11px]">{progressMsg || 'Saving profile updates...'}</span>
                </div>
              )}

              <div>
                <label className="block text-[9px] font-bold text-navy-950 uppercase tracking-widest mb-1">
                  Full Name
                </label>
                <input
                  type="text"
                  required
                  disabled={isSaving}
                  value={editName}
                  onChange={(e) => setEditName(e.target.value)}
                  className="w-full p-2.5 rounded-lg border border-navy-950/15 focus:outline-none focus:ring-1 focus:ring-gold-500 bg-white text-navy-950 font-sans disabled:opacity-50"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[9px] font-bold text-navy-950 uppercase tracking-widest mb-1">
                    Chapter Name
                  </label>
                  <input
                    type="text"
                    required
                    disabled={isSaving}
                    value={editChapter}
                    onChange={(e) => setEditChapter(e.target.value)}
                    className="w-full p-2.5 rounded-lg border border-navy-950/15 focus:outline-none focus:ring-1 focus:ring-gold-500 bg-white text-navy-950 font-sans disabled:opacity-50"
                  />
                </div>
                <div>
                  <label className="block text-[9px] font-bold text-navy-950 uppercase tracking-widest mb-1">
                    Batch Class
                  </label>
                  <input
                    type="text"
                    required
                    disabled={isSaving}
                    value={editBatch}
                    onChange={(e) => setEditBatch(e.target.value)}
                    className="w-full p-2.5 rounded-lg border border-navy-950/15 focus:outline-none focus:ring-1 focus:ring-gold-500 bg-white text-navy-950 font-sans disabled:opacity-50"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[9px] font-bold text-navy-950 uppercase tracking-widest mb-1">
                    Short Bio / Quote
                  </label>
                  <input
                    type="text"
                    required
                    disabled={isSaving}
                    value={editBio}
                    onChange={(e) => setEditBio(e.target.value)}
                    className="w-full p-2.5 rounded-lg border border-navy-950/15 focus:outline-none focus:ring-1 focus:ring-gold-500 bg-white text-navy-950 font-sans disabled:opacity-50"
                  />
                </div>
                <div>
                  <label className="block text-[9px] font-bold text-navy-950 uppercase tracking-widest mb-1">
                    Contact Phone
                  </label>
                  <input
                    type="tel"
                    required
                    disabled={isSaving}
                    value={editPhone}
                    onChange={(e) => setEditPhone(e.target.value)}
                    className="w-full p-2.5 rounded-lg border border-navy-950/15 focus:outline-none focus:ring-1 focus:ring-gold-500 bg-white text-navy-950 font-sans disabled:opacity-50"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[9px] font-bold text-navy-950 uppercase tracking-widest mb-1">
                  Profile Avatar
                </label>
                <div className="flex items-center gap-3.5 p-3 bg-[#fbf9f4] border border-[#c5a059]/30 rounded-lg">
                  <img 
                    src={getAvatarUrl(editAvatar || currentUser.avatar_url || currentUser.avatarUrl)} 
                    alt="Member Avatar" 
                    className="w-12 h-12 rounded-full object-cover border-2 border-[#c5a059] shrink-0"
                    referrerPolicy="no-referrer"
                  />
                  <div>
                    <p className="text-[10px] font-bold text-navy-950 uppercase tracking-wider">
                      Standard Identity Avatar Active
                    </p>
                    <p className="text-[9px] text-navy-500 leading-tight mt-0.5">
                      Custom profile picture uploads are deferred for Release v0.7.0. All members use standard chapter avatars.
                    </p>
                  </div>
                </div>
              </div>

              <div className="flex items-center justify-end gap-3 pt-3 border-t border-navy-950/5">
                <button
                  type="button"
                  disabled={isSaving}
                  onClick={() => setIsEditing(false)}
                  className="px-5 py-2 border border-navy-950/10 text-navy-950 text-[10px] font-bold uppercase tracking-widest rounded-lg hover:bg-navy-50 transition-colors disabled:opacity-50"
                >
                  Dismiss
                </button>
                <button
                  type="submit"
                  disabled={isSaving}
                  className="px-6 py-2 bg-navy-950 text-gold-500 text-[10px] font-bold uppercase tracking-widest rounded-lg hover:bg-navy-900 transition-colors flex items-center gap-2 disabled:opacity-50"
                >
                  {isSaving && <Loader2 className="w-3.5 h-3.5 animate-spin" />}
                  {isSaving ? 'Saving...' : 'Save Profile'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

interface RightSidebarProps {
  announcements: Announcement[];
  events: Event[];
  members: Member[];
  onRsvp: (eventId: string) => void;
  currentUser: Member;
  onNavigateTab: (tab: string) => void;
}

export function RightSidebar({ announcements, events, members, onRsvp, currentUser, onNavigateTab }: RightSidebarProps) {
  // 1. Announcements filter (pinned first, limit to 3)
  const displayAnns = [...announcements].sort((a, b) => {
    if (a.is_pinned && !b.is_pinned) return -1;
    if (!a.is_pinned && b.is_pinned) return 1;
    return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
  }).slice(0, 3);

  // 2. Events filter (upcoming, limit to 3)
  const displayEvents = [...events].filter(e => new Date(e.event_date).getTime() >= new Date().setHours(0,0,0,0)).slice(0, 3);

  // 3. Newly approved (Active members sorted by created_at desc, limit 3)
  const newlyApproved = [...members]
    .filter(m => m.status !== 'Pending')
    .sort((a, b) => new Date(b.created_at || '').getTime() - new Date(a.created_at || '').getTime())
    .slice(0, 3);

  // 4. Online members (simulated: all approved members)
  const onlineMembers = members.filter(m => m.status !== 'Pending');

  return (
    <div className="space-y-4 font-sans text-xs">
      
      {/* Announcements Panel */}
      <div className="bg-white rounded-2xl shadow-sm border border-navy-950/5 p-4">
        <div className="flex items-center justify-between mb-3 pb-2 border-b border-navy-950/5">
          <h4 className="font-serif font-black text-navy-950 uppercase tracking-wider text-[11px] flex items-center gap-1.5">
            <Volume2 className="w-4 h-4 text-gold-600 animate-pulse" />
            Directives & Bulletins
          </h4>
          <button 
            onClick={() => onNavigateTab('announcements')} 
            className="text-[9px] text-[#c5a059] font-bold uppercase hover:underline"
          >
            All
          </button>
        </div>
        
        {displayAnns.length > 0 ? (
          <div className="space-y-2.5">
            {displayAnns.map(ann => (
              <div 
                key={ann.id} 
                className={`p-2.5 rounded-xl border transition-all ${
                  ann.is_pinned 
                    ? 'bg-amber-50/50 border-amber-200/60' 
                    : 'bg-white hover:bg-navy-50/30 border-navy-950/5'
                }`}
              >
                <div className="flex items-center justify-between gap-1 mb-1">
                  <span className="font-bold text-navy-950 text-[10.5px] truncate block max-w-[150px]">
                    {ann.title}
                  </span>
                  {ann.is_pinned && (
                    <span className="px-1.5 py-0.5 bg-amber-100 text-amber-800 text-[8px] font-bold tracking-wider uppercase rounded">
                      Pinned
                    </span>
                  )}
                </div>
                <p className="text-[10px] text-navy-500 line-clamp-2 leading-relaxed mb-1.5">
                  {ann.content}
                </p>
                <div className="flex items-center gap-1.5 text-[8.5px] text-navy-400 font-mono">
                  <span className="font-bold">{members.find(m => m.id === ann.created_by)?.full_name || 'Administrator'}</span>
                  <span>&bull;</span>
                  <span>{new Date(ann.created_at).toLocaleDateString(undefined, {month: 'short', day: 'numeric'})}</span>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-[10px] text-navy-400 py-4 text-center italic">No immediate bulletins published.</p>
        )}
      </div>

      {/* Upcoming Events Panel */}
      <div className="bg-white rounded-2xl shadow-sm border border-navy-950/5 p-4">
        <div className="flex items-center justify-between mb-3 pb-2 border-b border-navy-950/5">
          <h4 className="font-serif font-black text-navy-950 uppercase tracking-wider text-[11px] flex items-center gap-1.5">
            <Calendar className="w-4 h-4 text-[#c5a059]" />
            Upcoming Assemblies
          </h4>
          <button 
            onClick={() => onNavigateTab('events')} 
            className="text-[9px] text-[#c5a059] font-bold uppercase hover:underline"
          >
            Calendar
          </button>
        </div>

        {displayEvents.length > 0 ? (
          <div className="space-y-3">
            {displayEvents.map(e => {
              const isRsvpd = (e.rsvps || []).includes(currentUser.id);
              return (
                <div key={e.id} className="flex gap-2.5 items-start p-1 hover:bg-navy-50/20 rounded-xl transition-colors">
                  {/* Calendar badge */}
                  <div className="w-10 h-11 bg-[#fbf9f4] border border-[#c5a059]/20 flex flex-col items-center justify-center rounded-lg shadow-sm shrink-0">
                    <span className="text-[7.5px] font-bold text-[#c5a059] uppercase tracking-wider">
                      {new Date(e.event_date).toLocaleDateString(undefined, {month: 'short'})}
                    </span>
                    <span className="text-sm font-serif font-black text-navy-950 -mt-0.5">
                      {new Date(e.event_date).getDate()}
                    </span>
                  </div>

                  <div className="flex-1 min-w-0">
                    <p className="font-bold text-navy-950 text-[10.5px] truncate leading-tight">{e.title}</p>
                    <div className="flex items-center gap-1.5 text-[8.5px] text-navy-400 font-mono mt-0.5">
                      <Clock className="w-2.5 h-2.5 text-navy-400 shrink-0" />
                      <span>{new Date(e.event_date).toLocaleTimeString(undefined, {hour: '2-digit', minute:'2-digit'})}</span>
                      <span>&bull;</span>
                      <span className="truncate max-w-[80px]">{e.location}</span>
                    </div>

                    <div className="flex items-center justify-between gap-2 mt-1.5">
                      <span className="text-[9px] text-navy-400 font-mono font-bold uppercase">
                        {e.rsvps?.length || 0} RSVP'd
                      </span>
                      <button
                        onClick={() => onRsvp(e.id)}
                        className={`px-2.5 py-1 text-[8.5px] font-bold uppercase tracking-wider rounded transition-all cursor-pointer ${
                          isRsvpd 
                            ? 'bg-emerald-50 border border-emerald-200 text-emerald-700' 
                            : 'bg-navy-950 text-gold-500 hover:bg-navy-900 shadow-sm'
                        }`}
                      >
                        {isRsvpd ? 'Going ✓' : 'Join'}
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <p className="text-[10px] text-navy-400 py-4 text-center italic">No upcoming assemblies.</p>
        )}
      </div>

      {/* Newly Approved Members Widget */}
      <div className="bg-white rounded-2xl shadow-sm border border-navy-950/5 p-4">
        <h4 className="font-serif font-black text-navy-950 uppercase tracking-wider text-[11px] flex items-center gap-1.5 mb-2.5 pb-2 border-b border-navy-950/5">
          <Users className="w-4 h-4 text-[#c5a059]" />
          Newly Sealed Members
        </h4>

        {newlyApproved.length > 0 ? (
          <div className="space-y-2.5">
            {newlyApproved.map(mem => (
              <div key={mem.id} className="flex items-center gap-2.5 p-1">
                <img 
                  src={mem.avatar_url || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80'} 
                  alt="" 
                  className="w-7 h-7 rounded-full object-cover border border-navy-950/15 shadow-sm"
                  referrerPolicy="no-referrer"
                />
                <div className="flex-1 min-w-0">
                  <p className="font-bold text-navy-950 text-[10.5px] truncate leading-tight">{mem.full_name}</p>
                  <p className="text-[8.5px] text-navy-400 font-mono uppercase truncate tracking-wider">
                    {mem.chapter || 'No Chapter'} &bull; {mem.batch || 'No Batch'}
                  </p>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-[10px] text-navy-400 py-2.5 text-center italic">No new registries.</p>
        )}
      </div>

      {/* Online Members Widget */}
      <div className="bg-white rounded-2xl shadow-sm border border-navy-950/5 p-4">
        <h4 className="font-serif font-black text-navy-950 uppercase tracking-wider text-[11px] flex items-center gap-1.5 mb-2 pb-2 border-b border-navy-950/5">
          <span className="flex h-2.5 w-2.5 relative">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500"></span>
          </span>
          Active in Portal ({onlineMembers.length})
        </h4>

        {onlineMembers.length > 0 ? (
          <div className="grid grid-cols-5 gap-2 pt-1.5">
            {onlineMembers.map(mem => (
              <div key={mem.id} className="relative group flex justify-center">
                <div className="relative">
                  <img 
                    src={mem.avatar_url || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80'} 
                    alt={mem.full_name} 
                    className="w-8 h-8 rounded-full object-cover border border-white ring-1 ring-emerald-500 shadow-md cursor-pointer hover:scale-105 transition-transform"
                    referrerPolicy="no-referrer"
                  />
                  <div className="absolute bottom-0 right-0 h-2 w-2 rounded-full bg-emerald-500 ring-1 ring-white"></div>
                </div>
                {/* Tooltip */}
                <div className="absolute bottom-full mb-1.5 hidden group-hover:block bg-navy-950 text-white text-[8px] uppercase tracking-widest font-bold px-2 py-1 rounded-md whitespace-nowrap z-30 shadow-xl border border-[#c5a059]/20 font-mono">
                  {mem.full_name.split(' ')[0]}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-[10px] text-navy-400 py-2 text-center italic">Everyone is offline.</p>
        )}
      </div>

    </div>
  );
}
