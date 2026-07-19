export interface Member {
  id: string;
  name: string;
  email: string;
  role: string;
  gender: 'Brother' | 'Sister';
  chapterPoints: number;
  duesStatus: 'Paid' | 'Unpaid' | 'Pending';
  duesAmount: number;
  joinsDate: string;
  avatarUrl: string;
  phone?: string;
  major?: string;
  hometown?: string;
  biography?: string;
  chapter?: string;
  slaveName?: string;
}

export interface Event {
  id: string;
  title: string;
  description: string;
  category: 'Social' | 'Service' | 'Professional' | 'Academic' | 'Ritual' | 'Alumni';
  date: string;
  time: string;
  location: string;
  image: string;
  rsvps: string[]; // member emails or names of RSVPs
  capacity?: number;
  highlights?: string;
}

export interface NewsComment {
  id: string;
  authorName: string;
  authorRole: string;
  content: string;
  date: string;
}

export interface NewsItem {
  id: string;
  title: string;
  brief: string;
  content: string;
  author: string;
  authorRole: string;
  date: string;
  category: 'Announcement' | 'Philanthropy' | 'Academic' | 'Alumni' | 'Milestone';
  image: string;
  likes: number;
  likedBy: string[]; // member emails
  comments: NewsComment[];
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
  replies: BulletinReply[];
}

export interface BulletinReply {
  id: string;
  authorName: string;
  authorRole: string;
  authorAvatar: string;
  content: string;
  date: string;
}

export interface BoardMember {
  id: string;
  name: string;
  role: string;
  image: string;
  major: string;
  hometown: string;
  bio: string;
  quote: string;
  email: string;
}
