import React, { useState } from 'react';
import { 
  Mail, 
  MapPin, 
  BookOpen, 
  Quote, 
  Compass, 
  UserCheck, 
  X, 
  GraduationCap, 
  Clock 
} from 'lucide-react';
import { FRAT_INFO } from '../data';

interface Founder {
  id: string;
  name: string;
  role: string;
  image: string;
  major: string;
  hometown: string;
  email: string;
  quote: string;
  bio: string;
}

const FOUNDERS: Founder[] = [
  {
    id: 'f1',
    name: 'Desiderio Cloribel',
    role: 'Co-Founder & First Supreme Grand',
    image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=400&q=80',
    major: 'Law & Jurisprudence',
    hometown: 'Tagbilaran City, Bohol',
    email: 'founders@lambdabetaphi.org',
    quote: 'To lead is to serve with unyielding integrity, academic devotion, and an unbreakable love for the community.',
    bio: 'Desiderio Cloribel was the pioneering spirit who secured the first official recognition of Lambda Beta Phi Fraternity from the University of Bohol administration in 1970, setting the cornerstone for our legacy.'
  },
  {
    id: 'f2',
    name: 'Efraim Castro',
    role: 'Co-Founder & Chief Architect',
    image: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=400&q=80',
    major: 'Political Science',
    hometown: 'Tagbilaran City, Bohol',
    email: 'founders@lambdabetaphi.org',
    quote: 'Our brotherhood and sisterhood must remain a beacon of intellectual strength and civic duty across all islands.',
    bio: 'Efraim Castro worked tirelessly alongside Cloribel to draft our initial constitution, organize our core chapters, and formulate our sovereign creed and principles of Love, Bravery, and Loyalty.'
  },
  {
    id: 'f3',
    name: 'Tito Abucejo',
    role: 'Co-Founder & Orator',
    image: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&w=400&q=80',
    major: 'Liberal Arts & Philosophy',
    hometown: 'Carmen, Bohol',
    email: 'founders@lambdabetaphi.org',
    quote: 'Knowledge is the shield that preserves our honor and builds a truly respected society.',
    bio: 'Tito Abucejo was known for his soaring oratory and philosophical depth, contributing significantly to the lyrical and spiritual foundations of the Lambda Beta Phi creed.'
  },
  {
    id: 'f4',
    name: 'Arthur Arengo',
    role: 'Co-Founder & Treasurer',
    image: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&w=400&q=80',
    major: 'Business Administration',
    hometown: 'Tagbilaran City, Bohol',
    email: 'founders@lambdabetaphi.org',
    quote: 'Loyalty binds us, but structure and service allow our legacy to thrive globally.',
    bio: 'Arthur Arengo established our first treasury systems and alumni network guidelines, ensuring the early organization had the administrative stability to support rapid expansion.'
  }
];

export default function AboutUs() {
  const [selectedOfficer, setSelectedOfficer] = useState<Founder | null>(null);

  const historyTimeline = [
    {
      year: 'July 9, 1969',
      title: 'The Bohol Foundation',
      description: 'Seven visionary college students (Tito Abucejo, Arthur Arengo, Cenocito Budlao, Efraim Castro, Desiderio Cloribel, Rodolfo Haman, and Leopoldo Mercado) formed the Lambda Beta Phi Fraternity at the University of Bohol, seeking a respected society built on academic excellence.'
    },
    {
      year: '1970',
      title: 'Official Recognition & Sisterhood',
      description: 'Desiderio Cloribel (the first Supreme Grand) and Efraim Castro secured official university recognition. At the same time, a companion sorority of the same name was established at Divine World College (DWC) in Tagbilaran City.'
    },
    {
      year: '1970s - 1980s',
      title: 'National Growth & Expansion',
      description: 'The co-educational organization expanded rapidly to several colleges and universities across the Philippines, establishing its Supreme Council and formalizing its cornerstone pillars of Love, Bravery, and Loyalty.'
    },
    {
      year: '2000s',
      title: 'International Foundation Incorporated',
      description: 'The "Lambda Beta Phi Fraternity & Sorority International Foundation Inc." was officially incorporated and established at 0128 Maria Clara Street, Tagbilaran City, Bohol, coordinating global alumni and philanthropic networks.'
    },
    {
      year: 'Today',
      title: 'A Distinguished Global Family',
      description: 'With a proud co-educational roster, LAMBDANS have become respected lawyers, academics, military officers, police officers, and political figures, leading in the Philippines and residing worldwide across the globe.'
    }
  ];

  return (
    <div className="py-12 bg-[#f9f7f2] animate-fade-in min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* HEADER SECTION */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <span className="text-[10px] font-bold tracking-widest text-gold-500 uppercase block mb-3">Our Heritage</span>
          <h1 className="text-3xl md:text-4xl font-serif font-black text-navy-950 uppercase tracking-tight">
            About Lambda Beta Phi
          </h1>
          <div className="h-[2px] w-12 bg-gold-500 mx-auto mt-4"></div>
          <p className="text-navy-950/75 mt-6 font-sans text-xs md:text-sm leading-relaxed max-w-xl mx-auto">
            Rooted in our cornerstone pillars of Love, Bravery, and Loyalty, we have fostered a distinguished family of thinkers, creators, and leaders for over five decades.
          </p>
        </div>

        {/* CREED & MISSION */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-0 border border-navy-950/10 mb-20 bg-white">
          
          {/* Mission Card */}
          <div className="p-8 md:p-12 border-b lg:border-b-0 lg:border-r border-navy-950/10 flex flex-col justify-between bg-[#fbf9f4]">
            <div>
              <span className="text-gold-600 text-[10px] font-bold uppercase tracking-widest block mb-4">Core Mission</span>
              <h3 className="font-serif font-black text-xl text-navy-950 uppercase tracking-wide mb-6">Our Eternal Purpose</h3>
              <p className="text-navy-950/80 text-xs md:text-sm leading-relaxed mb-6 font-sans font-light">
                {FRAT_INFO.mission}
              </p>
              <p className="text-navy-950/60 text-xs italic font-serif leading-relaxed">
                &ldquo;True leadership is born out of active scholarship and a sincere, burning desire to serve the vulnerable.&rdquo;
              </p>
            </div>

            <div className="mt-8 pt-6 border-t border-navy-950/10 flex items-center gap-3">
              <UserCheck className="w-4 h-4 text-gold-600" />
              <span className="text-[10px] font-bold text-navy-950 tracking-wider uppercase">Unified Brotherhood & Sisterhood</span>
            </div>
          </div>

          {/* Creed Card */}
          <div className="p-8 md:p-12 bg-navy-950 text-white flex flex-col justify-between">
            <div>
              <span className="text-gold-300 text-[10px] font-bold uppercase tracking-widest block mb-4">Official Creed</span>
              <h3 className="font-serif font-black text-xl text-gold-300 uppercase tracking-wide mb-6">The Sacred Covenant</h3>
              <p className="text-navy-100/90 text-xs md:text-sm leading-relaxed font-sans font-light italic tracking-wide">
                &ldquo;{FRAT_INFO.creed}&rdquo;
              </p>
            </div>

            <div className="mt-8 pt-6 border-t border-white/10 flex items-center gap-3 text-gold-300">
              <Clock className="w-4 h-4" />
              <span className="text-[10px] font-bold tracking-widest uppercase">Established {FRAT_INFO.foundedDate}</span>
            </div>
          </div>

        </div>

        {/* TIMELINE HISTORY SECTION */}
        <div className="mb-24">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <span className="text-[10px] font-bold tracking-widest text-gold-500 uppercase block mb-3">Historical Walk</span>
            <h2 className="text-2xl md:text-3xl font-serif font-black text-navy-950 uppercase tracking-tight">
              Historical Timeline
            </h2>
            <div className="h-[2px] w-12 bg-gold-500 mx-auto mt-4"></div>
          </div>

          {/* Timeline graphic wrapper */}
          <div className="relative border-l border-navy-950/10 ml-4 md:ml-32 space-y-8">
            {historyTimeline.map((item, index) => (
              <div key={index} className="relative pl-8 md:pl-12 group">
                
                {/* Bullet badge */}
                <span className="absolute -left-[4.5px] top-2.5 w-2 h-2 bg-gold-500 border border-white group-hover:scale-125 transition-transform"></span>
                
                {/* Left Year Box (for desktop) */}
                <div className="md:absolute md:-left-32 md:top-1 w-24 text-left md:text-right">
                  <span className="font-serif font-black text-base text-gold-500 block">
                    {item.year}
                  </span>
                </div>

                {/* Timeline item body */}
                <div className="bg-white p-6 border border-navy-950/10 rounded-none shadow-none group-hover:border-gold-500 transition-colors">
                  <h4 className="font-serif font-bold text-navy-950 text-sm md:text-base mb-2 uppercase tracking-wide">
                    {item.title}
                  </h4>
                  <p className="text-navy-950/70 text-xs leading-relaxed font-sans font-light">
                    {item.description}
                  </p>
                </div>

              </div>
            ))}
          </div>
        </div>

        {/* THE ORIGINAL FOUNDERS */}
        <div className="mb-12">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <span className="text-[10px] font-bold tracking-widest text-gold-500 uppercase block mb-3">Historical Founders</span>
            <h2 className="text-2xl md:text-3xl font-serif font-black text-navy-950 uppercase tracking-tight">
              The Seven Original Founders of 1969
            </h2>
            <div className="h-[2px] w-12 bg-gold-500 mx-auto mt-4"></div>
            <p className="text-navy-950/70 mt-4 text-xs font-sans max-w-lg mx-auto">
              Meet the visionary college students who established the foundations of Lambda Beta Phi Fraternity on July 9, 1969. Click on a founder to read their biography.
            </p>
          </div>

          {/* Founders Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-0 border border-navy-950/10 bg-white">
            {FOUNDERS.map((officer) => (
              <div 
                key={officer.id}
                onClick={() => setSelectedOfficer(officer)}
                className="overflow-hidden border-b sm:border-b-0 sm:border-r border-navy-950/10 hover:bg-navy-950/5 transition-all duration-200 group cursor-pointer flex flex-col justify-between"
              >
                {/* Officer image container */}
                <div className="h-72 w-full overflow-hidden relative">
                  <img 
                    src={officer.image} 
                    alt={officer.name} 
                    className="w-full h-full object-cover object-center grayscale hover:grayscale-0 transition-all duration-300"
                    referrerPolicy="no-referrer"
                  />
                  <div className="absolute inset-0 bg-navy-950/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-end justify-center p-4">
                    <span className="text-gold-500 text-[10px] font-bold uppercase tracking-widest bg-navy-950 px-4 py-2 border border-gold-500/30">
                      Read Biography
                    </span>
                  </div>
                </div>

                {/* Officer info footer */}
                <div className="p-6 text-center">
                  <h4 className="font-serif font-bold text-navy-950 uppercase tracking-wide group-hover:text-gold-600 transition-colors">
                    {officer.name}
                  </h4>
                  <p className="text-[9px] text-gold-500 font-black uppercase tracking-widest mt-1">
                    {officer.role}
                  </p>
                  <p className="text-[9px] text-navy-950/60 font-bold tracking-widest mt-3 uppercase">
                    {officer.major}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* OFFICER BIO MODAL */}
        {selectedOfficer && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-navy-950/60 backdrop-blur-none animate-fade-in">
            <div className="bg-white rounded-none shadow-xl max-w-2xl w-full border border-navy-950/20 relative animate-scale-up">
              
              {/* Close Button */}
              <button 
                onClick={() => setSelectedOfficer(null)}
                className="absolute top-4 right-4 z-10 p-2 bg-navy-950 text-gold-500 hover:bg-gold-500 hover:text-navy-950 transition-colors"
              >
                <X className="w-4 h-4" />
              </button>

              <div className="grid grid-cols-1 md:grid-cols-12">
                
                {/* Modal left column: Portrait */}
                <div className="md:col-span-5 h-64 md:h-full relative">
                  <img 
                    src={selectedOfficer.image} 
                    alt={selectedOfficer.name} 
                    className="w-full h-full object-cover"
                    referrerPolicy="no-referrer"
                  />
                  <div className="absolute bottom-4 left-4 bg-navy-950 text-gold-400 text-[8px] uppercase font-bold tracking-widest px-3 py-1 border border-gold-500/20">
                    Active Member
                  </div>
                </div>

                {/* Modal right column: Information details */}
                <div className="md:col-span-7 p-6 md:p-8 space-y-4">
                  <div>
                    <h3 className="font-serif font-black text-xl text-navy-950 uppercase tracking-wide">
                      {selectedOfficer.name}
                    </h3>
                    <p className="text-[10px] text-gold-500 font-black uppercase tracking-widest mt-1">
                      {selectedOfficer.role}
                    </p>
                  </div>

                  <div className="space-y-2 pt-3 border-t border-navy-950/10 text-xs text-navy-950/80 font-sans">
                    <div className="flex items-center gap-2">
                      <GraduationCap className="w-4 h-4 text-gold-600 shrink-0" />
                      <span><strong>Major:</strong> {selectedOfficer.major}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <MapPin className="w-4 h-4 text-gold-600 shrink-0" />
                      <span><strong>Hometown:</strong> {selectedOfficer.hometown}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Mail className="w-4 h-4 text-gold-600 shrink-0" />
                      <a href={`mailto:${selectedOfficer.email}`} className="hover:text-gold-500 hover:underline">
                        {selectedOfficer.email}
                      </a>
                    </div>
                  </div>

                  {/* Quote block */}
                  <div className="bg-[#fbf9f4] p-4 border border-navy-950/5 relative">
                    <Quote className="w-6 h-6 text-gold-500/30 absolute -top-2 -left-1 rotate-180" />
                    <p className="text-navy-950 italic text-xs leading-relaxed pl-4">
                      &ldquo;{selectedOfficer.quote}&rdquo;
                    </p>
                  </div>

                  {/* Biography */}
                  <div className="space-y-1">
                    <h4 className="text-[9px] font-black uppercase tracking-widest text-navy-950/40">Biography</h4>
                    <p className="text-navy-950/80 text-xs leading-relaxed font-sans font-light">
                      {selectedOfficer.bio}
                    </p>
                  </div>
                </div>

              </div>
            </div>
          </div>
        )}

      </div>
    </div>
  );
}
