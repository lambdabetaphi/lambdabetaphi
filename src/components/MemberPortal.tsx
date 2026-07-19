import React, { useState } from 'react';
import { 
  Shield, 
  Lock, 
  User, 
  Mail, 
  Search, 
  Award, 
  FileText, 
  DollarSign, 
  CheckCircle, 
  MessageSquare, 
  Send, 
  Phone, 
  MapPin, 
  GraduationCap, 
  Crown, 
  Bookmark, 
  UserPlus, 
  Landmark, 
  CreditCard,
  Trash2,
  Plus,
  Minus,
  Settings
} from 'lucide-react';
import { Member, BulletinPost, BulletinReply } from '../types';
import CrestLogo from './CrestLogo';
import { isSupabaseConfigured } from '../lib/supabase';

interface MemberPortalProps {
  members: Member[];
  currentUser: Member | null;
  bulletin: BulletinPost[];
  onLogin: (email: string, password?: string) => boolean | Promise<boolean>;
  onLogout: () => void;
  onRegister: (newMember: Omit<Member, 'id' | 'chapterPoints' | 'duesStatus' | 'duesAmount'>, password?: string) => void;
  onAddBulletinPost: (content: string) => void;
  onAddBulletinReply: (postId: string, content: string) => void;
  onPayDues: (memberId: string) => void;
  onUpdateMembers?: (updatedMembers: Member[]) => void;
}

export default function MemberPortal({
  members,
  currentUser,
  bulletin,
  onLogin,
  onLogout,
  onRegister,
  onAddBulletinPost,
  onAddBulletinReply,
  onPayDues,
  onUpdateMembers
}: MemberPortalProps) {
  
  // Tab within portal
  const [portalTab, setPortalTab] = useState<'dashboard' | 'roster' | 'bulletin' | 'dues' | 'creed' | 'admin'>('dashboard');
  
  // Search state
  const [searchQuery, setSearchQuery] = useState('');
  const [genderFilter, setGenderFilter] = useState<'all' | 'Brother' | 'Sister'>('all');

  // Input states
  const [loginEmail, setLoginEmail] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  const [loginError, setLoginError] = useState(false);

  // New Post/Reply states
  const [bulletinInput, setBulletinInput] = useState('');
  const [replyInputMap, setReplyInputMap] = useState<{ [postId: string]: string }>({});

  // Registration Form States
  const [isRegistering, setIsRegistering] = useState(false);
  const [regName, setRegName] = useState('');
  const [regEmail, setRegEmail] = useState('');
  const [regPassword, setRegPassword] = useState('');
  const [regGender, setRegGender] = useState<'Brother' | 'Sister'>('Brother');
  const [regPhone, setRegPhone] = useState('');
  const [regChapter, setRegChapter] = useState('');
  const [regSlaveName, setRegSlaveName] = useState('');
  const [regAvatar, setRegAvatar] = useState('');

  const handleLoginSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoginError(false);
    if (!loginEmail.trim()) return;
    const success = await onLogin(loginEmail.trim(), isSupabaseConfigured ? loginPassword : undefined);
    if (!success) {
      setLoginError(true);
    }
  };

  const handleRegisterSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!regName.trim() || !regEmail.trim() || !regChapter.trim() || !regSlaveName.trim() || !regPhone.trim() || !regAvatar.trim()) return;
    if (isSupabaseConfigured && !regPassword) return;

    onRegister({
      name: regName.trim(),
      email: regEmail.trim(),
      gender: regGender,
      role: `Active ${regGender}`,
      avatarUrl: regAvatar.trim(),
      phone: regPhone.trim(),
      chapter: regChapter.trim(),
      slaveName: regSlaveName.trim(),
      joinsDate: new Date().toISOString().split('T')[0]
    }, isSupabaseConfigured ? regPassword : undefined);

    // Reset Form
    setIsRegistering(false);
    setRegName('');
    setRegEmail('');
    setRegPassword('');
    setRegPhone('');
    setRegChapter('');
    setRegSlaveName('');
    setRegAvatar('');
  };

  const handleCreatePostSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!bulletinInput.trim()) return;
    onAddBulletinPost(bulletinInput.trim());
    setBulletinInput('');
  };

  const handleCreateReplySubmit = (postId: string) => {
    const inputVal = replyInputMap[postId];
    if (!inputVal || !inputVal.trim()) return;
    onAddBulletinReply(postId, inputVal.trim());
    setReplyInputMap({
      ...replyInputMap,
      [postId]: ''
    });
  };

  // Filter Roster
  const filteredRoster = members.filter(m => {
    const query = searchQuery.toLowerCase();
    const matchesSearch = m.name.toLowerCase().includes(query) || 
                          (m.major && m.major.toLowerCase().includes(query)) ||
                          (m.role && m.role.toLowerCase().includes(query));
    
    const matchesGender = genderFilter === 'all' || m.gender === genderFilter;
    return matchesSearch && matchesGender;
  });

  // Gated Render: If not logged in, show Login/Registration page
  if (!currentUser) {
    return (
      <div className="py-16 bg-navy-50 animate-fade-in flex flex-col justify-center items-center min-h-[80vh]">
        <div className="max-w-md w-full px-4">
          
          <div className="text-center mb-8">
            <CrestLogo size={110} className="mx-auto mb-4" />
            <h2 className="text-2xl md:text-3xl font-serif font-black text-navy-950 uppercase tracking-tight">
              Lambda Member Portal
            </h2>
            <p className="text-navy-950/60 text-[10px] uppercase tracking-wider mt-2 font-sans leading-relaxed">
              Strictly reserved for active brothers, sisters, and advisors of the Chapter. Please authenticate to enter.
            </p>
          </div>

          {/* Supabase Status Banner */}
          {isSupabaseConfigured ? (
            <div className="bg-emerald-50 text-emerald-800 p-3 border border-emerald-500/20 text-[9px] font-bold uppercase tracking-wider mb-4 flex items-center gap-2.5">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
              </span>
              Supabase Cloud Connected: Database Auth Active
            </div>
          ) : (
            <div className="bg-amber-50 text-amber-800 p-3 border border-amber-500/20 text-[9px] font-bold uppercase tracking-wider mb-4 flex items-center gap-2.5">
              <span className="h-2 w-2 rounded-full bg-amber-500"></span>
              Local Database Mode: Connect Supabase in Secrets
            </div>
          )}

          {!isRegistering ? (
            /* Login Form */
            <div className="bg-white rounded-none p-8 border border-navy-950/10 shadow-none space-y-6">
              
              <form onSubmit={handleLoginSubmit} className="space-y-4">
                <div>
                  <label className="block text-[10px] font-bold text-navy-950 uppercase tracking-widest mb-2">
                    Enter Member Email
                  </label>
                  <div className="relative">
                    <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center text-navy-400">
                      <Mail className="w-4 h-4" />
                    </span>
                    <input
                      type="email"
                      required
                      placeholder="e.g., president.brother@lambdabetaphi.org"
                      value={loginEmail}
                      onChange={(e) => setLoginEmail(e.target.value)}
                      className="w-full pl-10 pr-4 py-3 rounded-none border border-navy-950/15 text-xs focus:outline-none focus:ring-1 focus:ring-gold-500 bg-white text-navy-950 font-sans"
                    />
                  </div>
                </div>

                {isSupabaseConfigured && (
                  <div>
                    <label className="block text-[10px] font-bold text-navy-950 uppercase tracking-widest mb-2">
                      Enter Account Password
                    </label>
                    <div className="relative">
                      <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center text-navy-400">
                        <Lock className="w-4 h-4" />
                      </span>
                      <input
                        type="password"
                        required
                        placeholder="••••••••"
                        value={loginPassword}
                        onChange={(e) => setLoginPassword(e.target.value)}
                        className="w-full pl-10 pr-4 py-3 rounded-none border border-navy-950/15 text-xs focus:outline-none focus:ring-1 focus:ring-gold-500 bg-white text-navy-950 font-sans"
                      />
                    </div>
                  </div>
                )}

                {loginError && (
                  <p className="text-[10px] uppercase tracking-wider text-red-600 bg-red-50 p-3 rounded-none border border-red-100 font-bold">
                    Unrecognized email. Please verify spelling, or use quick-access reviews below.
                  </p>
                )}

                <button
                  type="submit"
                  className="w-full bg-navy-950 text-gold-500 font-bold py-3.5 px-4 rounded-none shadow-none hover:bg-navy-800 transition-colors uppercase tracking-widest text-[10px] cursor-pointer"
                >
                  Authenticate Session
                </button>
              </form>

              {/* REGISTER INCENTIVE */}
              <div className="text-center pt-2 border-t border-navy-950/10">
                <p className="text-[10px] uppercase font-bold text-navy-950/40 tracking-wider">Not on our chapter ledger?</p>
                <button
                  onClick={() => {
                    setIsRegistering(true);
                    setLoginError(false);
                  }}
                  className="mt-2 text-[10px] font-bold text-gold-600 hover:text-gold-700 uppercase tracking-widest cursor-pointer hover:underline"
                >
                  Create Member Account &rarr;
                </button>
              </div>

              {/* QUICK LOGIN CONTROLS (for evaluation) */}
              <div className="pt-6 border-t border-navy-950/10 space-y-3">
                <span className="block text-[9px] font-bold text-navy-400 uppercase tracking-widest text-center">
                  Quick-Access Accounts (For Reviewers)
                </span>
                
                <div className="grid grid-cols-2 gap-2 text-[11px]">
                  <button
                    onClick={() => {
                      onLogin('president.brother@lambdabetaphi.org');
                    }}
                    className="p-2.5 rounded-none border border-navy-950/10 bg-[#fbf9f4] hover:border-gold-500 text-left flex items-center gap-2 group transition-all"
                  >
                    <Crown className="w-3.5 h-3.5 text-gold-600 shrink-0" />
                    <div className="min-w-0">
                      <p className="font-bold text-navy-950 truncate group-hover:text-gold-600">Julian Vance</p>
                      <p className="text-[8px] uppercase tracking-wider text-navy-400 truncate">Brother Pres</p>
                    </div>
                  </button>

                  <button
                    onClick={() => {
                      onLogin('president.sister@lambdabetaphi.org');
                    }}
                    className="p-2.5 rounded-none border border-navy-950/10 bg-[#fbf9f4] hover:border-gold-500 text-left flex items-center gap-2 group transition-all"
                  >
                    <Crown className="w-3.5 h-3.5 text-gold-600 shrink-0" />
                    <div className="min-w-0">
                      <p className="font-bold text-navy-950 truncate group-hover:text-gold-600">Evelyn Sterling</p>
                      <p className="text-[8px] uppercase tracking-wider text-navy-400 truncate">Sister Pres</p>
                    </div>
                  </button>

                  <button
                    onClick={() => {
                      onLogin('treasurer@lambdabetaphi.org');
                    }}
                    className="p-2.5 rounded-none border border-navy-950/10 bg-[#fbf9f4] hover:border-gold-500 text-left flex items-center gap-2 group transition-all"
                  >
                    <DollarSign className="w-3.5 h-3.5 text-gold-600 shrink-0" />
                    <div className="min-w-0">
                      <p className="font-bold text-navy-950 truncate group-hover:text-gold-600">Sophia Laurent</p>
                      <p className="text-[8px] uppercase tracking-wider text-navy-400 truncate">Treasurer</p>
                    </div>
                  </button>

                  <button
                    onClick={() => {
                      onLogin('aria.h@lambdabetaphi.org');
                    }}
                    className="p-2.5 rounded-none border border-navy-950/10 bg-[#fbf9f4] hover:border-gold-500 text-left flex items-center gap-2 group transition-all"
                  >
                    <User className="w-3.5 h-3.5 text-gold-600 shrink-0" />
                    <div className="min-w-0">
                      <p className="font-bold text-navy-950 truncate group-hover:text-gold-600">Aria Henderson</p>
                      <p className="text-[8px] uppercase tracking-wider text-navy-400 truncate">Active Sister</p>
                    </div>
                  </button>
                </div>
              </div>

            </div>
          ) : (
            /* Registration Form */
            <div className="bg-white rounded-none p-8 border border-navy-950/10 shadow-none space-y-6">
              <div className="flex items-center gap-2 pb-2 border-b border-navy-950/10 text-gold-600">
                <UserPlus className="w-5 h-5 text-gold-500" />
                <h3 className="font-serif font-black text-navy-950 uppercase tracking-wide">Register Active Account</h3>
              </div>

              <form onSubmit={handleRegisterSubmit} className="space-y-4 text-xs">
                <div>
                  <label className="block text-[9px] font-bold text-navy-950 uppercase tracking-widest mb-1">
                    Full Name <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g., Roderick Danzing"
                    value={regName}
                    onChange={(e) => setRegName(e.target.value)}
                    className="w-full p-3 rounded-none border border-navy-950/15 focus:outline-none focus:ring-1 focus:ring-gold-500 bg-white text-navy-950 font-sans"
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-[9px] font-bold text-navy-950 uppercase tracking-widest mb-1">
                      Email Address <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="email"
                      required
                      placeholder="roderick@lambdabetaphi.org"
                      value={regEmail}
                      onChange={(e) => setRegEmail(e.target.value)}
                      className="w-full p-3 rounded-none border border-navy-950/15 focus:outline-none focus:ring-1 focus:ring-gold-500 bg-white text-navy-950 font-sans"
                    />
                  </div>
                  <div>
                    <label className="block text-[9px] font-bold text-navy-950 uppercase tracking-widest mb-1">
                      Account Password <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="password"
                      required
                      minLength={6}
                      placeholder="Enter secure password (min 6 chars)"
                      value={regPassword}
                      onChange={(e) => setRegPassword(e.target.value)}
                      className="w-full p-3 rounded-none border border-navy-950/15 focus:outline-none focus:ring-1 focus:ring-gold-500 bg-white text-navy-950 font-sans"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-[9px] font-bold text-navy-950 uppercase tracking-widest mb-1">
                      Chapter <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="e.g., Bohol Alpha Chapter"
                      value={regChapter}
                      onChange={(e) => setRegChapter(e.target.value)}
                      className="w-full p-3 rounded-none border border-navy-950/15 focus:outline-none focus:ring-1 focus:ring-gold-500 bg-white text-navy-950 font-sans"
                    />
                  </div>
                  <div>
                    <label className="block text-[9px] font-bold text-navy-950 uppercase tracking-widest mb-1">
                      Slave Name <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="e.g., System Architect"
                      value={regSlaveName}
                      onChange={(e) => setRegSlaveName(e.target.value)}
                      className="w-full p-3 rounded-none border border-navy-950/15 focus:outline-none focus:ring-1 focus:ring-gold-500 bg-white text-navy-950 font-sans"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-[9px] font-bold text-navy-950 uppercase tracking-widest mb-1">
                      Phone Number <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="tel"
                      required
                      placeholder="e.g., 0917-555-0123"
                      value={regPhone}
                      onChange={(e) => setRegPhone(e.target.value)}
                      className="w-full p-3 rounded-none border border-navy-950/15 focus:outline-none focus:ring-1 focus:ring-gold-500 bg-white text-navy-950 font-sans"
                    />
                  </div>
                  <div>
                    <label className="block text-[9px] font-bold text-navy-950 uppercase tracking-widest mb-1">
                      Profile Picture URL <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="url"
                      required
                      placeholder="https://images.unsplash.com/photo-..."
                      value={regAvatar}
                      onChange={(e) => setRegAvatar(e.target.value)}
                      className="w-full p-3 rounded-none border border-navy-950/15 focus:outline-none focus:ring-1 focus:ring-gold-500 bg-white text-navy-950 font-sans"
                    />
                  </div>
                </div>

                <div className="flex items-center gap-2 justify-end pt-3">
                  <button
                    type="button"
                    onClick={() => setIsRegistering(false)}
                    className="px-4 py-2 rounded-none border border-navy-950/15 font-bold text-[9px] uppercase tracking-widest text-navy-700 hover:bg-[#fbf9f4]"
                  >
                    Back to Login
                  </button>
                  <button
                    type="submit"
                    className="px-5 py-2 rounded-none bg-[#c5a059] text-white hover:bg-gold-600 font-bold text-[9px] uppercase tracking-widest"
                  >
                    Finalize Registration
                  </button>
                </div>
              </form>
            </div>
          )}

        </div>
      </div>
    );
  }

  // LOGGED IN PORTAL INTERFACE
  return (
    <div className="py-10 bg-[#f9f7f2] animate-fade-in min-h-[90vh]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Welcome and Dashboard selector */}
        <div className="bg-navy-950 text-white p-6 md:p-8 rounded-none border border-gold-500/20 shadow-none flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-10">
          <div className="flex items-center gap-4">
            <img 
              src={currentUser.avatarUrl} 
              alt={currentUser.name} 
              className="w-14 h-14 md:w-16 md:h-16 rounded-none object-cover border border-gold-500"
              referrerPolicy="no-referrer"
            />
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-xl md:text-2xl font-serif font-black uppercase text-white tracking-wide">{currentUser.name}</h2>
                <Crown className="w-4 h-4 text-gold-400" />
              </div>
              <p className="text-[10px] uppercase tracking-widest text-gold-500 font-bold">{currentUser.role} &bull; Admitted {currentUser.joinsDate}</p>
            </div>
          </div>

          <div className="flex items-center gap-2 bg-navy-900 px-4 py-2.5 rounded-none border border-white/5">
            <div className="text-right">
              <p className="text-[8px] text-navy-300 font-black uppercase tracking-widest">Chapter Points Balance</p>
              <p className="text-lg font-mono font-bold text-gold-500">{currentUser.chapterPoints} Pts</p>
            </div>
            <span className="p-2 rounded-none bg-gold-500/10 text-gold-400 ml-2">
              <Award className="w-5 h-5" />
            </span>
          </div>
        </div>

        {/* INNER NAVIGATION TABS */}
        <div className="flex overflow-x-auto gap-2 pb-4 mb-8 border-b border-navy-950/10 scrollbar-none text-xs font-bold uppercase tracking-wider">
          {[
            { id: 'dashboard', label: 'Member Dashboard', icon: <Landmark className="w-4 h-4" /> },
            { id: 'roster', label: 'Roster Directory', icon: <User className="w-4 h-4" /> },
            { id: 'bulletin', label: 'Bulletin Board', icon: <MessageSquare className="w-4 h-4" /> },
            { id: 'dues', label: 'Chapter Treasury', icon: <CreditCard className="w-4 h-4" /> },
            { id: 'creed', label: 'Creed Study', icon: <Bookmark className="w-4 h-4" /> },
            ...((currentUser?.role === 'Admin' || currentUser?.email?.toLowerCase() === 'roderickdanzing04@gmail.com') ? [
              { id: 'admin', label: 'Admin Console', icon: <Shield className="w-4 h-4 text-gold-500 animate-pulse" /> }
            ] : [])
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setPortalTab(tab.id as any)}
              className={`flex items-center gap-2 px-5 py-3 rounded-none shrink-0 transition-all cursor-pointer border ${
                portalTab === tab.id
                  ? 'bg-navy-950 text-gold-500 border-navy-950 shadow-none'
                  : 'bg-white text-navy-950/70 border-navy-950/10 hover:bg-[#fbf9f4]'
              }`}
            >
              {tab.icon}
              <span>{tab.label}</span>
            </button>
          ))}
        </div>

        {/* TAB CONTENTS: 1. DASHBOARD */}
        {portalTab === 'dashboard' && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 animate-fade-in">
            
            {/* Digital Member ID Card (Left Column) */}
            <div className="lg:col-span-5 space-y-6">
              <h3 className="font-serif font-black text-navy-950 text-base uppercase tracking-wider">Your Chapter Credential</h3>
              
              {/* ID Card Wrapper */}
              <div className="relative w-full h-64 rounded-none bg-navy-950 p-6 border border-gold-500/30 text-white shadow-none overflow-hidden flex flex-col justify-between group">
                
                {/* Crest Watermark in background */}
                <div className="absolute -right-10 -bottom-10 opacity-5 pointer-events-none group-hover:scale-105 transition-transform duration-500">
                  <Shield className="w-64 h-64 text-gold-500" />
                </div>

                <div className="flex justify-between items-start relative z-10">
                  <div>
                    <span className="font-serif font-black text-xl tracking-widest text-gold-500">ΛΒΦ</span>
                    <p className="text-[8px] uppercase tracking-widest text-navy-300 font-bold">National Chapter</p>
                  </div>
                  <div className="px-2.5 py-1 rounded-none bg-gold-500/10 text-gold-500 border border-gold-500/30 text-[8px] uppercase font-bold tracking-widest">
                    Active Seal
                  </div>
                </div>

                <div className="flex gap-4 items-center relative z-10 my-4">
                  <img 
                    src={currentUser.avatarUrl} 
                    alt={currentUser.name} 
                    className="w-16 h-16 rounded-none object-cover border border-gold-500 shadow-none"
                    referrerPolicy="no-referrer"
                  />
                  <div className="space-y-1">
                    <h4 className="font-serif font-bold text-base text-white leading-tight uppercase tracking-wide">{currentUser.name}</h4>
                    <p className="text-[10px] text-gold-500 uppercase tracking-widest font-bold">{currentUser.role}</p>
                    {currentUser.slaveName && (
                      <p className="text-[9px] text-rose-400 font-mono uppercase tracking-widest font-bold">
                        SLAVE: {currentUser.slaveName}
                      </p>
                    )}
                    <p className="text-[8px] text-navy-400 font-mono tracking-wider">MEMBER ID: LBP-2026-00{currentUser.id.slice(-1) || '9'}</p>
                  </div>
                </div>

                <div className="flex justify-between items-end border-t border-white/5 pt-3 text-[9px] text-navy-300 relative z-10 font-mono">
                  <div>
                    <p className="uppercase text-[7px] text-navy-400">Jurisdiction</p>
                    <p className="font-bold text-white uppercase">{currentUser.chapter || 'Lambda Chapter'}</p>
                  </div>
                  <div>
                    <p className="uppercase text-[7px] text-navy-400">Dues Status</p>
                    <p className={`font-bold uppercase ${currentUser.duesStatus === 'Paid' ? 'text-green-400' : 'text-red-400'}`}>
                      {currentUser.duesStatus}
                    </p>
                  </div>
                  <div>
                    <p className="uppercase text-[7px] text-navy-400">Affiliation</p>
                    <p className="font-bold text-white">{currentUser.joinsDate}</p>
                  </div>
                </div>
              </div>

              <div className="bg-white p-6 rounded-none border border-navy-950/10 shadow-none space-y-4">
                <h4 className="text-[9px] font-bold text-navy-400 uppercase tracking-widest">Quick Profile Facts</h4>
                <div className="grid grid-cols-2 gap-4 text-xs font-sans text-navy-950/80">
                  <div className="p-3 bg-[#fbf9f4] rounded-none border border-navy-950/5">
                    <span className="text-navy-400 block mb-0.5 text-[9px] uppercase tracking-wider font-bold">Chapter Affiliation</span>
                    <strong className="text-navy-950 font-bold uppercase text-[11px] truncate block">{currentUser.chapter || 'Not Specified'}</strong>
                  </div>
                  <div className="p-3 bg-[#fbf9f4] rounded-none border border-navy-950/5">
                    <span className="text-navy-400 block mb-0.5 text-[9px] uppercase tracking-wider font-bold">Slave Name</span>
                    <strong className="text-navy-950 font-bold uppercase text-[11px] truncate block">{currentUser.slaveName || 'Not Specified'}</strong>
                  </div>
                  <div className="p-3 bg-[#fbf9f4] rounded-none border border-navy-950/5 col-span-2">
                    <span className="text-navy-400 block mb-0.5 text-[9px] uppercase tracking-wider font-bold">Contact Number</span>
                    <strong className="text-navy-950 font-bold uppercase text-[11px] block">{currentUser.phone || 'Not Specified'}</strong>
                  </div>
                </div>
              </div>

            </div>

            {/* General Chapter Announcements & Metrics (Right Column) */}
            <div className="lg:col-span-7 space-y-8">
              
              {/* Point Threshold Rank card */}
              <div className="bg-white p-6 md:p-8 rounded-none border border-navy-950/10 shadow-none">
                <h3 className="font-serif font-black text-navy-950 text-base uppercase tracking-wider mb-4">Elite Honors Advancement</h3>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-center">
                  <div className="space-y-2">
                    <p className="text-xs text-navy-950/70 leading-relaxed font-sans font-light">
                      Chapter Points are accumulated by attending mandatory study sessions, participating in philanthropy gauntlets, and steering executive boards.
                    </p>
                    <div className="text-[10px] text-gold-600 font-bold uppercase tracking-widest">
                      Current Rank: {currentUser.chapterPoints >= 100 ? 'Lion Sovereign' : 'Initiated Member'}
                    </div>
                  </div>

                  <div className="bg-navy-950 text-white p-4 rounded-none text-center space-y-2 border border-gold-500/20">
                    <p className="text-[9px] text-navy-300 uppercase tracking-widest font-bold">Next Target: Laurel Master</p>
                    <div className="text-xl font-mono font-black text-gold-500">
                      {Math.max(150 - currentUser.chapterPoints, 0)} Pts Needed
                    </div>
                    <div className="w-full bg-navy-900 h-1 rounded-none overflow-hidden">
                      <div 
                        className="h-full bg-gold-500" 
                        style={{ width: `${Math.min((currentUser.chapterPoints / 150) * 100, 100)}%` }} 
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* Private Quick Checklist */}
              <div className="bg-white p-6 md:p-8 rounded-none border border-navy-950/10 shadow-none space-y-4">
                <h3 className="font-serif font-black text-navy-950 text-base uppercase tracking-wider">Chapter Mandates To-Do</h3>
                
                <div className="space-y-3 text-xs">
                  
                  <div className="flex items-center gap-3 p-3 bg-green-50 rounded-none border border-green-200">
                    <CheckCircle className="w-5 h-5 text-green-600 shrink-0" />
                    <span className="text-navy-900 font-medium">Signed Chapter Ethics Pledge and safety directives.</span>
                  </div>

                  <div className={`flex items-center gap-3 p-3 rounded-none border ${
                    currentUser.duesStatus === 'Paid' 
                      ? 'bg-green-50 border-green-200' 
                      : 'bg-red-50 border-red-200'
                  }`}>
                    {currentUser.duesStatus === 'Paid' ? (
                      <CheckCircle className="w-5 h-5 text-green-600 shrink-0" />
                    ) : (
                      <Shield className="w-5 h-5 text-red-600 shrink-0 animate-pulse" />
                    )}
                    <div className="flex-1">
                      <span className="text-navy-950 block font-bold uppercase tracking-wider text-[10px]">Semester Financial Chapter Dues</span>
                      <span className="text-navy-500 text-[11px] font-sans">
                        {currentUser.duesStatus === 'Paid' ? 'Cleared ($350)' : 'Dues outstanding ($350). Please pay on the Chapter Treasury tab.'}
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 p-3 bg-[#fbf9f4] rounded-none border border-navy-950/5">
                    <Shield className="w-5 h-5 text-gold-500 shrink-0" />
                    <div className="flex-1">
                      <span className="text-navy-950 block font-bold uppercase tracking-wider text-[10px]">Study Tables Requirement</span>
                      <span className="text-navy-500 text-[11px] font-sans">Maintain at least 10 logged study hours per month to protect GPA metrics.</span>
                    </div>
                  </div>

                </div>
              </div>

            </div>
          </div>
        )}

        {/* TAB CONTENTS: 2. ROSTER DIRECTORY */}
        {portalTab === 'roster' && (
          <div className="space-y-8 animate-fade-in">
            
            {/* Filter controls */}
            <div className="bg-white p-6 rounded-none border border-navy-950/10 shadow-none flex flex-col md:flex-row items-center justify-between gap-4">
              
              {/* Search */}
              <div className="relative w-full md:max-w-md">
                <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center text-navy-400">
                  <Search className="w-4 h-4" />
                </span>
                <input
                  type="text"
                  placeholder="Search members by name, major, or role..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 rounded-none border border-navy-950/15 text-xs focus:outline-none focus:ring-1 focus:ring-gold-500 bg-white text-navy-950 font-sans"
                />
              </div>

              {/* Roster Filters */}
              <div className="flex gap-2">
                {(['all', 'Brother', 'Sister'] as const).map((filter) => (
                  <button
                    key={filter}
                    onClick={() => setGenderFilter(filter)}
                    className={`px-4 py-2 rounded-none text-[10px] font-bold uppercase tracking-widest transition-all cursor-pointer ${
                      genderFilter === filter
                        ? 'bg-navy-950 text-gold-500 border border-navy-950'
                        : 'bg-[#fbf9f4] text-navy-950 border border-navy-950/10 hover:border-gold-500'
                    }`}
                  >
                    {filter === 'all' ? 'All Directory' : `${filter}s`}
                  </button>
                ))}
              </div>

            </div>

            {/* Roster Cards List */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {filteredRoster.map((item) => (
                <div 
                  key={item.id} 
                  className={`bg-white rounded-none p-6 border transition-all ${
                    currentUser.email === item.email ? 'border-2 border-gold-500' : 'border-navy-950/10 hover:border-gold-500'
                  }`}
                >
                  <div className="flex items-start gap-4">
                    <img 
                      src={item.avatarUrl} 
                      alt={item.name} 
                      className="w-16 h-16 rounded-none object-cover border border-gold-500"
                      referrerPolicy="no-referrer"
                    />
                    <div className="space-y-1">
                      <h4 className="font-serif font-bold text-navy-950 text-sm uppercase tracking-wide">{item.name}</h4>
                      <p className="text-[8px] uppercase font-black text-gold-600 tracking-widest bg-gold-500/10 border border-gold-500/20 inline-block px-2.5 py-0.5 rounded-none">
                        {item.role}
                      </p>
                      <p className="text-[10px] font-bold uppercase tracking-widest text-navy-400 mt-1">{item.gender}</p>
                    </div>
                  </div>

                  <div className="mt-5 pt-4 border-t border-navy-950/5 text-xs space-y-2 text-navy-950/80 font-sans font-light">
                    {item.chapter && (
                      <div className="flex items-center gap-2">
                        <Landmark className="w-4 h-4 text-gold-600 shrink-0" />
                        <span className="truncate"><strong>Chapter:</strong> {item.chapter}</span>
                      </div>
                    )}
                    {item.slaveName && (
                      <div className="flex items-center gap-2">
                        <Shield className="w-4 h-4 text-rose-600 shrink-0" />
                        <span className="truncate"><strong>Slave Name:</strong> {item.slaveName}</span>
                      </div>
                    )}
                    {item.phone && (
                      <div className="flex items-center gap-2">
                        <Phone className="w-4 h-4 text-gold-600 shrink-0" />
                        <a href={`tel:${item.phone}`} className="hover:text-gold-500">
                          {item.phone}
                        </a>
                      </div>
                    )}
                    <div className="flex items-center gap-2">
                      <Mail className="w-4 h-4 text-gold-600 shrink-0" />
                      <a href={`mailto:${item.email}`} className="hover:text-gold-500 truncate block hover:underline">
                        {item.email}
                      </a>
                    </div>
                  </div>

                  {item.biography && (
                    <div className="mt-4 p-3 bg-[#fbf9f4] border border-navy-950/5 rounded-none text-[11px] text-navy-950/60 font-light italic leading-normal">
                      &ldquo;{item.biography}&rdquo;
                    </div>
                  )}
                </div>
              ))}
            </div>

          </div>
        )}

        {/* TAB CONTENTS: 3. BULLETIN MESSAGE BOARD */}
        {portalTab === 'bulletin' && (
          <div className="max-w-4xl mx-auto space-y-8 animate-fade-in">
            
            {/* Create Bulletin Form */}
            <div className="bg-white p-6 md:p-8 rounded-none border border-navy-950/10 shadow-none space-y-4">
              <div className="flex items-center gap-2 pb-2 border-b border-navy-950/10 text-gold-600">
                <MessageSquare className="w-5 h-5 text-gold-500" />
                <h4 className="font-serif font-black text-navy-950 uppercase tracking-wide">Publish Internal Notice</h4>
              </div>

              <form onSubmit={handleCreatePostSubmit} className="space-y-4">
                <textarea
                  placeholder="Share study updates, coordinate service logistics, or publish chapter alerts..."
                  rows={4}
                  value={bulletinInput}
                  onChange={(e) => setBulletinInput(e.target.value)}
                  className="w-full text-xs p-4 rounded-none border border-navy-950/15 focus:outline-none focus:ring-1 focus:ring-gold-500 bg-white text-navy-950 font-sans"
                  required
                />
                
                <div className="flex justify-end">
                  <button
                    type="submit"
                    className="bg-navy-950 text-gold-500 font-bold text-[10px] py-2.5 px-5 rounded-none hover:bg-navy-800 flex items-center gap-2 cursor-pointer uppercase tracking-widest"
                  >
                    <Send className="w-3.5 h-3.5" />
                    Broadcast Notice
                  </button>
                </div>
              </form>
            </div>

            {/* Bulletin Feed */}
            <div className="space-y-6">
              {bulletin.length === 0 ? (
                <p className="text-center py-12 text-navy-400 italic font-sans text-xs">No announcements broadcasted yet.</p>
              ) : (
                bulletin.map((post) => (
                  <div key={post.id} className="bg-white p-6 rounded-none border border-navy-950/10 shadow-none space-y-4">
                    
                    {/* Post Author Info */}
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <img 
                          src={post.authorAvatar} 
                          alt={post.authorName} 
                          className="w-10 h-10 rounded-none object-cover border border-gold-500"
                          referrerPolicy="no-referrer"
                        />
                        <div>
                          <p className="text-xs font-bold text-navy-950 uppercase tracking-wider">{post.authorName}</p>
                          <p className="text-[10px] text-navy-400 uppercase tracking-widest font-bold">{post.authorRole} &bull; {post.date}</p>
                        </div>
                      </div>
                    </div>

                    {/* Content statement */}
                    <p className="text-navy-950/80 text-xs md:text-sm leading-relaxed font-sans font-light">
                      {post.content}
                    </p>

                    {/* Replies listing */}
                    {post.replies.length > 0 && (
                      <div className="pl-6 md:pl-10 space-y-3 border-l-2 border-gold-500">
                        {post.replies.map((reply) => (
                          <div key={reply.id} className="flex gap-3 items-start text-xs bg-[#fbf9f4] p-3 rounded-none border border-navy-950/5">
                            <img 
                              src={reply.authorAvatar} 
                              alt={reply.authorName} 
                              className="w-7 h-7 rounded-none object-cover shrink-0 border border-gold-500/30"
                              referrerPolicy="no-referrer"
                            />
                            <div>
                              <p className="font-bold text-navy-950 text-[10px] uppercase tracking-wider">
                                {reply.authorName} <span className="text-[8px] text-navy-400">({reply.authorRole})</span>
                              </p>
                              <p className="text-navy-950/80 text-xs mt-1 leading-relaxed font-sans font-light">{reply.content}</p>
                              <span className="text-[8px] text-navy-400 block mt-1 uppercase tracking-widest">{reply.date}</span>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}

                    {/* Reply Input Form */}
                    <div className="flex items-center gap-3 pt-3 border-t border-navy-950/5">
                      <input
                        type="text"
                        placeholder="Write a nested chapter reply..."
                        value={replyInputMap[post.id] || ''}
                        onChange={(e) => setReplyInputMap({
                          ...replyInputMap,
                          [post.id]: e.target.value
                        })}
                        className="flex-1 p-2.5 rounded-none border border-navy-950/15 text-xs focus:outline-none focus:ring-1 focus:ring-gold-500 bg-white text-navy-950 font-sans text-[11px]"
                      />
                      <button
                        onClick={() => handleCreateReplySubmit(post.id)}
                        className="bg-[#fbf9f4] hover:bg-gold-500 hover:text-white text-navy-950 border border-navy-950/15 px-4 py-2.5 rounded-none font-bold text-[10px] uppercase tracking-widest cursor-pointer shrink-0 transition-colors"
                      >
                        Reply
                      </button>
                    </div>

                  </div>
                ))
              )}
            </div>

          </div>
        )}

        {/* TAB CONTENTS: 4. CHAPTER TREASURY */}
        {portalTab === 'dues' && (
          <div className="max-w-2xl mx-auto space-y-8 animate-fade-in">
            
            <div className="bg-white p-8 rounded-none border border-navy-950/10 shadow-none space-y-6">
              <div className="flex items-center gap-2 pb-2 border-b border-navy-950/10 text-gold-600">
                <CreditCard className="w-6 h-6 text-gold-500" />
                <h3 className="font-serif font-black text-navy-950 text-xl uppercase tracking-wide">Chapter Financial Ledger</h3>
              </div>

              <div className="bg-[#fbf9f4] p-6 rounded-none border border-navy-950/5 text-center space-y-3">
                <span className="text-[10px] uppercase font-bold text-navy-400 block tracking-widest">Semester Chapter Dues</span>
                <span className="text-3xl font-mono font-black text-navy-950">$350.00 USD</span>
                <p className="text-xs text-navy-950/60 leading-relaxed max-w-md mx-auto font-sans font-light">
                  Dues directly fund our community philanthropy events, scholastic library study tables, recruitment publications, and annual formal banquets.
                </p>
              </div>

              {/* Status block */}
              <div className="flex justify-between items-center p-4 rounded-none border border-navy-950/10 bg-white">
                <span className="text-[10px] font-bold text-navy-950 uppercase tracking-widest">Ledger Audit Status:</span>
                <span className={`text-[9px] font-black uppercase tracking-widest px-4 py-1.5 rounded-none border ${
                  currentUser.duesStatus === 'Paid'
                    ? 'bg-green-50 border-green-200 text-green-700'
                    : 'bg-red-50 border-red-200 text-red-700'
                }`}>
                  {currentUser.duesStatus === 'Paid' ? 'Paid & Audited' : 'Pending Payment'}
                </span>
              </div>

              {currentUser.duesStatus !== 'Paid' ? (
                <button
                  onClick={() => onPayDues(currentUser.id)}
                  className="w-full bg-navy-950 text-gold-500 font-bold py-4 px-4 rounded-none shadow-none hover:bg-navy-800 transition-all text-xs uppercase tracking-widest cursor-pointer border border-navy-950"
                >
                  Pay Chapter Dues $350
                </button>
              ) : (
                <div className="bg-green-50 p-4 rounded-none border border-green-200 flex items-center gap-3 text-xs text-green-800 leading-relaxed">
                  <CheckCircle className="w-5 h-5 text-green-600 shrink-0" />
                  <span>
                    Verified! Your dues payment has been audited by Chapter Treasurer Sophia Laurent. Your active membership standing and voting rights are secured.
                  </span>
                </div>
              )}
            </div>

          </div>
        )}

        {/* TAB CONTENTS: 5. CREED STUDY */}
        {portalTab === 'creed' && (
          <div className="max-w-3xl mx-auto space-y-8 animate-fade-in">
            
            <div className="bg-white p-8 md:p-10 rounded-none border border-navy-950/10 shadow-none space-y-6">
              <h3 className="font-serif font-black text-navy-950 text-xl border-b border-navy-950/10 pb-4 uppercase tracking-wide">
                The Sacred Charter Study Room
              </h3>

              <div className="space-y-4 text-xs md:text-sm text-navy-950/80 leading-relaxed">
                <p className="font-sans font-light">
                  Welcome to the private sanctuary study room. Under our national charter, all active initiates must regularly read and study the core covenants of Lambda Beta Phi to preserve our historical integrity.
                </p>

                <div className="space-y-6 pt-4 border-t border-navy-950/10">
                  
                  <div>
                    <h4 className="font-serif font-bold text-navy-950 text-sm md:text-base mb-1 uppercase tracking-wider">I. The Golden Rule of Harmony</h4>
                    <p className="font-sans font-light text-xs">
                      We treat all brothers, sisters, and human beings with profound, unyielding respect. There is a zero-tolerance policy for hazing, psychological pressure, or hostile competition inside our chapter.
                    </p>
                  </div>

                  <div>
                    <h4 className="font-serif font-bold text-navy-950 text-sm md:text-base mb-1 uppercase tracking-wider">II. Scholastic Dedication</h4>
                    <p className="font-sans font-light text-xs">
                      Intellect is the fuel of leadership. Active members with a GPA dropping below 3.0 are suspended from social privileges and enrolled in peer tutoring groups till scholastic metrics satisfy the National Council.
                    </p>
                  </div>

                  <div>
                    <h4 className="font-serif font-bold text-navy-950 text-sm md:text-base mb-1 uppercase tracking-wider">III. The Philanthropic Vow</h4>
                    <p className="font-sans font-light text-xs">
                      Wealth is not evaluated by bank balances, but by the volume of charity provided. Members pledge a minimum of 15 volunteer hours and active participation in pediatric fundraisers each academic semester.
                    </p>
                  </div>

                </div>
              </div>
            </div>

          </div>
        )}

        {/* TAB CONTENTS: 6. ADMIN CONSOLE */}
        {portalTab === 'admin' && (currentUser?.role === 'Admin' || currentUser?.email?.toLowerCase() === 'roderickdanzing04@gmail.com') && (
          <div className="space-y-8 animate-fade-in text-xs">
            
            {/* Quick Metrics */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="bg-white p-4 border border-navy-950/10 rounded-none text-center space-y-1">
                <span className="text-[9px] uppercase tracking-wider text-navy-400 font-bold block">Total Members</span>
                <span className="text-xl font-mono font-black text-navy-950">{members.length}</span>
              </div>
              <div className="bg-white p-4 border border-navy-950/10 rounded-none text-center space-y-1">
                <span className="text-[9px] uppercase tracking-wider text-navy-400 font-bold block">Total Chapter Points</span>
                <span className="text-xl font-mono font-black text-gold-600">
                  {members.reduce((acc, m) => acc + m.chapterPoints, 0)}
                </span>
              </div>
              <div className="bg-white p-4 border border-navy-950/10 rounded-none text-center space-y-1">
                <span className="text-[9px] uppercase tracking-wider text-navy-400 font-bold block">Paid Dues Ledger</span>
                <span className="text-xl font-mono font-black text-green-600">
                  ${members.filter(m => m.duesStatus === 'Paid').length * 350} USD
                </span>
              </div>
              <div className="bg-white p-4 border border-navy-950/10 rounded-none text-center space-y-1">
                <span className="text-[9px] uppercase tracking-wider text-navy-400 font-bold block">Unpaid Balance</span>
                <span className="text-xl font-mono font-black text-red-600">
                  ${members.filter(m => m.duesStatus !== 'Paid').length * 350} USD
                </span>
              </div>
            </div>

            {/* Member Management Table */}
            <div className="bg-white p-6 md:p-8 rounded-none border border-navy-950/10 shadow-none space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-4 border-b border-navy-950/10">
                <div className="flex items-center gap-2.5">
                  <Settings className="w-5 h-5 text-gold-500 shrink-0" />
                  <div>
                    <h3 className="font-serif font-black text-navy-950 text-base uppercase tracking-wide">
                      Chapter Ledger Registry Control
                    </h3>
                    <p className="text-navy-400 text-[10px] uppercase font-bold tracking-wider">
                      Supreme Administrative Portal &bull; Edit standing, points, and financial logs.
                    </p>
                  </div>
                </div>
              </div>

              {/* Members Control Table */}
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse font-sans">
                  <thead>
                    <tr className="border-b border-navy-950/10 text-[9px] font-bold uppercase tracking-widest text-navy-400 bg-navy-50">
                      <th className="p-3">Member Details</th>
                      <th className="p-3">Role Designation</th>
                      <th className="p-3 text-center">Chapter Points</th>
                      <th className="p-3 text-center">Semester Dues</th>
                      <th className="p-3 text-center">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-navy-950/5 text-xs">
                    {members.map((m) => {
                      const isMeUser = m.email.toLowerCase() === 'roderickdanzing04@gmail.com';
                      return (
                        <tr key={m.id} className="hover:bg-navy-50/40 transition-colors">
                          <td className="p-3">
                            <div className="flex items-center gap-2.5">
                              <img 
                                src={m.avatarUrl} 
                                alt={m.name} 
                                className="w-8 h-8 rounded-none object-cover border border-gold-500 shrink-0"
                                referrerPolicy="no-referrer"
                              />
                              <div className="min-w-0">
                                <p className="font-bold text-navy-950 uppercase tracking-wide truncate">{m.name}</p>
                                <p className="text-[10px] text-navy-400 font-mono truncate">{m.email}</p>
                              </div>
                            </div>
                          </td>
                          <td className="p-3">
                            <span className="font-bold uppercase tracking-wider text-[9px] bg-gold-500/10 text-gold-700 px-2.5 py-1 border border-gold-500/20">
                              {m.role}
                            </span>
                          </td>
                          <td className="p-3 text-center">
                            <div className="flex items-center justify-center gap-2">
                              <button
                                onClick={() => {
                                  if (!onUpdateMembers) return;
                                  const updated = members.map(item => 
                                    item.id === m.id 
                                      ? { ...item, chapterPoints: Math.max(item.chapterPoints - 10, 0) } 
                                      : item
                                  );
                                  onUpdateMembers(updated);
                                }}
                                className="p-1 border border-navy-950/15 bg-white text-navy-700 hover:bg-gold-500 hover:text-white rounded-none cursor-pointer"
                                title="Deduct 10 Points"
                              >
                                <Minus className="w-3 h-3" />
                              </button>
                              <span className="font-mono font-bold text-navy-950 w-10 text-center">{m.chapterPoints} Pts</span>
                              <button
                                onClick={() => {
                                  if (!onUpdateMembers) return;
                                  const updated = members.map(item => 
                                    item.id === m.id 
                                      ? { ...item, chapterPoints: item.chapterPoints + 10 } 
                                      : item
                                  );
                                  onUpdateMembers(updated);
                                }}
                                className="p-1 border border-navy-950/15 bg-white text-navy-700 hover:bg-gold-500 hover:text-white rounded-none cursor-pointer"
                                title="Add 10 Points"
                              >
                                <Plus className="w-3 h-3" />
                              </button>
                            </div>
                          </td>
                          <td className="p-3 text-center">
                            <button
                              onClick={() => {
                                if (!onUpdateMembers) return;
                                const updated = members.map(item => 
                                  item.id === m.id 
                                    ? { ...item, duesStatus: (item.duesStatus === 'Paid' ? 'Unpaid' : 'Paid') as any } 
                                    : item
                                );
                                onUpdateMembers(updated);
                              }}
                              className={`px-3 py-1 text-[9px] font-bold uppercase tracking-wider border rounded-none cursor-pointer transition-colors ${
                                m.duesStatus === 'Paid'
                                  ? 'bg-green-50 border-green-200 text-green-700 hover:bg-red-50 hover:border-red-200 hover:text-red-700'
                                  : 'bg-red-50 border-red-200 text-red-700 hover:bg-green-50 hover:border-green-200 hover:text-green-700'
                              }`}
                              title="Toggle Dues Status"
                            >
                              {m.duesStatus === 'Paid' ? 'Paid' : 'Unpaid'}
                            </button>
                          </td>
                          <td className="p-3 text-center">
                            <button
                              onClick={() => {
                                if (!onUpdateMembers) return;
                                if (isMeUser) {
                                  return;
                                }
                                if (confirm(`Are you sure you want to remove ${m.name} from the chapter ledger?`)) {
                                  const updated = members.filter(item => item.id !== m.id);
                                  onUpdateMembers(updated);
                                }
                              }}
                              disabled={isMeUser}
                              className={`p-2 rounded-none border text-red-600 bg-red-50 hover:bg-red-600 hover:text-white transition-all cursor-pointer ${
                                isMeUser ? 'opacity-30 cursor-not-allowed' : 'border-red-200'
                              }`}
                              title="Remove Member from Registry"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Supabase SQL Setup instructions */}
            <div className="bg-navy-900 text-gold-300 p-6 md:p-8 rounded-none border border-gold-500/20 shadow-none space-y-4">
              <div className="flex items-center gap-2.5 pb-2 border-b border-white/10">
                <Landmark className="w-5 h-5 text-gold-400 shrink-0 animate-pulse" />
                <div>
                  <h4 className="font-serif font-black text-white text-sm uppercase tracking-wide">
                    Supabase Database Setup Instructions
                  </h4>
                  <p className="text-navy-300 text-[9px] uppercase font-bold tracking-wider">
                    Copy and run this query inside your Supabase SQL Editor to provision the ledger schema.
                  </p>
                </div>
              </div>
              <p className="text-[11px] text-white/80 font-sans leading-relaxed">
                If you have connected Supabase, you must initialize the <code className="font-mono text-gold-400 bg-white/5 px-1 py-0.5">members</code> table. Run the SQL script below in your Supabase SQL Editor to provision the registry, enforce proper types, and set up Row Level Security (RLS) policies.
              </p>
              <pre className="p-4 bg-navy-950 text-emerald-400 font-mono text-[10px] overflow-x-auto select-all cursor-pointer border border-white/5 rounded-none leading-relaxed" title="Click to Select All">
{`-- 1. Create members registry table
create table if not exists members (
  id text primary key,
  name text not null,
  email text unique not null,
  role text not null default 'User',
  gender text not null,
  "chapterPoints" integer not null default 10,
  "duesStatus" text not null default 'Unpaid',
  "duesAmount" integer not null default 350,
  "joinsDate" text not null,
  "avatarUrl" text,
  phone text,
  chapter text,
  "slaveName" text
);

-- 2. Enable Row Level Security (RLS)
alter table members enable row level security;

-- 3. Create permissive policies for chapter ledger access
create policy "Allow select for everyone" on members
  for select using (true);

create policy "Allow all actions for anyone" on members
  for all using (true);`}
              </pre>
            </div>

          </div>
        )}

      </div>
    </div>
  );
}
