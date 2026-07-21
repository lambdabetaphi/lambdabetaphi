import React, { useState, useEffect, useRef, useMemo } from 'react';
import { Bell, LogOut, ExternalLink, Menu } from 'lucide-react';
import CrestLogo from '../CrestLogo';
import { Member, Notification } from '../../types';
import { PortalTab } from './Sidebar';
import { getRelativeTime } from '../../utils/date';

export interface HeaderProps {
  activeTab: PortalTab;
  onTabChange: (tabId: PortalTab) => void;
  currentUser: Member | null;
  notifications: Notification[];
  onMarkNotificationRead: (id: string) => void;
  onClearNotifications: () => void;
  onLogout: () => void;
  onNavigateToPublic?: () => void;
  onMobileMenuToggle: () => void;
}

export function Header({
  activeTab,
  onTabChange,
  currentUser,
  notifications = [],
  onMarkNotificationRead,
  onClearNotifications,
  onLogout,
  onNavigateToPublic,
  onMobileMenuToggle
}: HeaderProps) {
  const [notifDrawerOpen, setNotifDrawerOpen] = useState(false);
  const notifRef = useRef<HTMLDivElement>(null);

  // Close notifications popover on clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (notifRef.current && !notifRef.current.contains(event.target as Node)) {
        setNotifDrawerOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  // Keyboard navigation: Close popover on Escape key
  useEffect(() => {
    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === 'Escape') {
        setNotifDrawerOpen(false);
      }
    }
    document.addEventListener('keydown', handleKeyDown);
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, []);

  // Filter unread notifications
  const unreadNotifications = useMemo(() => {
    return notifications.filter(n => !n.is_read);
  }, [notifications]);

  // Handle click on individual notification
  const handleNotificationClick = (notif: Notification) => {
    onMarkNotificationRead(notif.id);
    setNotifDrawerOpen(false);

    // Clean compile-time type-checked properties without "any" casting
    const notifType = notif.type || '';
    if (notifType === 'new_post') {
      onTabChange('home');
    } else if (notifType === 'new_announcement') {
      onTabChange('announcements');
    } else if (notifType === 'new_event') {
      onTabChange('events');
    } else {
      // Fallback: default to notifications view
      onTabChange('notifications');
    }
  };

  // Safe user profile details fallback
  const userDetails = useMemo(() => {
    if (!currentUser) return null;
    return {
      name: currentUser.full_name || currentUser.name || 'Initiate Member',
      avatarUrl: currentUser.avatar_url || currentUser.avatarUrl || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80',
      slaveName: currentUser.bio || currentUser.slaveName || 'Candidate Member'
    };
  }, [currentUser]);

  return (
    <header 
      id="lbp-portal-header"
      role="banner"
      className="sticky top-0 z-40 bg-navy-950 text-white border-b border-[#c5a059]/20 h-16 shadow-md shrink-0 font-sans"
    >
      <div className="max-w-7xl mx-auto px-4 h-full flex items-center justify-between">
        
        {/* Left section: Logo & Crest with title - Refactored as semantic button */}
        <button 
          id="header-brand-trigger"
          onClick={() => onTabChange('home')} 
          className="flex items-center gap-2.5 cursor-pointer group text-left bg-transparent border-none p-0 focus:outline-none focus-visible:ring-2 focus-visible:ring-gold-500/50 rounded-lg"
          aria-label="Lambda Beta Phi Home"
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
        </button>

        {/* Right section: Navigation controls */}
        <div className="flex items-center gap-3.5" id="header-controls-container">
          
          {/* Public Site Switcher Action */}
          {onNavigateToPublic && (
            <button
              id="header-btn-public-site"
              onClick={onNavigateToPublic}
              className="text-[10px] text-gold-400 hover:text-white border border-[#c5a059]/30 hover:border-white px-2.5 py-1.5 font-bold uppercase tracking-wider transition-all rounded-lg shrink-0 flex items-center gap-1 focus:outline-none focus-visible:ring-2 focus-visible:ring-gold-500/50 cursor-pointer"
              title="Return to Public Website"
            >
              <ExternalLink className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Public Site</span>
            </button>
          )}

          {/* Notification bell trigger and popover container */}
          <div className="relative" ref={notifRef} id="header-notif-dropdown-wrapper">
            <button
              id="header-btn-notifications"
              onClick={() => setNotifDrawerOpen(!notifDrawerOpen)}
              aria-expanded={notifDrawerOpen}
              aria-haspopup="true"
              aria-label={`System alerts, ${unreadNotifications.length} unread`}
              className="p-2 rounded-full hover:bg-white/10 text-gold-400 hover:text-white transition-colors relative cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-gold-500/50"
            >
              <Bell className="w-5 h-5 shrink-0" />
              {unreadNotifications.length > 0 && (
                <span 
                  id="header-notif-badge"
                  className="absolute top-1 right-1.5 h-4 w-4 bg-rose-500 text-white rounded-full flex items-center justify-center text-[8px] font-mono font-bold border border-navy-950 animate-bounce"
                >
                  {unreadNotifications.length}
                </span>
              )}
            </button>

            {/* Notification Drawer Popover */}
            {notifDrawerOpen && (
              <div 
                id="header-notif-dropdown"
                role="dialog"
                aria-label="System Notifications List"
                className="absolute right-0 mt-3 bg-white text-navy-950 rounded-2xl shadow-2xl border border-[#c5a059]/20 w-80 py-2.5 z-50 animate-fade-in text-xs"
              >
                <div className="flex items-center justify-between px-4 pb-2 border-b border-navy-950/5">
                  <p className="font-serif font-black text-[10px] uppercase tracking-wider text-navy-950">
                    System Notifications
                  </p>
                  <button
                    id="header-btn-clear-notifs"
                    onClick={() => {
                      onClearNotifications();
                      setNotifDrawerOpen(false);
                    }}
                    className="text-[9px] text-[#c5a059] font-bold uppercase hover:underline focus:outline-none focus-visible:ring-1 focus-visible:ring-gold-500 cursor-pointer"
                  >
                    Clear All
                  </button>
                </div>

                <div className="max-h-[300px] overflow-y-auto pr-1" id="header-notif-list">
                  {notifications.length > 0 ? (
                    notifications.slice(0, 5).map(notif => {
                      const messageText = notif.message || notif.content || '';
                      const notifType = notif.type || '';
                      return (
                        <div 
                          key={notif.id}
                          id={`header-notif-item-${notif.id}`}
                          onClick={() => handleNotificationClick(notif)}
                          className={`p-3 border-b border-navy-950/5 hover:bg-navy-50/50 cursor-pointer flex items-start gap-2.5 transition-colors focus:outline-none focus-visible:bg-navy-50 ${
                            !notif.is_read ? 'bg-[#fbf9f4]' : ''
                          }`}
                          role="button"
                          tabIndex={0}
                          onKeyDown={(e) => {
                            if (e.key === 'Enter' || e.key === ' ') {
                              handleNotificationClick(notif);
                            }
                          }}
                        >
                          <div className="mt-0.5 shrink-0">
                            <span className="text-sm" role="img" aria-label="alert icon">
                              {notifType === 'new_post' ? '💬' : notifType === 'new_announcement' ? '🚨' : '📅'}
                            </span>
                          </div>
                          <div className="text-left">
                            <p className="font-bold text-navy-950 text-[10.5px] leading-tight">{notif.title}</p>
                            <p className="text-[9px] text-navy-500 leading-tight mt-0.5">{messageText}</p>
                            <p className="text-[7.5px] text-navy-400 font-mono mt-1 uppercase">
                              {getRelativeTime(notif.created_at)}
                            </p>
                          </div>
                        </div>
                      );
                    })
                  ) : (
                    <p className="py-8 text-center text-navy-400 italic text-[10px]" id="header-notif-empty">
                      Registry is completely quiet.
                    </p>
                  )}
                </div>
              </div>
            )}
          </div>

          {/* User Mini-Card profile */}
          {userDetails && (
            <div className="flex items-center gap-2 border-l border-white/10 pl-3.5" id="header-user-profile-widget">
              <img 
                id="header-user-avatar"
                src={userDetails.avatarUrl} 
                alt={userDetails.name} 
                className="w-8.5 h-8.5 rounded-full object-cover border border-[#c5a059] cursor-pointer hover:scale-105 transition-transform focus:outline-none focus-visible:ring-2 focus-visible:ring-gold-500"
                onClick={() => onTabChange('profile')}
                referrerPolicy="no-referrer"
                role="button"
                tabIndex={0}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' || e.key === ' ') {
                    onTabChange('profile');
                  }
                }}
              />
              <div className="hidden md:flex flex-col text-left">
                <span className="font-bold text-xs uppercase tracking-wide leading-tight">
                  {userDetails.name.split(' ')[0]}
                </span>
                <span className="text-[8.5px] text-gold-400 font-mono font-bold uppercase leading-tight mt-0.5">
                  SLAVE: {userDetails.slaveName}
                </span>
              </div>

              {/* Sign out */}
              <button 
                id="header-btn-logout"
                onClick={onLogout}
                title="Sign Out of Secure Session"
                className="p-1.5 rounded-full text-navy-400 hover:text-red-400 transition-colors cursor-pointer ml-1.5 focus:outline-none focus-visible:ring-2 focus-visible:ring-red-500"
                aria-label="Sign out of secure session"
              >
                <LogOut className="w-4.5 h-4.5" />
              </button>
            </div>
          )}

          {/* Mobile hamburger menu toggle */}
          <button 
            id="header-btn-mobile-menu"
            onClick={onMobileMenuToggle}
            className="md:hidden p-2 hover:bg-white/10 rounded-lg text-white cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-gold-500/50"
            aria-label="Toggle main mobile navigation drawer"
          >
            <Menu className="w-5 h-5" />
          </button>

        </div>

      </div>
    </header>
  );
}
