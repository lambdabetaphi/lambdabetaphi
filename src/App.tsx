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
import { Member, Event, NewsItem, BulletinPost } from './types';
import { 
  INITIAL_MEMBERS, 
  INITIAL_EVENTS, 
  INITIAL_NEWS, 
  INITIAL_BULLETIN, 
  FRAT_INFO 
} from './data';
import { supabase, isSupabaseConfigured } from './lib/supabase';

export default function App() {
  const [activeTab, setActiveTab] = useState<'home' | 'about' | 'news' | 'events' | 'portal'>('home');
  const [currentUser, setCurrentUser] = useState<Member | null>(null);
  
  // Notification States
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'info' | 'error' } | null>(null);

  // Core Persisted States
  const [members, setMembers] = useState<Member[]>([]);
  const [events, setEvents] = useState<Event[]>([]);
  const [news, setNews] = useState<NewsItem[]>([]);
  const [bulletin, setBulletin] = useState<BulletinPost[]>([]);

  // 1. Initial State Loading from LocalStorage or Data.ts
  useEffect(() => {
    const cachedEvents = localStorage.getItem('lbp_events');
    const cachedNews = localStorage.getItem('lbp_news');
    const cachedBulletin = localStorage.getItem('lbp_bulletin');
    const cachedUser = localStorage.getItem('lbp_current_user');

    if (cachedEvents) setEvents(JSON.parse(cachedEvents));
    else {
      setEvents(INITIAL_EVENTS);
      localStorage.setItem('lbp_events', JSON.stringify(INITIAL_EVENTS));
    }

    if (cachedNews) setNews(JSON.parse(cachedNews));
    else {
      setNews(INITIAL_NEWS);
      localStorage.setItem('lbp_news', JSON.stringify(INITIAL_NEWS));
    }

    if (cachedBulletin) setBulletin(JSON.parse(cachedBulletin));
    else {
      setBulletin(INITIAL_BULLETIN);
      localStorage.setItem('lbp_bulletin', JSON.stringify(INITIAL_BULLETIN));
    }

    if (cachedUser) {
      setCurrentUser(JSON.parse(cachedUser));
    }

    // Load members from Supabase (with fallback to local storage)
    const loadMembersData = async () => {
      if (isSupabaseConfigured && supabase) {
        try {
          const { data, error } = await supabase.from('members').select('*');
          if (error) {
            console.warn('Could not query Supabase members table (using local fallback):', error.message);
            loadLocalMembers();
          } else if (data && data.length > 0) {
            // Sort by numerical/alphabetical IDs to maintain order
            const sorted = [...data].sort((a, b) => a.id.localeCompare(b.id));
            setMembers(sorted as Member[]);
          } else {
            // Seed the Supabase table with initial members
            const { error: seedError } = await supabase.from('members').insert(INITIAL_MEMBERS);
            if (seedError) {
              console.warn('Seeding Supabase members failed:', seedError.message);
            }
            setMembers(INITIAL_MEMBERS);
          }
        } catch (e) {
          console.warn('Supabase loading error (using local fallback):', e);
          loadLocalMembers();
        }
      } else {
        loadLocalMembers();
      }
    };

    const loadLocalMembers = () => {
      const cachedMembers = localStorage.getItem('lbp_members');
      if (cachedMembers) setMembers(JSON.parse(cachedMembers));
      else {
        setMembers(INITIAL_MEMBERS);
        localStorage.setItem('lbp_members', JSON.stringify(INITIAL_MEMBERS));
      }
    };

    loadMembersData();
  }, []);

  // 2. State Synchronizers
  const saveMembers = async (newMembers: Member[]) => {
    setMembers(newMembers);
    localStorage.setItem('lbp_members', JSON.stringify(newMembers));

    if (isSupabaseConfigured && supabase) {
      try {
        const { error } = await supabase.from('members').upsert(newMembers);
        if (error) {
          console.warn('Failed to upsert to Supabase database (will stay local):', error.message);
        }
      } catch (err) {
        console.warn('Supabase sync skipped/failed:', err);
      }
    }
  };

  const saveEvents = (newEvents: Event[]) => {
    setEvents(newEvents);
    localStorage.setItem('lbp_events', JSON.stringify(newEvents));
  };

  const saveNews = (newNews: NewsItem[]) => {
    setNews(newNews);
    localStorage.setItem('lbp_news', JSON.stringify(newNews));
  };

  const saveBulletin = (newBulletin: BulletinPost[]) => {
    setBulletin(newBulletin);
    localStorage.setItem('lbp_bulletin', JSON.stringify(newBulletin));
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
            showToast(`Successfully logged in! Welcome ${localMatched.name}.`, 'success');
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
            ? `Welcome back, Administrator ${memberProfile.name}!`
            : `Welcome back, Initiate ${memberProfile.name}!`,
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
        showToast(`Welcome back, Administrator ${matched.name}!`, 'success');
      } else {
        showToast(`Welcome back, Initiate ${matched.name}!`, 'success');
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
    newMemberData: Omit<Member, 'id' | 'chapterPoints' | 'duesStatus' | 'duesAmount'>,
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
          role: isMe ? 'Admin' : 'User',
          chapterPoints: isMe ? 500 : 10, // Starting bonus points!
          duesStatus: isMe ? 'Paid' : 'Unpaid',
          duesAmount: 350
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
      role: isMe ? 'Admin' : 'User',
      chapterPoints: isMe ? 500 : 10, // Starting bonus points!
      duesStatus: isMe ? 'Paid' : 'Unpaid',
      duesAmount: 350
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

  const handlePayDues = (memberId: string) => {
    const updatedMembers = members.map(m => {
      if (m.id === memberId) {
        return { ...m, duesStatus: 'Paid' as const, chapterPoints: m.chapterPoints + 15 }; // award chapter points for payment!
      }
      return m;
    });
    saveMembers(updatedMembers);

    // Update session
    const updatedMe = updatedMembers.find(m => m.id === memberId);
    if (updatedMe) {
      setCurrentUser(updatedMe);
      localStorage.setItem('lbp_current_user', JSON.stringify(updatedMe));
    }
    showToast('Dues received. Thank you for supporting chapter activities! (+15 Pts)', 'success');
  };

  // 4. RSVP Event Interactions
  const handleRsvpEvent = (eventId: string) => {
    if (!currentUser) {
      showToast('Please sign in to RSVP.', 'error');
      return;
    }

    const updatedEvents = events.map(e => {
      if (e.id === eventId) {
        const alreadyRsvpd = e.rsvps.includes(currentUser.email);
        const newRsvps = alreadyRsvpd 
          ? e.rsvps.filter(email => email !== currentUser.email)
          : [...e.rsvps, currentUser.email];
        
        // Adjust current user points in database
        const pointChange = alreadyRsvpd ? -10 : 10;
        const updatedMembers = members.map(m => {
          if (m.id === currentUser.id) {
            return { ...m, chapterPoints: Math.max(m.chapterPoints + pointChange, 0) };
          }
          return m;
        });
        saveMembers(updatedMembers);

        // Update active session user
        const updatedMe = updatedMembers.find(m => m.id === currentUser.id);
        if (updatedMe) {
          setCurrentUser(updatedMe);
          localStorage.setItem('lbp_current_user', JSON.stringify(updatedMe));
        }

        showToast(
          alreadyRsvpd 
            ? 'Your RSVP has been retracted. (-10 Pts)' 
            : 'Ticket secured! RSVP Approved. (+10 Pts)', 
          alreadyRsvpd ? 'info' : 'success'
        );

        return { ...e, rsvps: newRsvps };
      }
      return e;
    });
    saveEvents(updatedEvents);
  };

  const handlePublishEvent = (newEventData: Omit<Event, 'id' | 'rsvps'>) => {
    if (!currentUser) return;
    const newEvent: Event = {
      ...newEventData,
      id: `e${events.length + 1}`,
      rsvps: [currentUser.email] // Owner automatically RSVPs!
    };
    
    const updatedEvents = [newEvent, ...events];
    saveEvents(updatedEvents);

    // Reward points for scheduling events!
    const updatedMembers = members.map(m => {
      if (m.id === currentUser.id) {
        return { ...m, chapterPoints: m.chapterPoints + 20 };
      }
      return m;
    });
    saveMembers(updatedMembers);
    const updatedMe = updatedMembers.find(m => m.id === currentUser.id);
    if (updatedMe) {
      setCurrentUser(updatedMe);
      localStorage.setItem('lbp_current_user', JSON.stringify(updatedMe));
    }

    showToast('New event scheduled and broadcasted! (+20 Pts)', 'success');
  };

  // 5. News Likes and Comments
  const handleLikeNews = (newsId: string) => {
    if (!currentUser) {
      showToast('Please sign in to like articles.', 'error');
      return;
    }

    const updatedNews = news.map(item => {
      if (item.id === newsId) {
        const liked = item.likedBy.includes(currentUser.email);
        const newLikes = liked ? item.likes - 1 : item.likes + 1;
        const newLikedBy = liked 
          ? item.likedBy.filter(email => email !== currentUser.email)
          : [...item.likedBy, currentUser.email];

        return { ...item, likes: newLikes, likedBy: newLikedBy };
      }
      return item;
    });
    saveNews(updatedNews);
  };

  const handleAddComment = (newsId: string, commentContent: string) => {
    if (!currentUser) return;
    
    const newComment = {
      id: `c${Date.now()}`,
      authorName: currentUser.name,
      authorRole: currentUser.role,
      content: commentContent,
      date: new Date().toISOString().split('T')[0]
    };

    const updatedNews = news.map(item => {
      if (item.id === newsId) {
        return { ...item, comments: [...item.comments, newComment] };
      }
      return item;
    });
    saveNews(updatedNews);
    showToast('Comment published successfully.', 'success');
  };

  const handlePublishNews = (newItemData: Omit<NewsItem, 'id' | 'likes' | 'likedBy' | 'comments'>) => {
    const newItem: NewsItem = {
      ...newItemData,
      id: `n${news.length + 1}`,
      likes: 0,
      likedBy: [],
      comments: []
    };

    const updatedNews = [newItem, ...news];
    saveNews(updatedNews);

    // Award points
    const updatedMembers = members.map(m => {
      if (m.id === currentUser?.id) {
        return { ...m, chapterPoints: m.chapterPoints + 15 };
      }
      return m;
    });
    saveMembers(updatedMembers);
    const updatedMe = updatedMembers.find(m => m.id === currentUser?.id);
    if (updatedMe) {
      setCurrentUser(updatedMe);
      localStorage.setItem('lbp_current_user', JSON.stringify(updatedMe));
    }

    showToast('Announcement published to chapter newsfeed! (+15 Pts)', 'success');
  };

  // 6. Bulletin Message Board interactions
  const handleAddBulletinPost = (content: string) => {
    if (!currentUser) return;

    const newPost: BulletinPost = {
      id: `bp${bulletin.length + 1}`,
      authorName: currentUser.name,
      authorRole: currentUser.role,
      authorAvatar: currentUser.avatarUrl,
      content,
      date: new Date().toISOString().split('T')[0],
      likes: 0,
      likedBy: [],
      replies: []
    };

    const updated = [newPost, ...bulletin];
    saveBulletin(updated);
    showToast('Notice broadcasted to the chapter.', 'success');
  };

  const handleAddBulletinReply = (postId: string, content: string) => {
    if (!currentUser) return;

    const updated = bulletin.map(post => {
      if (post.id === postId) {
        const newReply: any = {
          id: `br${Date.now()}`,
          authorName: currentUser.name,
          authorRole: currentUser.role,
          authorAvatar: currentUser.avatarUrl,
          content,
          date: new Date().toISOString().split('T')[0]
        };
        return {
          ...post,
          replies: [...post.replies, newReply]
        };
      }
      return post;
    });
    saveBulletin(updated);
    showToast('Reply published.', 'success');
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
            news={news} 
            currentUser={currentUser}
            onLikeNews={handleLikeNews}
            onAddComment={handleAddComment}
            onPublishNews={handlePublishNews}
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
            bulletin={bulletin}
            onLogin={handleLogin}
            onLogout={handleLogout}
            onRegister={handleRegister}
            onAddBulletinPost={handleAddBulletinPost}
            onAddBulletinReply={handleAddBulletinReply}
            onPayDues={handlePayDues}
            onUpdateMembers={saveMembers}
          />
        );
      default:
        return <LandingPage onNavigate={setActiveTab} />;
    }
  };

  return (
    <div className="flex flex-col min-h-screen bg-navy-50 font-sans antialiased text-navy-950 selection:bg-gold-200 selection:text-navy-950">
      
      {/* 1. Header Navigation */}
      <Navigation 
        activeTab={activeTab} 
        setActiveTab={setActiveTab} 
        currentUser={currentUser}
        onLogout={handleLogout}
      />

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
