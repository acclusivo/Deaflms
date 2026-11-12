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
      bg: 'bg-[#E6F4F6] text-[#065A63] border-[#CCEEF1]',
      icon: <GraduationCap className={size === 'sm' ? 'w-3.5 h-3.5' : 'w-4 h-4 text-[#087F8C]'} />,
    },
    parent: {
      label: 'Parent Portal',
      bg: 'bg-[#EEF2FF] text-[#3847AF] border-[#C7D2FE]',
      icon: <ShieldCheck className={size === 'sm' ? 'w-3.5 h-3.5' : 'w-4 h-4 text-[#3847AF]'} />,
    },
    teacher: {
      label: 'Facilitator Studio',
      bg: 'bg-[#F0F4FA] text-[#1B4EA7] border-[#ABB8D7]',
      icon: <BookOpen className={size === 'sm' ? 'w-3.5 h-3.5' : 'w-4 h-4 text-[#1B4EA7]'} />,
    },
    admin: {
      label: 'Admin Console',
      bg: 'bg-amber-50 text-amber-950 border-amber-300',
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
