'use client';

import React, { useState } from 'react';
import { getSignImage } from '@/lib/fingerspell-signs';

interface SignHandshapeIconProps {
  letter: string;
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl' | '2xl' | 'keycap' | 'fill';
  className?: string;
  showBorder?: boolean;
}

export const SignHandshapeIcon: React.FC<SignHandshapeIconProps> = ({
  letter,
  size = 'md',
  className = '',
  showBorder = false,
}) => {
  const signInfo = getSignImage(letter);
  const [imgError, setImgError] = useState(false);

  const sizeClasses = {
    xs: 'w-7 h-7',
    sm: 'w-9 h-9',
    md: 'w-12 h-12',
    lg: 'w-16 h-16',
    xl: 'w-24 h-24',
    '2xl': 'w-32 h-32',
    keycap: 'w-9 h-9 sm:w-12 sm:h-12 md:w-13 md:h-13',
    fill: 'w-full h-full',
  }[size];

  // If using authentic AnySign ASL photo or custom uploaded photo
  if ((signInfo.type === 'photo' || signInfo.type === 'custom') && !imgError) {
    return (
      <div
        className={`relative ${sizeClasses} rounded-xl overflow-hidden shrink-0 flex items-center justify-center bg-white/95 ${
          showBorder ? 'border-2 border-indigo-200 shadow-sm' : ''
        } ${className}`}
        title={`ASL Handshape for letter ${letter}: ${signInfo.details.name}`}
      >
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={signInfo.value}
          alt={`ASL Sign for letter ${letter}`}
          onError={() => setImgError(true)}
          className="w-full h-full object-contain p-0.5 filter drop-shadow-md transition-transform duration-200"
          loading="eager"
        />
      </div>
    );
  }

  // High contrast SVG fallback
  return (
    <div
      className={`relative ${sizeClasses} rounded-xl shrink-0 flex items-center justify-center ${
        showBorder ? 'bg-white border-2 border-indigo-200 shadow-sm' : ''
      } ${className}`}
      title={`Sign for letter ${letter}: ${signInfo.details.name}`}
    >
      <svg
        viewBox="0 0 64 64"
        className="w-full h-full p-0.5"
        dangerouslySetInnerHTML={{ __html: signInfo.details.svgPath }}
      />
    </div>
  );
};
