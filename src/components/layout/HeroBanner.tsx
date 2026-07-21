import React, { useMemo } from 'react';
import { motion } from 'motion/react';
import { 
  Compass, Users, FolderOpen, Calendar, Volume2, Crown, Bell, User, Settings, Shield,
  Sparkles, Lock, ArrowUpRight, Database
} from 'lucide-react';
import { Member } from '../../types';
import { PortalTab } from './Sidebar';

export interface HeroBannerProps {
  activeTab: PortalTab;
  currentUser: Member | null;
}

interface BannerContent {
  title: string;
  subtitle: string;
  description: string;
  accentText: string;
  icon: React.ComponentType<any>;
  stats: { label: string; value: string; detail?: string }[];
}

export function HeroBanner({ activeTab, currentUser }: HeroBannerProps) {
  
  const userName = useMemo(() => {
    if (!currentUser) return 'Sovereign Initiate';
    return currentUser.full_name || currentUser.name || 'Sovereign Initiate';
  }, [currentUser]);

  const userRole = useMemo(() => {
    if (!currentUser) return 'Candidate';
    return currentUser.role || 'Member';
  }, [currentUser]);

  const slaveName = useMemo(() => {
    if (!currentUser) return 'Candidate';
    return currentUser.bio || currentUser.slaveName || 'Candidate';
  }, [currentUser]);

  // Construct highly relevant contextual header states for every PortalTab without string interpolation redundancy
  const bannerData = useMemo<Record<PortalTab, BannerContent>>(() => {
    return {
      home: {
        title: `Welcome, ${userName.split(' ')[0]}`,
        subtitle: `AUTHORIZED PROFILE: EXECUTIVE ${userRole.toUpperCase()}`,
        description: `Your digital ledger has successfully synchronized with the Lambda Beta Phi primary network. Check the timeline below for secure posts, recent assemblies, and encrypted directives.`,
        accentText: `SLAVE KEY: ${slaveName.toUpperCase()}`,
        icon: Compass,
        stats: [
          { label: 'Security Status', value: 'OPTIMAL', detail: 'End-to-End Encrypted' },
          { label: 'Access Level', value: userRole.toUpperCase(), detail: 'Sovereign Council' },
          { label: 'Session Clock', value: 'SECURE', detail: 'Token Validated' }
        ]
      },
      directory: {
        title: 'Sovereign Registry Archives',
        subtitle: 'SECURE ROSTER LEDGER',
        description: 'Explore the verified identities, active chapters, and executive leadership presiding over the Lambda Beta Phi private assembly.',
        accentText: 'CHAMBER ARCHIVES',
        icon: Users,
        stats: [
          { label: 'Active Chapters', value: '3 CHAPTERS', detail: 'Regional Conclaves' },
          { label: 'Vetted Roster', value: 'VERIFIED', detail: '100% Confirmed' },
          { label: 'Inductions', value: 'ACTIVE', detail: 'Candidates Queue' }
        ]
      },
      gallery: {
        title: 'Imperial Media Treasury',
        subtitle: 'HISTORICAL ARCHIVES LEDGER',
        description: 'A historical depository preserving key assemblies, sovereign conclaves, and precious memorabilia of Lambda Beta Phi in secure cloud lockers.',
        accentText: 'SECURE REPOSITORY',
        icon: FolderOpen,
        stats: [
          { label: 'Cloud Storage', value: 'UNLIMITED', detail: 'Optimized CDN' },
          { label: 'Media Type', value: 'HIGH-RES', detail: 'Conclave Logs' },
          { label: 'Encryption', value: 'AES-256', detail: 'Zero Leak Protocol' }
        ]
      },
      events: {
        title: 'Grand Conclaves & Assemblies',
        subtitle: 'SOVEREIGN CALENDAR',
        description: 'Synchronize your schedule with official regional chapters gatherings, high council hearings, and legislative sovereign conclaves.',
        accentText: 'REGISTRY DIRECTORY',
        icon: Calendar,
        stats: [
          { label: 'Upcoming', value: 'ACTIVE', detail: 'Conclaves Hub' },
          { label: 'RSVP Engine', value: 'ENABLED', detail: 'Instant Confirmation' },
          { label: 'Format', value: 'IN-PERSON', detail: 'Formal Accoutrements' }
        ]
      },
      announcements: {
        title: 'Imperial Directives Board',
        subtitle: 'HIGH COUNCIL EXECUTIVE DECREES',
        description: 'Review mandatory decrees, constitutional edits, and urgent operational notices issued by the Presiding Officers of the Sovereign Council.',
        accentText: 'LEGISLATIVE BOARD',
        icon: Volume2,
        stats: [
          { label: 'Authority', value: 'DECREED', detail: 'Executive Sovereign' },
          { label: 'Urgency', value: 'HIGH', detail: 'Binding Mandates' },
          { label: 'Pinned Feed', value: 'PRIORITY', detail: 'Critical Alerts' }
        ]
      },
      officers: {
        title: 'Chamber of Presiding Officers',
        subtitle: 'EXECUTIVE CABINET ROSTER',
        description: 'Vetting the identities and legislative portfolios of the current reigning officers holding sovereign chairs in the Supreme Council.',
        accentText: 'OFFICER PORTFOLIOS',
        icon: Crown,
        stats: [
          { label: 'Cabinet Seats', value: 'VETTED', detail: 'Elected Chairs' },
          { label: 'Authority', value: 'EXECUTIVE', detail: 'Supreme Legislative' },
          { label: 'Chamber Room', value: 'CHAIRS', detail: 'Sovereign Jurisdiction' }
        ]
      },
      notifications: {
        title: 'System Registry Alerts',
        subtitle: 'REAL-TIME NETWORK STREAM',
        description: 'Monitor automated system logging telemetry, profile modification flags, and live security audits across the distributed node database.',
        accentText: 'TELEMETRY LEDGER',
        icon: Bell,
        stats: [
          { label: 'Audit Status', value: 'OK', detail: 'System Diagnostic' },
          { label: 'Network Feed', value: 'LIVE', detail: 'Real-time Listeners' },
          { label: 'Error Logs', value: '0 FLAGS', detail: 'Optimal Connection' }
        ]
      },
      profile: {
        title: 'Cryptographic Member Dossier',
        subtitle: 'INDIVIDUAL REGISTRY CARD',
        description: 'Manage your active chapter affiliation, biographical details, profile visuals, and client-side credential states in absolute privacy.',
        accentText: 'MEMBER PRIVACY',
        icon: User,
        stats: [
          { label: 'Dossier State', value: 'SECURE', detail: 'User Controlled' },
          { label: 'Verification', value: 'APPROVED', detail: 'Vetted Profile' },
          { label: 'Data Policy', value: 'PRIVATE', detail: 'No External Sharing' }
        ]
      },
      settings: {
        title: 'Settings & Sovereign Storage',
        subtitle: 'DISTRIBUTED NODE MANAGER',
        description: 'Fine-tune network interface caching variables, verify physical table schemas, or initialize Supabase project credentials in real-time.',
        accentText: 'DATABASE ENGINE',
        icon: Settings,
        stats: [
          { label: 'Host System', value: 'CLOUD', detail: 'Cloud Run Engine' },
          { label: 'Data Store', value: 'SUPABASE', detail: 'PostgreSQL Sync' },
          { label: 'Telemetry', value: 'ACTIVE', detail: 'Vitals Monitoring' }
        ]
      },
      admin: {
        title: 'Executive Sovereignty Control',
        subtitle: 'ADMINISTRATIVE PRIVILEGED GATEWAY',
        description: 'Admit pending candidate registrations, execute manual SQL migration scripts, purge historical logs, or trigger high-priority alerts.',
        accentText: 'ROOT EXECUTIVE',
        icon: Shield,
        stats: [
          { label: 'System Mode', value: 'ADMIN', detail: 'Full Schema Control' },
          { label: 'Candidate Queue', value: 'LIVE', detail: 'Applicant Vetting' },
          { label: 'Table Status', value: 'VERIFIED', detail: 'Database Healthy' }
        ]
      }
    };
  }, [userName, userRole, slaveName]);

  const activeContent = useMemo(() => {
    return bannerData[activeTab] || bannerData.home;
  }, [bannerData, activeTab]);

  const IconComponent = activeContent.icon;

  return (
    <motion.div
      initial={{ opacity: 0, y: -12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, ease: 'easeOut' }}
      id={`hero-banner-${activeTab}`}
      className="relative mb-6 overflow-hidden rounded-3xl bg-navy-950 text-white shadow-xl border border-[#c5a059]/10"
    >
      {/* Premium background subtle visual grids and radial glows */}
      <div 
        id="hero-banner-glow-overlay" 
        className="absolute inset-0 bg-gradient-to-r from-navy-950 via-navy-900/80 to-navy-950 mix-blend-multiply pointer-events-none z-0" 
      />
      
      <div 
        id="hero-banner-accent-glow" 
        className="absolute -right-36 -top-36 w-96 h-96 bg-[#c5a059]/10 rounded-full blur-[100px] pointer-events-none z-0" 
      />

      <div 
        id="hero-banner-grid-overlay" 
        className="absolute inset-0 bg-[linear-gradient(to_right,rgba(197,160,89,0.03)_1px,transparent_1px),linear-gradient(to_bottom,rgba(197,160,89,0.03)_1px,transparent_1px)] bg-[size:24px_24px] pointer-events-none z-0"
      />

      {/* Main Flex layout content section */}
      <div className="relative z-10 p-6 md:p-8 flex flex-col lg:flex-row lg:items-center justify-between gap-6">
        
        {/* Left Side text content */}
        <div className="flex-1 text-left space-y-3 max-w-2xl">
          <div className="flex flex-wrap items-center gap-2.5">
            <span 
              id="hero-badge-subtitle" 
              className="px-2.5 py-1 text-[8px] font-black tracking-widest bg-[#c5a059]/10 border border-[#c5a059]/35 text-gold-400 rounded-md uppercase font-sans flex items-center gap-1"
            >
              <Lock className="w-2.5 h-2.5" />
              {activeContent.subtitle}
            </span>
            <span 
              id="hero-badge-accent" 
              className="hidden sm:inline-block px-2.5 py-1 text-[8px] font-mono font-bold tracking-wider bg-white/5 text-navy-300 rounded-md uppercase"
            >
              {activeContent.accentText}
            </span>
          </div>

          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-[#c5a059]/10 rounded-xl border border-[#c5a059]/10 text-gold-400 shrink-0 hidden sm:block">
              <IconComponent className="w-6 h-6" />
            </div>
            <h1 
              id="hero-banner-title" 
              className="font-serif font-black text-xl md:text-2xl text-gold-400 tracking-tight leading-tight"
            >
              {activeContent.title}
            </h1>
          </div>

          <p 
            id="hero-banner-description" 
            className="text-navy-200 text-xs md:text-[12.5px] leading-relaxed max-w-xl font-normal opacity-90"
          >
            {activeContent.description}
          </p>
        </div>

        {/* Right Side: High-Impact Contextual Key Metrics Panels */}
        <div 
          id="hero-banner-stats-container" 
          className="grid grid-cols-3 gap-2.5 md:gap-3.5 sm:min-w-[340px] lg:min-w-[400px] shrink-0"
        >
          {activeContent.stats.map((stat, i) => (
            <div
              key={stat.label}
              id={`hero-stat-card-${i}`}
              className="bg-navy-900/40 border border-[#c5a059]/5 hover:border-[#c5a059]/20 rounded-2xl p-3 text-left transition-all duration-300 group flex flex-col justify-between"
            >
              <div>
                <p className="text-[7.5px] text-navy-400 font-mono font-bold uppercase tracking-widest leading-none">
                  {stat.label}
                </p>
                <p className="text-sm md:text-base font-serif font-black text-gold-400 mt-1.5 tracking-tight group-hover:text-white transition-colors">
                  {stat.value}
                </p>
              </div>
              
              {stat.detail && (
                <div className="mt-2 pt-1 border-t border-white/5 flex items-center justify-between">
                  <span className="text-[7.5px] text-navy-400 font-sans font-medium uppercase truncate">
                    {stat.detail}
                  </span>
                  <ArrowUpRight className="w-2 h-2 text-gold-500/40 group-hover:text-gold-500 transition-colors shrink-0" />
                </div>
              )}
            </div>
          ))}
        </div>

      </div>

      {/* Ambient bottom golden decorative border rule */}
      <div className="absolute bottom-0 left-0 right-0 h-[2.5px] bg-gradient-to-r from-gold-600 via-gold-400 to-gold-600 opacity-60" />
    </motion.div>
  );
}
