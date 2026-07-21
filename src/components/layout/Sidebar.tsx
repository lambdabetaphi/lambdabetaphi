import React, { useMemo } from 'react';
import { 
  Compass, Users, FolderOpen, Calendar, Volume2, Crown, Bell, User, Settings, Shield, LogOut,
  type LucideIcon 
} from 'lucide-react';
import { motion } from 'motion/react';
import CrestLogo from '../CrestLogo';

// Strongly typed navigation tab union for superior compile-time safety
export type PortalTab = 
  | 'home' 
  | 'directory' 
  | 'gallery' 
  | 'events' 
  | 'announcements' 
  | 'officers' 
  | 'notifications' 
  | 'profile' 
  | 'settings' 
  | 'admin';

export interface SidebarProps {
  activeTab: PortalTab | string;
  onTabChange: (tabId: PortalTab) => void;
  unreadNotificationsCount?: number;
  isAdmin?: boolean;
  onLogout?: () => void;
}

interface SidebarItemProps {
  id: PortalTab;
  label: string;
  icon: LucideIcon;
  isActive: boolean;
  badge?: number;
  onClick: () => void;
  key?: React.Key; // Satisfies strict JSX compilers during dynamic list mapping
}

// Extracted SidebarItem sub-component for premium modularity and isolation
function SidebarItem({
  id,
  label,
  icon: IconComponent,
  isActive,
  badge,
  onClick
}: SidebarItemProps) {
  return (
    <button
      id={`sidebar-nav-${id}`}
      onClick={onClick}
      aria-current={isActive ? 'page' : undefined}
      className={`w-full group flex items-center justify-between px-3.5 py-3 text-xs font-bold tracking-wide uppercase transition-all duration-300 rounded-xl relative cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-gold-500/50 ${
        isActive
          ? 'text-gold-400 bg-white/5 border border-gold-500/10'
          : 'text-navy-300 hover:text-white hover:bg-white/5 border border-transparent'
      }`}
    >
      {/* Dynamic motion highlight active slide-in bar */}
      {isActive && (
        <motion.div
          layoutId="activeSidebarIndicator"
          id={`sidebar-active-indicator-${id}`}
          className="absolute left-0 top-2 bottom-2 w-1 bg-gradient-to-b from-gold-400 to-gold-600 rounded-r-full"
          transition={{ type: 'spring', stiffness: 380, damping: 30 }}
        />
      )}

      <div className="flex items-center gap-3">
        <IconComponent 
          className={`w-4 h-4 shrink-0 transition-transform group-hover:scale-105 duration-200 ${
            isActive ? 'text-gold-400' : 'text-navy-400 group-hover:text-gold-500'
          }`} 
        />
        <span className="leading-none">{label}</span>
      </div>

      {/* Conditional unread count indicator */}
      {badge !== undefined && badge > 0 && (
        <span 
          id={`sidebar-badge-${id}`}
          className="px-2 py-0.5 text-[8.5px] font-mono font-black text-white bg-rose-500 rounded-full shadow border border-navy-950 animate-pulse shrink-0"
        >
          {badge}
        </span>
      )}
    </button>
  );
}

export function Sidebar({
  activeTab,
  onTabChange,
  unreadNotificationsCount = 0,
  isAdmin = false,
  onLogout
}: SidebarProps) {
  
  // Wrap navigation structures inside useMemo to avoid array reconstruction overhead on renders
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

  return (
    <aside 
      id="lbp-desktop-sidebar" 
      className="hidden lg:flex flex-col w-64 h-[calc(100vh-4rem)] sticky top-16 bg-navy-950 border-r border-[#c5a059]/10 text-white shrink-0 shadow-xl overflow-hidden font-sans"
    >
      {/* Decorative Brand Header */}
      <div 
        id="sidebar-brand-container" 
        className="flex items-center gap-3 px-6 py-5 border-b border-[#c5a059]/10 bg-navy-950/40 shrink-0"
      >
        <CrestLogo size={36} className="border border-[#c5a059]/30 rounded-full bg-navy-900/40 shadow" />
        <div className="flex flex-col text-left">
          <span className="font-serif font-black tracking-widest text-[11px] text-gold-400">
            LAMBDA BETA PHI
          </span>
          <span className="font-sans text-[7.5px] tracking-widest uppercase text-navy-300">
            SOVEREIGN COUNCIL
          </span>
        </div>
      </div>

      {/* Navigation List Container */}
      <nav 
        id="sidebar-nav-container" 
        role="navigation"
        aria-label="Primary Portal Navigation"
        className="flex-1 py-4 px-4 overflow-y-auto space-y-1 scrollbar-thin scrollbar-thumb-navy-900 scrollbar-track-transparent"
      >
        {navItems.map((item) => (
          <SidebarItem
            key={item.id}
            id={item.id}
            label={item.label}
            icon={item.icon}
            isActive={activeTab === item.id}
            badge={item.badge}
            onClick={() => onTabChange(item.id)}
          />
        ))}
      </nav>

      {/* Sidebar Footer containing Optional Sign Out Action */}
      {onLogout && (
        <div 
          id="sidebar-footer-container" 
          className="p-4 border-t border-[#c5a059]/10 bg-navy-950/20 shrink-0"
        >
          <button
            id="sidebar-nav-logout"
            onClick={onLogout}
            className="w-full flex items-center gap-3 px-3.5 py-3 text-xs font-bold tracking-wide uppercase text-rose-400 hover:text-rose-300 hover:bg-rose-500/5 rounded-xl transition-all duration-300 cursor-pointer border border-transparent hover:border-rose-500/10 focus:outline-none focus-visible:ring-2 focus-visible:ring-rose-500/50"
          >
            <LogOut className="w-4 h-4 shrink-0" />
            <span className="leading-none">Sign Out Ledger</span>
          </button>
        </div>
      )}
    </aside>
  );
}
