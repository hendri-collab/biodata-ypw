import React from 'react';
import wahidiyahLogoImg from '../assets/images/wahidiyah_logo_emblem_1789928427083.jpg';

interface LogoProps {
  className?: string;
  size?: number;
  alt?: string;
}

export const WahidiyahLogo: React.FC<LogoProps> = ({
  className = '',
  size = 56,
  alt = 'Logo Resmi Yayasan Perjuangan Wahidiyah',
}) => {
  return (
    <div
      className={`relative inline-flex items-center justify-center shrink-0 aspect-square rounded-full overflow-hidden bg-black shadow-sm border border-emerald-700/50 select-none ${className}`}
      style={{ width: `${size}px`, height: `${size}px` }}
    >
      <img
        src={wahidiyahLogoImg}
        alt={alt}
        className="w-full h-full object-contain aspect-square rounded-full"
        referrerPolicy="no-referrer"
        loading="eager"
      />
    </div>
  );
};

