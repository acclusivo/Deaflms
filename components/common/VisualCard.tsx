import React from 'react';

interface VisualCardProps {
  children: React.ReactNode;
  className?: string;
  onClick?: () => void;
  hoverEffect?: boolean;
}

export const VisualCard: React.FC<VisualCardProps> = ({
  children,
  className = '',
  onClick,
  hoverEffect = true,
}) => {
  return (
    <div
      onClick={onClick}
      className={`bg-white rounded-3xl border-2 border-slate-200 p-6 shadow-sm ${
        hoverEffect
          ? 'hover:border-indigo-400 hover:shadow-md hover:-translate-y-0.5 transition-all duration-200 cursor-pointer'
          : ''
      } ${className}`}
    >
      {children}
    </div>
  );
};
