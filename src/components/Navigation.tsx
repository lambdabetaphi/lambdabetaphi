import React, { useState } from 'react';
import { Menu, X, LogOut, User, Crown } from 'lucide-react';
import { Member } from '../types';
import CrestLogo from './CrestLogo';

interface NavigationProps {
  activeTab: 'home' | 'about' | 'news' | 'events' | 'portal';
  setActiveTab: (tab: 'home' | 'about' | 'news' | 'events' | 'portal') => void;
  currentUser: Member | null;
  onLogout: () => void;
}

export default function Navigation({ activeTab, setActiveTab, currentUser, onLogout }: NavigationProps) {
  const [isOpen, setIsOpen] = useState(false);

  const navItems = [
    { id: 'home', label: 'Home' },
    { id: 'about', label: 'About' },
    { id: 'news', label: 'News' },
    { id: 'events', label: 'Events' },
    { id: 'portal', label: currentUser ? 'Portal' : 'Login' },
  ];

  return (
    <nav className="sticky top-0 z-50 bg-white text-navy-950 border-b border-navy-950/10 h-16 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-full">
        <div className="flex items-center justify-between h-full">
          
          {/* Logo / Greek Emblem */}
          <div 
            onClick={() => setActiveTab('home')} 
            className="flex items-center gap-2.5 cursor-pointer group h-full"
          >
            <CrestLogo size={44} className="transition-transform group-hover:scale-105" />
            
            <div className="flex flex-col">
              <span className="font-serif font-black tracking-wider text-sm text-navy-950">
                Lambda Beta Phi
              </span>
              <span className="font-sans text-[8px] tracking-widest uppercase text-navy-400">
                National Organization
              </span>
            </div>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-6 h-full">
            <div className="flex gap-6 h-full items-center">
              {navItems.map((item) => {
                const isActive = activeTab === item.id;
                return (
                  <button
                    key={item.id}
                    onClick={() => {
                      setActiveTab(item.id as any);
                      setIsOpen(false);
                    }}
                    className={`h-16 px-2 text-[11px] font-semibold uppercase tracking-widest transition-all duration-150 flex items-center border-b-2 ${
                      isActive 
                        ? 'text-gold-500 border-gold-500' 
                        : 'text-navy-950/70 border-transparent hover:text-gold-500 hover:border-gold-500/30'
                    }`}
                  >
                    {item.label}
                  </button>
                );
              })}
            </div>

            {/* User Account Quick Link */}
            {currentUser ? (
              <div className="flex items-center gap-3 ml-4 pl-4 border-l border-navy-950/10 h-8">
                <button 
                  onClick={() => setActiveTab('portal')}
                  className="flex items-center gap-2 text-[10px] text-navy-950 hover:text-gold-500 bg-navy-950/5 hover:bg-navy-950/10 px-3 py-1.5 rounded-none border border-navy-950/15 transition-all cursor-pointer font-bold uppercase tracking-wider"
                >
                  <img 
                    src={currentUser.avatar_url} 
                    alt={currentUser.full_name} 
                    className="w-4 h-4 rounded-none object-cover border border-gold-500"
                    referrerPolicy="no-referrer"
                  />
                  <span className="max-w-[80px] truncate">{currentUser.full_name.split(' ')[0]}</span>
                </button>
                <button 
                  onClick={onLogout}
                  title="Sign Out"
                  className="p-1 rounded-none text-navy-500 hover:text-red-600 transition-colors"
                >
                  <LogOut className="w-4 h-4" />
                </button>
              </div>
            ) : (
              <button 
                onClick={() => setActiveTab('portal')}
                className="px-6 py-2 bg-navy-950 text-gold-500 text-[10px] font-bold uppercase tracking-widest rounded-none hover:bg-navy-800 transition-colors"
              >
                Member Portal
              </button>
            )}
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden flex items-center gap-2">
            {currentUser && (
              <button 
                onClick={() => setActiveTab('portal')}
                className="flex items-center justify-center w-8 h-8 rounded-none border border-gold-500 overflow-hidden"
              >
                <img 
                  src={currentUser.avatar_url} 
                  alt={currentUser.full_name} 
                  className="w-full h-full object-cover" 
                  referrerPolicy="no-referrer"
                />
              </button>
            )}
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="inline-flex items-center justify-center p-2 rounded-none text-navy-950 hover:bg-navy-950/5 focus:outline-none"
            >
              {isOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {isOpen && (
        <div className="md:hidden bg-white border-b border-navy-950/10 px-4 pt-2 pb-4 space-y-1 animate-fade-in shadow-md absolute w-full left-0 z-50">
          {navItems.map((item) => {
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => {
                  setActiveTab(item.id as any);
                  setIsOpen(false);
                }}
                className={`w-full text-left block px-4 py-2.5 text-[11px] font-semibold uppercase tracking-widest transition-colors ${
                  isActive 
                    ? 'bg-navy-950/5 text-gold-500 border-l-2 border-gold-500 font-bold' 
                    : 'text-navy-950/70 hover:bg-navy-950/5 hover:text-navy-950'
                }`}
              >
                {item.label}
              </button>
            );
          })}
          
          {currentUser ? (
            <div className="pt-4 mt-2 border-t border-navy-950/10 flex items-center justify-between px-4">
              <div className="flex items-center gap-3">
                <img 
                  src={currentUser.avatar_url} 
                  alt={currentUser.full_name} 
                  className="w-8 h-8 rounded-none object-cover border border-gold-500"
                  referrerPolicy="no-referrer"
                />
                <div>
                  <p className="text-xs font-bold text-navy-950">{currentUser.full_name}</p>
                  <p className="text-[9px] uppercase tracking-wider text-navy-400 font-bold">{currentUser.role}</p>
                </div>
              </div>
              <button 
                onClick={() => {
                  onLogout();
                  setIsOpen(false);
                }}
                className="flex items-center gap-1.5 text-[9px] font-bold uppercase tracking-wider text-red-600 bg-red-50 border border-red-200 py-1.5 px-3 rounded-none hover:bg-red-100"
              >
                <LogOut className="w-3.5 h-3.5" />
                Sign Out
              </button>
            </div>
          ) : (
            <div className="pt-4 mt-2 border-t border-navy-950/10">
              <button 
                onClick={() => {
                  setActiveTab('portal');
                  setIsOpen(false);
                }}
                className="w-full flex items-center justify-center gap-2 bg-navy-950 text-gold-500 font-bold py-2.5 px-4 rounded-none text-xs uppercase tracking-widest shadow-sm"
              >
                <User className="w-3.5 h-3.5" />
                Portal Sign In
              </button>
            </div>
          )}
        </div>
      )}
    </nav>
  );
}
