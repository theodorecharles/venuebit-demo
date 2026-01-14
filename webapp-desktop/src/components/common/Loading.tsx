import React from 'react';

interface LoadingProps {
  message?: string;
  size?: 'sm' | 'md' | 'lg';
  fullPage?: boolean;
}

export const Loading: React.FC<LoadingProps> = ({
  message = 'Loading...',
  size = 'md',
  fullPage = false,
}) => {
  const sizeClasses = {
    sm: 'w-4 h-4 border-2',
    md: 'w-8 h-8 border-3',
    lg: 'w-12 h-12 border-4',
  };

  const content = (
    <div className="flex flex-col items-center justify-center gap-3">
      <div
        className={`${sizeClasses[size]} rounded-full border-primary border-t-transparent animate-spin`}
        style={{ borderTopColor: 'transparent' }}
      />
      {message && <p className="text-text-secondary text-sm">{message}</p>}
    </div>
  );

  if (fullPage) {
    return (
      <div className="flex items-center justify-center min-h-[50vh]">
        {content}
      </div>
    );
  }

  return content;
};
