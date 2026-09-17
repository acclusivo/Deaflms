import React from 'react';
import { UserRole } from '@/lib/types';
import { GraduationCap, BookOpen, ShieldCheck } from 'lucide-react';

interface RoleBadgeProps {
  role: UserRole;
  size?: 'sm' | 'md' | 'lg';
}

export const RoleBadge: React.FC<RoleBadgeProps> = ({ role, size = 'md' }) => {
  const configs = {
    student: {
      label: 'Student Portal',
      bg: 'bg-emerald-50 text-emerald-700 border-emerald-300',
      icon: <GraduationCap className={size === 'sm' ? 'w-3.5 h-3.5' : 'w-4 h-4'} />,
    },
    teacher: {
      label: 'Teacher Studio',
      bg: 'bg-indigo-50 text-indigo-700 border-indigo-300',
      icon: <BookOpen className={size === 'sm' ? 'w-3.5 h-3.5' : 'w-4 h-4'} />,
    },
    admin: {
      label: 'Admin Hub',
      bg: 'bg-amber-50 text-amber-800 border-amber-300',
      icon: <ShieldCheck className={size === 'sm' ? 'w-3.5 h-3.5' : 'w-4 h-4'} />,
    },
  };

  const config = configs[role];
  const sizeClasses = size === 'sm' ? 'px-2 py-0.5 text-xs' : 'px-3 py-1 text-sm';

  return (
    <span
      className={`inline-flex items-center gap-1.5 font-bold uppercase tracking-wider rounded-full border shadow-sm ${config.bg} ${sizeClasses}`}
    >
      {config.icon}
      {config.label}
    </span>
  );
};
