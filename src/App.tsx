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

  // 1. Initial State Loading from Supabase or Fallback
  useEffect(() => {
    const cachedUser = localStorage.getItem('lbp_current_user');
    if (cachedUser) {
      setCurrentUser(JSON.parse(cachedUser));
    }

    const loadAllData = async () => {
      try {
        const dbMembers = await dbService.getMembers();
        setMembers(dbMembers);

        const dbEvents = await dbService.getEvents();
        setEvents(dbEvents);

        const dbAnns = await dbService.getAnnouncements();
        setAnnouncements(dbAnns);
      } catch (e) {
        console.warn('Error loading initial data in App.tsx:', e);
      }
    };

    loadAllData();
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

    if (isSupabaseConfigured && supabase) {
      try {
        if (!password) {
          showToast('Password is required for Supabase authentication.', 'error');
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
          console.warn('Profile entry not found in members table. checking fallback.');
          const localMatched = members.find(m => m.email.toLowerCase() === emailLower);
          if (localMatched) {
            setCurrentUser(localMatched);
            localStorage.setItem('lbp_current_user', JSON.stringify(localMatched));
            showToast(`Successfully logged in! Welcome ${localMatched.full_name}.`, 'success');
            setActiveTab('portal');
            return true;
          } else {
            showToast('Authentication succeeded, but no matching profile exists in the chapter ledger.', 'error');
            return false;
          }
        }

        const memberProfile = profile as Member;
        // Enforce admin privileges for specific email
        if (emailLower === 'roderickdanzing04@gmail.com' && memberProfile.role !== 'Admin') {
          memberProfile.role = 'Admin';
          await supabase.from('members').update({ role: 'Admin' }).eq('id', memberProfile.id);
        }

        setCurrentUser(memberProfile);
        localStorage.setItem('lbp_current_user', JSON.stringify(memberProfile));
        showToast(
          memberProfile.role === 'Admin'
            ? `Welcome back, Administrator ${memberProfile.full_name}!`
            : `Welcome back, Initiate ${memberProfile.full_name}!`,
          'success'
        );
        setActiveTab('portal');
        return true;
      } catch (err: any) {
        showToast(`Login failed: ${err.message || err}`, 'error');
        return false;
      }
    }

    const matched = members.find(m => m.email.toLowerCase() === emailLower);
    if (matched) {
      // Force admin role if you log in with your email
      if (matched.email.toLowerCase() === 'roderickdanzing04@gmail.com' && matched.role !== 'Admin') {
        matched.role = 'Admin';
        const updated = members.map(m => m.id === matched.id ? matched : m);
        saveMembers(updated);
      }
      setCurrentUser(matched);
      localStorage.setItem('lbp_current_user', JSON.stringify(matched));
      if (matched.role === 'Admin') {
        showToast(`Welcome back, Administrator ${matched.full_name}!`, 'success');
      } else {
        showToast(`Welcome back, Initiate ${matched.full_name}!`, 'success');
      }
      setActiveTab('portal');
      return true;
    }
    return false;
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
    localStorage.removeItem('lbp_current_user');
    showToast('Secure session closed.', 'info');
    setActiveTab('home');
  };

  const handleRegister = async (
    newMemberData: Omit<Member, 'id'>,
    password?: string
  ) => {
    const emailLower = newMemberData.email.toLowerCase().trim();
    const isMe = emailLower === 'roderickdanzing04@gmail.com';

    if (isSupabaseConfigured && supabase) {
      try {
        if (!password) {
          showToast('Password is required for Supabase registration.', 'error');
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

        const userId = authData.user?.id || `m${members.length + 1}`;
        const newMember: Member = {
          ...newMemberData,
          id: userId,
          role: isMe ? 'Admin' : 'Member',
          status: isMe ? 'Approved' : 'Pending'
        };

        // Write profile details to the members table
        const { error: dbError } = await supabase.from('members').insert([newMember]);
        if (dbError) {
          console.warn('Database insert failed. Storing locally. Error:', dbError.message);
        }

        // Update application state
        const updated = [...members, newMember];
        await saveMembers(updated);

        // Auto log in user
        setCurrentUser(newMember);
        localStorage.setItem('lbp_current_user', JSON.stringify(newMember));
        showToast(
          isMe
            ? 'Welcome, Administrator! System access fully unlocked.'
            : 'Congratulations! Registration complete. Welcome to the chapter!',
          'success'
        );
      } catch (err: any) {
        showToast(`Registration failed: ${err.message || err}`, 'error');
      }
      return;
    }

    const isEmailTaken = members.some(m => m.email.toLowerCase() === emailLower);
    if (isEmailTaken) {
      showToast('This email is already registered.', 'error');
      return;
    }

    const newMember: Member = {
      ...newMemberData,
      id: `m${members.length + 1}`,
      role: isMe ? 'Admin' : 'Member',
      status: isMe ? 'Approved' : 'Pending'
    };

    const updated = [...members, newMember];
    saveMembers(updated);
    
    // Automatically log in the registered user
    setCurrentUser(newMember);
    localStorage.setItem('lbp_current_user', JSON.stringify(newMember));
    if (isMe) {
      showToast('Welcome, Administrator! System access fully unlocked.', 'success');
    } else {
      showToast('Congratulations! Registration complete. Welcome to the chapter!', 'success');
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
