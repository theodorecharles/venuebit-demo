import React, { useEffect } from 'react';
import { useUserStore } from '../store/userStore';
import { useAppStore } from '../store/appStore';
import { useFeatureFlags } from '../context/FeatureFlagContext';
import { useTracking } from '../hooks/useTracking';
import { useDatafilePolling } from '../hooks/useDatafilePolling';
import { Card } from '../components/common/Card';
import { Button } from '../components/common/Button';
import { APP_VERSION, APP_NAME } from '../utils/constants';

export const SettingsPage: React.FC = () => {
  const userId = useUserStore((state) => state.userId);
  const generateNewUserId = useUserStore((state) => state.generateNewUserId);
  const trackedEvents = useAppStore((state) => state.trackedEvents);
  const clearTrackedEvents = useAppStore((state) => state.clearTrackedEvents);
  const clearOrders = useAppStore((state) => state.clearOrders);
  const { trackPageView } = useTracking();

  const {
    ticketExperienceEnabled,
    ticketExperienceVariation,
    showRecommendations,
    showUrgencyBanner,
    checkoutLayout,
    appTheme,
    homescreenModules,
    homescreenVariation,
    refresh,
  } = useFeatureFlags();

  const { isPolling } = useDatafilePolling();

  useEffect(() => {
    trackPageView('settings');
  }, [trackPageView]);

  const handleGenerateNewUserId = async () => {
    const newId = generateNewUserId();
    console.log('[Settings] Generated new user ID:', newId);
    // Refresh feature flags with new user ID
    await refresh();
  };

  const handleCopyUserId = () => {
    navigator.clipboard.writeText(userId);
    alert('User ID copied to clipboard!');
  };

  return (
    <div className="p-6 max-w-4xl mx-auto space-y-6">
        {/* User Identity Section */}
        <Card>
          <h2 className="text-lg font-semibold text-text-primary mb-4">User Identity</h2>
          <div className="space-y-4">
            <div>
              <label className="text-sm text-text-tertiary">Current User ID</label>
              <div className="flex items-center gap-2 mt-1">
                <code className="flex-1 bg-theme-surface-secondary px-3 py-2 rounded font-mono text-sm text-text-primary overflow-x-auto">
                  {userId}
                </code>
                <Button variant="ghost" size="sm" onClick={handleCopyUserId}>
                  📋 Copy
                </Button>
              </div>
            </div>
            <div className="flex gap-2">
              <Button variant="outline" onClick={handleGenerateNewUserId}>
                🔄 Generate New User ID
              </Button>
            </div>
            <p className="text-xs text-text-tertiary">
              Generating a new user ID will re-bucket you into different Optimizely variations
            </p>
          </div>
        </Card>

        {/* Feature Flags Section */}
        <Card>
          <h2 className="text-lg font-semibold text-text-primary mb-4">Feature Flags</h2>
          <div className="space-y-4">
            {/* Connection status */}
            <div className="flex items-center gap-2 text-sm">
              <div className={`w-2 h-2 rounded-full ${isPolling ? 'bg-success' : 'bg-error'}`} />
              <span className="text-text-secondary">
                Polling: {isPolling ? 'Active' : 'Inactive'}
              </span>
            </div>

            {/* App Theme */}
            <div className="p-3 bg-theme-surface-secondary rounded-lg">
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium text-text-primary">app_theme</p>
                  <p className="text-sm text-text-tertiary">Current theme setting</p>
                </div>
                <span className="px-3 py-1 rounded-full bg-primary text-white text-sm">
                  {appTheme}
                </span>
              </div>
            </div>

            {/* Ticket Experience */}
            <div className="p-3 bg-theme-surface-secondary rounded-lg">
              <div className="flex items-center justify-between mb-2">
                <div>
                  <p className="font-medium text-text-primary">ticket_experience</p>
                  <p className="text-sm text-text-tertiary">Enhanced ticket UI features</p>
                </div>
                <span className={`px-3 py-1 rounded-full text-sm ${
                  ticketExperienceEnabled ? 'bg-success text-white' : 'bg-text-tertiary text-white'
                }`}>
                  {ticketExperienceEnabled ? 'Enabled' : 'Disabled'}
                </span>
              </div>
              <div className="mt-2 space-y-1 text-sm">
                <p className="text-text-secondary">
                  Variation: <span className="text-text-primary">{ticketExperienceVariation}</span>
                </p>
                <div className="flex gap-4">
                  <span className={showRecommendations ? 'text-success' : 'text-text-tertiary'}>
                    {showRecommendations ? '✓' : '✗'} Recommendations
                  </span>
                  <span className={showUrgencyBanner ? 'text-success' : 'text-text-tertiary'}>
                    {showUrgencyBanner ? '✓' : '✗'} Urgency Banner
                  </span>
                  <span className="text-text-secondary">
                    Layout: {checkoutLayout}
                  </span>
                </div>
              </div>
            </div>

            {/* Homescreen Config */}
            <div className="p-3 bg-theme-surface-secondary rounded-lg">
              <div className="flex items-center justify-between mb-2">
                <div>
                  <p className="font-medium text-text-primary">venuebit_homescreen</p>
                  <p className="text-sm text-text-tertiary">Homescreen module configuration</p>
                </div>
                <span className="px-3 py-1 rounded-full bg-primary text-white text-sm">
                  {homescreenVariation}
                </span>
              </div>
              <div className="mt-2 text-sm">
                <p className="text-text-secondary mb-1">Modules:</p>
                <div className="flex flex-wrap gap-2">
                  {homescreenModules.map((module, idx) => (
                    <span key={idx} className="px-2 py-1 bg-theme-surface rounded text-xs text-text-primary">
                      {module.module}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </Card>

        {/* Tracked Events Section */}
        <Card>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-text-primary">
              Recent Tracked Events ({trackedEvents.length})
            </h2>
            {trackedEvents.length > 0 && (
              <Button variant="ghost" size="sm" onClick={clearTrackedEvents}>
                Clear
              </Button>
            )}
          </div>
          {trackedEvents.length === 0 ? (
            <p className="text-text-tertiary text-sm">No events tracked yet</p>
          ) : (
            <div className="space-y-2 max-h-64 overflow-y-auto">
              {trackedEvents.slice(0, 20).map((event, idx) => (
                <div key={idx} className="p-2 bg-theme-surface-secondary rounded text-sm">
                  <div className="flex items-center justify-between">
                    <span className="font-mono text-primary-light">{event.eventKey}</span>
                    <span className="text-xs text-text-tertiary">
                      {new Date(event.timestamp).toLocaleTimeString()}
                    </span>
                  </div>
                  {event.tags && Object.keys(event.tags).length > 0 && (
                    <p className="text-xs text-text-tertiary mt-1">
                      {JSON.stringify(event.tags)}
                    </p>
                  )}
                </div>
              ))}
            </div>
          )}
        </Card>

        {/* Data Management */}
        <Card>
          <h2 className="text-lg font-semibold text-text-primary mb-4">Data Management</h2>
          <div className="flex gap-2">
            <Button variant="outline" onClick={clearOrders}>
              🗑️ Clear Orders
            </Button>
            <Button variant="outline" onClick={clearTrackedEvents}>
              🗑️ Clear Tracked Events
            </Button>
          </div>
        </Card>

        {/* About Section */}
        <Card>
          <h2 className="text-lg font-semibold text-text-primary mb-4">About</h2>
          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-text-tertiary">App Name</span>
              <span className="text-text-primary">{APP_NAME}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-text-tertiary">Version</span>
              <span className="text-text-primary">{APP_VERSION}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-text-tertiary">Platform</span>
              <span className="text-text-primary">Web (Desktop)</span>
            </div>
          </div>
        </Card>
    </div>
  );
};
