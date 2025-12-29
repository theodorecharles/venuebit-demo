import React from 'react';
import { useLocation, useSearchParams } from 'react-router-dom';
import { useFeatureFlag } from '../../hooks/useFeatureFlag';
import { useUserId, generateNewUserId } from '../../hooks/useUserId';
import { useUserStore } from '../../store/userStore';
import { VariationBadge } from './VariationBadge';

export const DebugBanner: React.FC = () => {
  const userId = useUserId();
  const { variation } = useFeatureFlag();
  const { setUserId } = useUserStore();
  const location = useLocation();
  const [searchParams] = useSearchParams();

  // Hide banner - the iOS app has its own header
  return null;

  const handleNewUserId = () => {
    const newUserId = generateNewUserId();
    setUserId(newUserId);

    // Update URL with new userId
    const searchParams = new URLSearchParams(location.search);
    searchParams.set('userId', newUserId);

    // Reload the current page with new userId
    window.location.search = searchParams.toString();
  };

  return (
    <div className="bg-surface-light border-b border-border px-4 py-3 sticky top-0 z-50 shadow-lg">
      <div className="max-w-7xl mx-auto flex items-center justify-between flex-wrap gap-3">
        <div className="flex items-center gap-4 flex-wrap">
          {/* Logo */}
          <div className="flex items-center gap-2">
            <span className="logo-font text-2xl bg-gradient-to-r from-indigo-400 to-pink-400 bg-clip-text text-transparent">
              VenueBit
            </span>
          </div>

          <div className="h-6 w-px bg-border hidden sm:block" />

          <div className="flex items-center gap-2">
            <span className="text-text-secondary text-sm font-medium">User ID:</span>
            <code className="bg-background px-3 py-1 rounded text-primary text-sm font-mono">
              {userId || 'Not set'}
            </code>
          </div>

          <VariationBadge variation={variation} />
        </div>

        <button
          onClick={handleNewUserId}
          className="px-4 py-1.5 bg-primary hover:bg-primary-dark text-text-primary text-sm font-semibold rounded transition-colors"
        >
          New User ID
        </button>
      </div>
    </div>
  );
};
