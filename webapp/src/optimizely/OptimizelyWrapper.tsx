import React from 'react';
import { OptimizelyProvider } from '@optimizely/react-sdk';
import { optimizelyClient } from './client';
import { useUserStore } from '../store/userStore';

interface OptimizelyWrapperProps {
  children: React.ReactNode;
}

export const OptimizelyWrapper: React.FC<OptimizelyWrapperProps> = ({ children }) => {
  const { userId } = useUserStore();

  // Use userId as the Optimizely user ID, or 'anonymous' if not set
  const optimizelyUserId = userId || 'anonymous';

  return (
    <OptimizelyProvider
      optimizely={optimizelyClient}
      user={{
        id: optimizelyUserId,
      }}
      timeout={500}
    >
      {children}
    </OptimizelyProvider>
  );
};
