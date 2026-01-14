import React from 'react';
import { Button } from './Button';

interface ErrorStateProps {
  title?: string;
  message: string;
  onRetry?: () => void;
}

export const ErrorState: React.FC<ErrorStateProps> = ({
  title = 'Something went wrong',
  message,
  onRetry,
}) => {
  return (
    <div className="flex flex-col items-center justify-center py-12 px-4 text-center">
      <span className="text-5xl mb-4">⚠️</span>
      <h3 className="text-lg font-semibold text-text-primary mb-2">{title}</h3>
      <p className="text-text-secondary text-sm mb-4 max-w-md">{message}</p>
      {onRetry && (
        <Button variant="outline" onClick={onRetry}>
          Try Again
        </Button>
      )}
    </div>
  );
};
