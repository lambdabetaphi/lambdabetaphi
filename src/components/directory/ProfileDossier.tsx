import React, { useEffect } from 'react';
import { X, Landmark, Shield, Mail, Phone, User } from 'lucide-react';
import { Member } from '../../types';

export interface ProfileDossierProps {
  member: Member;
  onClose: () => void;
}

export function ProfileDossier({
  member,
  onClose
}: ProfileDossierProps) {
  
  // Close on Escape key press
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    // Prevent scrolling behind modal
    document.body.style.overflow = 'hidden';

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = '';
    };
  }, [onClose]);

  const avatar = member.avatar_url || member.avatarUrl || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80';

  return (
    <div 
      className="fixed inset-0 bg-navy-950/60 backdrop-blur-sm flex items-center justify-center p-4 z-50 animate-fade-in"
      role="dialog"
      aria-modal="true"
      aria-label="Member Profile Dossier"
      id="profile_dossier_overlay"
    >
      <div className="bg-white rounded-2xl shadow-2xl border border-[#c5a059]/20 w-full max-w-md overflow-hidden relative font-sans text-xs">
        <div className="absolute top-0 left-0 right-0 h-1.5 bg-[#c5a059]"></div>
        
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-navy-950/5">
          <h3 className="font-serif font-black text-navy-950 text-xs uppercase tracking-wide">
            Community Dossier Ledger
          </h3>
          <button 
            id="close_dossier_btn"
            onClick={onClose}
            className="p-1 rounded-full text-navy-400 hover:text-navy-950 transition-colors cursor-pointer focus:outline-none focus:ring-1 focus:ring-gold-500"
            aria-label="Close dossier"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 text-center space-y-4">
          <div className="flex justify-center">
            <div className="p-1.5 bg-white rounded-full shadow-md border-2 border-[#c5a059]">
              <img 
                src={avatar} 
                alt={member.full_name} 
                className="w-20 h-20 rounded-full object-cover"
                referrerPolicy="no-referrer"
              />
            </div>
          </div>

          <div>
            <h3 className="font-serif font-black text-navy-950 text-lg tracking-wide uppercase leading-tight">
              {member.full_name || 'Anonymous Frater'}
            </h3>
            <p className="text-xs text-rose-600 font-mono font-bold uppercase mt-1">
              ROLE: {member.role || 'Member'}
            </p>
            <p className="text-[10px] text-[#c5a059] font-bold uppercase tracking-widest mt-0.5">
              {member.position || 'Active Initiate'}
            </p>
          </div>

          {/* Dossier Field Layout */}
          <div className="p-4 bg-[#fbf9f4] border border-[#c5a059]/15 text-left rounded-xl text-xs space-y-3 text-navy-950">
            <div className="flex items-center gap-3">
              <Landmark className="w-4 h-4 text-[#c5a059] shrink-0" />
              <span><strong>Chapter:</strong> {member.chapter || 'No Chapter'}</span>
            </div>
            <div className="flex items-center gap-3">
              <Shield className="w-4 h-4 text-[#c5a059] shrink-0" />
              <span><strong>Batch Class:</strong> {member.batch || 'No Batch'}</span>
            </div>
            <div className="flex items-center gap-3">
              <Mail className="w-4 h-4 text-navy-400 shrink-0" />
              <span>
                <strong>Email Address: </strong> 
                <a href={`mailto:${member.email}`} className="hover:underline text-navy-900 font-medium">{member.email || 'No email registered'}</a>
              </span>
            </div>
            <div className="flex items-center gap-3">
              <Phone className="w-4 h-4 text-navy-400 shrink-0" />
              <span>
                <strong>Phone Number: </strong> 
                <a href={`tel:${member.phone}`} className="hover:underline text-navy-900 font-mono">{member.phone || 'No Phone Registered'}</a>
              </span>
            </div>
            {member.bio && (
              <div className="flex items-start gap-3">
                <User className="w-4 h-4 text-navy-400 shrink-0 mt-0.5" />
                <span className="break-words"><strong>Biography:</strong> {member.bio}</span>
              </div>
            )}
            <div className="flex items-center gap-3">
              <User className="w-4 h-4 text-navy-400 shrink-0" />
              <span><strong>Joined Association:</strong> {member.created_at ? new Date(member.created_at).toLocaleDateString() : 'New'}</span>
            </div>
          </div>

          <button
            type="button"
            id="dossier_modal_close_btn"
            onClick={onClose}
            className="w-full py-2.5 bg-navy-950 text-gold-500 text-[10px] font-bold uppercase tracking-widest rounded-lg hover:bg-navy-900 transition-colors cursor-pointer"
          >
            Close Ledger
          </button>
        </div>
      </div>
    </div>
  );
}
