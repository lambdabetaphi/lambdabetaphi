export interface Member {
  id: string;
  name: string;
  email: string;
  role: string; // Dynamic role type to support both custom officers and standard portal permissions
  gender?: 'Brother' | 'Sister';
  chapter: string;
  batch?: string; // Batch identifier, e.g., 'Alpha Class', '2026-A'
  position?: string; // e.g., 'President', 'Member', 'Archon'
  joinsDate: string;
  avatarUrl: string;
  phone: string;
  slaveName: string;
  birthday?: string; // YYYY-MM-DD
  isOnline?: boolean;
  chapterPoints?: number; // Legacy compatibility
  duesStatus?: string; // Legacy compatibility
  duesAmount?: number; // Legacy compatibility
  major?: string; // Legacy compatibility
  hometown?: string; // Legacy compatibility
  biography?: string; // Legacy compatibility
}

export interface Post {
  id: string;
  author_id: string;
  author_name: string;
  author_avatar: string;
  author_chapter: string;
  author_slave_name?: string;
  content: string;
  images: string[]; // URLs or base64 data for multiple images
  created_at: string; // ISO timestamp
  likes_count: number;
  liked_by: string[]; // Array of member IDs who liked this post
}

export interface Comment {
  id: string;
  post_id: string;
  author_id: string;
  author_name: string;
  author_avatar: string;
  content: string;
  created_at: string;
}

export interface Announcement {
  id: string;
  title: string;
  content: string;
  author_name: string;
  author_avatar: string;
  created_at: string;
  is_pinned: boolean;
}

export interface Event {
  id: string;
  title: string;
  description: string;
  date: string;
  time: string;
  location: string;
  image?: string;
  category: string; // Dynamic category supports both Legacy and New Portal
  created_by?: string;
  rsvps: string[]; // array of member IDs who rsvp'd
  capacity?: number; // Legacy compatibility
  highlights?: string | string[]; // Legacy compatibility (supports string or array)
}

export interface Notification {
  id: string;
  type: 'new_member' | 'new_post' | 'new_announcement' | 'new_event' | 'approved';
  title: string;
  content: string;
  reference_id?: string;
  created_at: string;
  is_read: boolean;
}

export interface GalleryItem {
  id: string;
  album: string; // Album name, e.g., 'Induction 2026', 'Philanthropy'
  url?: string; // Image URL or base64 - optional for backwards compatibility
  image_url?: string; // Support for alternate camelcase field names
  description?: string;
  caption?: string; // Support for PortalGallery field name
  uploaded_by?: string; // Optional for backwards compatibility
  uploaded_by_name?: string; // Support for PortalGallery field name
  created_at: string;
}

// Legacy Compatibility Types
export interface NewsItem {
  id: string;
  title: string;
  content: string;
  date: string;
  likes: number;
  likedBy: string[];
  comments: any[];
  category?: string;
  brief?: string;
  image?: string;
  author?: string;
  authorRole?: string;
}

export interface BulletinPost {
  id: string;
  authorName: string;
  authorRole: string;
  authorAvatar: string;
  content: string;
  date: string;
  likes: number;
  likedBy: string[];
  replies: any[];
}

export interface BoardMember {
  id?: string;
  name: string;
  role: string;
  avatarUrl?: string;
  image?: string;
  major?: string;
  hometown?: string;
  bio?: string;
  quote?: string;
  email?: string;
}
