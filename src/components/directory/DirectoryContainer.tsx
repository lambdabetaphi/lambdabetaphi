import React, { useState, useMemo } from 'react';
import { Member } from '../../types';
import { DirectoryFilters } from './DirectoryFilters';
import { MemberList } from './MemberList';
import { ProfileDossier } from './ProfileDossier';

export interface DirectoryContainerProps {
  members: Member[];
  currentUser: Member;
}

export function DirectoryContainer({
  members,
  currentUser
}: DirectoryContainerProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [chapterFilter, setChapterFilter] = useState('all');
  const [batchFilter, setBatchFilter] = useState('all');
  const [activeDossier, setActiveDossier] = useState<Member | null>(null);

  // Exclude pending users from general members directory
  const activeMembers = useMemo(() => {
    return members.filter(m => m.status !== 'Pending');
  }, [members]);

  // Gather unique chapters and batches for filter dropdowns
  const uniqueChapters = useMemo(() => {
    return Array.from(new Set(activeMembers.map(m => m.chapter).filter(Boolean))) as string[];
  }, [activeMembers]);

  const uniqueBatches = useMemo(() => {
    return Array.from(new Set(activeMembers.map(m => m.batch).filter(Boolean))) as string[];
  }, [activeMembers]);

  // Compute filtered members list based on filters
  const filteredMembers = useMemo(() => {
    return activeMembers.filter(m => {
      const nameMatch = (m.full_name || '').toLowerCase().includes(searchQuery.toLowerCase());
      const bioMatch = (m.bio || '').toLowerCase().includes(searchQuery.toLowerCase());
      const emailMatch = (m.email || '').toLowerCase().includes(searchQuery.toLowerCase());
      const positionMatch = (m.position || '').toLowerCase().includes(searchQuery.toLowerCase());
      const roleMatch = (m.role || '').toLowerCase().includes(searchQuery.toLowerCase());

      const matchesSearch = nameMatch || bioMatch || emailMatch || positionMatch || roleMatch;
      const matchesChapter = chapterFilter === 'all' || m.chapter === chapterFilter;
      const matchesBatch = batchFilter === 'all' || m.batch === batchFilter;
      
      return matchesSearch && matchesChapter && matchesBatch;
    });
  }, [activeMembers, searchQuery, chapterFilter, batchFilter]);

  const handleResetFilters = () => {
    setSearchQuery('');
    setChapterFilter('all');
    setBatchFilter('all');
  };

  return (
    <div className="space-y-4 font-sans text-xs">
      {/* Directory Filters (Search, Chapter Dropdown, Batch Dropdown) */}
      <DirectoryFilters
        searchQuery={searchQuery}
        onSearchQueryChange={setSearchQuery}
        chapterFilter={chapterFilter}
        onChapterFilterChange={setChapterFilter}
        batchFilter={batchFilter}
        onBatchFilterChange={setBatchFilter}
        uniqueChapters={uniqueChapters}
        uniqueBatches={uniqueBatches}
        totalResults={filteredMembers.length}
        onResetFilters={handleResetFilters}
      />

      {/* Grid List of Members */}
      <MemberList
        filteredMembers={filteredMembers}
        onReviewDossier={setActiveDossier}
      />

      {/* Interactive Profile Dossier Modal */}
      {activeDossier && (
        <ProfileDossier
          member={activeDossier}
          onClose={() => setActiveDossier(null)}
        />
      )}
    </div>
  );
}
export default DirectoryContainer;
