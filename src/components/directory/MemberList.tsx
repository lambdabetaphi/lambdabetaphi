import React from 'react';
import { Users } from 'lucide-react';
import { Member } from '../../types';
import { MemberCard } from './MemberCard';

export interface MemberListProps {
  filteredMembers: Member[];
  onReviewDossier: (member: Member) => void;
}

export function MemberList({
  filteredMembers,
  onReviewDossier
}: MemberListProps) {
  if (filteredMembers.length === 0) {
    return (
      <div className="bg-white rounded-2xl p-12 border border-navy-950/5 text-center text-navy-400 font-sans text-xs" id="directory_empty_state">
        <Users className="w-12 h-12 text-navy-200 mx-auto mb-2" />
        <p className="font-bold uppercase tracking-wider text-xs text-navy-950">No Members Match Search</p>
        <p className="text-[10px] text-navy-400 mt-1">Try broadening your spelling or selecting other chapter/batch classifications.</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4" id="directory_members_grid">
      {filteredMembers.map(member => (
        <MemberCard
          key={member.id}
          member={member}
          onReviewDossier={() => onReviewDossier(member)}
        />
      ))}
    </div>
  );
}
