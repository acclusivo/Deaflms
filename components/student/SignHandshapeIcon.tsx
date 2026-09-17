'use client';

import React from 'react';
import { getSignImage } from '@/lib/fingerspell-signs';

interface SignHandshapeIconProps {
  letter: string;
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
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

  const sizeClasses = {
    xs: 'w-5 h-5',
    sm: 'w-7 h-7',
    md: 'w-11 h-11',
    lg: 'w-16 h-16',
    xl: 'w-24 h-24',
  }[size];

  if (signInfo.type === 'custom') {
    return (
      <div
        className={`relative ${sizeClasses} rounded-xl overflow-hidden shrink-0 flex items-center justify-center bg-slate-100 ${
          showBorder ? 'border border-slate-300 shadow-inner' : ''
        } ${className}`}
        title={`Sign for letter ${letter}: ${signInfo.details.name}`}
      >
        {/* Custom Uploaded Picture */}
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={signInfo.value}
          alt={`Sign for letter ${letter}`}
          className="w-full h-full object-cover"
        />
      </div>
    );
  }

  return (
    <div
      className={`relative ${sizeClasses} rounded-xl shrink-0 flex items-center justify-center ${
        showBorder ? 'bg-white border border-indigo-200 shadow-sm' : ''
      } ${className}`}
      title={`Sign for letter ${letter}: ${signInfo.details.name}`}
    >
      <svg
        viewBox="0 0 64 64"
        className="w-full h-full p-0.5"
        dangerouslySetInnerHTML={{ __html: signInfo.value }}
      />
    </div>
  );
};
