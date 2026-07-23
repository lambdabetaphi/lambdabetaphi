export const DEFAULT_AVATAR = 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80';

export function getAvatarUrl(url?: string | null): string {
  if (url && url.trim().length > 0) {
    return url;
  }
  return DEFAULT_AVATAR;
}

export interface Member {
  id: string; // Supabase Auth UUID
  full_name: string;
  email: string;
  chapter?: string;
  batch?: string;
  position?: string;
  role: 'Admin' | 'Officer' | 'Member';
  status: 'Pending' | 'Approved' | 'Suspended';
  avatar_url?: string;
  phone?: string;
  bio?: string;
  created_at?: string;
  updated_at?: string;
  // Presentation/legacy compatibility fields
  name?: string;
  avatarUrl?: string;
  slaveName?: string;
}

export interface Post {
  id: string;
  member_id: string;
  content: string;
  created_at: string;
  updated_at?: string;
  // Derived/joined fields for presentation layer
  member_name?: string;
  member_avatar?: string;
  member_chapter?: string;
  images?: string[]; // mapped from PostImages
  likes_count?: number; // derived from Likes
  liked_by?: string[]; // member_ids who liked this
}

export interface PostImage {
  id: string;
  post_id: string;
  image_url: string;
}

export interface Comment {
  id: string;
  post_id: string;
  member_id: string;
  comment: string;
  created_at: string;
  // Derived/joined fields
  member_name?: string;
  member_avatar?: string;
}

export interface Like {
  id: string;
  post_id: string;
  member_id: string;
  created_at: string;
}

export interface Announcement {
  id: string;
  title: string;
  content: string;
  created_by: string; // member_id
  is_pinned: boolean;
  created_at: string;
  // Derived fields
  member_name?: string;
  member_avatar?: string;
}

export interface Event {
  id: string;
  title: string;
  description: string;
  location: string;
  event_date: string;
  created_by?: string; // member_id
  image?: string;
  time?: string;
  date?: string;
  // Derived field
  rsvps?: string[]; // member_ids who rsvp'd (derived or mock fallback array)
}

export interface Notification {
  id: string;
  member_id: string;
  title: string;
  message: string;
  is_read: boolean;
  created_at: string;
  // Presentation/legacy compatibility fields
  type?: string;
  content?: string;
}

export interface Chapter {
  id: string;
  chapter_name: string;
  province?: string;
  city?: string;
}

export interface GalleryItem {
  id: string;
  album: string;
  image_url: string;
  caption?: string;
  uploaded_by_name?: string;
  created_at?: string;
}

