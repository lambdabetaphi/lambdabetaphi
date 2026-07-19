import React from 'react';
// @ts-ignore
import logoUrl from '../assets/images/crest_logo_1784430913041.jpg';

interface CrestLogoProps {
  className?: string;
  size?: number;
}

export default function CrestLogo({ className = '', size = 200 }: CrestLogoProps) {
  return (
    <img
      src={logoUrl}
      alt="Lambda Beta Phi Crest"
      width={size}
      height={size}
      style={{ width: size, height: size }}
      className={`object-contain select-none rounded-full border border-gold-500/10 shadow-sm ${className}`}
      referrerPolicy="no-referrer"
    />
  );
}
