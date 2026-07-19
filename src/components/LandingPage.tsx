import React, { useState } from 'react';
import { 
  Users, 
  GraduationCap, 
  ShieldAlert, 
  HeartHandshake, 
  ChevronRight, 
  Calendar, 
  Newspaper, 
  Shield, 
  Crown, 
  Award, 
  FileText,
  Bookmark
} from 'lucide-react';
import { PILLARS, FRAT_INFO } from '../data';
import CrestLogo from './CrestLogo';

interface LandingPageProps {
  onNavigate: (tab: 'home' | 'about' | 'news' | 'events' | 'portal') => void;
}

export default function LandingPage({ onNavigate }: LandingPageProps) {
  const [activePillar, setActivePillar] = useState<number | null>(null);
  const [activeCrestPart, setActiveCrestPart] = useState<'crown' | 'lion' | 'shield' | 'wreath' | null>('crown');

  const crestDetails = {
    crown: {
      title: 'The Sovereign Crown',
      meaning: 'Sovereignty, Wisdom & Intellectual Focus',
      description: 'The golden crown at the crest\'s apex represents our pursuit of intellectual sovereignty and self-governance. Centered in its base are our Greek letters, ΛΒΦ, showing that our fraternal bond is crowned by wisdom, integrity, and honor.'
    },
    lion: {
      title: 'The Golden Lion Rampant',
      meaning: 'Bravery, Courage & Dynamic Leadership',
      description: 'Standing proudly inside the striped shield, the Golden Lion Rampant symbolizes "Bravery" in our core motto. It represents our members\' courage to lead, protect our sacred bond, and speak out for service and justice.'
    },
    shield: {
      title: 'The Striped Shield',
      meaning: 'Love, Truth & Integrity',
      description: 'The central shield with royal blue and light sky blue horizontal stripes represents our structured unity and commitment to Truth. Grounded in the principle of "Love", it protects our members from adversity and fosters dynamic growth.'
    },
    wreath: {
      title: 'The Laurel Branches',
      meaning: 'Service, Philanthropy & Scholastic Victory',
      description: 'Two green laurel branches flank the shield, symbolizing victory in academic studies and civic service. It reflects the "Service" in our motto, reminding us of our commitment to philanthropy and community impact.'
    }
  };

  const milestones = [
    { value: '1969', label: 'Founded Heritage' },
    { value: '3.62', label: 'Chapter Average GPA' },
    { value: '1,200+', label: 'Annual Volunteer Hours' },
    { value: '$14,000+', label: 'Raised for Pediatric Wards' },
    { value: '500+', label: 'Active & Alumni Network' }
  ];

  return (
    <div className="animate-fade-in bg-[#f9f7f2] min-h-screen">
      
      {/* HERO SECTION - SPLIT GRID */}
      <section className="relative bg-white text-navy-950 overflow-hidden border-b border-navy-950/10">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row min-h-[580px]">
          
          {/* Hero Left side */}
          <div className="md:w-1/2 p-8 md:p-16 flex flex-col justify-center border-r border-navy-950/10 bg-[#fbf9f4]">
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-gold-500/10 border border-gold-500/30 text-gold-700 text-[10px] font-bold uppercase tracking-widest mb-6 w-fit rounded-none">
              <Award className="w-3.5 h-3.5 text-gold-600" />
              Empowering Leaders Since 1969
            </div>
            
            <h1 className="text-4xl sm:text-5xl md:text-6xl font-serif font-black text-navy-950 tracking-tight leading-none mb-6 uppercase">
              LAMBDA<br/>BETA PHI
            </h1>
            
            <p className="text-lg md:text-xl font-serif italic text-gold-600 mb-8 leading-relaxed">
              &ldquo;{FRAT_INFO.tagline}&rdquo;
            </p>
            
            <p className="text-xs md:text-sm text-navy-950/70 leading-relaxed mb-8 font-sans font-light max-w-lg">
              Lambda Beta Phi is a premier, values-based co-educational fraternity and sorority. Under the banner of 
              <span className="text-navy-950 font-semibold"> Love, Bravery, and Loyalty</span>, we forge an unbreakable lifelong bond of brotherhood and sisterhood, dedicated to academic merit and profound philanthropic action.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4">
              <button
                onClick={() => onNavigate('portal')}
                className="bg-navy-950 text-gold-500 font-bold px-8 py-3.5 rounded-none shadow-none hover:bg-navy-800 transition-colors uppercase tracking-widest text-[10px] border border-navy-950"
              >
                Enter Member Portal
              </button>
              <button
                onClick={() => onNavigate('about')}
                className="border-2 border-navy-950 bg-transparent hover:bg-navy-950 hover:text-white text-navy-950 font-bold px-8 py-3.5 rounded-none transition-colors flex items-center justify-center gap-1.5 uppercase tracking-widest text-[10px]"
              >
                Our Heritage
                <ChevronRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
          
          {/* Hero Right side: Features / Graphic / Quick info */}
          <div className="md:w-1/2 flex flex-col bg-white">
            <div className="flex-1 p-8 md:p-12 border-b border-navy-950/10 flex flex-col justify-center">
              <span className="text-gold-600 text-[10px] font-bold uppercase tracking-widest mb-4 block">Official Creed</span>
              <blockquote className="font-serif italic text-navy-950 text-sm md:text-base leading-relaxed relative pl-6 border-l-2 border-gold-500">
                &ldquo;{FRAT_INFO.creed}&rdquo;
              </blockquote>
            </div>
            
            <div className="flex-1 grid grid-cols-2">
              <div className="p-6 md:p-8 border-r border-navy-950/10 flex flex-col justify-center bg-[#FDFCFB]">
                <span className="text-[10px] text-[#c5a059] font-bold uppercase tracking-widest block mb-1">Our Purpose</span>
                <p className="text-[11px] text-navy-950/70 leading-relaxed font-sans">
                  Dedicated to the pursuit of knowledge and the service of humanity through collective action.
                </p>
              </div>
              <div className="p-6 md:p-8 flex flex-col justify-center bg-navy-950 text-white">
                <span className="text-gold-400 text-[10px] font-bold uppercase tracking-widest block mb-2">Next Assembly</span>
                <p className="font-serif text-sm text-white font-bold leading-tight">National Assembly 2026</p>
                <p className="text-[10px] text-gold-300 mt-1 uppercase tracking-widest">Annual Session • Tagbilaran City</p>
              </div>
            </div>
          </div>

        </div>
      </section>

      {/* TIMELINE / MILESTONES BAR - GEOMETRIC */}
      <section className="bg-white border-b border-navy-950/10 text-navy-950 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-5 gap-0">
            {milestones.map((item, index) => (
              <div 
                key={index} 
                className={`flex flex-col justify-center items-center p-6 border-navy-950/10 ${
                  index !== milestones.length - 1 ? 'border-b md:border-b-0 md:border-r' : ''
                } ${
                  index % 2 === 0 ? 'bg-[#fbf9f4]' : 'bg-white'
                }`}
              >
                <span className="text-xl md:text-2xl font-serif font-black text-navy-950 mb-1">
                  {item.value}
                </span>
                <span className="text-[9px] tracking-widest uppercase text-navy-950/60 font-bold text-center">
                  {item.label}
                </span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CORE PILLARS SECTION - GEOMETRIC BENTO GRID */}
      <section className="py-20 bg-[#f9f7f2]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <span className="text-[10px] font-bold tracking-widest text-gold-600 uppercase block mb-3">Our Foundations</span>
            <h2 className="text-3xl md:text-4xl font-serif font-black text-navy-950 uppercase tracking-tight">
              The Cornerstone Principles of Lambda Beta Phi
            </h2>
            <div className="h-[2px] w-12 bg-gold-500 mx-auto mt-4"></div>
            <p className="text-navy-950/70 mt-6 font-sans text-xs md:text-sm leading-relaxed max-w-xl mx-auto">
              Our sacred charter is built upon four indestructible foundations. Click each pillar below to explore our values and expectations.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-0 border border-navy-950/10 bg-white">
            {PILLARS.map((pillar, index) => {
              const iconMap: { [key: string]: any } = {
                Users: <Users className="w-6 h-6" />,
                GraduationCap: <GraduationCap className="w-6 h-6" />,
                ShieldAlert: <ShieldAlert className="w-6 h-6" />,
                HeartHandshake: <HeartHandshake className="w-6 h-6" />
              };
              
              const isSelected = activePillar === index;

              return (
                <div
                  key={index}
                  onClick={() => setActivePillar(isSelected ? null : index)}
                  className={`cursor-pointer p-8 flex flex-col items-start transition-all duration-200 border-navy-950/10 ${
                    index !== PILLARS.length - 1 ? 'border-b md:border-b-0 md:border-r' : ''
                  } ${
                    isSelected ? 'bg-gold-500/10' : 'hover:bg-navy-950/5'
                  }`}
                >
                  <div className={`p-3 rounded-none mb-6 transition-all ${
                    isSelected ? 'bg-navy-950 text-gold-500' : 'bg-navy-50 text-navy-950'
                  }`}>
                    {iconMap[pillar.icon] || <Award className="w-6 h-6" />}
                  </div>

                  <h3 className="font-serif font-bold text-base text-navy-950 mb-3 uppercase tracking-wider">
                    {pillar.title}
                  </h3>
                  
                  <p className="text-navy-950/70 text-xs leading-relaxed font-sans font-light">
                    {pillar.description}
                  </p>

                  <div className="mt-6 text-[8px] text-gold-600 font-bold tracking-widest uppercase">
                    {isSelected ? 'Collapse Detail' : 'Read Detail &rarr;'}
                  </div>
                </div>
              );
            })}
          </div>

          {/* Expanded Pillar Info */}
          {activePillar !== null && (
            <div className="mt-8 p-8 bg-white border border-navy-950/10 rounded-none shadow-sm text-navy-950 animate-slide-up">
              <h4 className="font-serif font-bold text-lg text-navy-950 uppercase tracking-wider flex items-center gap-2 mb-3">
                <Bookmark className="w-4 h-4 text-gold-500" />
                Under the Pillar of {PILLARS[activePillar].title}
              </h4>
              <p className="text-xs md:text-sm text-navy-950/80 leading-relaxed font-sans">
                {activePillar === 0 && 'The cornerstone of Love (Lambda) represents our co-educational support. We pledge help in times of need and danger, nurturing lifetime bonds of sisterhood and brotherhood across all local and global alumni chapters.'}
                {activePillar === 1 && 'The cornerstone of Bravery (Beta) symbolizes the courage to face hardships, defy adversity, and maintain standard-setting integrity without hesitation, reflecting our core founding philosophy.'}
                {activePillar === 2 && 'The cornerstone of Loyalty (Phi) embodies lifelong fidelity. Our commitment to our letters and each other is absolute, fostering a respected society that cares for its members throughout their entire lives.'}
                {activePillar === 3 && 'Our motto "Fraternity that would set a high standard of Academic excellence and a Society respected" guides our academic pursuit. We uphold stellar standards, sponsor research, and support members to achieve intellectual honors.'}
              </p>
            </div>
          )}
        </div>
      </section>

      {/* COAT OF ARMS INTERACTIVE EXPLORER - HIGH FIDELITY */}
      <section className="py-20 bg-white border-y border-navy-950/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            
            {/* Left Column: Authentic Crest Render & Selection Tabs */}
            <div className="lg:col-span-5 flex flex-col items-center justify-center bg-[#f1f6fc] p-8 border border-navy-950/10 rounded-none relative">
              
              <div className="relative text-center mb-6">
                <span className="text-[10px] font-bold tracking-widest text-[#dfb141] uppercase block">Interactive Heraldry</span>
                <p className="text-[#0d55a3] text-[9px] uppercase tracking-widest mt-1">Explore our sovereign emblem</p>
              </div>

              {/* The Visual Emblem representation */}
              <div className="relative p-6 bg-white border border-navy-950/10 rounded-none shadow-sm mb-6 flex justify-center items-center">
                <CrestLogo size={240} className="transition-all duration-300 transform hover:scale-105" />
              </div>

              {/* Active Part indicator tabs */}
              <div className="grid grid-cols-2 gap-2 w-full">
                {(['crown', 'lion', 'shield', 'wreath'] as const).map((part) => {
                  const labels = {
                    crown: 'The Crown',
                    lion: 'The Lion',
                    shield: 'The Shield',
                    wreath: 'The Laurel'
                  };
                  return (
                    <button
                      key={part}
                      onClick={() => setActiveCrestPart(part)}
                      className={`text-[10px] font-bold uppercase tracking-wider py-2.5 px-3 rounded-none border transition-all text-center ${
                        activeCrestPart === part 
                          ? 'bg-navy-950 text-gold-500 border-navy-950' 
                          : 'bg-white text-navy-950 border-navy-950/15 hover:bg-navy-950/5'
                      }`}
                    >
                      {labels[part]}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Right Column: Crest Description Details */}
            <div className="lg:col-span-7 space-y-6">
              <span className="text-[10px] font-bold tracking-widest text-[#0d55a3] uppercase block">Emblem & Heraldry</span>
              <h3 className="text-2xl md:text-3xl font-serif font-black text-navy-950 uppercase tracking-tight">
                Our Seal of Honor
              </h3>
              <p className="text-navy-950/70 leading-relaxed font-sans text-xs md:text-sm">
                Each curve, shield, and symbol of the official Lambda Beta Phi Seal is historically significant. Established in 1969, the heraldry represents the foundational virtues of love, bravery, and loyalty expected of all registered active brothers and sisters.
              </p>

              {/* Detail Card for selected part */}
              {activeCrestPart && (
                <div className="p-6 bg-[#f1f6fc] border border-navy-950/10 rounded-none border-l-4 border-l-gold-500 animate-fade-in">
                  <div className="flex items-center gap-3 mb-3">
                    <span className="p-2 rounded-none bg-gold-500/10 text-gold-700">
                      {activeCrestPart === 'crown' && <Crown className="w-5 h-5 text-navy-950" />}
                      {activeCrestPart === 'lion' && <Award className="w-5 h-5 text-navy-950" />}
                      {activeCrestPart === 'shield' && <Shield className="w-5 h-5 text-navy-950" />}
                      {activeCrestPart === 'wreath' && <FileText className="w-5 h-5 text-navy-950" />}
                    </span>
                    <div>
                      <h4 className="font-serif font-bold text-navy-950 text-base uppercase">
                        {crestDetails[activeCrestPart].title}
                      </h4>
                      <p className="text-[9px] text-[#dfb141] font-black uppercase tracking-widest mt-0.5">
                        {crestDetails[activeCrestPart].meaning}
                      </p>
                    </div>
                  </div>
                  <p className="text-navy-950/80 text-xs leading-relaxed font-sans font-light">
                    {crestDetails[activeCrestPart].description}
                  </p>
                </div>
              )}
            </div>

          </div>
        </div>
      </section>

      {/* QUICK ROUTE SECTION / CALL TO ACTION - GEOMETRIC */}
      <section className="py-20 bg-[#f9f7f2]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-0 border border-navy-950/10 bg-white">
            
            {/* About Us Quick Card */}
            <div className="p-8 border-b md:border-b-0 md:border-r border-navy-950/10 hover:bg-navy-950/5 transition-all flex flex-col justify-between h-[300px]">
              <div>
                <span className="p-2 bg-navy-50 text-navy-950 inline-block mb-4">
                  <Users className="w-5 h-5" />
                </span>
                <h4 className="font-serif font-black text-lg text-navy-950 uppercase tracking-wide">Who We Are</h4>
                <p className="text-navy-950/70 text-xs leading-relaxed mt-2 font-sans font-light">
                  Deep dive into our 1969 Founding Creed, meeting our executive committees, and exploring our values.
                </p>
              </div>
              <button 
                onClick={() => onNavigate('about')}
                className="text-gold-600 font-bold text-xs tracking-widest uppercase flex items-center gap-1.5 hover:text-gold-700 cursor-pointer w-fit"
              >
                Learn About Us <ChevronRight className="w-3.5 h-3.5" />
              </button>
            </div>

            {/* News Quick Card */}
            <div className="p-8 border-b md:border-b-0 md:border-r border-navy-950/10 hover:bg-navy-950/5 transition-all flex flex-col justify-between h-[300px]">
              <div>
                <span className="p-2 bg-navy-50 text-navy-950 inline-block mb-4">
                  <Newspaper className="w-5 h-5" />
                </span>
                <h4 className="font-serif font-black text-lg text-navy-950 uppercase tracking-wide">Chapter News</h4>
                <p className="text-navy-950/70 text-xs leading-relaxed mt-2 font-sans font-light">
                  Keep pace with our community service, academic achievements, philanthropic awards, and official announcements.
                </p>
              </div>
              <button 
                onClick={() => onNavigate('news')}
                className="text-gold-600 font-bold text-xs tracking-widest uppercase flex items-center gap-1.5 hover:text-gold-700 cursor-pointer w-fit"
              >
                View News Feed <ChevronRight className="w-3.5 h-3.5" />
              </button>
            </div>

            {/* Event Quick Card */}
            <div className="p-8 hover:bg-navy-950/5 transition-all flex flex-col justify-between h-[300px]">
              <div>
                <span className="p-2 bg-navy-50 text-navy-950 inline-block mb-4">
                  <Calendar className="w-5 h-5" />
                </span>
                <h4 className="font-serif font-black text-lg text-navy-950 uppercase tracking-wide">Calendar</h4>
                <p className="text-navy-950/70 text-xs leading-relaxed mt-2 font-sans font-light">
                  Register or RSVP for upcoming chapter conferences, networking summits, mixers, and service opportunities.
                </p>
              </div>
              <button 
                onClick={() => onNavigate('events')}
                className="text-gold-600 font-bold text-xs tracking-widest uppercase flex items-center gap-1.5 hover:text-gold-700 cursor-pointer w-fit"
              >
                Browse Events <ChevronRight className="w-3.5 h-3.5" />
              </button>
            </div>

          </div>
        </div>
      </section>

    </div>
  );
}
