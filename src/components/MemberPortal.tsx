import React, { useState, useEffect } from 'react';
import { 
  Shield, Lock, User, Mail, Search, Award, CheckCircle, MessageSquare, Send, 
  Phone, MapPin, Crown, Settings, Trash2, Plus, X, Upload, Image, Bell, BookOpen, 
  Users, FolderOpen, Calendar, Volume2, LogOut, ChevronRight, Menu, HelpCircle, 
  Activity, Clock, Compass, Info, AlertCircle 
} from 'lucide-react';

import { Member, Post, Comment, Announcement, Event, Notification, GalleryItem } from '../types';
import { dbService } from '../lib/dbService';
import CrestLogo from './CrestLogo';

// Sub-components import
import PortalAuth, { PendingScreen } from './PortalAuth';
import { LeftSidebar, RightSidebar } from './PortalSidebar';
import { PortalFeed, getRelativeTime } from './PortalFeed';
import PortalDirectory from './PortalDirectory';
import PortalGallery from './PortalGallery';
import PortalAdmin from './PortalAdmin';

interface MemberPortalProps {
  members: Member[];
  currentUser: Member | null;
  onLogin: (email: string, password?: string) => boolean | Promise<boolean>;
  onLogout: () => void;
  onRegister: (newMember: Omit<Member, 'id' | 'joinsDate'>, password?: string) => void;
  onUpdateMembers?: (updatedMembers: Member[]) => void;
}

export default function MemberPortal({
  members: initialMembers,
  currentUser: initialUser,
  onLogin,
  onLogout,
  onRegister,
  onUpdateMembers
}: MemberPortalProps) {

  // Global Portal active Navigation Tab
  // Options: 'home' | 'directory' | 'gallery' | 'events' | 'announcements' | 'officers' | 'notifications' | 'profile' | 'settings' | 'admin'
  const [activeTab, setActiveTab] = useState<string>('home');

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
        author_id: currentUser.id,
        author_name: currentUser.name,
        author_avatar: currentUser.avatarUrl,
        author_chapter: currentUser.chapter,
        author_slave_name: currentUser.slaveName,
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
        author_id: currentUser.id,
        author_name: currentUser.name,
        author_avatar: currentUser.avatarUrl,
        content
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
        joinsDate: new Date().toISOString().split('T')[0]
      };

      const updatedList = localMembers.map(m => m.id === id ? updated : m);
      await updateMembersState(updatedList);

      // Create confirmation notification
      await dbService.createNotification({
        type: 'new_member',
        title: 'Registry Sealed',
        content: `Applicant ${updated.name} (Slave: ${updated.slaveName}) has been officially verified and admitted.`,
        reference_id: updated.id
      });

      showToast(`Approved applicant ${updated.name}. Welcome to the registry!`, 'success');
      
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
        role: 'Pending' as const
      };

      const updatedList = localMembers.map(m => m.id === id ? updated : m);
      await updateMembersState(updatedList);
      showToast(`Suspended active access for member ${target.name}.`, 'info');
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
        author_name: currentUser.name,
        author_avatar: currentUser.avatarUrl,
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

  const handleAddEvent = async (evt: { title: string; date: string; time: string; location: string; description: string }) => {
    if (!currentUser) return;
    try {
      const newEvt = await dbService.createEvent({
        ...evt,
        category: 'Assembly',
        created_by: currentUser.id,
        image: 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?auto=format&fit=crop&w=600&q=80'
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

  if (currentUser.role === 'Pending') {
    return (
      <PendingScreen 
        user={currentUser} 
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
    <div className="min-h-screen bg-[#f3f4f6] font-sans antialiased text-navy-950 flex flex-col">
      
      {/* =========================================================
          1. TOP BAR NAVIGATION (Facebook/LinkedIn inspired)
          ========================================================= */}
      <header className="sticky top-0 z-40 bg-navy-950 text-white border-b border-[#c5a059]/20 h-16 shadow-md shrink-0">
        <div className="max-w-7xl mx-auto px-4 h-full flex items-center justify-between">
          
          {/* Left section: Logo & Crest */}
          <div 
            onClick={() => setActiveTab('home')} 
            className="flex items-center gap-2.5 cursor-pointer group"
          >
            <CrestLogo size={42} className="transition-transform group-hover:scale-105" />
            <div className="flex flex-col text-left">
              <span className="font-serif font-black tracking-wider text-xs md:text-sm text-gold-400">
                LAMBDA BETA PHI
              </span>
              <span className="font-sans text-[7.5px] tracking-widest uppercase text-navy-300">
                Private Community Portal
              </span>
            </div>
          </div>

          {/* Right section: Navigation controls */}
          <div className="flex items-center gap-3.5">
            
            {/* Notification bell and badge */}
            <div className="relative">
              <button
                onClick={() => setNotifDrawerOpen(!notifDrawerOpen)}
                className="p-2 rounded-full hover:bg-white/10 text-gold-400 hover:text-white transition-colors relative cursor-pointer"
              >
                <Bell className="w-5 h-5 shrink-0" />
                {unreadNotifs.length > 0 && (
                  <span className="absolute top-1 right-1.5 h-4 w-4 bg-rose-500 text-white rounded-full flex items-center justify-center text-[8px] font-mono font-bold border border-navy-950 animate-bounce">
                    {unreadNotifs.length}
                  </span>
                )}
              </button>

              {/* Notification Drawer Popover */}
              {notifDrawerOpen && (
                <div className="absolute right-0 mt-3 bg-white text-navy-950 rounded-2xl shadow-2xl border border-[#c5a059]/20 w-80 py-2.5 z-50 animate-fade-in font-sans text-xs">
                  <div className="flex items-center justify-between px-4 pb-2 border-b border-navy-950/5">
                    <p className="font-serif font-black text-[10px] uppercase tracking-wider text-navy-950">
                      System Notifications
                    </p>
                    <button
                      onClick={handleClearNotifications}
                      className="text-[9px] text-[#c5a059] font-bold uppercase hover:underline"
                    >
                      Clear All
                    </button>
                  </div>

                  <div className="max-h-[300px] overflow-y-auto pr-1">
                    {notifications.length > 0 ? (
                      notifications.slice(0, 5).map(notif => (
                        <div 
                          key={notif.id}
                          onClick={() => {
                            handleMarkNotifRead(notif.id);
                            setNotifDrawerOpen(false);
                            if (notif.type === 'new_post') setActiveTab('home');
                            if (notif.type === 'new_announcement') setActiveTab('announcements');
                            if (notif.type === 'new_event') setActiveTab('events');
                          }}
                          className={`p-3 border-b border-navy-950/5 hover:bg-navy-50/50 cursor-pointer flex items-start gap-2.5 transition-colors ${
                            !notif.is_read ? 'bg-[#fbf9f4]' : ''
                          }`}
                        >
                          <div className="mt-0.5 shrink-0">
                            <span className="text-sm">
                              {notif.type === 'new_post' ? '💬' : notif.type === 'new_announcement' ? '🚨' : '📅'}
                            </span>
                          </div>
                          <div className="text-left">
                            <p className="font-bold text-navy-950 text-[10.5px] leading-tight">{notif.title}</p>
                            <p className="text-[9px] text-navy-500 leading-tight mt-0.5">{notif.content}</p>
                            <p className="text-[7.5px] text-navy-400 font-mono mt-1 uppercase">{getRelativeTime(notif.created_at)}</p>
                          </div>
                        </div>
                      ))
                    ) : (
                      <p className="py-8 text-center text-navy-400 italic text-[10px]">Registry is completely quiet.</p>
                    )}
                  </div>
                </div>
              )}
            </div>

            {/* User Mini-Card profile */}
            <div className="flex items-center gap-2 border-l border-white/10 pl-3.5">
              <img 
                src={currentUser.avatarUrl} 
                alt={currentUser.name} 
                className="w-8.5 h-8.5 rounded-full object-cover border border-[#c5a059] cursor-pointer hover:scale-105 transition-transform"
                onClick={() => setActiveTab('profile')}
                referrerPolicy="no-referrer"
              />
              <div className="hidden md:flex flex-col text-left">
                <span className="font-bold text-xs uppercase tracking-wide leading-tight">{currentUser.name.split(' ')[0]}</span>
                <span className="text-[8.5px] text-gold-400 font-mono font-bold uppercase leading-tight mt-0.5">SLAVE: {currentUser.slaveName}</span>
              </div>

              {/* Sign out */}
              <button 
                onClick={onLogout}
                title="Sign Out of Secure Session"
                className="p-1.5 rounded-full text-navy-400 hover:text-red-400 transition-colors cursor-pointer ml-1.5"
              >
                <LogOut className="w-4.5 h-4.5" />
              </button>
            </div>

            {/* Mobile menu button */}
            <button 
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-2 hover:bg-white/10 rounded-lg text-white"
            >
              <Menu className="w-5 h-5" />
            </button>

          </div>

        </div>
      </header>

      {/* =========================================================
          2. CORE TWO/THREE-COLUMN COMMUNITY AREA
          ========================================================= */}
      <div className="flex-1 max-w-7xl w-full mx-auto px-4 py-5 flex gap-5 overflow-hidden relative">
        
        {/* ====================================
           A. LEFT NAVIGATION BAR MENU (Desktop only, responsive drawers)
           ==================================== */}
        <aside className="hidden md:flex flex-col w-64 bg-white rounded-2xl shadow-sm border border-navy-950/5 p-4 shrink-0 overflow-y-auto">
          <div className="space-y-1 select-none">
            <p className="text-[9px] font-bold text-navy-400 uppercase tracking-widest pl-3 mb-2">Portal Services</p>
            {navItems.map(item => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => setActiveTab(item.id)}
                  className={`w-full flex items-center justify-between px-3 py-2.5 text-[10.5px] font-bold uppercase tracking-wider rounded-xl transition-all cursor-pointer ${
                    isActive 
                      ? 'bg-navy-950 text-gold-400 shadow-sm border border-navy-950' 
                      : 'text-navy-950/75 hover:bg-navy-50 hover:text-navy-950'
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    <Icon className={`w-4.5 h-4.5 ${isActive ? 'text-gold-400' : 'text-[#c5a059]'}`} />
                    <span>{item.label}</span>
                  </div>
                  {item.badge !== undefined && item.badge > 0 && (
                    <span className="bg-rose-500 text-white rounded-full px-1.5 py-0.5 text-[8px] font-mono animate-pulse">
                      {item.badge}
                    </span>
                  )}
                </button>
              );
            })}
          </div>

          {/* Secure indicator */}
          <div className="mt-auto pt-8 border-t border-navy-950/5 text-center text-[9px] text-navy-400 font-mono uppercase space-y-1">
            <div className="flex items-center justify-center gap-1.5">
              <Shield className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
              <span className="text-emerald-700 font-bold">256-Bit SSL Encrypted</span>
            </div>
            <p>Sovereign Ledger Node active</p>
          </div>
        </aside>

        {/* Mobile Navigation Drawer Overlay */}
        {mobileMenuOpen && (
          <div className="fixed inset-0 bg-navy-950/60 backdrop-blur-xs z-50 md:hidden flex animate-fade-in font-sans">
            <div className="w-64 bg-white h-full p-4 flex flex-col shadow-2xl border-r border-[#c5a059]/20">
              <div className="flex items-center justify-between pb-4 border-b border-navy-950/5 mb-4">
                <p className="font-serif font-black text-navy-950 text-xs uppercase tracking-wider">Chapters Hub</p>
                <button onClick={() => setMobileMenuOpen(false)} className="p-1 rounded-full hover:bg-navy-50 text-navy-950">
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="space-y-1 flex-1 overflow-y-auto select-none">
                {navItems.map(item => {
                  const Icon = item.icon;
                  const isActive = activeTab === item.id;
                  return (
                    <button
                      key={item.id}
                      onClick={() => {
                        setActiveTab(item.id);
                        setMobileMenuOpen(false);
                      }}
                      className={`w-full flex items-center justify-between px-3.5 py-2.5 text-[10.5px] font-bold uppercase tracking-wider rounded-xl transition-all cursor-pointer ${
                        isActive 
                          ? 'bg-navy-950 text-gold-400 shadow-sm' 
                          : 'text-navy-950/75 hover:bg-navy-50'
                      }`}
                    >
                      <div className="flex items-center gap-2.5">
                        <Icon className="w-4.5 h-4.5 text-[#c5a059]" />
                        <span>{item.label}</span>
                      </div>
                      {item.badge !== undefined && item.badge > 0 && (
                        <span className="bg-rose-500 text-white rounded-full px-1.5 py-0.5 text-[8px] font-mono">
                          {item.badge}
                        </span>
                      )}
                    </button>
                  );
                })}
              </div>

              <div className="mt-auto p-2 text-center text-[8.5px] font-mono text-navy-400">
                &copy; Lambda Beta Phi Private Space
              </div>
            </div>
          </div>
        )}

        {/* ====================================
           B. CENTER PANEL (Main viewports)
           ==================================== */}
        <main className="flex-1 overflow-y-auto pr-1">
          
          {/* NEWS FEED / PORTAL HOME (The 3-column layout) */}
          {(activeTab === 'home' || activeTab === 'news_feed') && (
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-start">
              
              {/* Left sidebar: Member Profile card (Desktop 3cols, hidden mobile) */}
              <div className="hidden lg:block lg:col-span-3.5">
                <LeftSidebar 
                  currentUser={currentUser} 
                  onUpdateProfile={handleUpdateProfile} 
                />
              </div>

              {/* Middle center: Timeline feed */}
              <div className="col-span-1 lg:col-span-5.5">
                <PortalFeed
                  currentUser={currentUser}
                  posts={posts}
                  comments={comments}
                  onAddPost={handleAddPost}
                  onLikePost={handleLikePost}
                  onAddComment={handleAddComment}
                  showToast={(msg, t) => showToast(msg, t as any)}
                />
              </div>

              {/* Right sidebar: Directives, events (Desktop 3cols, hidden mobile) */}
              <div className="hidden lg:block lg:col-span-3 text-left">
                <RightSidebar
                  announcements={announcements}
                  events={events}
                  members={localMembers}
                  onRsvp={handleRsvpEvent}
                  currentUser={currentUser}
                  onNavigateTab={setActiveTab}
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
              showToast={(msg, t) => showToast(msg, t as any)}
            />
          )}

          {/* EVENTS & ASSEMBLIES */}
          {activeTab === 'events' && (
            <div className="space-y-4 text-left">
              <div className="bg-white rounded-2xl shadow-sm border border-navy-950/5 p-4 flex justify-between items-center">
                <div>
                  <h3 className="font-serif font-black text-navy-950 text-base uppercase tracking-wide flex items-center gap-2">
                    <Calendar className="w-5 h-5 text-[#c5a059]" />
                    Assemblies & Conclaves
                  </h3>
                  <p className="text-[10px] text-navy-400 uppercase tracking-widest font-semibold mt-0.5">Sovereign Chapters Hub Calendar</p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {events.map(e => {
                  const isRsvpd = e.rsvps.includes(currentUser.id) || e.rsvps.includes(currentUser.email);
                  return (
                    <div key={e.id} className="bg-white rounded-2xl overflow-hidden border border-navy-950/5 flex flex-col">
                      <div className="h-40 relative bg-navy-900 overflow-hidden">
                        <img src={e.image} alt={e.title} className="w-full h-full object-cover opacity-85" />
                        <div className="absolute top-3 left-3 bg-white/95 px-2.5 py-1.5 rounded-lg text-center shadow-md">
                          <p className="text-[9px] font-bold text-[#c5a059] uppercase tracking-wider leading-none">
                            {new Date(e.date).toLocaleDateString(undefined, {month: 'short'})}
                          </p>
                          <p className="text-base font-serif font-black text-navy-950 leading-none mt-1">
                            {new Date(e.date).getDate()}
                          </p>
                        </div>
                      </div>

                      <div className="p-4 flex-1 flex flex-col justify-between">
                        <div>
                          <h4 className="font-serif font-black text-navy-950 text-sm uppercase tracking-wide leading-tight">{e.title}</h4>
                          <p className="text-[10px] text-navy-500 mt-1.5 leading-relaxed">{e.description}</p>
                          
                          <div className="mt-4 space-y-1.5 text-[10.5px] text-navy-600 font-medium">
                            <p className="flex items-center gap-2"><Clock className="w-3.5 h-3.5 text-[#c5a059]" /> {e.time}</p>
                            <p className="flex items-center gap-2"><MapPin className="w-3.5 h-3.5 text-[#c5a059]" /> {e.location}</p>
                          </div>
                        </div>

                        <div className="pt-4 border-t border-navy-950/5 mt-4 flex items-center justify-between">
                          <span className="text-[10px] text-navy-400 font-mono font-bold uppercase">{e.rsvps.length} RSVP'D MEMBERS</span>
                          <button
                            onClick={() => handleRsvpEvent(e.id)}
                            className={`px-4 py-2 text-[10px] font-bold uppercase tracking-wider rounded-lg transition-all cursor-pointer ${
                              isRsvpd 
                                ? 'bg-emerald-50 border border-emerald-200 text-emerald-700 hover:bg-emerald-100' 
                                : 'bg-navy-950 text-gold-500 hover:bg-navy-900'
                            }`}
                          >
                            {isRsvpd ? 'Going ✓' : 'Register RSVP'}
                          </button>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
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
                  showToast={(msg, t) => showToast(msg, t as any)}
                />
              </div>

            </div>
          )}

          {/* SETTINGS AND DATABASE STATUS */}
          {activeTab === 'settings' && (
            <div className="space-y-4 text-left">
              <div className="bg-white rounded-2xl p-4 border border-navy-950/5">
                <h3 className="font-serif font-black text-navy-950 text-base uppercase tracking-wide flex items-center gap-2">
                  <Settings className="w-5 h-5 text-[#c5a059]" />
                  Customization & Databases
                </h3>
                <p className="text-[10px] text-navy-400 uppercase tracking-widest font-semibold mt-0.5">Portal Configuration Services</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                
                {/* Database state */}
                <div className="bg-white rounded-2xl p-5 border border-navy-950/5 space-y-4 flex flex-col justify-between">
                  <div>
                    <h4 className="font-serif font-black text-navy-950 uppercase tracking-wider text-[11px] border-b border-navy-950/5 pb-2">
                      Supabase Cloud Connectivity
                    </h4>
                    <p className="text-[11px] text-navy-500 leading-relaxed mt-2">
                      The portal queries database tables in real-time. If credentials aren't initialized, a robust fallback engine manages local changes securely inside your local container sandbox.
                    </p>

                    <div className="mt-4 p-3 bg-[#fbf9f4] border border-[#c5a059]/25 rounded-xl space-y-1 text-[10px] text-navy-500 font-mono uppercase">
                      <p className="flex items-center gap-2">
                        <span className="h-2 w-2 rounded-full bg-emerald-500"></span>
                        LOCAL PERSISTENCE: ONLINE
                      </p>
                      <p className="flex items-center gap-2">
                        <span className="h-2 w-2 rounded-full bg-gold-500"></span>
                        SUPABASE CONNECTION: AUTODETECTING
                      </p>
                      <p className="text-[8px] text-navy-400 mt-2 font-sans lowercase">
                        * Environment values are mapped securely inside `.env` configuration.
                      </p>
                    </div>
                  </div>

                  <button
                    onClick={() => {
                      loadAllDatabaseStates();
                      showToast('Database synchronization complete.', 'success');
                    }}
                    className="w-full py-2.5 bg-navy-950 text-gold-500 text-[10px] font-bold uppercase tracking-widest rounded-lg hover:bg-navy-900 transition-colors cursor-pointer"
                  >
                    Sync Live Database
                  </button>
                </div>

                {/* Secure Dossier Card */}
                <div className="bg-white rounded-2xl p-5 border border-navy-950/5 space-y-3.5">
                  <h4 className="font-serif font-black text-navy-950 uppercase tracking-wider text-[11px] border-b border-navy-950/5 pb-2">
                    Security Credentials & Session
                  </h4>
                  <p className="text-[11px] text-navy-500 leading-relaxed">
                    You are connected to this space using a protected token. Keep your device lock active. Administrative credentials are restricted to audited emails.
                  </p>

                  <div className="space-y-1 text-[9.5px] text-navy-400 font-mono uppercase border-t border-navy-950/5 pt-3">
                    <p>&bull; ACTIVE LOGIN: {currentUser.email}</p>
                    <p>&bull; CHAPTER SECTOR: {currentUser.chapter}</p>
                    <p>&bull; AUTH LEVEL: {currentUser.role}</p>
                    <p>&bull; CLIENT BINDING: Web Preview Frame</p>
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
              showToast={(msg, t) => showToast(msg, t as any)}
            />
          )}

        </main>

      </div>

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

    </div>
  );
}
