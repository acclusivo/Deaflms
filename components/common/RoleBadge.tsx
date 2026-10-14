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
      label: 'Learner Portal',
      bg: 'bg-teal-50 text-teal-900 border-teal-200',
      icon: <GraduationCap className={size === 'sm' ? 'w-3.5 h-3.5' : 'w-4 h-4 text-teal-700'} />,
    },
    teacher: {
      label: 'Facilitator Studio',
      bg: 'bg-slate-100 text-slate-800 border-slate-300',
      icon: <BookOpen className={size === 'sm' ? 'w-3.5 h-3.5' : 'w-4 h-4 text-slate-700'} />,
    },
    admin: {
      label: 'Admin Console',
      bg: 'bg-amber-50 text-amber-900 border-amber-300',
      icon: <ShieldCheck className={size === 'sm' ? 'w-3.5 h-3.5' : 'w-4 h-4 text-amber-800'} />,
    },
  };

  const config = configs[role];
  const sizeClasses = size === 'sm' ? 'px-2.5 py-0.5 text-xs' : 'px-3 py-1 text-xs';

  return (
    <span
      className={`inline-flex items-center gap-1.5 font-bold uppercase tracking-wider rounded-md border ${config.bg} ${sizeClasses}`}
    >
      {config.icon}
      <span>{config.label}</span>
    </span>
  );
};
