import React from 'react';
import { Sidebar, PortalTab } from './Sidebar';
import { Header } from './Header';
import { MobileDrawer } from './MobileDrawer';
import { HeroBanner } from './HeroBanner';
import { Member, Notification } from '../../types';

export interface AppLayoutProps {
  children: React.ReactNode;
  activeTab: PortalTab;
  onTabChange: (tabId: PortalTab) => void;
  currentUser: Member | null;
  notifications: Notification[];
  onMarkNotificationRead: (id: string) => void;
  onClearNotifications: () => void;
  onLogout: () => void;
  onNavigateToPublic?: () => void;
  onMobileMenuToggle: () => void;
  mobileMenuOpen: boolean;
  onMobileMenuClose: () => void;
}

export function AppLayout({
  children,
  activeTab,
  onTabChange,
  currentUser,
  notifications = [],
  onMarkNotificationRead,
  onClearNotifications,
  onLogout,
  onNavigateToPublic,
  onMobileMenuToggle,
  mobileMenuOpen,
  onMobileMenuClose
}: AppLayoutProps) {
  
  // Count unread notifications for sidebar badge
  const unreadCount = notifications.filter(n => !n.is_read).length;

  // Determine administrative state safely for administrative portal action visibility
  const isAdmin = currentUser?.role === 'Admin' || currentUser?.role === 'Officer';

  return (
    <div 
      id="lbp-portal-layout-container" 
      className="min-h-screen bg-navy-900 text-slate-100 flex flex-col overflow-hidden"
    >
      {/* 1. Portal Header orchestration (Top Navigation viewports) */}
      <Header
        activeTab={activeTab}
        onTabChange={onTabChange}
        currentUser={currentUser}
        notifications={notifications}
        onMarkNotificationRead={onMarkNotificationRead}
        onClearNotifications={onClearNotifications}
        onLogout={onLogout}
        onNavigateToPublic={onNavigateToPublic}
        onMobileMenuToggle={onMobileMenuToggle}
      />

      {/* 2. Main Portal Split pane container */}
      <div 
        id="lbp-portal-body-wrapper" 
        className="flex flex-1 relative overflow-hidden"
      >
        {/* Desktop Left-Rail Sidebar (Desktop Navigation) */}
        <Sidebar
          activeTab={activeTab}
          onTabChange={onTabChange}
          unreadNotificationsCount={unreadCount}
          isAdmin={isAdmin}
          onLogout={onLogout}
        />

        {/* Mobile Navigation Drawer Overlay */}
        <MobileDrawer 
          isOpen={mobileMenuOpen} 
          onClose={onMobileMenuClose} 
          activeTab={activeTab} 
          onTabChange={onTabChange} 
          unreadNotificationsCount={unreadCount}
          isAdmin={isAdmin}
          onLogout={onLogout}
        />

        {/* 3. Main content viewport containing dynamic boards & feeds */}
        <main 
          id="lbp-portal-main-viewport" 
          className="flex-1 overflow-y-auto p-4 md:p-6 bg-[#f7f5f0] text-navy-950 scrollbar-thin scrollbar-thumb-navy-950/10 scrollbar-track-transparent"
        >
          {/* HeroBanner presenting high-impact greeting cards */}
          <HeroBanner activeTab={activeTab} currentUser={currentUser} />

          <div className="max-w-7xl mx-auto w-full relative">
            {/* Dynamic Viewport main slot rendering the active page view */}
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}
