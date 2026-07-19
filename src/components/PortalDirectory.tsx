import React, { useState } from 'react';
import { Search, Filter, Phone, Mail, Calendar, Landmark, Shield, User, X, Award } from 'lucide-react';
import { Member } from '../types';

interface PortalDirectoryProps {
  members: Member[];
  currentUser: Member;
}

export default function PortalDirectory({ members, currentUser }: PortalDirectoryProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [chapterFilter, setChapterFilter] = useState('all');
  const [batchFilter, setBatchFilter] = useState('all');
  const [activeDossier, setActiveDossier] = useState<Member | null>(null);

  // Exclude pending users from general members directory
  const activeMembers = members.filter(m => m.role !== 'Pending');

  // Gather unique chapters and batches for filter dropdowns
  const uniqueChapters = Array.from(new Set(activeMembers.map(m => m.chapter).filter(Boolean)));
  const uniqueBatches = Array.from(new Set(activeMembers.map(m => m.batch).filter(Boolean)));

  const filteredMembers = activeMembers.filter(m => {
    const matchesSearch = 
      m.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      m.slaveName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      m.email.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesChapter = chapterFilter === 'all' || m.chapter === chapterFilter;
    const matchesBatch = batchFilter === 'all' || m.batch === batchFilter;
    return matchesSearch && matchesChapter && matchesBatch;
  });

  return (
    <div className="space-y-4 font-sans text-xs">
      
      {/* Search and Filters card */}
      <div className="bg-white rounded-2xl shadow-sm border border-navy-950/5 p-4 space-y-3">
        <div className="flex flex-col md:flex-row gap-3">
          
          {/* Search box */}
          <div className="relative flex-1">
            <span className="absolute inset-y-0 left-0 flex items-center pl-3.5 text-navy-400">
              <Search className="w-4 h-4" />
            </span>
            <input
              type="text"
              placeholder="Search by Name, Slave Name, or Email..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 w-full p-2.5 rounded-xl border border-navy-950/10 focus:outline-none focus:ring-1 focus:ring-gold-500 bg-white text-navy-950 text-xs"
            />
          </div>

          {/* Chapter Filter */}
          <div className="relative md:w-48">
            <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-navy-400">
              <Landmark className="w-4.5 h-4.5" />
            </span>
            <select
              value={chapterFilter}
              onChange={(e) => setChapterFilter(e.target.value)}
              className="pl-9 w-full p-2.5 rounded-xl border border-navy-950/10 focus:outline-none focus:ring-1 focus:ring-gold-500 bg-white text-navy-950 text-xs appearance-none"
            >
              <option value="all">All Chapters</option>
              {uniqueChapters.map((ch, idx) => (
                <option key={idx} value={ch}>{ch}</option>
              ))}
            </select>
          </div>

          {/* Batch Filter */}
          <div className="relative md:w-48">
            <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-navy-400">
              <Shield className="w-4.5 h-4.5" />
            </span>
            <select
              value={batchFilter}
              onChange={(e) => setBatchFilter(e.target.value)}
              className="pl-9 w-full p-2.5 rounded-xl border border-navy-950/10 focus:outline-none focus:ring-1 focus:ring-gold-500 bg-white text-navy-950 text-xs appearance-none"
            >
              <option value="all">All Batches</option>
              {uniqueBatches.map((b, idx) => (
                <option key={idx} value={b}>{b}</option>
              ))}
            </select>
          </div>

        </div>

        <div className="flex justify-between items-center text-[10px] text-navy-400 font-mono font-bold uppercase">
          <span>Found {filteredMembers.length} Registered Members</span>
          {(searchQuery || chapterFilter !== 'all' || batchFilter !== 'all') && (
            <button
              onClick={() => {
                setSearchQuery('');
                setChapterFilter('all');
                setBatchFilter('all');
              }}
              className="text-rose-600 hover:underline"
            >
              Reset Filters
            </button>
          )}
        </div>
      </div>

      {/* Grid List */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
        {filteredMembers.map(m => (
          <div 
            key={m.id}
            onClick={() => setActiveDossier(m)}
            className="bg-white rounded-2xl p-4.5 border border-navy-950/5 hover:border-[#c5a059]/40 hover:shadow-md transition-all cursor-pointer flex flex-col items-center text-center relative group"
          >
            {m.role === 'Admin' && (
              <span className="absolute top-3 right-3 px-2 py-0.5 bg-amber-500 text-navy-950 text-[8px] font-bold uppercase tracking-widest rounded-full flex items-center gap-0.5">
                <Award className="w-2.5 h-2.5 shrink-0" />
                Admin
              </span>
            )}

            <img 
              src={m.avatarUrl} 
              alt={m.name} 
              className="w-16 h-16 rounded-full object-cover border-2 border-navy-950/5 group-hover:border-[#c5a059] shadow-sm transition-colors mb-2.5"
              referrerPolicy="no-referrer"
            />

            <h4 className="font-bold text-navy-950 text-sm uppercase tracking-wide truncate max-w-full leading-tight">
              {m.name}
            </h4>
            
            <p className="text-[10px] text-rose-600 font-mono font-bold uppercase mt-0.5">
              SLAVE: {m.slaveName}
            </p>

            <div className="mt-3 pt-2.5 border-t border-navy-950/5 w-full text-[10px] text-navy-500 space-y-1">
              <p className="truncate"><strong className="text-navy-950">Chapter:</strong> {m.chapter}</p>
              <p className="truncate"><strong className="text-navy-950">Batch:</strong> {m.batch}</p>
              <p className="truncate font-mono"><strong className="text-navy-950 font-sans">Phone:</strong> {m.phone}</p>
            </div>

            <button
              className="mt-4 w-full py-2 bg-[#fbf9f4] border border-[#c5a059]/20 hover:bg-[#c5a059]/10 text-[#c5a059] text-[9px] font-bold uppercase tracking-widest rounded-lg transition-colors"
            >
              Review Dossier
            </button>
          </div>
        ))}
      </div>

      {filteredMembers.length === 0 && (
        <div className="bg-white rounded-2xl p-8 border border-navy-950/5 text-center text-navy-400">
          <p className="font-bold uppercase tracking-wider text-xs text-navy-950">No Members Match Search</p>
          <p className="text-[10px] text-navy-400 mt-1">Try broadening your spelling or selecting other chapter/batch classifications.</p>
        </div>
      )}

      {/* Dossier Detail Modal */}
      {activeDossier && (
        <div className="fixed inset-0 bg-navy-950/60 backdrop-blur-sm flex items-center justify-center p-4 z-50 animate-fade-in">
          <div className="bg-white rounded-2xl shadow-2xl border border-[#c5a059]/20 w-full max-w-md overflow-hidden relative">
            <div className="absolute top-0 left-0 right-0 h-1.5 bg-[#c5a059]"></div>
            
            <div className="flex items-center justify-between p-4 border-b border-navy-950/5">
              <h3 className="font-serif font-black text-navy-950 text-xs uppercase tracking-wide">
                Community Dossier Ledger
              </h3>
              <button 
                onClick={() => setActiveDossier(null)}
                className="p-1 rounded-full text-navy-400 hover:text-navy-950 transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="p-6 text-center space-y-4">
              <div className="flex justify-center">
                <div className="p-1.5 bg-white rounded-full shadow-md border-2 border-[#c5a059]">
                  <img 
                    src={activeDossier.avatarUrl} 
                    alt={activeDossier.name} 
                    className="w-20 h-20 rounded-full object-cover"
                    referrerPolicy="no-referrer"
                  />
                </div>
              </div>

              <div>
                <h3 className="font-serif font-black text-navy-950 text-lg tracking-wide uppercase leading-tight">
                  {activeDossier.name}
                </h3>
                <p className="text-xs text-rose-600 font-mono font-bold uppercase mt-1">
                  SLAVE NAME: {activeDossier.slaveName}
                </p>
                <p className="text-[10px] text-[#c5a059] font-bold uppercase tracking-widest mt-0.5">
                  {activeDossier.position || 'Active Initiate'}
                </p>
              </div>

              <div className="p-4 bg-[#fbf9f4] border border-[#c5a059]/15 text-left rounded-xl text-xs space-y-3 text-navy-950">
                <div className="flex items-center gap-3">
                  <Landmark className="w-4 h-4 text-[#c5a059] shrink-0" />
                  <span><strong>Chapter:</strong> {activeDossier.chapter}</span>
                </div>
                <div className="flex items-center gap-3">
                  <Shield className="w-4 h-4 text-[#c5a059] shrink-0" />
                  <span><strong>Batch Class:</strong> {activeDossier.batch}</span>
                </div>
                <div className="flex items-center gap-3">
                  <Mail className="w-4 h-4 text-navy-400 shrink-0" />
                  <span><strong>Email Address:</strong> <a href={`mailto:${activeDossier.email}`} className="hover:underline text-navy-900 font-medium">{activeDossier.email}</a></span>
                </div>
                <div className="flex items-center gap-3">
                  <Phone className="w-4 h-4 text-navy-400 shrink-0" />
                  <span><strong>Phone Number:</strong> <a href={`tel:${activeDossier.phone}`} className="hover:underline text-navy-900 font-mono">{activeDossier.phone}</a></span>
                </div>
                {activeDossier.birthday && (
                  <div className="flex items-center gap-3">
                    <Calendar className="w-4 h-4 text-rose-400 shrink-0" />
                    <span><strong>Date of Birth:</strong> {new Date(activeDossier.birthday).toLocaleDateString(undefined, {month: 'long', day: 'numeric', year: 'numeric'})}</span>
                  </div>
                )}
                <div className="flex items-center gap-3">
                  <User className="w-4 h-4 text-navy-400 shrink-0" />
                  <span><strong>Joined Association:</strong> {activeDossier.joinsDate || '2026-07-19'}</span>
                </div>
              </div>

              <button
                onClick={() => setActiveDossier(null)}
                className="w-full py-2.5 bg-navy-950 text-gold-500 text-[10px] font-bold uppercase tracking-widest rounded-lg hover:bg-navy-900 transition-colors cursor-pointer"
              >
                Close Ledger
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
