import React from 'react';
import { useFeatureFlags } from '../../context/FeatureFlagContext';
import { useDatafilePolling } from '../../hooks/useDatafilePolling';
import { useUserStore } from '../../store/userStore';

export const Footer: React.FC = () => {
  const userId = useUserStore((state) => state.userId);
  const generateNewUserId = useUserStore((state) => state.generateNewUserId);
  const { appTheme, refresh } = useFeatureFlags();
  const { isPolling } = useDatafilePolling();

  const handleGenerateNewUser = async () => {
    generateNewUserId();
    await refresh();
  };

  return (
    <footer className="h-12 bg-theme-surface border-t border-theme flex items-center justify-between px-6">
      {/* Left side - Connection status */}
      <div className="flex items-center gap-4">
        {/* Polling status */}
        <div className="flex items-center gap-2">
          <div
            className={`w-2 h-2 rounded-full ${
              isPolling ? 'bg-success' : 'bg-error'
            }`}
          />
          <span className="text-xs text-text-tertiary">
            {isPolling ? 'Polling' : 'Offline'}
          </span>
        </div>

        {/* Generate new user button */}
        <button
          onClick={handleGenerateNewUser}
          className="p-1.5 rounded hover:bg-theme-surface-secondary transition-colors"
          title="Generate new user ID and refresh"
        >
          <span className="text-sm">🔄</span>
        </button>
      </div>

      {/* Center - Theme indicator */}
      <div className="flex items-center gap-2">
        <span className="text-xs text-text-tertiary">Theme:</span>
        <span className="text-xs px-2 py-0.5 rounded bg-theme-surface-secondary text-text-secondary">
          {appTheme}
        </span>
      </div>

      {/* Right side - User ID */}
      <div
        className="flex items-center gap-2 px-3 py-1 rounded bg-theme-surface-secondary cursor-help"
        title={`User ID: ${userId}`}
      >
        <span className="text-sm">👤</span>
        <span className="text-xs font-mono text-text-secondary max-w-24 truncate">
          {userId.slice(0, 12)}...
        </span>
      </div>
    </footer>
  );
};
