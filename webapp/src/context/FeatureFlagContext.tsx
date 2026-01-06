import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { useDecision } from '@optimizely/react-sdk';
import { useWebSocket } from '../hooks/useWebSocket';
import { useTheme, AppTheme } from '../theme/ThemeContext';
import { FEATURE_FLAGS } from '../optimizely/features';
import { refreshOptimizelyDatafile } from '../optimizely/client';

interface FeatureFlagState {
  variation: string;
  isEnhanced: boolean;
  showUrgencyBanner: boolean;
  showRecommendations: boolean;
  appTheme: AppTheme;
  enabled: boolean;
  refreshKey: number;
}

interface FeatureFlagContextValue extends FeatureFlagState {
  refresh: () => void;
}

const FeatureFlagContext = createContext<FeatureFlagContextValue | null>(null);

export const FeatureFlagProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [refreshKey, setRefreshKey] = useState(0);
  const { lastMessage } = useWebSocket();

  // Listen for datafile updates from WebSocket
  useEffect(() => {
    if (lastMessage?.type === 'datafile_updated') {
      console.log('[FeatureFlag] Datafile updated, refreshing Optimizely SDK...');
      // Force the SDK to fetch the new datafile
      refreshOptimizelyDatafile().then(() => {
        // Trigger re-render after datafile is updated
        setRefreshKey(prev => prev + 1);
      });
    }
  }, [lastMessage]);

  const refresh = useCallback(() => {
    setRefreshKey(prev => prev + 1);
  }, []);

  return (
    <FeatureFlagContext.Provider value={{
      variation: 'control',
      isEnhanced: false,
      showUrgencyBanner: false,
      showRecommendations: false,
      appTheme: 'off',
      enabled: false,
      refreshKey,
      refresh
    }}>
      {/* Use key to force remount when datafile changes */}
      <FeatureFlagInner key={refreshKey} refreshKey={refreshKey} refresh={refresh}>
        {children}
      </FeatureFlagInner>
    </FeatureFlagContext.Provider>
  );
};

// Valid theme values from Optimizely
const validThemes: AppTheme[] = ['off', 'black', 'dark', 'beige', 'light'];

// Inner component that actually reads the feature flags
const FeatureFlagInner: React.FC<{
  children: React.ReactNode;
  refreshKey: number;
  refresh: () => void;
}> = ({ children, refreshKey, refresh }) => {
  const { setTheme } = useTheme();
  const [ticketDecision] = useDecision(FEATURE_FLAGS.TICKET_EXPERIENCE, {
    autoUpdate: true,
  });
  const [themeDecision] = useDecision(FEATURE_FLAGS.APP_THEME, {
    autoUpdate: true,
  });

  const variables = ticketDecision?.variables || {};
  const showUrgencyBanner = variables.show_urgency_banner === true || variables.show_urgency_banner === 'true';
  const showRecommendations = variables.show_recommendations === true || variables.show_recommendations === 'true';

  // Get theme from app_theme flag - the variation key IS the theme
  const rawTheme = themeDecision?.variationKey || 'off';
  const appTheme: AppTheme = validThemes.includes(rawTheme as AppTheme) ? (rawTheme as AppTheme) : 'off';

  // Debug: log the full theme decision
  useEffect(() => {
    console.log('[FeatureFlag] Theme decision:', {
      enabled: themeDecision?.enabled,
      variationKey: themeDecision?.variationKey,
      rawTheme,
      appTheme,
      fullDecision: JSON.stringify(themeDecision, null, 2)
    });
  }, [themeDecision, rawTheme, appTheme]);

  // Apply theme when it changes from feature flag
  useEffect(() => {
    console.log('[FeatureFlag] Setting theme to:', appTheme);
    setTheme(appTheme);
  }, [appTheme, setTheme]);

  const value: FeatureFlagContextValue = {
    variation: ticketDecision?.variationKey || 'control',
    isEnhanced: showUrgencyBanner,
    showUrgencyBanner,
    showRecommendations,
    appTheme,
    enabled: ticketDecision?.enabled || false,
    refreshKey,
    refresh,
  };

  // Log when flags change
  useEffect(() => {
    console.log('[FeatureFlag] Current state:', {
      variation: value.variation,
      showUrgencyBanner: value.showUrgencyBanner,
      showRecommendations: value.showRecommendations,
      appTheme: value.appTheme,
      enabled: value.enabled,
    });
  }, [value.variation, value.showUrgencyBanner, value.showRecommendations, value.appTheme, value.enabled]);

  return (
    <FeatureFlagContext.Provider value={value}>
      {children}
    </FeatureFlagContext.Provider>
  );
};

export const useFeatureFlagContext = (): FeatureFlagContextValue => {
  const context = useContext(FeatureFlagContext);
  if (!context) {
    throw new Error('useFeatureFlagContext must be used within a FeatureFlagProvider');
  }
  return context;
};
