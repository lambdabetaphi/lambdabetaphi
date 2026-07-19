import { BoardMember, Event, NewsItem, BulletinPost, Member } from './types';

export const FRAT_INFO = {
  name: 'Lambda Beta Phi',
  fullname: 'Lambda Beta Phi Fraternity & Sorority (LAMBDANS)',
  tagline: 'Love, Bravery, and Loyalty',
  foundedDate: 'July 9, 1969',
  foundedLocation: 'University of Bohol, Tagbilaran City, Bohol, Philippines',
  mascot: 'The Lambdans',
  colors: 'Gold & Blue',
  creed: 'We, the members of Lambda Beta Phi, dedicate ourselves to the pursuit of academic excellence, the unyielding service to our community, and the cultivation of an unbreakable bond of unity. Grounded in the eternal virtues of Love, Bravery, and Loyalty, we strive to build a respected society, lead with integrity, and honor our sacred letters of Lambda Beta Phi. Love, Bravery, and Loyalty.',
  mission: 'Established at the University of Bohol on July 9, 1969, Lambda Beta Phi seeks to set a high standard of academic excellence and build a respected society. Through academic dedication, civic responsibility, and active service, we empower co-educational leaders to leave a lasting positive impact globally.'
};

export const PILLARS = [
  {
    title: 'Love (Lambda)',
    description: 'Embodying the deep co-educational bonds of brotherhood, sisterhood, and mutual support. We stand together as one family, helping members in times of need and danger.',
    icon: 'Users'
  },
  {
    title: 'Bravery (Beta)',
    description: 'The courage to lead with integrity, face challenges together, and maintain the highest standards across all chapters.',
    icon: 'ShieldAlert'
  },
  {
    title: 'Loyalty (Phi)',
    description: 'An unbreakable fidelity to our letters, our members, and the community. We maintain long-term commitments to support each other globally.',
    icon: 'HeartHandshake'
  },
  {
    title: 'Academic Excellence',
    description: 'Setting a high standard of academic performance and intellectual growth to be a respected force in our university and society.',
    icon: 'GraduationCap'
  }
];

export const INITIAL_BOARD: BoardMember[] = [
  {
    id: 'b1',
    name: 'Juan Carlo Abucejo',
    role: 'Chapter President (Fraternity)',
    image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=400&q=80',
    major: 'Civil Engineering & Business',
    hometown: 'Tagbilaran City, Bohol',
    bio: 'Juan Carlo manages fraternity operations at the University of Bohol, upholding our founding values, coordinating logistics, and leading recruitment.',
    quote: 'True leadership is not about standing above others; it is about providing the foundation upon which they can rise.',
    email: 'president.brother@lambdabetaphi.org'
  },
  {
    id: 'b2',
    name: 'Evelyn Arengo',
    role: 'Chapter President (Sorority)',
    image: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=400&q=80',
    major: 'Nursing & Public Health',
    hometown: 'Tagbilaran City, Bohol',
    bio: 'Evelyn directs sorority affairs, championing local healthcare missions, academic mentorship programs, and chapter service seminars.',
    quote: 'We grow by lifting others. Lambda Beta Phi is a catalyst for genuine sisterhood and profound community impact.',
    email: 'president.sister@lambdabetaphi.org'
  },
  {
    id: 'b3',
    name: 'Marcus Cloribel',
    role: 'Vice President of Operations',
    image: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=400&q=80',
    major: 'Information Technology',
    hometown: 'Tagbilaran City, Bohol',
    bio: 'Marcus manages the chapter technical infrastructure, event logistics, and international member directories.',
    quote: 'Efficiency powers our excellence. Harnessing technology helps us strengthen community and expand our global footprint.',
    email: 'operations@lambdabetaphi.org'
  },
  {
    id: 'b4',
    name: 'Sophia Castro',
    role: 'Treasurer & Philanthropy Chair',
    image: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80',
    major: 'Finance & Economics',
    hometown: 'Cebu City, Philippines',
    bio: 'Sophia manages the chapter treasury, academic scholarship awards, and coordinates charity drives for the Bohol Foundation.',
    quote: 'Financial stewardship and selfless giving are the cornerstones of sustainable community change.',
    email: 'treasurer@lambdabetaphi.org'
  }
];

export const INITIAL_EVENTS: Event[] = [
  {
    id: 'e1',
    title: 'Annual Bohol Community Health Mission',
    description: 'Our premier annual volunteering and fundraising drive in support of local clinics and health centers in Tagbilaran. Features local performances, health consulting tables, and dedicated civic service.',
    category: 'Service',
    date: '2026-09-12',
    time: '18:00 - 22:00',
    location: 'Tagbilaran Community Center, Bohol',
    image: 'https://images.unsplash.com/photo-1511795409834-ef04bbd61622?auto=format&fit=crop&w=1200&q=80',
    rsvps: ['president.brother@lambdabetaphi.org', 'president.sister@lambdabetaphi.org'],
    capacity: 250,
    highlights: 'Alumni networking, charity health raffle, formal attire required.'
  },
  {
    id: 'e2',
    title: 'Academic Honors Roundtable & Study Session',
    description: 'Join the highest-achieving brothers and sisters for peer tutoring, resume reviews, and internship prep sessions. Coffee and study snacks provided.',
    category: 'Academic',
    date: '2026-07-28',
    time: '14:00 - 18:00',
    location: 'University of Bohol Chapter Library',
    image: 'https://images.unsplash.com/photo-1523240795612-9a054b0db644?auto=format&fit=crop&w=1200&q=80',
    rsvps: ['operations@lambdabetaphi.org'],
    capacity: 60,
    highlights: 'Peer reviews, interview prep, and major-specific advising.'
  },
  {
    id: 'e3',
    title: 'Fall Interest Meeting & Professional Panel',
    description: 'An open networking and informational event for prospective recruits. Meet current active members, view our national presentation, and hear from distinguished alumni.',
    category: 'Professional',
    date: '2026-08-15',
    time: '19:00 - 21:00',
    location: 'University of Bohol Main Hall, Room 302',
    image: 'https://images.unsplash.com/photo-1515187029135-18ee286d815b?auto=format&fit=crop&w=1200&q=80',
    rsvps: ['treasurer@lambdabetaphi.org', 'president.brother@lambdabetaphi.org', 'president.sister@lambdabetaphi.org'],
    capacity: 100,
    highlights: 'Business casual dress. Q&A session with alumni mentors.'
  },
  {
    id: 'e4',
    title: 'Chapter Alumni Summer Tagbilaran Reunion',
    description: 'Reconnecting active members with the pioneering founders and alumni. Bring your families for games, delicious catering, and memory-sharing.',
    category: 'Alumni',
    date: '2026-08-02',
    time: '12:00 - 16:30',
    location: 'Tagbilaran Memorial Park, Bohol',
    image: 'https://images.unsplash.com/photo-1529156069898-49953e39b3ac?auto=format&fit=crop&w=1200&q=80',
    rsvps: ['operations@lambdabetaphi.org', 'treasurer@lambdabetaphi.org'],
    capacity: 150,
    highlights: 'Fun outdoor games, chapter archive viewing, and alumni awards.'
  }
];

export const INITIAL_NEWS: NewsItem[] = [
  {
    id: 'n1',
    title: 'Lambda Chapter Wins "Outstanding Community Impact" Award',
    brief: 'Our chapter has been recognized in Tagbilaran for delivering over 1,200 hours of volunteer service during the semester.',
    content: 'We are incredibly thrilled to announce that the Tagbilaran Inter-Fraternity Council has awarded Lambda Beta Phi the Outstanding Community Impact Cup for 2026. This award recognizes chapters that exhibit exceptional dedication to philanthropy and community service.\n\nOver the past semester, our brothers and sisters joined forces with medical centers, blood donation drives, and local youth tutoring networks. Together, we logged a record-breaking 1,248 volunteer hours and raised over $14,000 for children welfare initiatives.\n\nPresident Juan Carlo Abucejo expressed pride in the chapter: "This cup is a testament to what we can accomplish when brotherhood and sisterhood unite behind a single noble purpose. We want to thank every single member who woke up at 6 AM on Saturdays to volunteer. This belongs to you."',
    author: 'Evelyn Arengo',
    authorRole: 'Sorority President',
    date: '2026-07-10',
    category: 'Philanthropy',
    image: 'https://images.unsplash.com/photo-1531545514256-b1400bc00f31?auto=format&fit=crop&w=1200&q=80',
    likes: 24,
    likedBy: [],
    comments: [
      {
        id: 'c1',
        authorName: 'Juan Carlo Abucejo',
        authorRole: 'Fraternity President',
        content: 'Unbelievably proud of this milestone! Lambda Beta Phi setting the gold standard.',
        date: '2026-07-10'
      }
    ]
  },
  {
    id: 'n2',
    title: 'Establishing the Lambda Beta Phi Founders Endowment Fund',
    brief: 'An exciting new academic scholarship has been initialized through generous donations from our distinguished alumni.',
    content: 'Lambda Beta Phi is proud to launch the Founders Academic Endowment, a dedicated scholarship program engineered to reward intellectual rigor and alleviate financial stress for active members.\n\nInitiated by a generous lead donation from our alumni, this fund will distribute four scholarships every academic year. Active brothers and sisters with a GPA of 3.6 or above who demonstrate strong leadership inside the chapter are eligible to apply.\n\nApplications open soon and will be evaluated by our Chapter Advisory Council. We are deeply grateful to our network of global alumni who continuously invest in the future of our active roster.',
    author: 'Sophia Castro',
    authorRole: 'Chapter Treasurer',
    date: '2026-07-01',
    category: 'Milestone',
    image: 'https://images.unsplash.com/photo-1541339907198-e08756dedf3f?auto=format&fit=crop&w=1200&q=80',
    likes: 18,
    likedBy: [],
    comments: []
  },
  {
    id: 'n3',
    title: 'Sister Helena Thorne Named Valedictorian of University of Bohol',
    brief: 'One of our standout sisters will deliver the commencement address at the upcoming Winter graduation ceremony.',
    content: 'It is with immense academic pride that we announce Sister Helena Thorne (Class of 2026) has been officially named the Valedictorian for the University of Bohol.\n\nHelena, a double-major in Biochemistry and Philosophy, maintained a flawless 4.0 GPA while serving as our Academic Chairperson and volunteering at the Tagbilaran Health Ward.\n\n"Helena embodies everything Lambda Beta Phi stands for," says Academic VP Evelyn Arengo. "She has been a mentor, a tutor, and a constant inspiration to all of us. Her speech is sure to represent the highest ideals of our society."',
    author: 'Juan Carlo Abucejo',
    authorRole: 'Fraternity President',
    date: '2026-06-25',
    category: 'Academic',
    image: 'https://images.unsplash.com/photo-1523050854058-8df90110c9f1?auto=format&fit=crop&w=1200&q=80',
    likes: 42,
    likedBy: [],
    comments: []
  }
];

export const INITIAL_BULLETIN: BulletinPost[] = [
  {
    id: 'bp1',
    authorName: 'Juan Carlo Abucejo',
    authorRole: 'Chapter President (Fraternity)',
    authorAvatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=100&q=80',
    content: 'Reminder to all active brothers and sisters: Formal Chapter Meeting is this Sunday at 18:00 in the Main Lounge. Academic dress required. We will be voting on recruitment guidelines and reviewing budget drafts.',
    date: '2026-07-17',
    likes: 12,
    likedBy: [],
    replies: [
      {
        id: 'br1',
        authorName: 'Marcus Cloribel',
        authorRole: 'VP of Operations',
        authorAvatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=100&q=80',
        content: 'I have uploaded the budget spreadsheet draft to the Member Portal Drive section. Please review beforehand.',
        date: '2026-07-17'
      }
    ]
  },
  {
    id: 'bp2',
    authorName: 'Sophia Castro',
    authorRole: 'Chapter Treasurer',
    authorAvatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=100&q=80',
    content: 'Our annual canned food drive starts next Tuesday! Let\'s secure our goal of 1,000 cans. Each brother and sister is requested to bring at least 15 items. Chapter points will be awarded for extra contributions!',
    date: '2026-07-15',
    likes: 9,
    likedBy: [],
    replies: [
      {
        id: 'br2',
        authorName: 'Evelyn Arengo',
        authorRole: 'Sorority President',
        authorAvatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=100&q=80',
        content: 'I have coordinated drop-off boxes at the Student Union and the Memorial Gym. Let\'s make a huge impact!',
        date: '2026-07-16'
      }
    ]
  }
];

export const INITIAL_MEMBERS: Member[] = [
  {
    id: 'm1',
    name: 'Juan Carlo Abucejo',
    email: 'president.brother@lambdabetaphi.org',
    role: 'Chapter President (Fraternity)',
    gender: 'Brother',
    chapterPoints: 120,
    duesStatus: 'Paid',
    duesAmount: 350,
    joinsDate: '2023-09-15',
    avatarUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=400&q=80',
    phone: '0917-555-0192',
    major: 'Civil Engineering & Business',
    hometown: 'Tagbilaran City, Bohol',
    biography: 'Juan Carlo is an aspiring civil engineer. He manages fraternity operations at the University of Bohol, upholding our founding values.',
    chapter: 'Bohol Alpha Chapter',
    slaveName: 'Alpha Chief'
  },
  {
    id: 'm2',
    name: 'Evelyn Arengo',
    email: 'president.sister@lambdabetaphi.org',
    role: 'Chapter President (Sorority)',
    gender: 'Sister',
    chapterPoints: 145,
    duesStatus: 'Paid',
    duesAmount: 350,
    joinsDate: '2023-09-15',
    avatarUrl: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=400&q=80',
    phone: '0920-555-0143',
    major: 'Nursing & Public Health',
    hometown: 'Tagbilaran City, Bohol',
    biography: 'Evelyn advocates for health equity and community clinic support. She directs the sorority chapter at Divine World College.',
    chapter: 'Bohol Beta Chapter',
    slaveName: 'Beta Queen'
  },
  {
    id: 'm3',
    name: 'Marcus Cloribel',
    email: 'operations@lambdabetaphi.org',
    role: 'VP of Operations',
    gender: 'Brother',
    chapterPoints: 95,
    duesStatus: 'Paid',
    duesAmount: 350,
    joinsDate: '2024-02-10',
    avatarUrl: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=400&q=80',
    phone: '0915-555-0177',
    major: 'Information Technology',
    hometown: 'Tagbilaran City, Bohol',
    biography: 'Marcus is an IT developer who maintains our digital portal operations, registry records, and coordinates with international chapters.',
    chapter: 'Bohol Alpha Chapter',
    slaveName: 'Dev Commander'
  },
  {
    id: 'm4',
    name: 'Sophia Castro',
    email: 'treasurer@lambdabetaphi.org',
    role: 'Chapter Treasurer',
    gender: 'Sister',
    chapterPoints: 110,
    duesStatus: 'Paid',
    duesAmount: 350,
    joinsDate: '2024-02-10',
    avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80',
    phone: '0912-555-0115',
    major: 'Finance & Economics',
    hometown: 'Cebu City, Philippines',
    biography: 'Sophia is passionate about finance and handles chapter accounting, budgeting, and fundraising programs.',
    chapter: 'Bohol Alpha Chapter',
    slaveName: 'Penny Pincher'
  },
  {
    id: 'm5',
    name: 'Helena Thorne',
    email: 'helena.thorne@lambdabetaphi.org',
    role: 'Academic Chairperson',
    gender: 'Sister',
    chapterPoints: 165,
    duesStatus: 'Paid',
    duesAmount: 350,
    joinsDate: '2023-09-15',
    avatarUrl: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=400&q=80',
    phone: '0945-555-0211',
    major: 'Biochemistry & Philosophy',
    hometown: 'Tagbilaran City, Bohol',
    biography: 'Valedictorian of the University of Bohol. Helena loves bio-research, clinical ethics, and volunteering.',
    chapter: 'Bohol Beta Chapter',
    slaveName: 'Brain Sovereign'
  },
  {
    id: 'm6',
    name: 'Daniel Grayson',
    email: 'daniel.grayson@lambdabetaphi.org',
    role: 'Social & Mixer Chairperson',
    gender: 'Brother',
    chapterPoints: 78,
    duesStatus: 'Paid',
    duesAmount: 350,
    joinsDate: '2024-09-02',
    avatarUrl: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&w=400&q=80',
    phone: '0941-555-0294',
    major: 'Marketing',
    hometown: 'Manila, Philippines',
    biography: 'Daniel loves event curation, photography, and hiking. He organizes joint formals and inter-chapter meetings.',
    chapter: 'Manila Alpha Chapter',
    slaveName: 'Mix Master'
  },
  {
    id: 'm7',
    name: 'Lucas Sterling',
    email: 'lucas.s@lambdabetaphi.org',
    role: 'Active Brother',
    gender: 'Brother',
    chapterPoints: 45,
    duesStatus: 'Pending',
    duesAmount: 350,
    joinsDate: '2025-02-15',
    avatarUrl: 'https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?auto=format&fit=crop&w=400&q=80',
    phone: '0935-555-0222',
    major: 'Business Administration',
    hometown: 'Davao City, Philippines',
    biography: 'Lucas is a sports enthusiast and active member of our campus philanthropy boards.',
    chapter: 'Davao Alpha Chapter',
    slaveName: 'Sport Cadet'
  },
  {
    id: 'm8',
    name: 'Aria Henderson',
    email: 'aria.h@lambdabetaphi.org',
    role: 'Active Sister',
    gender: 'Sister',
    chapterPoints: 60,
    duesStatus: 'Unpaid',
    duesAmount: 350,
    joinsDate: '2025-02-15',
    avatarUrl: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=400&q=80',
    phone: '650-555-0255',
    major: 'Journalism & Communications',
    hometown: 'California, USA',
    biography: 'Aria edits our newsletter and manages global media updates for Lambda Beta Phi.',
    chapter: 'California Alpha Chapter',
    slaveName: 'Pen Knight'
  },
  {
    id: 'm9',
    name: 'Roderick Danzing',
    email: 'roderickdanzing04@gmail.com',
    role: 'Admin',
    gender: 'Brother',
    chapterPoints: 500,
    duesStatus: 'Paid',
    duesAmount: 350,
    joinsDate: '2026-07-09',
    avatarUrl: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=400&q=80',
    phone: '0917-555-0123',
    major: 'Computer Science & Systems',
    hometown: 'Tagbilaran City, Bohol',
    biography: 'Supreme Chapter Administrator for Lambda Beta Phi. Upholding global digital operations and community coordination.',
    chapter: 'Supreme Archon Chapter',
    slaveName: 'System Architect'
  }
];
