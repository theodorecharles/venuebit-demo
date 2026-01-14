import React from 'react';

interface CardProps {
  children: React.ReactNode;
  className?: string;
  padding?: 'none' | 'sm' | 'md' | 'lg';
  hover?: boolean;
  onClick?: () => void;
}

export const Card: React.FC<CardProps> = ({
  children,
  className = '',
  padding = 'md',
  hover = false,
  onClick,
}) => {
  const paddingClasses = {
    none: '',
    sm: 'p-3',
    md: 'p-4',
    lg: 'p-6',
  };

  const hoverClass = hover ? 'hover:bg-theme-surface-secondary cursor-pointer transition-colors' : '';
  const clickableClass = onClick ? 'cursor-pointer' : '';

  return (
    <div
      className={`bg-theme-surface rounded-lg border border-theme ${paddingClasses[padding]} ${hoverClass} ${clickableClass} ${className}`}
      onClick={onClick}
    >
      {children}
    </div>
  );
};
