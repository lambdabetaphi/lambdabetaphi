import React, { useState, useEffect } from 'react';
import { 
  Landmark, 
  Mail, 
  MapPin, 
  Phone, 
  Shield, 
  Crown, 
  Heart,
  ExternalLink,
  ChevronUp,
  Award,
  AlertCircle,
  CheckCircle2
} from 'lucide-react';
import Navigation from './components/Navigation';
import LandingPage from './components/LandingPage';
import AboutUs from './components/AboutUs';
import NewsPage from './components/NewsPage';
import EventPage from './components/EventPage';
import MemberPortal from './components/MemberPortal';
import CrestLogo from './components/CrestLogo';
import { Member, Event, Announcement } from './types';
import { FRAT_INFO } from './data';
import { supabase, isSupabaseConfigured } from './lib/supabase';
import { dbService } from './lib/dbService';

export default function App() {
  const [activeTab, setActiveTab] = useState<'home' | 'about' | 'news' | 'events' | 'portal'>('home');
  const [currentUser, setCurrentUser] = useState<Member | null>(null);
  
  // Notification States
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'info' | 'error' } | null>(null);

  // Core Persisted States
  const [members, setMembers] = useState<Member[]>([]);
  const [events, setEvents] = useState<Event[]>([]);
  const [announcements, setAnnouncements] = useState<Announcement[]>([]);

  // 1. Auth Session Handler and Initial State Loading
  const handleAuthSession = async (session: any) => {
    if (!session?.user) {
      setCurrentUser(null);
      return;
    }

    const authUser = session.user;
    const emailLower = authUser.email?.toLowerCase().trim() || '';

    if (isSupabaseConfigured && supabase) {
      try {
        // Retrieve member profile details from members table
        const { data: profile, error: dbError } = await supabase
          .from('members')
          .select('*')
          .eq('id', authUser.id)
          .maybeSingle();

        if (dbError) {
          console.warn('Error retrieving member from Supabase table:', dbError.message);
        }

        if (!profile) {
          // Automatically create a member profile in the members table
          const fullName = authUser.user_metadata?.full_name || authUser.user_metadata?.name || 'Initiate Member';
          const avatarUrl = authUser.user_metadata?.avatar_url || authUser.user_metadata?.picture || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80';
          
          const isMe = emailLower === 'roderickdanzing04@gmail.com';
          
          const newMember: Member = {
            id: authUser.id,
            full_name: fullName,
            email: emailLower,
            role: isMe ? 'Admin' : 'Member',
            status: isMe ? 'Approved' : 'Pending',
            chapter: 'Bohol Alpha',
            batch: 'Alpha Class 2026',
            position: isMe ? 'National Advisor' : 'Candidate Member',
            avatar_url: avatarUrl,
            phone: '',
            bio: 'Private Registry Member'
          };

          // Map for backwards compatibility
          const newMemberFull = {
            ...newMember,
            name: fullName,
            avatarUrl: avatarUrl,
            slaveName: 'Private Registry Member',
            joinsDate: new Date().toISOString().split('T')[0]
          };

          // Write to database
          const { error: insertError } = await supabase
            .from('members')
            .insert([newMember]);

          if (insertError) {
            console.warn('Failed to insert new member profile:', insertError.message);
          }

          // Add to active state
          setMembers(prev => {
            if (!prev.some(m => m.id === newMember.id)) {
              return [...prev, newMemberFull as any];
            }
            return prev;
          });

          setCurrentUser(newMemberFull as any);
        } else {
          const isMe = emailLower === 'roderickdanzing04@gmail.com';
          const existingMember = profile as Member;
          
          // Ensure Roderick has Admin and Approved status
          if (isMe && (existingMember.role !== 'Admin' || existingMember.status !== 'Approved')) {
            existingMember.role = 'Admin';
            existingMember.status = 'Approved';
            await supabase.from('members').update({ role: 'Admin', status: 'Approved' }).eq('id', existingMember.id);
          }

          // Map to both camelCase and snake_case for maximum compatibility with the UI
          const mappedUser = {
            ...existingMember,
            name: existingMember.full_name || (existingMember as any).name || 'Initiate Member',
            avatarUrl: existingMember.avatar_url || (existingMember as any).avatarUrl || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80',
            slaveName: existingMember.bio || (existingMember as any).slaveName || 'Candidate Member',
            joinsDate: existingMember.created_at ? new Date(existingMember.created_at).toISOString().split('T')[0] : (existingMember as any).joinsDate || new Date().toISOString().split('T')[0]
          };

          setCurrentUser(mappedUser as any);
        }
      } catch (err) {
        console.error('Error handling auth session:', err);
      }
    }
  };

  useEffect(() => {
    const loadAllData = async () => {
      try {
        const dbMembers = await dbService.getMembers();
        
        // Ensure all loaded members are mapped for maximum compatibility with the UI
        const mappedMembers = dbMembers.map(m => ({
          ...m,
          name: m.full_name || (m as any).name || 'Initiate Member',
          avatarUrl: m.avatar_url || (m as any).avatarUrl || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80',
          slaveName: m.bio || (m as any).slaveName || 'Candidate Member',
          joinsDate: m.created_at ? new Date(m.created_at).toISOString().split('T')[0] : (m as any).joinsDate || new Date().toISOString().split('T')[0]
        }));
        
        setMembers(mappedMembers as any);

        const dbEvents = await dbService.getEvents();
        setEvents(dbEvents);

        const dbAnns = await dbService.getAnnouncements();
        setAnnouncements(dbAnns);
      } catch (e) {
        console.warn('Error loading initial data in App.tsx:', e);
      }
    };

    loadAllData();

    // Single source of truth for auth
    if (isSupabaseConfigured && supabase) {
      // Get initial session
      supabase.auth.getSession().then(({ data: { session } }) => {
        handleAuthSession(session);
      });

      // Listen to auth state changes
      const { data: { subscription } } = supabase.auth.onAuthStateChange(async (_event, session) => {
        handleAuthSession(session);
      });

      return () => {
        subscription.unsubscribe();
      };
    }
  }, []);

  // 2. State Synchronizers
  const saveMembers = async (newMembers: Member[]) => {
    setMembers(newMembers);
    await dbService.saveMembers(newMembers);
  };

  const saveEvents = async (newEvents: Event[]) => {
    setEvents(newEvents);
    // Persist list
    localStorage.setItem('lbp_prod_events', JSON.stringify(newEvents));
  };

  // Toast trigger helper
  const showToast = (message: string, type: 'success' | 'info' | 'error' = 'success') => {
    setToast({ message, type });
    setTimeout(() => {
      setToast(null);
    }, 4000);
  };

  // 3. Member Interactions
  const handleLogin = async (email: string, password?: string): Promise<boolean> => {
    const emailLower = email.toLowerCase().trim();

    if (!isSupabaseConfigured || !supabase) {
      showToast('Supabase is not configured.', 'error');
      return false;
    }

    try {
      if (!password) {
        showToast('Password is required for authentication.', 'error');
        return false;
      }
      const { error: authError } = await supabase.auth.signInWithPassword({
        email: emailLower,
        password: password
      });

      if (authError) {
        showToast(`Authentication Error: ${authError.message}`, 'error');
        return false;
      }

      // Fetch member profile details from the custom table
      const { data: profile, error: dbError } = await supabase
        .from('members')
        .select('*')
        .eq('email', emailLower)
        .single();

      if (dbError || !profile) {
        showToast('Authentication succeeded, but no matching profile exists in the chapter ledger.', 'error');
        return false;
      }

      const memberProfile = profile as Member;
      // Enforce admin privileges for specific email
      if (emailLower === 'roderickdanzing04@gmail.com' && memberProfile.role !== 'Admin') {
        memberProfile.role = 'Admin';
        memberProfile.status = 'Approved';
        await supabase.from('members').update({ role: 'Admin', status: 'Approved' }).eq('id', memberProfile.id);
      }

      const mappedUser = {
        ...memberProfile,
        name: memberProfile.full_name || (memberProfile as any).name || 'Initiate Member',
        avatarUrl: memberProfile.avatar_url || (memberProfile as any).avatarUrl || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80',
        slaveName: memberProfile.bio || (memberProfile as any).slaveName || 'Candidate Member',
        joinsDate: memberProfile.created_at ? new Date(memberProfile.created_at).toISOString().split('T')[0] : (memberProfile as any).joinsDate || new Date().toISOString().split('T')[0]
      };

      setCurrentUser(mappedUser as any);
      showToast(
        mappedUser.role === 'Admin'
          ? `Welcome back, Administrator ${mappedUser.name}!`
          : `Welcome back, Initiate ${mappedUser.name}!`,
        'success'
      );
      setActiveTab('portal');
      return true;
    } catch (err: any) {
      showToast(`Login failed: ${err.message || err}`, 'error');
      return false;
    }
  };

  const handleLogout = async () => {
    if (isSupabaseConfigured && supabase) {
      try {
        await supabase.auth.signOut();
      } catch (e) {
        console.warn('Supabase signout skipped:', e);
      }
    }
    setCurrentUser(null);
    showToast('Secure session closed.', 'info');
    setActiveTab('home');
  };

  const handleRegister = async (
    newMemberData: Omit<Member, 'id'>,
    password?: string
  ) => {
    const emailLower = newMemberData.email.toLowerCase().trim();
    const isMe = emailLower === 'roderickdanzing04@gmail.com';

    if (!isSupabaseConfigured || !supabase) {
      showToast('Supabase is not configured.', 'error');
      return;
    }

    try {
      if (!password) {
        showToast('Password is required for registration.', 'error');
        return;
      }

      // Register the user with Supabase Auth
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email: emailLower,
        password: password
      });

      if (authError) {
        showToast(`Supabase Auth Error: ${authError.message}`, 'error');
        return;
      }

      const userId = authData.user?.id;
      if (!userId) {
        showToast('Registration succeeded, but user ID could not be retrieved.', 'error');
        return;
      }

      const newMember: Member = {
        ...newMemberData,
        id: userId,
        role: isMe ? 'Admin' : 'Member',
        status: isMe ? 'Approved' : 'Pending'
      };

      // Write profile details to the members table
      const { error: dbError } = await supabase.from('members').insert([newMember]);
      if (dbError) {
        console.warn('Database insert failed. Error:', dbError.message);
      }

      // Reload members list
      const dbMembers = await dbService.getMembers();
      
      const mappedMembers = dbMembers.map(m => ({
        ...m,
        name: m.full_name || (m as any).name || 'Initiate Member',
        avatarUrl: m.avatar_url || (m as any).avatarUrl || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80',
        slaveName: m.bio || (m as any).slaveName || 'Candidate Member',
        joinsDate: m.created_at ? new Date(m.created_at).toISOString().split('T')[0] : (m as any).joinsDate || new Date().toISOString().split('T')[0]
      }));
      
      setMembers(mappedMembers as any);

      // Auto log in user
      const mappedUser = {
        ...newMember,
        name: newMember.full_name || (newMember as any).name || 'Initiate Member',
        avatarUrl: newMember.avatar_url || (newMember as any).avatarUrl || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80',
        slaveName: newMember.bio || (newMember as any).slaveName || 'Candidate Member',
        joinsDate: new Date().toISOString().split('T')[0]
      };

      setCurrentUser(mappedUser as any);
      showToast(
        isMe
          ? 'Welcome, Administrator! System access fully unlocked.'
          : 'Congratulations! Registration complete. Welcome to the chapter!',
        'success'
      );
    } catch (err: any) {
      showToast(`Registration failed: ${err.message || err}`, 'error');
    }
  };

  // 4. RSVP Event Interactions
  const handleRsvpEvent = async (eventId: string) => {
    if (!currentUser) {
      showToast('Please sign in to RSVP.', 'error');
      return;
    }
    try {
      const updatedEvent = await dbService.rsvpEvent(eventId, currentUser.id);
      if (updatedEvent) {
        const dbEvents = await dbService.getEvents();
        setEvents(dbEvents);
        showToast('Your RSVP status was successfully updated.', 'success');
      }
    } catch (e) {
      showToast('Failed to process RSVP request.', 'error');
    }
  };

  const handlePublishEvent = async (newEventData: Omit<Event, 'id' | 'rsvps'>) => {
    if (!currentUser) return;
    try {
      await dbService.createEvent(newEventData);
      const dbEvents = await dbService.getEvents();
      setEvents(dbEvents);
      showToast('New assembly scheduled and broadcasted!', 'success');
    } catch (e) {
      showToast('Failed to schedule chapter assembly.', 'error');
    }
  };

  // Helper page renderer
  const renderPage = () => {
    switch (activeTab) {
      case 'home':
        return <LandingPage onNavigate={setActiveTab} />;
      case 'about':
        return <AboutUs />;
      case 'news':
        return (
          <NewsPage 
            announcements={announcements} 
            currentUser={currentUser}
            members={members}
          />
        );
      case 'events':
        return (
          <EventPage 
            events={events} 
            currentUser={currentUser}
            onRsvpEvent={handleRsvpEvent}
            onPublishEvent={handlePublishEvent}
            members={members}
          />
        );
      case 'portal':
        return (
          <MemberPortal
            members={members}
            currentUser={currentUser}
            onLogin={handleLogin}
            onLogout={handleLogout}
            onRegister={handleRegister}
            onUpdateMembers={saveMembers}
            onNavigateToPublic={() => setActiveTab('home')}
          />
        );
      default:
        return <LandingPage onNavigate={setActiveTab} />;
    }
  };

  const showGlobalNav = !(activeTab === 'portal' && currentUser && currentUser.role !== 'Pending');

  return (
    <div className="flex flex-col min-h-screen bg-navy-50 font-sans antialiased text-navy-950 selection:bg-gold-200 selection:text-navy-950">
      
      {/* 1. Header Navigation */}
      {showGlobalNav && (
        <Navigation 
          activeTab={activeTab} 
          setActiveTab={setActiveTab} 
          currentUser={currentUser}
          onLogout={handleLogout}
        />
      )}

      {/* 2. Main Body Stage */}
      <main className="flex-grow">
        {renderPage()}
      </main>

      {/* 3. Toast Banner alerts */}
      {toast && (
        <div className="fixed bottom-6 right-6 z-50 flex items-center gap-3 bg-navy-900 border border-gold-400 text-white px-5 py-4 rounded-2xl shadow-2xl animate-slide-up max-w-sm">
          {toast.type === 'error' ? (
            <AlertCircle className="w-5 h-5 text-red-400 shrink-0" />
          ) : (
            <CheckCircle2 className="w-5 h-5 text-gold-400 shrink-0" />
          )}
          <span className="text-xs md:text-sm font-semibold tracking-wide">{toast.message}</span>
        </div>
      )}

      {/* 4. Elegant Greek Footer */}
      <footer className="bg-navy-950 text-white border-t border-gold-500/20 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-12">
            
            {/* Crest column */}
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <CrestLogo size={52} />
                <div>
                  <h4 className="font-serif font-black text-gold-300 tracking-widest">ΛΒΦ</h4>
                  <p className="text-[10px] text-navy-400 uppercase tracking-widest">National Registry</p>
                </div>
              </div>
              <p className="text-xs text-navy-300 leading-relaxed font-sans font-light">
                {FRAT_INFO.fullname} is a private academic and civic organization founded at {FRAT_INFO.foundedLocation}.
              </p>
            </div>

            {/* Quick Links Column */}
            <div className="space-y-4">
              <h5 className="font-serif font-bold text-sm text-gold-200 uppercase tracking-wider">Chapter Board</h5>
              <div className="flex flex-col space-y-2 text-xs text-navy-300">
                <button onClick={() => setActiveTab('home')} className="hover:text-gold-300 transition-colors text-left">Charter Home</button>
                <button onClick={() => setActiveTab('about')} className="hover:text-gold-300 transition-colors text-left">Our Heritage</button>
                <button onClick={() => setActiveTab('news')} className="hover:text-gold-300 transition-colors text-left">Announcements</button>
                <button onClick={() => setActiveTab('events')} className="hover:text-gold-300 transition-colors text-left">Events & Calendars</button>
                <button onClick={() => setActiveTab('portal')} className="hover:text-gold-300 transition-colors text-left">Private Member Portal</button>
              </div>
            </div>

            {/* Contact info column */}
            <div className="space-y-4 text-xs text-navy-300">
              <h5 className="font-serif font-bold text-sm text-gold-200 uppercase tracking-wider">Chapter Council</h5>
              <div className="space-y-2.5">
                <div className="flex items-center gap-2">
                  <MapPin className="w-4 h-4 text-gold-500 shrink-0" />
                  <span>Crestmont Academic Park, Suite 400</span>
                </div>
                <div className="flex items-center gap-2">
                  <Mail className="w-4 h-4 text-gold-500 shrink-0" />
                  <a href="mailto:council@lambdabetaphi.org" className="hover:text-gold-300">
                    council@lambdabetaphi.org
                  </a>
                </div>
                <div className="flex items-center gap-2">
                  <Phone className="w-4 h-4 text-gold-500 shrink-0" />
                  <span>+1 (555) 012-1984</span>
                </div>
              </div>
            </div>

            {/* Shield and motto column */}
            <div className="space-y-4">
              <h5 className="font-serif font-bold text-sm text-gold-200 uppercase tracking-wider">Sovereign Motto</h5>
              <div className="bg-navy-900 p-4 rounded-2xl border border-navy-800">
                <p className="font-serif italic text-gold-300 text-sm mb-1">
                  &ldquo;{FRAT_INFO.tagline}&rdquo;
                </p>
                <p className="text-[10px] text-navy-400 font-sans">
                  Knowledge, Charity, and Honor guiding our operations every single day.
                </p>
              </div>
            </div>

          </div>

          <div className="mt-12 pt-8 border-t border-navy-900 flex flex-col md:flex-row justify-between items-center gap-4 text-[10px] text-navy-400 font-mono">
            <p>&copy; {new Date().getFullYear()} Lambda Beta Phi National Council. All private rights reserved.</p>
            <div className="flex gap-4">
              <a href="#" className="hover:text-gold-400 flex items-center gap-1">Panhellenic Council <ExternalLink className="w-2.5 h-2.5" /></a>
              <span>&bull;</span>
              <a href="#" className="hover:text-gold-400 flex items-center gap-1">Interfraternity Council <ExternalLink className="w-2.5 h-2.5" /></a>
            </div>
          </div>
        </div>
      </footer>

    </div>
  );
}
