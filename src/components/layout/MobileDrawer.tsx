import React, { useEffect, useRef, useMemo } from 'react';
import { 
  Compass, Users, FolderOpen, Calendar, Volume2, Crown, Bell, User, Settings, Shield, LogOut, X,
  type LucideIcon 
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import CrestLogo from '../CrestLogo';
import { PortalTab } from './Sidebar';

export interface MobileDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  activeTab: PortalTab;
  onTabChange: (tabId: PortalTab) => void;
  unreadNotificationsCount?: number;
  isAdmin?: boolean;
  onLogout?: () => void;
}

interface DrawerItemProps {
  id: PortalTab;
  label: string;
  icon: LucideIcon;
  isActive: boolean;
  badge?: number;
  onClick: () => void;
  key?: React.Key;
}

function DrawerItem({
  id,
  label,
  icon: IconComponent,
  isActive,
  badge,
  onClick
}: DrawerItemProps) {
  return (
    <button
      id={`mobile-drawer-nav-${id}`}
      onClick={onClick}
      aria-current={isActive ? 'page' : undefined}
      className={`w-full group flex items-center justify-between px-4 py-3.5 text-xs font-bold tracking-wide uppercase transition-all duration-300 rounded-xl relative cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-gold-500/50 ${
        isActive
          ? 'text-gold-400 bg-white/5 border border-gold-500/10'
          : 'text-navy-300 hover:text-white hover:bg-white/5 border border-transparent'
      }`}
    >
      <div className="flex items-center gap-3">
        <IconComponent 
          className={`w-4 h-4 shrink-0 transition-transform group-hover:scale-105 duration-200 ${
            isActive ? 'text-gold-400' : 'text-navy-400 group-hover:text-gold-500'
          }`} 
        />
        <span className="leading-none">{label}</span>
      </div>

      {badge !== undefined && badge > 0 && (
        <span 
          id={`mobile-drawer-badge-${id}`}
          className="px-2 py-0.5 text-[8.5px] font-mono font-black text-white bg-rose-500 rounded-full shadow border border-navy-950 shrink-0"
        >
          {badge}
        </span>
      )}
    </button>
  );
}

export function MobileDrawer({
  isOpen,
  onClose,
  activeTab,
  onTabChange,
  unreadNotificationsCount = 0,
  isAdmin = false,
  onLogout
}: MobileDrawerProps) {
  const drawerRef = useRef<HTMLDivElement>(null);
  const closeButtonRef = useRef<HTMLButtonElement>(null);

  // 1. Lock/Unlock scrolling on the body when drawer is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  // 2. Keyboard interaction: close on Escape key and handle simple focus trapping
  useEffect(() => {
    function handleKeyDown(event: KeyboardEvent) {
      if (!isOpen) return;

      if (event.key === 'Escape') {
        onClose();
      }

      // Simple Focus Lock
      if (event.key === 'Tab' && drawerRef.current) {
        const focusableElements = drawerRef.current.querySelectorAll(
          'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
        );
        const firstElement = focusableElements[0] as HTMLElement;
        const lastElement = focusableElements[focusableElements.length - 1] as HTMLElement;

        if (event.shiftKey) {
          if (document.activeElement === firstElement) {
            lastElement.focus();
            event.preventDefault();
          }
        } else {
          if (document.activeElement === lastElement) {
            firstElement.focus();
            event.preventDefault();
          }
        }
      }
    }

    document.addEventListener('keydown', handleKeyDown);
    if (isOpen && closeButtonRef.current) {
      // Focus close button on open for instant accessibility action
      closeButtonRef.current.focus();
    }

    return () => {
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen, onClose]);

  // Reuse same navigation layout schemas
  const navItems = useMemo(() => {
    const items = [
      { id: 'home' as PortalTab, label: 'News Feed', icon: Compass },
      { id: 'directory' as PortalTab, label: 'Members Directory', icon: Users },
      { id: 'gallery' as PortalTab, label: 'Media Gallery', icon: FolderOpen },
      { id: 'events' as PortalTab, label: 'Assemblies & Calendar', icon: Calendar },
      { id: 'announcements' as PortalTab, label: 'Directives Board', icon: Volume2 },
      { id: 'officers' as PortalTab, label: 'Executive Board', icon: Crown },
      { 
        id: 'notifications' as PortalTab, 
        label: 'System Alerts', 
        icon: Bell, 
        badge: unreadNotificationsCount > 0 ? unreadNotificationsCount : undefined 
      },
      { id: 'profile' as PortalTab, label: 'Personal Dossier', icon: User },
      { id: 'settings' as PortalTab, label: 'Settings & Cloud', icon: Settings },
    ];

    if (isAdmin) {
      items.push({ id: 'admin' as PortalTab, label: 'Executive Admin', icon: Shield });
    }

    return items;
  }, [isAdmin, unreadNotificationsCount]);

  const handleTabSelect = (tabId: PortalTab) => {
    onTabChange(tabId);
    onClose();
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div id="mobile-drawer-portal-wrapper" className="fixed inset-0 z-50 lg:hidden flex">
          
          {/* Backdrop Overlay with fade-in animation */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.6 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            id="mobile-drawer-backdrop"
            className="fixed inset-0 bg-navy-950 cursor-pointer"
            aria-hidden="true"
          />

          {/* Drawer Sidebar with slide-in animation */}
          <motion.div
            ref={drawerRef}
            initial={{ x: '-100%' }}
            animate={{ x: 0 }}
            exit={{ x: '-100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 220 }}
            id="mobile-drawer-container"
            role="dialog"
            aria-modal="true"
            aria-label="Mobile Navigation Menu"
            className="relative w-80 max-w-[85vw] h-full bg-navy-950 border-r border-[#c5a059]/20 text-white flex flex-col shadow-2xl z-10"
          >
            {/* Header: Brand & Close Action */}
            <div 
              id="mobile-drawer-header" 
              className="flex items-center justify-between px-5 py-4 border-b border-[#c5a059]/10 bg-navy-950/40"
            >
              <div className="flex items-center gap-2.5">
                <CrestLogo size={32} className="border border-[#c5a059]/30 rounded-full" />
                <div className="flex flex-col text-left">
                  <span className="font-serif font-black tracking-wider text-[10px] text-gold-400">
                    LAMBDA BETA PHI
                  </span>
                  <span className="font-sans text-[6.5px] tracking-widest uppercase text-navy-300 leading-none">
                    SOVEREIGN COUNCIL
                  </span>
                </div>
              </div>

              <button
                ref={closeButtonRef}
                id="mobile-drawer-btn-close"
                onClick={onClose}
                aria-label="Close mobile navigation menu"
                className="p-1.5 rounded-lg text-navy-300 hover:text-white hover:bg-white/10 transition-colors cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-gold-500/50"
              >
                <X className="w-5 h-5 shrink-0" />
              </button>
            </div>

            {/* Navigation Body */}
            <nav 
              id="mobile-drawer-nav-list"
              className="flex-1 py-4 px-3 overflow-y-auto space-y-1.5"
            >
              {navItems.map((item) => (
                <DrawerItem
                  key={item.id}
                  id={item.id}
                  label={item.label}
                  icon={item.icon}
                  isActive={activeTab === item.id}
                  badge={item.badge}
                  onClick={() => handleTabSelect(item.id)}
                />
              ))}
            </nav>

            {/* Drawer Footer Actions */}
            {onLogout && (
              <div 
                id="mobile-drawer-footer" 
                className="p-4 border-t border-[#c5a059]/10 bg-navy-950/20 shrink-0"
              >
                <button
                  id="mobile-drawer-btn-logout"
                  onClick={() => {
                    onClose();
                    onLogout();
                  }}
                  className="w-full flex items-center gap-3 px-3.5 py-3 text-xs font-bold tracking-wide uppercase text-rose-400 hover:text-rose-300 hover:bg-rose-500/5 rounded-xl transition-all duration-300 cursor-pointer border border-transparent hover:border-rose-500/10 focus:outline-none focus-visible:ring-2 focus-visible:ring-rose-500/50"
                >
                  <LogOut className="w-4 h-4 shrink-0" />
                  <span className="leading-none">Sign Out Ledger</span>
                </button>
              </div>
            )}
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
