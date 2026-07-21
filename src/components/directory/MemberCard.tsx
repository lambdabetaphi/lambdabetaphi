import React from 'react';
import { Award } from 'lucide-react';
import { Member } from '../../types';

export interface MemberCardProps {
  member: Member;
  onReviewDossier: () => void;
}

export const MemberCard: React.FC<MemberCardProps> = ({
  member,
  onReviewDossier
}) => {
  const avatar = member.avatar_url || member.avatarUrl || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80';

  return (
    <div 
      id={`member_card_${member.id}`}
      onClick={onReviewDossier}
      className="bg-white rounded-2xl p-4.5 border border-navy-950/5 hover:border-[#c5a059]/40 hover:shadow-md transition-all cursor-pointer flex flex-col items-center text-center relative group font-sans text-xs"
    >
      {member.role === 'Admin' && (
        <span className="absolute top-3 right-3 px-2 py-0.5 bg-amber-500 text-navy-950 text-[8px] font-bold uppercase tracking-widest rounded-full flex items-center gap-0.5 shadow-sm">
          <Award className="w-2.5 h-2.5 shrink-0" />
          Admin
        </span>
      )}

      <img 
        src={avatar} 
        alt={member.full_name} 
        className="w-16 h-16 rounded-full object-cover border-2 border-navy-950/5 group-hover:border-[#c5a059] shadow-sm transition-colors mb-2.5"
        referrerPolicy="no-referrer"
      />

      <h4 className="font-bold text-navy-950 text-sm uppercase tracking-wide truncate max-w-full leading-tight">
        {member.full_name || 'Anonymous Frater'}
      </h4>
      
      <p className="text-[10px] text-rose-600 font-mono font-bold uppercase mt-0.5">
        ROLE: {member.role || 'Member'}
      </p>

      <div className="mt-3 pt-2.5 border-t border-navy-950/5 w-full text-[10px] text-navy-500 space-y-1 text-left">
        <p className="truncate"><strong className="text-navy-950">Chapter:</strong> {member.chapter || 'N/A'}</p>
        <p className="truncate"><strong className="text-navy-950">Batch:</strong> {member.batch || 'N/A'}</p>
        <p className="truncate font-mono"><strong className="text-navy-950 font-sans">Phone:</strong> {member.phone || 'N/A'}</p>
      </div>

      <button
        type="button"
        id={`review_dossier_btn_${member.id}`}
        onClick={(e) => {
          e.stopPropagation();
          onReviewDossier();
        }}
        className="mt-4 w-full py-2 bg-[#fbf9f4] border border-[#c5a059]/20 hover:bg-[#c5a059]/10 text-[#c5a059] text-[9px] font-bold uppercase tracking-widest rounded-lg transition-colors cursor-pointer"
      >
        Review Dossier
      </button>
    </div>
  );
}
