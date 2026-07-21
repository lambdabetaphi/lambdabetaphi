import React, { useState, useEffect } from 'react';
import { 
  Shield, Lock, User, Mail, Search, Award, CheckCircle, MessageSquare, Send, 
  Phone, MapPin, Crown, Settings, Trash2, Plus, X, Upload, Image, Bell, BookOpen, 
  Users, FolderOpen, Calendar, Volume2, LogOut, ChevronRight, Menu, HelpCircle, 
  Activity, Clock, Compass, Info, AlertCircle, ExternalLink, Database, Copy
} from 'lucide-react';

import { Member, Post, Comment, Announcement, Event, Notification, GalleryItem } from '../types';
import { dbService } from '../lib/dbService';
import CrestLogo from './CrestLogo';

// Sub-components import
import PortalAuth, { PendingScreen, SuspendedScreen } from './PortalAuth';
import { LeftSidebar } from './PortalSidebar';
import { AppLayout, PortalTab, RightSidebar } from './layout';
import { PortalFeed, getRelativeTime } from './feed';
import { PortalDirectory } from './directory';
import { PortalGallery } from './gallery';
import { PortalEvents } from './events';
import PortalAdmin from './PortalAdmin';

interface MemberPortalProps {
  members: Member[];
  currentUser: Member | null;
  onLogin: (email: string, password?: string) => boolean | Promise<boolean>;
  onLogout: () => void;
  onRegister: (newMember: Omit<Member, 'id' | 'joinsDate'>, password?: string) => void;
  onUpdateMembers?: (updatedMembers: Member[]) => void;
  onNavigateToPublic?: () => void;
}

export default function MemberPortal({
  members: initialMembers,
  currentUser: initialUser,
  onLogin,
  onLogout,
  onRegister,
  onUpdateMembers,
  onNavigateToPublic
}: MemberPortalProps) {

  // Global Portal active Navigation Tab
  // Options: 'home' | 'directory' | 'gallery' | 'events' | 'announcements' | 'officers' | 'notifications' | 'profile' | 'settings' | 'admin'
  const [activeTab, setActiveTab] = useState<PortalTab>('home');

  // Unified UI States
  const [posts, setPosts] = useState<Post[]>([]);
  const [comments, setComments] = useState<Comment[]>([]);
  const [announcements, setAnnouncements] = useState<Announcement[]>([]);
  const [events, setEvents] = useState<Event[]>([]);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [gallery, setGallery] = useState<GalleryItem[]>([]);
  const [localMembers, setLocalMembers] = useState<Member[]>(initialMembers);
  const [currentUser, setCurrentUser] = useState<Member | null>(initialUser);

  // Layout states
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [notifDrawerOpen, setNotifDrawerOpen] = useState(false);
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'info' | 'error' } | null>(null);

  // Live Supabase Diagnostics & Provision States
  const [tableStatuses, setTableStatuses] = useState<Record<string, boolean>>({});
  const [isCheckingTables, setIsCheckingTables] = useState(false);
  const [isProvisioning, setIsProvisioning] = useState(false);
  const [provisionError, setProvisionError] = useState<string | null>(null);

  const handleCheckTables = async () => {
    setIsCheckingTables(true);
    try {
      const statuses = await dbService.checkAllTables();
      setTableStatuses(statuses);
    } catch (e) {
      console.error('Error diagnostic tables:', e);
    } finally {
      setIsCheckingTables(false);
    }
  };

  useEffect(() => {
    if (activeTab === 'settings') {
      handleCheckTables();
    }
  }, [activeTab]);

  // Synchronize state with initial props
  useEffect(() => {
    setCurrentUser(initialUser);
  }, [initialUser]);

  useEffect(() => {
    if (initialMembers && initialMembers.length > 0) {
      setLocalMembers(initialMembers);
    }
  }, [initialMembers]);

  // Load community registry items on mount / session change
  useEffect(() => {
    if (currentUser && currentUser.role !== 'Pending') {
      loadAllDatabaseStates();
    }
  }, [currentUser]);

  const loadAllDatabaseStates = async () => {
    try {
      const dbMembers = await dbService.getMembers();
      setLocalMembers(dbMembers);
      
      const dbPosts = await dbService.getPosts();
      setPosts(dbPosts);

      const dbComments = await dbService.getComments();
      setComments(dbComments);

      const dbAnns = await dbService.getAnnouncements();
      setAnnouncements(dbAnns);

      const dbEvents = await dbService.getEvents();
      setEvents(dbEvents);

      const dbNotifs = await dbService.getNotifications();
      setNotifications(dbNotifs);

      const dbGallery = await dbService.getGalleryItems();
      setGallery(dbGallery);
    } catch (e) {
      console.warn('Error fetching unified database states:', e);
    }
  };

  const showToast = (message: string, type: 'success' | 'info' | 'error' = 'success') => {
    setToast({ message, type });
    setTimeout(() => {
      setToast(null);
    }, 4000);
  };

  // Safe Member update helper
  const updateMembersState = async (updated: Member[]) => {
    setLocalMembers(updated);
    if (onUpdateMembers) {
      onUpdateMembers(updated);
    }
    await dbService.saveMembers(updated);
  };

  // ==========================================
  // User Profile Modifier Action
  // ==========================================
  const handleUpdateProfile = async (updatedUser: Member) => {
    try {
      const updated = await dbService.updateMemberProfile(updatedUser);
      setCurrentUser(updated);
      const listUpdated = localMembers.map(m => m.id === updated.id ? updated : m);
      await updateMembersState(listUpdated);
      showToast('Dossier profile details updated in sovereign ledger.', 'success');
    } catch (e) {
      showToast('Failed to modify your profile registry.', 'error');
    }
  };

  // ==========================================
  // Timeline Actions
  // ==========================================
  const handleAddPost = async (content: string, images: string[]) => {
    if (!currentUser) return;
    try {
      const newPost = await dbService.createPost({
        member_id: currentUser.id,
        content,
        images
      });

      // Stagger feed additions
      setPosts(prev => [newPost, ...prev]);
      showToast('Notice broadcasted to the private community feed!', 'success');
      
      // Refresh notifications dynamically
      const dbNotifs = await dbService.getNotifications();
      setNotifications(dbNotifs);
    } catch (e) {
      showToast('Could not record your post on the server timeline.', 'error');
    }
  };

  const handleLikePost = async (postId: string) => {
    if (!currentUser) return;
    try {
      const updatedPost = await dbService.toggleLikePost(postId, currentUser.id);
      if (updatedPost) {
        setPosts(prev => prev.map(p => p.id === postId ? updatedPost : p));
      }
    } catch (e) {
      showToast('Like operation encountered an issue.', 'error');
    }
  };

  const handleAddComment = async (postId: string, content: string) => {
    if (!currentUser) return;
    try {
      const newComment = await dbService.addComment({
        post_id: postId,
        member_id: currentUser.id,
        comment: content
      });

      setComments(prev => [...prev, newComment]);
    } catch (e) {
      showToast('Could not record your comment.', 'error');
    }
  };

  // ==========================================
  // Executive Suite Admin Control Actions
  // ==========================================
  const handleApproveMember = async (id: string) => {
    try {
      const target = localMembers.find(m => m.id === id);
      if (!target) return;

      const updated = {
        ...target,
        role: 'Member' as const,
        status: 'Approved' as const
      };

      const updatedList = localMembers.map(m => m.id === id ? updated : m);
      await updateMembersState(updatedList);

      // Create confirmation notification
      await dbService.createNotification({
        member_id: updated.id,
        title: 'Registry Sealed',
        message: `Applicant ${updated.full_name} has been officially verified and admitted.`,
      });

      showToast(`Approved applicant ${updated.full_name}. Welcome to the registry!`, 'success');
      
      // Reload states
      const dbNotifs = await dbService.getNotifications();
      setNotifications(dbNotifs);
    } catch (e) {
      showToast('Admin approval failed.', 'error');
    }
  };

  const handleRejectMember = async (id: string) => {
    try {
      const updatedList = localMembers.filter(m => m.id !== id);
      await updateMembersState(updatedList);
      showToast('Applicant registration deleted completely from the registry.', 'info');
    } catch (e) {
      showToast('Admin rejection failed.', 'error');
    }
  };

  const handleSuspendMember = async (id: string) => {
    try {
      const target = localMembers.find(m => m.id === id);
      if (!target) return;

      const updated = {
        ...target,
        status: 'Suspended' as const
      };

      const updatedList = localMembers.map(m => m.id === id ? updated : m);
      await updateMembersState(updatedList);
      showToast(`Suspended active access for member ${target.full_name}.`, 'info');
    } catch (e) {
      showToast('Admin suspension failed.', 'error');
    }
  };

  const handleDeleteMember = async (id: string) => {
    try {
      const updatedList = localMembers.filter(m => m.id !== id);
      await updateMembersState(updatedList);
      showToast('Member removed completely from the sovereign registry.', 'info');
    } catch (e) {
      showToast('Admin deletion failed.', 'error');
    }
  };

  const handleAddAnnouncement = async (title: string, content: string, isPinned: boolean) => {
    if (!currentUser) return;
    try {
      const newAnn = await dbService.createAnnouncement({
        title,
        content,
        created_by: currentUser.id,
        is_pinned: isPinned
      });

      setAnnouncements(prev => [newAnn, ...prev]);
      
      // Refresh notifications dynamically
      const dbNotifs = await dbService.getNotifications();
      setNotifications(dbNotifs);
    } catch (e) {
      showToast('Could not register bulletin announcement.', 'error');
    }
  };

  const handleDeleteAnnouncement = async (id: string) => {
    try {
      await dbService.deleteAnnouncement(id);
      setAnnouncements(prev => prev.filter(a => a.id !== id));
      showToast('Announcement bulletin deleted.', 'info');
    } catch (e) {
      showToast('Could not delete announcement.', 'error');
    }
  };

  const handleAddEvent = async (evt: { title: string; event_date: string; location: string; description: string }) => {
    if (!currentUser) return;
    try {
      const newEvt = await dbService.createEvent({
        title: evt.title,
        description: evt.description,
        location: evt.location,
        event_date: evt.event_date,
        created_by: currentUser.id
      });

      setEvents(prev => [...prev, newEvt]);
      
      // Refresh notifications dynamically
      const dbNotifs = await dbService.getNotifications();
      setNotifications(dbNotifs);
    } catch (e) {
      showToast('Could not create calendar event.', 'error');
    }
  };

  const handleDeleteEvent = async (id: string) => {
    try {
      await dbService.deleteEvent(id);
      setEvents(prev => prev.filter(e => e.id !== id));
      showToast('Assembly canceled and deleted from registry.', 'info');
    } catch (e) {
      showToast('Could not delete event.', 'error');
    }
  };

  // ==========================================
  // Assembly RSVP Actions
  // ==========================================
  const handleRsvpEvent = async (eventId: string) => {
    if (!currentUser) return;
    try {
      const updatedEvt = await dbService.rsvpEvent(eventId, currentUser.id);
      if (updatedEvt) {
        setEvents(prev => prev.map(e => e.id === eventId ? updatedEvt : e));
        const isJoining = updatedEvt.rsvps.includes(currentUser.id);
        showToast(
          isJoining 
            ? 'Ticket secured! Assembly RSVP recorded successfully.' 
            : 'Your assembly RSVP has been retracted.', 
          isJoining ? 'success' : 'info'
        );
      }
    } catch (e) {
      showToast('RSVP action encountered an issue.', 'error');
    }
  };

  // ==========================================
  // Gallery Archive Actions
  // ==========================================
  const handleAddGalleryItem = async (item: Omit<GalleryItem, 'id' | 'created_at'>) => {
    try {
      const newItem = await dbService.uploadGalleryItem(item);
      setGallery(prev => [newItem, ...prev]);
    } catch (e) {
      showToast('Could not upload image asset.', 'error');
    }
  };

  // ==========================================
  // Notification Managers
  // ==========================================
  const handleMarkNotifRead = async (id: string) => {
    try {
      await dbService.markNotificationRead(id);
      setNotifications(prev => prev.map(n => n.id === id ? { ...n, is_read: true } : n));
    } catch (e) {
      console.warn('Could not read notification.');
    }
  };

  const handleClearNotifications = async () => {
    try {
      await dbService.clearAllNotifications();
      setNotifications([]);
      showToast('Notifications registry cleared.', 'success');
    } catch (e) {
      console.warn('Could not clear notifications.');
    }
  };

  // ==========================================
  // Security Authentication Filter Gates
  // ==========================================
  if (!currentUser) {
    return (
      <PortalAuth 
        onLogin={onLogin} 
        onRegister={onRegister} 
        isSupabaseConfigured={dbService !== undefined} 
      />
    );
  }

  if (currentUser.status === 'Pending') {
    return (
      <PendingScreen 
        user={currentUser} 
        onLogout={onLogout} 
      />
    );
  }

  if (currentUser.status === 'Suspended') {
    return (
      <SuspendedScreen 
        onLogout={onLogout} 
      />
    );
  }

  // ==========================================
  // Left Navigation Menu Setup
  // ==========================================
  const navItems = [
    { id: 'home', label: 'News Feed', icon: Compass },
    { id: 'directory', label: 'Members Directory', icon: Users },
    { id: 'gallery', label: 'Media Gallery', icon: FolderOpen },
    { id: 'events', label: ' assemblies & Calendar', icon: Calendar },
    { id: 'announcements', label: 'Directives Board', icon: Volume2 },
    { id: 'officers', label: 'Executive Board', icon: Crown },
    { id: 'notifications', label: 'System alerts', icon: Bell, badge: notifications.filter(n => !n.is_read).length },
    { id: 'profile', label: 'Personal Dossier', icon: User },
    { id: 'settings', label: 'Settings & Cloud', icon: Settings },
  ];

  // Include admin control view button for executive roles
  if (currentUser.role === 'Admin') {
    navItems.push({ id: 'admin', label: 'Executive Admin', icon: Shield });
  }

  // Count unread notifications
  const unreadNotifs = notifications.filter(n => !n.is_read);

  return (
    <>
      <AppLayout
        activeTab={activeTab}
        onTabChange={(tab) => {
          setActiveTab(tab);
          setMobileMenuOpen(false);
        }}
        currentUser={currentUser}
        notifications={notifications}
        onMarkNotificationRead={handleMarkNotifRead}
        onClearNotifications={handleClearNotifications}
        onLogout={onLogout}
        onNavigateToPublic={onNavigateToPublic}
        onMobileMenuToggle={() => setMobileMenuOpen(!mobileMenuOpen)}
        mobileMenuOpen={mobileMenuOpen}
        onMobileMenuClose={() => setMobileMenuOpen(false)}
      >
        {/* NEWS FEED / PORTAL HOME (3-column layout) */}
        {activeTab === 'home' && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-start">
            
            {/* Left sidebar: Member Profile card */}
            <div className="col-span-1 lg:col-span-3 xl:col-span-3">
              <LeftSidebar 
                currentUser={currentUser!} 
                onUpdateProfile={handleUpdateProfile} 
              />
            </div>

            {/* Middle center: Timeline feed */}
            <div className="col-span-1 lg:col-span-6 xl:col-span-6">
              <PortalFeed
                currentUser={currentUser!}
                posts={posts}
                comments={comments}
                onAddPost={handleAddPost}
                onLikePost={handleLikePost}
                onAddComment={handleAddComment}
                showToast={showToast}
              />
            </div>

            {/* Right sidebar: Directives, events */}
            <div className="col-span-1 lg:col-span-3 xl:col-span-3 text-left">
              <RightSidebar 
                announcements={announcements} 
                events={events} 
                membersCount={localMembers.filter(m => m.status !== 'Pending').length}
                chaptersCount={Array.from(new Set(localMembers.map(m => m.chapter).filter(Boolean))).length || 3}
                onTabChange={(tab) => {
                  setActiveTab(tab);
                }}
                onCreatePostClick={() => {
                  setActiveTab('home');
                }}
              />
            </div>

          </div>
        )}

          {/* MEMBERS DIRECTORY */}
          {activeTab === 'directory' && (
            <PortalDirectory 
              members={localMembers} 
              currentUser={currentUser} 
            />
          )}

          {/* DIGITAL MEDIA GALLERY */}
          {activeTab === 'gallery' && (
            <PortalGallery
              gallery={gallery}
              currentUser={currentUser}
              onAddGalleryItem={handleAddGalleryItem}
              showToast={showToast}
            />
          )}

          {/* EVENTS & ASSEMBLIES */}
          {activeTab === 'events' && (
            <PortalEvents
              events={events}
              currentUser={currentUser}
              allMembers={localMembers}
              onRsvp={handleRsvpEvent}
            />
          )}

          {/* ANNOUNCEMENTS DIRECTIVES BOARD */}
          {activeTab === 'announcements' && (
            <div className="space-y-4 text-left">
              <div className="bg-white rounded-2xl p-4 flex justify-between border border-navy-950/5 items-center">
                <div>
                  <h3 className="font-serif font-black text-navy-950 text-base uppercase tracking-wide flex items-center gap-2">
                    <Volume2 className="w-5 h-5 text-[#c5a059]" />
                    Sovereign Directives Board
                  </h3>
                  <p className="text-[10px] text-navy-400 uppercase tracking-widest font-semibold mt-0.5">Official Executive Council Decrees</p>
                </div>
              </div>

              <div className="space-y-3.5">
                {announcements.map(ann => (
                  <div key={ann.id} className={`p-4.5 rounded-2xl border ${ann.is_pinned ? 'bg-amber-50/50 border-amber-200/60' : 'bg-white border-navy-950/5'}`}>
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-2">
                        <h4 className="font-serif font-black text-navy-950 text-sm uppercase tracking-wide">{ann.title}</h4>
                        {ann.is_pinned && (
                          <span className="bg-amber-100 text-amber-800 text-[8.5px] font-bold uppercase px-2 py-0.5 rounded">Pinned</span>
                        )}
                      </div>
                      <span className="text-[9px] text-navy-400 font-mono">{new Date(ann.created_at).toLocaleDateString()}</span>
                    </div>

                    <p className="text-navy-950/80 text-[11px] leading-relaxed font-sans">{ann.content}</p>

                    <div className="mt-4 pt-3 border-t border-navy-950/5 flex items-center gap-2 text-[9px] text-navy-400 font-mono">
                      <img src={ann.author_avatar} alt="" className="w-5 h-5 rounded-full object-cover" />
                      <span>Decreed by Executive Officer {ann.author_name}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* OFFICERS BOARD LIST */}
          {activeTab === 'officers' && (
            <div className="space-y-4 text-left">
              <div className="bg-white rounded-2xl p-4 border border-navy-950/5">
                <h3 className="font-serif font-black text-navy-950 text-base uppercase tracking-wide flex items-center gap-2">
                  <Crown className="w-5 h-5 text-[#c5a059]" />
                  Chapter executive Officers
                </h3>
                <p className="text-[10px] text-navy-400 uppercase tracking-widest font-semibold mt-0.5">Lambda Beta Phi Governing Board</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {[
                  { name: 'Roderick Danzing', position: 'Grand Supreme Archon', slaveName: 'System Architect', avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=300&q=80', phone: '0917-555-0123', email: 'roderickdanzing04@gmail.com', desc: 'Directs overall operations, audits, chapter expansion charters, and sovereign ledger integrations.' },
                  { name: 'Evelyn Sterling', position: 'Vice Archon', slaveName: 'Beta Queen', avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=300&q=80', phone: '0920-555-0143', email: 'evelyn.sterling@example.com', desc: 'Oversees civic outreach programs, member welfare, local community partnerships, and sorority events.' },
                  { name: 'Marcus Vance', position: 'Technology Warden', slaveName: 'Dev Commander', avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=300&q=80', phone: '0915-555-0177', email: 'marcus.vance@example.com', desc: 'Maintains technical compliance registries, coordinates portal support, and moderates social feed integrations.' },
                  { name: 'Helena Troy', position: 'Keeper of the Seals', slaveName: 'Brain Sovereign', avatar: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=300&q=80', phone: '0945-555-0211', email: 'helena.troy@example.com', desc: 'Responsible for chapter archives, ceremonial protocols, conclave transcripts, and security briefs.' }
                ].map((off, idx) => (
                  <div key={idx} className="bg-white rounded-2xl p-4.5 border border-navy-950/5 flex gap-4 items-start hover:shadow-md transition-shadow">
                    <img src={off.avatar} alt={off.name} className="w-16 h-16 rounded-full object-cover border-2 border-[#c5a059]" referrerPolicy="no-referrer" />
                    <div className="flex-1 min-w-0">
                      <p className="text-[9px] font-mono text-rose-600 font-bold uppercase tracking-wider">{off.position}</p>
                      <h4 className="font-serif font-black text-navy-950 text-sm uppercase mt-0.5">{off.name}</h4>
                      <p className="text-[10px] text-navy-400 font-bold uppercase mt-0.5">SLAVE: {off.slaveName}</p>
                      <p className="text-[10px] text-navy-500 font-sans leading-relaxed mt-2.5">{off.desc}</p>
                      
                      <div className="mt-3.5 pt-2.5 border-t border-navy-950/5 flex flex-col space-y-1 text-[9.5px] font-mono text-navy-400">
                        <a href={`mailto:${off.email}`} className="hover:text-gold-600 truncate">EMAIL: {off.email}</a>
                        <a href={`tel:${off.phone}`} className="hover:text-gold-600 truncate">PHONE: {off.phone}</a>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* CENTRAL NOTIFICATIONS DIRECTORY */}
          {activeTab === 'notifications' && (
            <div className="space-y-4 text-left">
              <div className="bg-white rounded-2xl p-4 border border-navy-950/5 flex justify-between items-center">
                <div>
                  <h3 className="font-serif font-black text-navy-950 text-base uppercase tracking-wide flex items-center gap-2">
                    <Bell className="w-5 h-5 text-[#c5a059]" />
                    Central System Alerts
                  </h3>
                  <p className="text-[10px] text-navy-400 uppercase tracking-widest font-semibold mt-0.5">Secure Chapter Event History</p>
                </div>
                <button
                  onClick={handleClearNotifications}
                  className="px-4 py-2 border border-navy-950/10 text-navy-950 text-[10px] font-bold uppercase tracking-widest rounded-lg hover:bg-navy-50 transition-colors"
                >
                  Clear Log
                </button>
              </div>

              <div className="bg-white rounded-2xl border border-navy-950/5 overflow-hidden divide-y divide-navy-950/5">
                {notifications.length > 0 ? (
                  notifications.map(notif => (
                    <div 
                      key={notif.id}
                      onClick={() => handleMarkNotifRead(notif.id)}
                      className={`p-4 flex items-start gap-3 hover:bg-navy-50/50 transition-colors cursor-pointer ${!notif.is_read ? 'bg-[#fbf9f4]' : ''}`}
                    >
                      <span className="text-lg mt-0.5">
                        {notif.type === 'new_post' ? '💬' : notif.type === 'new_announcement' ? '🚨' : '📅'}
                      </span>
                      <div className="flex-1 min-w-0">
                        <p className="font-bold text-navy-950 text-xs uppercase tracking-wide">{notif.title}</p>
                        <p className="text-[11px] text-navy-500 leading-relaxed mt-1">{notif.content}</p>
                        <p className="text-[8.5px] text-navy-400 font-mono mt-2 uppercase">{getRelativeTime(notif.created_at)}</p>
                      </div>
                      {!notif.is_read && (
                        <span className="h-2 w-2 rounded-full bg-gold-500 shrink-0 mt-2"></span>
                      )}
                    </div>
                  ))
                ) : (
                  <p className="py-12 text-center text-navy-400 italic">No historical activities recorded.</p>
                )}
              </div>
            </div>
          )}

          {/* USER DOSSIER PROFILE VIEW */}
          {activeTab === 'profile' && (
            <div className="space-y-4 text-left">
              
              {/* Cover card */}
              <div className="bg-white rounded-2xl overflow-hidden border border-navy-950/5">
                <div className="h-32 bg-gradient-to-r from-navy-950 to-navy-900 relative"></div>
                <div className="p-5 text-center md:text-left md:flex gap-5 items-end -mt-12 relative z-10">
                  <img 
                    src={currentUser.avatarUrl} 
                    alt={currentUser.name} 
                    className="w-24 h-24 rounded-full object-cover border-4 border-white shadow-md mx-auto md:mx-0 shrink-0" 
                    referrerPolicy="no-referrer"
                  />
                  <div className="mt-4 md:mt-0 flex-1">
                    <div className="flex items-center justify-center md:justify-start gap-2">
                      <h3 className="font-serif font-black text-navy-950 text-xl tracking-wide uppercase leading-tight">{currentUser.name}</h3>
                      <span className="text-[9px] font-mono font-bold uppercase tracking-wider bg-rose-50 text-rose-600 px-1.5 py-0.5 rounded">
                        {currentUser.role}
                      </span>
                    </div>
                    <p className="text-xs text-rose-600 font-mono font-bold uppercase mt-1">SLAVE: {currentUser.slaveName}</p>
                    <p className="text-[10px] text-navy-400 font-medium uppercase mt-0.5">{currentUser.chapter} &bull; {currentUser.batch}</p>
                  </div>
                </div>

                <div className="p-5 border-t border-navy-950/5 grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
                  <div className="bg-[#fbf9f4] p-3 rounded-xl border border-navy-950/5">
                    <p className="font-bold text-navy-950 uppercase text-[9px] tracking-wider">Chapter Rank Status</p>
                    <p className="text-[#c5a059] font-bold uppercase text-xs mt-1">{currentUser.position || 'Initiate Member'}</p>
                  </div>
                  <div className="bg-[#fbf9f4] p-3 rounded-xl border border-navy-950/5">
                    <p className="font-bold text-navy-950 uppercase text-[9px] tracking-wider">Contact Phone</p>
                    <p className="text-navy-950 font-mono font-bold text-xs mt-1">{currentUser.phone}</p>
                  </div>
                  <div className="bg-[#fbf9f4] p-3 rounded-xl border border-navy-950/5">
                    <p className="font-bold text-navy-950 uppercase text-[9px] tracking-wider">Registry Date Joined</p>
                    <p className="text-navy-950 font-mono font-bold text-xs mt-1">{currentUser.joinsDate || '2026-07-19'}</p>
                  </div>
                </div>
              </div>

              {/* Personal Feed postings */}
              <div className="space-y-3.5">
                <p className="font-bold text-navy-950 uppercase tracking-widest text-[10px]">Your Personal Postings ({posts.filter(p => p.author_id === currentUser.id).length})</p>
                <PortalFeed
                  currentUser={currentUser}
                  posts={posts.filter(p => p.author_id === currentUser.id)}
                  comments={comments}
                  onAddPost={handleAddPost}
                  onLikePost={handleLikePost}
                  onAddComment={handleAddComment}
                  showToast={showToast}
                />
              </div>

            </div>
          )}

          {/* SETTINGS AND DATABASE STATUS */}
          {activeTab === 'settings' && (
            <div className="space-y-4 text-left">
              <div className="bg-white rounded-2xl p-4 border border-navy-950/5 flex justify-between items-center">
                <div>
                  <h3 className="font-serif font-black text-navy-950 text-base uppercase tracking-wide flex items-center gap-2">
                    <Database className="w-5 h-5 text-[#c5a059]" />
                    Sovereign Cloud & Databases
                  </h3>
                  <p className="text-[10px] text-navy-400 uppercase tracking-widest font-semibold mt-0.5">Supabase Real-Time Diagnostics & Schema Provisioner</p>
                </div>
                <button
                  onClick={async () => {
                    await handleCheckTables();
                    await loadAllDatabaseStates();
                    showToast('Database diagnostics refreshed.', 'success');
                  }}
                  disabled={isCheckingTables}
                  className="px-3.5 py-1.5 border border-navy-950/10 text-navy-950 text-[9.5px] font-bold uppercase tracking-widest rounded-lg hover:bg-navy-50 transition-colors disabled:opacity-50 flex items-center gap-1 cursor-pointer"
                >
                  <Activity className={`w-3.5 h-3.5 ${isCheckingTables ? 'animate-pulse' : ''}`} />
                  {isCheckingTables ? 'Scanning...' : 'Scan DB'}
                </button>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-start">
                
                {/* Left column: Database status and diagnostic list (5 cols) */}
                <div className="lg:col-span-5 space-y-4">
                  <div className="bg-white rounded-2xl p-5 border border-navy-950/5 space-y-4">
                    <h4 className="font-serif font-black text-navy-950 uppercase tracking-wider text-[11px] border-b border-navy-950/5 pb-2 flex justify-between items-center">
                      <span>Connection Integrity</span>
                      <span className={`h-2.5 w-2.5 rounded-full ${Object.keys(tableStatuses).length > 0 && Object.values(tableStatuses).every(Boolean) ? 'bg-emerald-500 animate-pulse' : 'bg-gold-500 animate-pulse'}`}></span>
                    </h4>

                    <div className="space-y-2 text-xs">
                      <div className="flex justify-between p-2.5 bg-navy-50/50 rounded-xl">
                        <span className="font-bold text-navy-500 uppercase text-[9.5px]">Local Sandbox Engine</span>
                        <span className="font-mono text-[10px] text-emerald-600 font-bold uppercase">ONLINE (FALLBACK READY)</span>
                      </div>
                      <div className="flex justify-between p-2.5 bg-navy-50/50 rounded-xl">
                        <span className="font-bold text-navy-500 uppercase text-[9.5px]">Supabase Env Variables</span>
                        <span className="font-mono text-[10px] font-bold uppercase">
                          {Object.keys(tableStatuses).length > 0 ? (
                            <span className="text-emerald-600">CONFIGURED</span>
                          ) : (
                            <span className="text-amber-600">CHECKING ENVS...</span>
                          )}
                        </span>
                      </div>
                    </div>

                    <div className="space-y-2 pt-2">
                      <p className="font-bold text-navy-950 uppercase tracking-widest text-[9.5px] mb-2.5">Live Database Table Diagnostics</p>
                      
                      {['members', 'posts', 'comments', 'announcements', 'events', 'notifications', 'gallery'].map((table) => {
                        const exists = tableStatuses[table];
                        return (
                          <div key={table} className="flex justify-between items-center py-2 px-3 bg-[#fbf9f4] border border-navy-950/5 rounded-xl">
                            <span className="font-mono text-xs text-navy-600 font-bold uppercase">&bull; {table}</span>
                            <span className="flex items-center gap-1 text-[9.5px] font-bold uppercase font-mono">
                              {isCheckingTables ? (
                                <span className="text-navy-400 animate-pulse">CHECKING...</span>
                              ) : exists ? (
                                <span className="text-emerald-600 flex items-center gap-1">
                                  <CheckCircle className="w-3.5 h-3.5" /> LIVE
                                </span>
                              ) : (
                                <span className="text-rose-600 flex items-center gap-1">
                                  <AlertCircle className="w-3.5 h-3.5" /> MISSING
                                </span>
                              )}
                            </span>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                </div>

                {/* Right column: DB Provisioner wizard (7 cols) */}
                <div className="lg:col-span-7 space-y-4">
                  <div className="bg-white rounded-2xl p-5 border border-navy-950/5 space-y-4">
                    <h4 className="font-serif font-black text-navy-950 uppercase tracking-wider text-[11px] border-b border-navy-950/5 pb-2">
                      Sovereign Ledger Provisioner
                    </h4>
                    
                    <p className="text-[11px] text-navy-500 leading-relaxed">
                      To synchronize this application with live data, your Supabase project must be initialized with the core chapter schema tables. You can use our automated script or execute the SQL queries directly.
                    </p>

                    {provisionError && (
                      <div className="p-3 bg-rose-50 border border-rose-200 text-rose-700 rounded-xl text-xs space-y-1">
                        <p className="font-bold uppercase tracking-wider text-[9px]">Provision Warning</p>
                        <p className="font-mono text-[10px] leading-relaxed">{provisionError}</p>
                      </div>
                    )}

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pt-1">
                      {/* Provision option 1: Auto RPC */}
                      <div className="border border-navy-950/5 rounded-xl p-4 bg-[#fbf9f4] flex flex-col justify-between space-y-4">
                        <div>
                          <p className="font-bold text-navy-950 uppercase text-[10px] tracking-wider">Method A: Programmatic RPC</p>
                          <p className="text-[10px] text-navy-400 leading-relaxed mt-1">
                            Attempts to run the SQL migration query via the built-in PostgreSQL <code className="font-mono text-amber-700">exec_sql</code> function.
                          </p>
                        </div>
                        <button
                          onClick={async () => {
                            setIsProvisioning(true);
                            setProvisionError(null);
                            try {
                              const res = await dbService.autoProvision();
                              if (res.success) {
                                showToast('Tables provisioned successfully!', 'success');
                                handleCheckTables();
                                loadAllDatabaseStates();
                              } else {
                                setProvisionError(res.error || 'Auto-provision returned error.');
                              }
                            } catch (e: any) {
                              setProvisionError(e.message || 'Error occurred during auto-provision.');
                            } finally {
                              setIsProvisioning(false);
                            }
                          }}
                          disabled={isProvisioning}
                          className="w-full py-2 bg-navy-950 text-gold-500 text-[9.5px] font-bold uppercase tracking-widest rounded-lg hover:bg-navy-900 transition-colors disabled:opacity-50 cursor-pointer"
                        >
                          {isProvisioning ? 'PROVISIONING...' : 'RUN AUTO-PROVISION'}
                        </button>
                      </div>

                      {/* Provision option 2: Clipboard Copy */}
                      <div className="border border-navy-950/5 rounded-xl p-4 bg-[#fbf9f4] flex flex-col justify-between space-y-4">
                        <div>
                          <p className="font-bold text-navy-950 uppercase text-[10px] tracking-wider">Method B: Direct Dashboard SQL</p>
                          <p className="text-[10px] text-navy-400 leading-relaxed mt-1">
                            Copies the entire database schema to your clipboard so you can paste it directly inside the Supabase SQL editor. Recommended!
                          </p>
                        </div>
                        <button
                          onClick={() => {
                            const sqlContent = `
-- LAMBDA BETA PHI SUPABASE SCHEMA
-- Run this in your SQL Editor inside the Supabase dashboard!
CREATE TABLE IF NOT EXISTS public.members (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    email TEXT NOT NULL UNIQUE,
    role TEXT NOT NULL DEFAULT 'User',
    gender TEXT,
    chapter TEXT NOT NULL,
    batch TEXT,
    position TEXT,
    "joinsDate" TEXT,
    "avatarUrl" TEXT,
    phone TEXT,
    "slaveName" TEXT,
    birthday TEXT,
    "isOnline" BOOLEAN DEFAULT false,
    "chapterPoints" INTEGER DEFAULT 0,
    "duesStatus" TEXT DEFAULT 'Unpaid',
    "duesAmount" NUMERIC DEFAULT 0,
    major TEXT,
    hometown TEXT,
    biography TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now())
);
CREATE TABLE IF NOT EXISTS public.posts (
    id TEXT PRIMARY KEY,
    author_id TEXT NOT NULL REFERENCES public.members(id) ON DELETE CASCADE,
    author_name TEXT NOT NULL,
    author_avatar TEXT,
    author_chapter TEXT,
    author_slave_name TEXT,
    content TEXT NOT NULL,
    images TEXT[] DEFAULT '{}'::TEXT[],
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()),
    likes_count INTEGER DEFAULT 0,
    liked_by TEXT[] DEFAULT '{}'::TEXT[]
);
CREATE TABLE IF NOT EXISTS public.comments (
    id TEXT PRIMARY KEY,
    post_id TEXT NOT NULL REFERENCES public.posts(id) ON DELETE CASCADE,
    author_id TEXT NOT NULL REFERENCES public.members(id) ON DELETE CASCADE,
    author_name TEXT NOT NULL,
    author_avatar TEXT,
    content TEXT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now())
);
CREATE TABLE IF NOT EXISTS public.announcements (
    id TEXT PRIMARY KEY,
    title TEXT NOT NULL,
    content TEXT NOT NULL,
    author_name TEXT NOT NULL,
    author_avatar TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()),
    is_pinned BOOLEAN DEFAULT false
);
CREATE TABLE IF NOT EXISTS public.events (
    id TEXT PRIMARY KEY,
    title TEXT NOT NULL,
    description TEXT NOT NULL,
    date TEXT NOT NULL,
    time TEXT NOT NULL,
    location TEXT NOT NULL,
    image TEXT,
    category TEXT NOT NULL,
    created_by TEXT,
    rsvps TEXT[] DEFAULT '{}'::TEXT[],
    capacity INTEGER,
    highlights TEXT
);
CREATE TABLE IF NOT EXISTS public.notifications (
    id TEXT PRIMARY KEY,
    type TEXT NOT NULL,
    title TEXT NOT NULL,
    content TEXT NOT NULL,
    reference_id TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()),
    is_read BOOLEAN DEFAULT false
);
CREATE TABLE IF NOT EXISTS public.gallery (
    id TEXT PRIMARY KEY,
    album TEXT NOT NULL,
    url TEXT,
    image_url TEXT,
    description TEXT,
    caption TEXT,
    uploaded_by TEXT,
    uploaded_by_name TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now())
);
-- Seed default Roderick admin account
INSERT INTO public.members (id, name, email, role, gender, chapter, batch, position, "joinsDate", "avatarUrl", phone, "slaveName", birthday, "isOnline", "chapterPoints", "duesStatus", "duesAmount")
VALUES ('m1', 'Roderick Danzing', 'roderickdanzing04@gmail.com', 'Admin', 'Brother', 'Supreme Archon Chapter', 'Alpha Class 2022', 'Supreme Commander', '2022-01-15', 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80', '0917-555-0123', 'System Architect', '2004-07-20', true, 500, 'Paid', 0)
ON CONFLICT (id) DO NOTHING;
`;
                            navigator.clipboard.writeText(sqlContent);
                            showToast('Supabase SQL schema copied to clipboard!', 'success');
                          }}
                          className="w-full py-2 bg-navy-950 text-gold-500 text-[9.5px] font-bold uppercase tracking-widest rounded-lg hover:bg-navy-900 transition-colors cursor-pointer flex items-center justify-center gap-1"
                        >
                          <Copy className="w-3.5 h-3.5" />
                          COPY SQL SCHEMA
                        </button>
                      </div>
                    </div>

                    <div className="pt-2">
                      <p className="font-bold text-navy-950 uppercase text-[9px] tracking-wider">Dashboard Deployment Quick Links</p>
                      <div className="flex flex-wrap gap-2.5 mt-2 text-[10px]">
                        <a 
                          href="https://supabase.com/dashboard/project/_/sql" 
                          target="_blank" 
                          rel="noreferrer" 
                          className="text-[#c5a059] hover:underline flex items-center gap-0.5"
                        >
                          SQL Editor <ExternalLink className="w-3 h-3" />
                        </a>
                        <span className="text-navy-300">|</span>
                        <a 
                          href="https://supabase.com/dashboard/project/_/storage/buckets" 
                          target="_blank" 
                          rel="noreferrer" 
                          className="text-[#c5a059] hover:underline flex items-center gap-0.5"
                        >
                          Storage Buckets <ExternalLink className="w-3 h-3" />
                        </a>
                        <span className="text-navy-300">|</span>
                        <a 
                          href="https://supabase.com/dashboard/project/_/settings/api" 
                          target="_blank" 
                          rel="noreferrer" 
                          className="text-[#c5a059] hover:underline flex items-center gap-0.5"
                        >
                          API Keys Dashboard <ExternalLink className="w-3 h-3" />
                        </a>
                      </div>
                    </div>
                  </div>

                  {/* Credential Dossier */}
                  <div className="bg-white rounded-2xl p-5 border border-navy-950/5 space-y-3">
                    <h4 className="font-serif font-black text-navy-950 uppercase tracking-wider text-[11px] border-b border-navy-950/5 pb-2">
                      Active Session & Terminal Information
                    </h4>
                    <p className="text-[11px] text-navy-500 leading-relaxed">
                      You are authenticated on this client with administrative privileges. To initialize tables via terminal, execute the following command in your repository terminal:
                    </p>
                    <div className="p-3 bg-navy-950 text-gold-400 font-mono text-[10.5px] rounded-xl flex justify-between items-center select-all">
                      <code>npm run db:init</code>
                      <span className="text-[8px] uppercase font-sans text-navy-400 font-semibold bg-navy-900 border border-navy-800 px-1.5 py-0.5 rounded">Terminal Command</span>
                    </div>

                    <div className="space-y-1 text-[9.5px] text-navy-400 font-mono uppercase border-t border-navy-950/5 pt-3">
                      <p>&bull; SESSION BINDING: {currentUser?.email}</p>
                      <p>&bull; AUTHORIZATION LEVEL: {currentUser?.role}</p>
                      <p>&bull; CHAPTER CLUSTER: {currentUser?.chapter}</p>
                    </div>
                  </div>
                </div>

              </div>
            </div>
          )}

          {/* ADMIN FEATURES COMPONENT PANEL */}
          {activeTab === 'admin' && currentUser.role === 'Admin' && (
            <PortalAdmin
              members={localMembers}
              announcements={announcements}
              events={events}
              onApproveMember={handleApproveMember}
              onRejectMember={handleRejectMember}
              onSuspendMember={handleSuspendMember}
              onDeleteMember={handleDeleteMember}
              onAddAnnouncement={handleAddAnnouncement}
              onAddEvent={handleAddEvent}
              onDeleteAnnouncement={handleDeleteAnnouncement}
              onDeleteEvent={handleDeleteEvent}
              showToast={showToast}
            />
          )}

      </AppLayout>

      {/* =========================================================
          3. Dynamic Floating Toast Messages
          ========================================================= */}
      {toast && (
        <div className="fixed bottom-6 right-6 z-50 flex items-center gap-3 bg-navy-900 border border-[#c5a059] text-white px-5 py-4 rounded-xl shadow-2xl animate-slide-up max-w-xs">
          {toast.type === 'error' ? (
            <AlertCircle className="w-4.5 h-4.5 text-rose-400 shrink-0" />
          ) : (
            <CheckCircle className="w-4.5 h-4.5 text-gold-400 shrink-0" />
          )}
          <span className="text-[11px] font-bold tracking-wide uppercase font-mono">{toast.message}</span>
        </div>
      )}
    </>
  );
}
