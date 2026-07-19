import { supabase, isSupabaseConfigured } from './supabase';
import { Member, Post, Comment, Announcement, Event, Notification, GalleryItem } from '../types';

// ==========================================
// 1. Initial High-Fidelity Mock Seed Data
// ==========================================

const INITIAL_MEMBERS: Member[] = [
  {
    id: 'm1',
    name: 'Roderick Danzing',
    email: 'roderickdanzing04@gmail.com',
    role: 'Admin',
    chapter: 'Supreme Archon Chapter',
    batch: 'Alpha Class 2022',
    position: 'Supreme Commander',
    joinsDate: '2022-01-15',
    avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80',
    phone: '0917-555-0123',
    slaveName: 'System Architect',
    birthday: '2004-07-20',
    isOnline: true
  },
  {
    id: 'm2',
    name: 'Evelyn Sterling',
    email: 'evelyn.sterling@example.com',
    role: 'Officer',
    chapter: 'Bohol Beta Chapter',
    batch: 'Beta Class 2023',
    position: 'Vice Archon',
    joinsDate: '2023-04-12',
    avatarUrl: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=200&q=80',
    phone: '0920-555-0143',
    slaveName: 'Beta Queen',
    birthday: '2003-11-05',
    isOnline: true
  },
  {
    id: 'm3',
    name: 'Marcus Vance',
    email: 'marcus.vance@example.com',
    role: 'Member',
    chapter: 'Bohol Alpha Chapter',
    batch: 'Alpha Class 2022',
    position: 'Technology Warden',
    joinsDate: '2022-08-20',
    avatarUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=200&q=80',
    phone: '0915-555-0177',
    slaveName: 'Dev Commander',
    birthday: '2002-05-15',
    isOnline: false
  },
  {
    id: 'm4',
    name: 'Helena Troy',
    email: 'helena.troy@example.com',
    role: 'Member',
    chapter: 'Bohol Beta Chapter',
    batch: 'Gamma Class 2024',
    position: 'Academic Chair',
    joinsDate: '2024-02-10',
    avatarUrl: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=200&q=80',
    phone: '0945-555-0211',
    slaveName: 'Brain Sovereign',
    birthday: '2004-07-22', // Upcoming birthday!
    isOnline: true
  },
  {
    id: 'm5',
    name: 'Julian Carter',
    email: 'julian.c@example.com',
    role: 'Pending',
    chapter: 'Manila Alpha Chapter',
    batch: 'Delta Class 2026',
    position: 'Candidate',
    joinsDate: '2026-07-18',
    avatarUrl: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=200&q=80',
    phone: '0917-222-3333',
    slaveName: 'Hopeful Squire'
  }
];

const INITIAL_POSTS: Post[] = [
  {
    id: 'p1',
    author_id: 'm1',
    author_name: 'Roderick Danzing',
    author_avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80',
    author_chapter: 'Supreme Archon Chapter',
    author_slave_name: 'System Architect',
    content: 'Welcome to the newly launched Private Community Portal of Lambda Beta Phi Fraternity and Sorority. This custom application will serve as our secure ledger, news feed, gallery, and administrative nexus. Direct all suggestions for digital portal enhancements to the Technology Committee.',
    images: ['https://images.unsplash.com/photo-1541534741688-6078c6bfb5c5?auto=format&fit=crop&w=800&q=80'],
    created_at: new Date(Date.now() - 3600000 * 24 * 3).toISOString(), // 3 days ago
    likes_count: 3,
    liked_by: ['m2', 'm3', 'm4']
  },
  {
    id: 'p2',
    author_id: 'm2',
    author_name: 'Evelyn Sterling',
    author_avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=200&q=80',
    author_chapter: 'Bohol Beta Chapter',
    author_slave_name: 'Beta Queen',
    content: 'Had an incredibly successful joint philanthropy planning session last night. Looking forward to our Regional Community Outreach and Food Drive next week! Please RSVP in the Events tab so we can finalize logistics and assignments.',
    images: [
      'https://images.unsplash.com/photo-1488521787991-ed7bbaae773c?auto=format&fit=crop&w=600&q=80',
      'https://images.unsplash.com/photo-1593113598332-cd288d649433?auto=format&fit=crop&w=600&q=80'
    ],
    created_at: new Date(Date.now() - 3600000 * 5).toISOString(), // 5 hours ago
    likes_count: 2,
    liked_by: ['m1', 'm4']
  }
];

const INITIAL_COMMENTS: Comment[] = [
  {
    id: 'c1',
    post_id: 'p1',
    author_id: 'm2',
    author_name: 'Evelyn Sterling',
    author_avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=200&q=80',
    content: 'This portal is exceptionally clean and modern. Outstanding work on the layout, Rod!',
    created_at: new Date(Date.now() - 3600000 * 24 * 2.8).toISOString()
  },
  {
    id: 'c2',
    post_id: 'p1',
    author_id: 'm3',
    author_name: 'Marcus Vance',
    author_avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=200&q=80',
    content: 'Excellent response time and the offline mode integration is top-tier.',
    created_at: new Date(Date.now() - 3600000 * 24 * 2.5).toISOString()
  }
];

const INITIAL_ANNOUNCEMENTS: Announcement[] = [
  {
    id: 'a1',
    title: 'Supreme Council Annual Conclave',
    content: 'Official notice is hereby given to all active Chapters that the Supreme Council Annual Conclave will be hosted next month. Officers must prepare and submit their chapter status audits, financial briefs, and updated registries by Friday. Attendance is strictly mandatory for all chapter executives.',
    author_name: 'Roderick Danzing',
    author_avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80',
    created_at: new Date(Date.now() - 3600000 * 24 * 5).toISOString(),
    is_pinned: true
  },
  {
    id: 'a2',
    title: 'Induction Ceremony Guidelines',
    content: 'The official rituals and protocol dossiers for the incoming Alpha Class of 2026 have been posted in the private files. Please review your ceremonial roles and dress code requirements (formal black & gold).',
    author_name: 'Evelyn Sterling',
    author_avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=200&q=80',
    created_at: new Date(Date.now() - 3600000 * 12).toISOString(),
    is_pinned: false
  }
];

const INITIAL_EVENTS: Event[] = [
  {
    id: 'e1',
    title: 'Community Outreach & Food Drive',
    description: 'Annual philanthropy event supporting localized regional care centers. We will organize food distribution and coordinate with healthcare volunteers.',
    date: '2026-07-28',
    time: '08:00 AM',
    location: 'Bohol Community Center & Gymnasium',
    image: 'https://images.unsplash.com/photo-1593113598332-cd288d649433?auto=format&fit=crop&w=600&q=80',
    category: 'Service',
    created_by: 'm2',
    rsvps: ['m1', 'm2', 'm4']
  },
  {
    id: 'e2',
    title: 'National Leadership Seminar',
    description: 'An interactive workshop and conference bringing chapters together to share operational frameworks and foster strategic planning.',
    date: '2026-08-15',
    time: '10:00 AM',
    location: 'Metropolitan Executive Hall',
    image: 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?auto=format&fit=crop&w=600&q=80',
    category: 'Professional',
    created_by: 'm1',
    rsvps: ['m1', 'm3']
  }
];

const INITIAL_NOTIFICATIONS: Notification[] = [
  {
    id: 'n1',
    type: 'new_member',
    title: 'New Member Registered',
    content: 'Julian Carter has registered for the Manila Alpha Chapter and is currently pending administrator approval.',
    reference_id: 'm5',
    created_at: new Date(Date.now() - 3600000 * 2).toISOString(),
    is_read: false
  },
  {
    id: 'n2',
    type: 'new_post',
    title: 'New Community Post',
    content: 'Evelyn Sterling shared a photo updates regarding the Joint Philanthropy session.',
    reference_id: 'p2',
    created_at: new Date(Date.now() - 3600000 * 5).toISOString(),
    is_read: false
  }
];

const INITIAL_GALLERY: GalleryItem[] = [
  {
    id: 'g1',
    album: 'Induction Class',
    url: 'https://images.unsplash.com/photo-1541534741688-6078c6bfb5c5?auto=format&fit=crop&w=800&q=80',
    description: 'Supreme Commander addressing the delegation during the Conclave opening ceremony.',
    uploaded_by: 'm1',
    created_at: new Date(Date.now() - 3600000 * 24 * 10).toISOString()
  },
  {
    id: 'g2',
    album: 'Philanthropy Days',
    url: 'https://images.unsplash.com/photo-1488521787991-ed7bbaae773c?auto=format&fit=crop&w=800&q=80',
    description: 'Volunteers and members during last season’s medical outreach campaign.',
    uploaded_by: 'm2',
    created_at: new Date(Date.now() - 3600000 * 24 * 15).toISOString()
  },
  {
    id: 'g3',
    album: 'Conclave 2025',
    url: 'https://images.unsplash.com/photo-1511578314322-379afb476865?auto=format&fit=crop&w=800&q=80',
    description: 'Chapter presidents gathering for the executive council dinner.',
    uploaded_by: 'm1',
    created_at: new Date(Date.now() - 3600000 * 24 * 20).toISOString()
  }
];

// ==========================================
// 2. Storage Local Fallback Helpers
// ==========================================

const getStored = <T>(key: string, initial: T): T => {
  const data = localStorage.getItem(key);
  if (!data) {
    localStorage.setItem(key, JSON.stringify(initial));
    return initial;
  }
  return JSON.parse(data);
};

const setStored = <T>(key: string, value: T) => {
  localStorage.setItem(key, JSON.stringify(value));
};

// ==========================================
// 3. Dynamic Unified Database Service
// ==========================================

export const dbService = {
  // Members & Users Management
  async getMembers(): Promise<Member[]> {
    if (isSupabaseConfigured && supabase) {
      try {
        const { data, error } = await supabase.from('members').select('*');
        if (!error && data) return data as Member[];
        console.warn('Supabase members fetch error, using local fallback:', error?.message);
      } catch (e) {
        console.warn('Supabase exception in getMembers, using fallback:', e);
      }
    }
    return getStored<Member[]>('lbp_v2_members', INITIAL_MEMBERS);
  },

  async saveMembers(members: Member[]): Promise<void> {
    setStored('lbp_v2_members', members);
    if (isSupabaseConfigured && supabase) {
      try {
        // Attempt to sync
        const { error } = await supabase.from('members').upsert(members);
        if (error) console.warn('Supabase members save failed:', error.message);
      } catch (e) {
        console.warn('Supabase members save exception:', e);
      }
    }
  },

  async updateMemberProfile(updatedMember: Member): Promise<Member> {
    const members = await this.getMembers();
    const index = members.findIndex(m => m.id === updatedMember.id);
    if (index !== -1) {
      members[index] = updatedMember;
    } else {
      members.push(updatedMember);
    }
    await this.saveMembers(members);
    return updatedMember;
  },

  // News Feed & Posts
  async getPosts(): Promise<Post[]> {
    if (isSupabaseConfigured && supabase) {
      try {
        const { data, error } = await supabase.from('posts').select('*').order('created_at', { ascending: false });
        if (!error && data) return data as Post[];
        console.warn('Supabase posts fetch failed, using local:', error?.message);
      } catch (e) {
        console.warn('Supabase exception in getPosts:', e);
      }
    }
    const localPosts = getStored<Post[]>('lbp_v2_posts', INITIAL_POSTS);
    return [...localPosts].sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
  },

  async createPost(post: Omit<Post, 'id' | 'created_at' | 'likes_count' | 'liked_by'>): Promise<Post> {
    const newPost: Post = {
      ...post,
      id: 'p_' + Date.now() + '_' + Math.random().toString(36).substr(2, 4),
      created_at: new Date().toISOString(),
      likes_count: 0,
      liked_by: []
    };

    const posts = await this.getPosts();
    const updated = [newPost, ...posts];
    setStored('lbp_v2_posts', updated);

    if (isSupabaseConfigured && supabase) {
      try {
        const { error } = await supabase.from('posts').insert([newPost]);
        if (error) console.warn('Supabase post insert failed:', error.message);
      } catch (e) {
        console.warn('Supabase post insert exception:', e);
      }
    }

    // Trigger Notification for new post
    await this.createNotification({
      type: 'new_post',
      title: 'New Community Post',
      content: `${newPost.author_name} posted in the feed: "${newPost.content.slice(0, 45)}..."`,
      reference_id: newPost.id
    });

    return newPost;
  },

  async toggleLikePost(postId: string, memberId: string): Promise<Post | null> {
    const posts = await this.getPosts();
    const index = posts.findIndex(p => p.id === postId);
    if (index === -1) return null;

    const post = posts[index];
    const isLiked = post.liked_by.includes(memberId);

    if (isLiked) {
      post.liked_by = post.liked_by.filter(id => id !== memberId);
    } else {
      post.liked_by.push(memberId);
    }
    post.likes_count = post.liked_by.length;
    posts[index] = post;
    setStored('lbp_v2_posts', posts);

    if (isSupabaseConfigured && supabase) {
      try {
        const { error } = await supabase
          .from('posts')
          .update({ liked_by: post.liked_by, likes_count: post.likes_count })
          .eq('id', postId);
        if (error) console.warn('Supabase toggle like failed:', error.message);
      } catch (e) {
        console.warn('Supabase toggle like exception:', e);
      }
    }

    return post;
  },

  // Comments
  async getComments(postId?: string): Promise<Comment[]> {
    if (isSupabaseConfigured && supabase) {
      try {
        let query = supabase.from('comments').select('*');
        if (postId) query = query.eq('post_id', postId);
        const { data, error } = await query;
        if (!error && data) return data as Comment[];
        console.warn('Supabase comments fetch failed:', error?.message);
      } catch (e) {
        console.warn('Supabase comments exception:', e);
      }
    }
    const allComments = getStored<Comment[]>('lbp_v2_comments', INITIAL_COMMENTS);
    if (postId) {
      return allComments.filter(c => c.post_id === postId);
    }
    return allComments;
  },

  async addComment(comment: Omit<Comment, 'id' | 'created_at'>): Promise<Comment> {
    const newComment: Comment = {
      ...comment,
      id: 'c_' + Date.now() + '_' + Math.random().toString(36).substr(2, 4),
      created_at: new Date().toISOString()
    };

    const comments = await this.getComments();
    const updated = [...comments, newComment];
    setStored('lbp_v2_comments', updated);

    if (isSupabaseConfigured && supabase) {
      try {
        const { error } = await supabase.from('comments').insert([newComment]);
        if (error) console.warn('Supabase comment insert failed:', error.message);
      } catch (e) {
        console.warn('Supabase comment exception:', e);
      }
    }

    return newComment;
  },

  // Announcements
  async getAnnouncements(): Promise<Announcement[]> {
    if (isSupabaseConfigured && supabase) {
      try {
        const { data, error } = await supabase.from('announcements').select('*').order('created_at', { ascending: false });
        if (!error && data) return data as Announcement[];
        console.warn('Supabase announcements fetch failed:', error?.message);
      } catch (e) {
        console.warn('Supabase announcements exception:', e);
      }
    }
    const local = getStored<Announcement[]>('lbp_v2_announcements', INITIAL_ANNOUNCEMENTS);
    return [...local].sort((a, b) => {
      // Pinned first, then date
      if (a.is_pinned && !b.is_pinned) return -1;
      if (!a.is_pinned && b.is_pinned) return 1;
      return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
    });
  },

  async createAnnouncement(announcement: Omit<Announcement, 'id' | 'created_at'>): Promise<Announcement> {
    const newAnn: Announcement = {
      ...announcement,
      id: 'a_' + Date.now() + '_' + Math.random().toString(36).substr(2, 4),
      created_at: new Date().toISOString()
    };

    const announcements = await this.getAnnouncements();
    const updated = [newAnn, ...announcements];
    setStored('lbp_v2_announcements', updated);

    if (isSupabaseConfigured && supabase) {
      try {
        const { error } = await supabase.from('announcements').insert([newAnn]);
        if (error) console.warn('Supabase announcement insert failed:', error.message);
      } catch (e) {
        console.warn('Supabase announcement exception:', e);
      }
    }

    await this.createNotification({
      type: 'new_announcement',
      title: '🚨 New Announcement Pinned',
      content: `A new chapter directive has been published: "${newAnn.title}"`,
      reference_id: newAnn.id
    });

    return newAnn;
  },

  async togglePinAnnouncement(announcementId: string): Promise<Announcement | null> {
    const anns = await this.getAnnouncements();
    const index = anns.findIndex(a => a.id === announcementId);
    if (index === -1) return null;

    const ann = anns[index];
    ann.is_pinned = !ann.is_pinned;
    anns[index] = ann;
    setStored('lbp_v2_announcements', anns);

    if (isSupabaseConfigured && supabase) {
      try {
        const { error } = await supabase
          .from('announcements')
          .update({ is_pinned: ann.is_pinned })
          .eq('id', announcementId);
        if (error) console.warn('Supabase toggle pin failed:', error.message);
      } catch (e) {
        console.warn('Supabase toggle pin exception:', e);
      }
    }

    return ann;
  },

  async deleteAnnouncement(annId: string): Promise<void> {
    const anns = await this.getAnnouncements();
    const filtered = anns.filter(a => a.id !== annId);
    setStored('lbp_v2_announcements', filtered);

    if (isSupabaseConfigured && supabase) {
      try {
        const { error } = await supabase.from('announcements').delete().eq('id', annId);
        if (error) console.warn('Supabase delete ann failed:', error.message);
      } catch (e) {
        console.warn('Supabase delete ann exception:', e);
      }
    }
  },

  // Events
  async getEvents(): Promise<Event[]> {
    if (isSupabaseConfigured && supabase) {
      try {
        const { data, error } = await supabase.from('events').select('*');
        if (!error && data) return data as Event[];
        console.warn('Supabase events fetch failed:', error?.message);
      } catch (e) {
        console.warn('Supabase events exception:', e);
      }
    }
    const local = getStored<Event[]>('lbp_v2_events', INITIAL_EVENTS);
    return [...local].sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
  },

  async createEvent(event: Omit<Event, 'id' | 'rsvps'>): Promise<Event> {
    const newEvent: Event = {
      ...event,
      id: 'e_' + Date.now() + '_' + Math.random().toString(36).substr(2, 4),
      rsvps: []
    };

    const events = await this.getEvents();
    const updated = [...events, newEvent];
    setStored('lbp_v2_events', updated);

    if (isSupabaseConfigured && supabase) {
      try {
        const { error } = await supabase.from('events').insert([newEvent]);
        if (error) console.warn('Supabase event insert failed:', error.message);
      } catch (e) {
        console.warn('Supabase event exception:', e);
      }
    }

    await this.createNotification({
      type: 'new_event',
      title: '📅 New Event Scheduled',
      content: `A new chapter event has been created: "${newEvent.title}" on ${newEvent.date}. RSVP now!`,
      reference_id: newEvent.id
    });

    return newEvent;
  },

  async rsvpEvent(eventId: string, memberId: string): Promise<Event | null> {
    const events = await this.getEvents();
    const index = events.findIndex(e => e.id === eventId);
    if (index === -1) return null;

    const event = events[index];
    const isRsvpd = event.rsvps.includes(memberId);

    if (isRsvpd) {
      event.rsvps = event.rsvps.filter(id => id !== memberId);
    } else {
      event.rsvps.push(memberId);
    }
    events[index] = event;
    setStored('lbp_v2_events', events);

    if (isSupabaseConfigured && supabase) {
      try {
        const { error } = await supabase
          .from('events')
          .update({ rsvps: event.rsvps })
          .eq('id', eventId);
        if (error) console.warn('Supabase rsvp update failed:', error.message);
      } catch (e) {
        console.warn('Supabase rsvp exception:', e);
      }
    }

    return event;
  },

  async deleteEvent(eventId: string): Promise<void> {
    const events = await this.getEvents();
    const filtered = events.filter(e => e.id !== eventId);
    setStored('lbp_v2_events', filtered);

    if (isSupabaseConfigured && supabase) {
      try {
        const { error } = await supabase.from('events').delete().eq('id', eventId);
        if (error) console.warn('Supabase delete event failed:', error.message);
      } catch (e) {
        console.warn('Supabase delete event exception:', e);
      }
    }
  },

  // Notifications
  async getNotifications(): Promise<Notification[]> {
    if (isSupabaseConfigured && supabase) {
      try {
        const { data, error } = await supabase.from('notifications').select('*').order('created_at', { ascending: false });
        if (!error && data) return data as Notification[];
        console.warn('Supabase notifications fetch failed:', error?.message);
      } catch (e) {
        console.warn('Supabase notifications exception:', e);
      }
    }
    const local = getStored<Notification[]>('lbp_v2_notifications', INITIAL_NOTIFICATIONS);
    return [...local].sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
  },

  async createNotification(notif: Omit<Notification, 'id' | 'created_at' | 'is_read'>): Promise<Notification> {
    const newNotif: Notification = {
      ...notif,
      id: 'n_' + Date.now() + '_' + Math.random().toString(36).substr(2, 4),
      created_at: new Date().toISOString(),
      is_read: false
    };

    const notifs = getStored<Notification[]>('lbp_v2_notifications', INITIAL_NOTIFICATIONS);
    const updated = [newNotif, ...notifs];
    setStored('lbp_v2_notifications', updated);

    if (isSupabaseConfigured && supabase) {
      try {
        const { error } = await supabase.from('notifications').insert([newNotif]);
        if (error) console.warn('Supabase notification insert failed:', error.message);
      } catch (e) {
        console.warn('Supabase notification exception:', e);
      }
    }

    return newNotif;
  },

  async markNotificationRead(notifId: string): Promise<void> {
    const notifs = await this.getNotifications();
    const index = notifs.findIndex(n => n.id === notifId);
    if (index !== -1) {
      notifs[index].is_read = true;
      setStored('lbp_v2_notifications', notifs);
    }

    if (isSupabaseConfigured && supabase) {
      try {
        const { error } = await supabase
          .from('notifications')
          .update({ is_read: true })
          .eq('id', notifId);
        if (error) console.warn('Supabase notification mark read failed:', error.message);
      } catch (e) {
        console.warn('Supabase notification mark read exception:', e);
      }
    }
  },

  async clearAllNotifications(): Promise<void> {
    setStored('lbp_v2_notifications', []);

    if (isSupabaseConfigured && supabase) {
      try {
        const { error } = await supabase.from('notifications').delete().neq('id', '');
        if (error) console.warn('Supabase notification clear failed:', error.message);
      } catch (e) {
        console.warn('Supabase notification clear exception:', e);
      }
    }
  },

  // Gallery
  async getGalleryItems(): Promise<GalleryItem[]> {
    if (isSupabaseConfigured && supabase) {
      try {
        const { data, error } = await supabase.from('gallery').select('*').order('created_at', { ascending: false });
        if (!error && data) return data as GalleryItem[];
        console.warn('Supabase gallery fetch failed:', error?.message);
      } catch (e) {
        console.warn('Supabase gallery exception:', e);
      }
    }
    const local = getStored<GalleryItem[]>('lbp_v2_gallery', INITIAL_GALLERY);
    return [...local].sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
  },

  async uploadGalleryItem(item: Omit<GalleryItem, 'id' | 'created_at'>): Promise<GalleryItem> {
    const newItem: GalleryItem = {
      ...item,
      id: 'g_' + Date.now() + '_' + Math.random().toString(36).substr(2, 4),
      created_at: new Date().toISOString()
    };

    const items = await this.getGalleryItems();
    const updated = [newItem, ...items];
    setStored('lbp_v2_gallery', updated);

    if (isSupabaseConfigured && supabase) {
      try {
        const { error } = await supabase.from('gallery').insert([newItem]);
        if (error) console.warn('Supabase gallery insert failed:', error.message);
      } catch (e) {
        console.warn('Supabase gallery exception:', e);
      }
    }

    return newItem;
  }
};
