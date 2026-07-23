import { supabase, isSupabaseConfigured } from './supabase';
import { Member, Post, Comment, Announcement, Event, Notification, Chapter, GalleryItem } from '../types';

// Storage helper for offline/caching if Supabase is temporarily offline
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

export const dbService = {
  // =================================================================
  // 1. MEMBERS & ROSTER MANAGEMENT
  // =================================================================
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
    return getStored<Member[]>('lbp_prod_members', []);
  },

  async saveMembers(members: Member[]): Promise<void> {
    setStored('lbp_prod_members', members);
    if (isSupabaseConfigured && supabase) {
      try {
        const cleanMembers = members.map(m => ({
          id: m.id,
          full_name: m.full_name || (m as any).name || '',
          email: m.email || '',
          chapter: m.chapter || null,
          batch: m.batch || null,
          position: m.position || null,
          role: m.role || 'Member',
          status: m.status || 'Pending',
          avatar_url: m.avatar_url || (m as any).avatarUrl || null,
          phone: m.phone || null,
          bio: m.bio || (m as any).slaveName || null,
          updated_at: new Date().toISOString()
        }));
        const { error } = await supabase.from('members').upsert(cleanMembers, { onConflict: 'id' });
        if (error) {
          console.warn('Supabase members save failed:', error.message);
        }
      } catch (e) {
        console.warn('Supabase members save exception:', e);
      }
    }
  },

  /**
   * Saves updated member profile fields directly to Supabase and local cache.
   * Ensures schema compliance and throws clear error on database save failure.
   */
  async updateMemberProfile(updatedMember: Member): Promise<Member> {
    const normalizedMember: Member = {
      ...updatedMember,
      full_name: updatedMember.full_name || (updatedMember as any).name || '',
      name: updatedMember.full_name || (updatedMember as any).name || '',
      avatar_url: updatedMember.avatar_url || (updatedMember as any).avatarUrl || '',
      avatarUrl: updatedMember.avatar_url || (updatedMember as any).avatarUrl || '',
      bio: updatedMember.bio || (updatedMember as any).slaveName || '',
      slaveName: updatedMember.bio || (updatedMember as any).slaveName || '',
      updated_at: new Date().toISOString()
    };

    // Strictly mapped DB row matching public.members schema
    const dbPayload = {
      id: normalizedMember.id,
      full_name: normalizedMember.full_name,
      email: normalizedMember.email,
      chapter: normalizedMember.chapter || null,
      batch: normalizedMember.batch || null,
      position: normalizedMember.position || null,
      role: normalizedMember.role || 'Member',
      status: normalizedMember.status || 'Pending',
      avatar_url: normalizedMember.avatar_url || null,
      phone: normalizedMember.phone || null,
      bio: normalizedMember.bio || null,
      updated_at: normalizedMember.updated_at
    };

    // 1. Update local storage cache
    const members = await this.getMembers();
    const index = members.findIndex(m => m.id === normalizedMember.id);
    if (index !== -1) {
      members[index] = normalizedMember;
    } else {
      members.push(normalizedMember);
    }
    setStored('lbp_prod_members', members);

    // 2. Persist to Supabase database
    if (isSupabaseConfigured && supabase) {
      const { error } = await supabase
        .from('members')
        .upsert([dbPayload], { onConflict: 'id' });

      if (error) {
        console.error('Supabase profile update error:', error);
        throw new Error(`Database error saving profile: ${error.message}`);
      }

      // Sync user metadata with Supabase Auth session if possible
      try {
        await supabase.auth.updateUser({
          data: {
            full_name: normalizedMember.full_name,
            avatar_url: normalizedMember.avatar_url,
            chapter: normalizedMember.chapter,
            batch: normalizedMember.batch
          }
        });
      } catch (authErr) {
        console.warn('Supabase Auth user metadata sync notice:', authErr);
      }
    }

    return normalizedMember;
  },

  /**
   * Uploads a profile picture file to Supabase Storage bucket 'avatars'.
   * 
   * Storage Configuration & Location:
   * - Storage Bucket: 'avatars' (public bucket)
   * - File Path Strategy: `${auth.uid()}/profile_${timestamp}.${extension}`
   * - Policy Requirement: (storage.foldername(name))[1] = auth.uid()
   */
  async uploadProfilePicture(file: File): Promise<string> {
    if (!isSupabaseConfigured || !supabase) {
      throw new Error('Supabase Storage uploads require configured VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY variables.');
    }

    // 1. Obtain authenticated Supabase Auth user context
    const { data: { user }, error: authError } = await supabase.auth.getUser();

    if (authError || !user || !user.id) {
      console.warn('No active Supabase Auth user session found for Storage upload:', authError);
      throw new Error('Supabase Storage uploads require an active authenticated Supabase session. Please sign in or register via Supabase Auth.');
    }

    try {
      const ext = file.name.split('.').pop()?.toLowerCase() || 'jpg';
      const fileName = `profile_${Date.now()}.${ext}`;
      // Strictly use authenticated Supabase Auth user.id to guarantee matching auth.uid() in Storage RLS policy
      const filePath = `${user.id}/${fileName}`;
      const primaryBucket = 'avatars';

      // 2. Upload image file to Supabase Storage 'avatars' bucket
      const { error: uploadError } = await supabase.storage
        .from(primaryBucket)
        .upload(filePath, file, {
          cacheControl: '3600',
          upsert: true
        });

      if (uploadError) {
        console.error('Supabase avatars storage bucket upload error:', uploadError);

        if (uploadError.message?.includes('row-level security') || uploadError.message?.includes('RLS')) {
          throw new Error(`Storage RLS Policy Error: Folder path (${user.id}) must match auth.uid() in the avatars bucket policy.`);
        }

        throw new Error(`Storage upload failed: ${uploadError.message}`);
      }

      // 3. Obtain and verify public access URL
      const { data: urlData } = supabase.storage.from(primaryBucket).getPublicUrl(filePath);
      if (!urlData?.publicUrl) {
        throw new Error('Failed to retrieve public URL from Supabase Storage');
      }

      return urlData.publicUrl;
    } catch (err: any) {
      console.error('Error in uploadProfilePicture:', err);
      throw new Error(err.message || 'Image upload failed. Please try again.');
    }
  },

  // =================================================================
  // 2. SOCIAL FEED & POSTS (WITH IMAGES & LIKES)
  // =================================================================
  async getPosts(): Promise<Post[]> {
    if (isSupabaseConfigured && supabase) {
      try {
        const { data: dbPosts, error: postsErr } = await supabase
          .from('posts')
          .select('*')
          .order('created_at', { ascending: false });

        if (!postsErr && dbPosts) {
          // Fetch join data: images and likes
          const { data: dbImages } = await supabase.from('post_images').select('*');
          const { data: dbLikes } = await supabase.from('likes').select('*');

          const mappedPosts: Post[] = dbPosts.map(p => {
            const images = dbImages?.filter(img => img.post_id === p.id).map(img => img.image_url) || [];
            const likes = dbLikes?.filter(lk => lk.post_id === p.id).map(lk => lk.member_id) || [];
            return {
              id: p.id,
              member_id: p.member_id,
              content: p.content,
              created_at: p.created_at,
              updated_at: p.updated_at,
              images,
              likes_count: likes.length,
              liked_by: likes
            };
          });

          return mappedPosts;
        }
        console.warn('Supabase posts fetch failed, using local:', postsErr?.message);
      } catch (e) {
        console.warn('Supabase exception in getPosts:', e);
      }
    }
    return getStored<Post[]>('lbp_prod_posts', []);
  },

  async createPost(post: Omit<Post, 'id' | 'created_at' | 'likes_count' | 'liked_by'> & { images?: string[] }): Promise<Post> {
    const newPostId = 'p_' + Date.now() + '_' + Math.random().toString(36).substr(2, 4);
    const newPost: Post = {
      id: newPostId,
      member_id: post.member_id,
      content: post.content,
      created_at: new Date().toISOString(),
      images: post.images || [],
      likes_count: 0,
      liked_by: []
    };

    const posts = await this.getPosts();
    const updated = [newPost, ...posts];
    setStored('lbp_prod_posts', updated);

    if (isSupabaseConfigured && supabase) {
      try {
        // 1. Insert to posts table
        const { error: postErr } = await supabase.from('posts').insert([{
          id: newPostId,
          member_id: post.member_id,
          content: post.content,
          created_at: newPost.created_at
        }]);

        if (postErr) {
          console.warn('Supabase post insert failed:', postErr.message);
        }

        // 2. Insert to post_images table
        if (post.images && post.images.length > 0) {
          const imageRows = post.images.map((img, idx) => ({
            id: `img_${newPostId}_${idx}`,
            post_id: newPostId,
            image_url: img
          }));
          const { error: imgErr } = await supabase.from('post_images').insert(imageRows);
          if (imgErr) console.warn('Supabase post_images insert failed:', imgErr.message);
        }
      } catch (e) {
        console.warn('Supabase post insert exception:', e);
      }
    }

    return newPost;
  },

  async toggleLikePost(postId: string, memberId: string): Promise<Post | null> {
    const posts = await this.getPosts();
    const index = posts.findIndex(p => p.id === postId);
    if (index === -1) return null;

    const post = posts[index];
    if (!post.liked_by) post.liked_by = [];
    const isLiked = post.liked_by.includes(memberId);

    if (isLiked) {
      post.liked_by = post.liked_by.filter(id => id !== memberId);
    } else {
      post.liked_by.push(memberId);
    }
    post.likes_count = post.liked_by.length;
    posts[index] = post;
    setStored('lbp_prod_posts', posts);

    if (isSupabaseConfigured && supabase) {
      try {
        if (isLiked) {
          await supabase.from('likes').delete().eq('post_id', postId).eq('member_id', memberId);
        } else {
          await supabase.from('likes').insert([{
            id: 'lk_' + Date.now() + '_' + Math.random().toString(36).substr(2, 4),
            post_id: postId,
            member_id: memberId,
            created_at: new Date().toISOString()
          }]);
        }
      } catch (e) {
        console.warn('Supabase toggle like exception:', e);
      }
    }

    return post;
  },

  // =================================================================
  // 3. COMMENTS
  // =================================================================
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
    const allComments = getStored<Comment[]>('lbp_prod_comments', []);
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
    setStored('lbp_prod_comments', updated);

    if (isSupabaseConfigured && supabase) {
      try {
        const { error } = await supabase.from('comments').insert([{
          id: newComment.id,
          post_id: comment.post_id,
          member_id: comment.member_id,
          comment: comment.comment,
          created_at: newComment.created_at
        }]);
        if (error) console.warn('Supabase comment insert failed:', error.message);
      } catch (e) {
        console.warn('Supabase comment exception:', e);
      }
    }

    return newComment;
  },

  // =================================================================
  // 4. ANNOUNCEMENTS (DIRECTIVES)
  // =================================================================
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
    return getStored<Announcement[]>('lbp_prod_announcements', []);
  },

  async createAnnouncement(announcement: Omit<Announcement, 'id' | 'created_at'>): Promise<Announcement> {
    const newAnn: Announcement = {
      ...announcement,
      id: 'a_' + Date.now() + '_' + Math.random().toString(36).substr(2, 4),
      created_at: new Date().toISOString()
    };

    const announcements = await this.getAnnouncements();
    const updated = [newAnn, ...announcements];
    setStored('lbp_prod_announcements', updated);

    if (isSupabaseConfigured && supabase) {
      try {
        const { error } = await supabase.from('announcements').insert([{
          id: newAnn.id,
          title: announcement.title,
          content: announcement.content,
          created_by: announcement.created_by,
          is_pinned: announcement.is_pinned,
          created_at: newAnn.created_at
        }]);
        if (error) console.warn('Supabase announcement insert failed:', error.message);
      } catch (e) {
        console.warn('Supabase announcement exception:', e);
      }
    }

    return newAnn;
  },

  async togglePinAnnouncement(announcementId: string): Promise<Announcement | null> {
    const anns = await this.getAnnouncements();
    const index = anns.findIndex(a => a.id === announcementId);
    if (index === -1) return null;

    const ann = anns[index];
    ann.is_pinned = !ann.is_pinned;
    anns[index] = ann;
    setStored('lbp_prod_announcements', anns);

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
    setStored('lbp_prod_announcements', filtered);

    if (isSupabaseConfigured && supabase) {
      try {
        const { error } = await supabase.from('announcements').delete().eq('id', annId);
        if (error) console.warn('Supabase delete ann failed:', error.message);
      } catch (e) {
        console.warn('Supabase delete ann exception:', e);
      }
    }
  },

  // =================================================================
  // 5. EVENTS & RSVPS
  // =================================================================
  async getEvents(): Promise<Event[]> {
    if (isSupabaseConfigured && supabase) {
      try {
        const { data, error } = await supabase.from('events').select('*');
        if (!error && data) {
          // Standard map to client structure
          return data.map(e => ({
            id: e.id,
            title: e.title,
            description: e.description,
            location: e.location,
            event_date: e.event_date,
            created_by: e.created_by,
            rsvps: getStored<string[]>('lbp_rsvp_' + e.id, [])
          })) as Event[];
        }
        console.warn('Supabase events fetch failed, using local:', error?.message);
      } catch (e) {
        console.warn('Supabase events exception:', e);
      }
    }
    return getStored<Event[]>('lbp_prod_events', []);
  },

  async createEvent(event: Omit<Event, 'id' | 'rsvps'>): Promise<Event> {
    const newEventId = 'e_' + Date.now() + '_' + Math.random().toString(36).substr(2, 4);
    const newEvent: Event = {
      id: newEventId,
      title: event.title,
      description: event.description,
      location: event.location,
      event_date: event.event_date,
      created_by: event.created_by,
      rsvps: []
    };

    const events = await this.getEvents();
    const updated = [...events, newEvent];
    setStored('lbp_prod_events', updated);
    setStored('lbp_rsvp_' + newEventId, []);

    if (isSupabaseConfigured && supabase) {
      try {
        const { error } = await supabase.from('events').insert([{
          id: newEventId,
          title: event.title,
          description: event.description,
          location: event.location,
          event_date: event.event_date,
          created_by: event.created_by
        }]);
        if (error) console.warn('Supabase event insert failed:', error.message);
      } catch (e) {
        console.warn('Supabase event exception:', e);
      }
    }

    return newEvent;
  },

  async deleteEvent(eventId: string): Promise<void> {
    const events = await this.getEvents();
    const filtered = events.filter(e => e.id !== eventId);
    setStored('lbp_prod_events', filtered);

    if (isSupabaseConfigured && supabase) {
      try {
        const { error } = await supabase.from('events').delete().eq('id', eventId);
        if (error) console.warn('Supabase delete event failed:', error.message);
      } catch (e) {
        console.warn('Supabase delete event exception:', e);
      }
    }
  },

  // =================================================================
  // 6. NOTIFICATIONS
  // =================================================================
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
    return getStored<Notification[]>('lbp_prod_notifications', []);
  },

  async createNotification(notif: Omit<Notification, 'id' | 'created_at' | 'is_read'>): Promise<Notification> {
    const newNotif: Notification = {
      ...notif,
      id: 'n_' + Date.now() + '_' + Math.random().toString(36).substr(2, 4),
      created_at: new Date().toISOString(),
      is_read: false
    };

    const notifs = getStored<Notification[]>('lbp_prod_notifications', []);
    const updated = [newNotif, ...notifs];
    setStored('lbp_prod_notifications', updated);

    if (isSupabaseConfigured && supabase) {
      try {
        const { error } = await supabase.from('notifications').insert([{
          id: newNotif.id,
          member_id: notif.member_id,
          title: notif.title,
          message: notif.message,
          is_read: false,
          created_at: newNotif.created_at
        }]);
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
      setStored('lbp_prod_notifications', notifs);
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
    setStored('lbp_prod_notifications', []);

    if (isSupabaseConfigured && supabase) {
      try {
        const { error } = await supabase.from('notifications').delete().neq('id', '');
        if (error) console.warn('Supabase notification clear failed:', error.message);
      } catch (e) {
        console.warn('Supabase notification clear exception:', e);
      }
    }
  },

  // =================================================================
  // 7. CHAPTERS
  // =================================================================
  async getChapters(): Promise<Chapter[]> {
    if (isSupabaseConfigured && supabase) {
      try {
        const { data, error } = await supabase.from('chapters').select('*');
        if (!error && data) return data as Chapter[];
        console.warn('Supabase chapters fetch failed:', error?.message);
      } catch (e) {
        console.warn('Supabase chapters exception:', e);
      }
    }
    return getStored<Chapter[]>('lbp_prod_chapters', []);
  },

  async createChapter(chapter: Omit<Chapter, 'id'>): Promise<Chapter> {
    const newChapter: Chapter = {
      ...chapter,
      id: 'ch_' + Date.now() + '_' + Math.random().toString(36).substr(2, 4)
    };

    const chapters = await this.getChapters();
    const updated = [...chapters, newChapter];
    setStored('lbp_prod_chapters', updated);

    if (isSupabaseConfigured && supabase) {
      try {
        const { error } = await supabase.from('chapters').insert([newChapter]);
        if (error) console.warn('Supabase chapter insert failed:', error.message);
      } catch (e) {
        console.warn('Supabase chapter exception:', e);
      }
    }

    return newChapter;
  },

  async rsvpEvent(eventId: string, memberId: string): Promise<Event | null> {
    const events = await this.getEvents();
    const index = events.findIndex(e => e.id === eventId);
    if (index === -1) return null;

    const event = events[index];
    if (!event.rsvps) event.rsvps = [];
    const isRsvpd = event.rsvps.includes(memberId);

    if (isRsvpd) {
      event.rsvps = event.rsvps.filter(id => id !== memberId);
    } else {
      event.rsvps.push(memberId);
    }

    events[index] = event;
    setStored('lbp_prod_events', events);
    setStored('lbp_rsvp_' + eventId, event.rsvps);

    return event;
  },

  async getGalleryItems(): Promise<GalleryItem[]> {
    return getStored<GalleryItem[]>('lbp_prod_gallery', []);
  },

  async uploadGalleryItem(item: Omit<GalleryItem, 'id' | 'created_at'>): Promise<GalleryItem> {
    const newItem: GalleryItem = {
      ...item,
      id: 'g_' + Date.now() + '_' + Math.random().toString(36).substr(2, 4),
      created_at: new Date().toISOString()
    };
    const items = await this.getGalleryItems();
    const updated = [newItem, ...items];
    setStored('lbp_prod_gallery', updated);
    return newItem;
  },

  // =================================================================
  // 8. DIAGNOSTICS & AUTO PROVISIONING
  // =================================================================
  async checkTableExists(tableName: string): Promise<boolean> {
    if (!isSupabaseConfigured || !supabase) return false;
    try {
      const { error } = await supabase.from(tableName).select('id').limit(1);
      if (!error) return true;
      if (error.code === '42P01') return false;
      return error.code !== '42P01';
    } catch (e) {
      return false;
    }
  },

  async checkAllTables(): Promise<Record<string, boolean>> {
    const tables = ['chapters', 'members', 'posts', 'post_images', 'comments', 'likes', 'announcements', 'events', 'notifications'];
    const results: Record<string, boolean> = {};
    for (const table of tables) {
      results[table] = await this.checkTableExists(table);
    }
    return results;
  },

  async autoProvision(): Promise<{ success: boolean; error?: string }> {
    if (!isSupabaseConfigured || !supabase) {
      return { success: false, error: 'Supabase is not configured' };
    }
    try {
      const schemaSql = `
CREATE TABLE IF NOT EXISTS public.chapters (
    id TEXT PRIMARY KEY,
    chapter_name TEXT NOT NULL,
    province TEXT,
    city TEXT
);
CREATE TABLE IF NOT EXISTS public.members (
    id TEXT PRIMARY KEY,
    full_name TEXT NOT NULL,
    email TEXT NOT NULL UNIQUE,
    chapter TEXT,
    batch TEXT,
    position TEXT,
    role TEXT NOT NULL DEFAULT 'Member',
    status TEXT NOT NULL DEFAULT 'Pending',
    avatar_url TEXT,
    phone TEXT,
    bio TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now())
);
CREATE TABLE IF NOT EXISTS public.posts (
    id TEXT PRIMARY KEY,
    member_id TEXT NOT NULL REFERENCES public.members(id) ON DELETE CASCADE,
    content TEXT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now())
);
CREATE TABLE IF NOT EXISTS public.post_images (
    id TEXT PRIMARY KEY,
    post_id TEXT NOT NULL REFERENCES public.posts(id) ON DELETE CASCADE,
    image_url TEXT NOT NULL
);
CREATE TABLE IF NOT EXISTS public.comments (
    id TEXT PRIMARY KEY,
    post_id TEXT NOT NULL REFERENCES public.posts(id) ON DELETE CASCADE,
    member_id TEXT NOT NULL REFERENCES public.members(id) ON DELETE CASCADE,
    comment TEXT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now())
);
CREATE TABLE IF NOT EXISTS public.likes (
    id TEXT PRIMARY KEY,
    post_id TEXT NOT NULL REFERENCES public.posts(id) ON DELETE CASCADE,
    member_id TEXT NOT NULL REFERENCES public.members(id) ON DELETE CASCADE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()),
    CONSTRAINT unique_post_member_like UNIQUE (post_id, member_id)
);
CREATE TABLE IF NOT EXISTS public.announcements (
    id TEXT PRIMARY KEY,
    title TEXT NOT NULL,
    content TEXT NOT NULL,
    created_by TEXT NOT NULL REFERENCES public.members(id) ON DELETE CASCADE,
    is_pinned BOOLEAN DEFAULT false,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now())
);
CREATE TABLE IF NOT EXISTS public.events (
    id TEXT PRIMARY KEY,
    title TEXT NOT NULL,
    description TEXT NOT NULL,
    location TEXT NOT NULL,
    event_date TEXT NOT NULL,
    created_by TEXT REFERENCES public.members(id) ON DELETE SET NULL
);
CREATE TABLE IF NOT EXISTS public.notifications (
    id TEXT PRIMARY KEY,
    member_id TEXT NOT NULL REFERENCES public.members(id) ON DELETE CASCADE,
    title TEXT NOT NULL,
    message TEXT NOT NULL,
    is_read BOOLEAN DEFAULT false,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now())
);
      `;
      const { error } = await supabase.rpc('exec_sql', { sql_query: schemaSql });
      if (error) {
        return { success: false, error: error.message };
      }
      return { success: true };
    } catch (e: any) {
      return { success: false, error: e.message || 'exec_sql RPC function not found in database' };
    }
  }
};
