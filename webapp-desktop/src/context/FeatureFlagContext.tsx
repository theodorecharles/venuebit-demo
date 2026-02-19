import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { useTheme } from './ThemeContext';
import { useUserStore } from '../store/userStore';
import { useDatafilePolling } from '../hooks/useDatafilePolling';
import { featuresApi } from '../api/features';
import { AppTheme, TicketExperienceVariables } from '../types/features';
import { HomescreenModule } from '../types/homescreen';

interface FeatureFlagState {
  // Ticket experience flags
  ticketExperienceEnabled: boolean;
  ticketExperienceVariation: string;
  showRecommendations: boolean;
  showUrgencyBanner: boolean;
  checkoutLayout: string;

  // App theme
  appTheme: AppTheme;

  // Homescreen configuration
  homescreenModules: HomescreenModule[];
  homescreenVariation: string;

  // Loading state
  isLoading: boolean;
  error: string | null;

  // Refresh function
  refresh: () => Promise<void>;
}

const defaultState: FeatureFlagState = {
  ticketExperienceEnabled: false,
  ticketExperienceVariation: 'control',
  showRecommendations: false,
  showUrgencyBanner: false,
  checkoutLayout: 'standard',
  appTheme: 'off',
  homescreenModules: [],
  homescreenVariation: 'control',
  isLoading: true,
  error: null,
  refresh: async () => {},
};

const FeatureFlagContext = createContext<FeatureFlagState>(defaultState);

export const FeatureFlagProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { setTheme } = useTheme();
  const userId = useUserStore((state) => state.userId);

  const [state, setState] = useState<Omit<FeatureFlagState, 'refresh'>>({
    ticketExperienceEnabled: false,
    ticketExperienceVariation: 'control',
    showRecommendations: false,
    showUrgencyBanner: false,
    checkoutLayout: 'standard',
    appTheme: 'off',
    homescreenModules: [],
    homescreenVariation: 'control',
    isLoading: true,
    error: null,
  });

  const fetchFeatures = useCallback(async () => {
    if (!userId) return;

    setState((prev) => ({ ...prev, isLoading: true, error: null }));

    try {
      // Fetch features and homescreen config in parallel
      const [featuresResponse, homescreenResponse] = await Promise.all([
        featuresApi.getFeatures(userId, 'desktop'),
        featuresApi.getHomescreen(userId, 'desktop'),
      ]);

      console.log('[FeatureFlags] Features response:', featuresResponse);
      console.log('[FeatureFlags] Homescreen response:', homescreenResponse);

      // The backend returns data.features.X structure
      const features = featuresResponse.data?.features;
      const ticketExp = features?.ticket_experience;
      const appThemeFeature = features?.app_theme;

      // Parse ticket experience variables
      const variables = ticketExp?.variables || {} as TicketExperienceVariables;
      const showRecommendations = variables.show_recommendations === true;
      const showUrgencyBanner = variables.show_urgency_banner === true;
      const checkoutLayout = variables.checkout_layout || 'standard';

      // Get theme from feature flag
      const validThemes: AppTheme[] = ['off', 'black', 'dark', 'beige', 'light'];
      const rawTheme = appThemeFeature?.variationKey || 'off';
      const appTheme: AppTheme = validThemes.includes(rawTheme as AppTheme)
        ? (rawTheme as AppTheme)
        : 'off';

      console.log('[FeatureFlags] Applying theme:', appTheme, 'from raw:', rawTheme);

      // Apply theme
      setTheme(appTheme);

      setState({
        ticketExperienceEnabled: ticketExp?.enabled || false,
        ticketExperienceVariation: ticketExp?.variationKey || 'control',
        showRecommendations,
        showUrgencyBanner,
        checkoutLayout,
        appTheme,
        homescreenModules: homescreenResponse.data || [],
        homescreenVariation: homescreenResponse.variationKey || 'control',
        isLoading: false,
        error: null,
      });
    } catch (error) {
      console.error('[FeatureFlags] Error fetching features:', error);
      setState((prev) => ({
        ...prev,
        isLoading: false,
        error: 'Failed to load feature flags',
      }));
    }
  }, [userId, setTheme]);

  // Fetch features on mount and when userId changes
  useEffect(() => {
    fetchFeatures();
  }, [fetchFeatures]);

  // Listen for datafile updates via polling and trigger refresh
  useDatafilePolling({
    onDatafileUpdate: fetchFeatures,
  });

  const value: FeatureFlagState = {
    ...state,
    refresh: fetchFeatures,
  };

  // Hide page until theme is loaded
  if (state.isLoading) {
    return (
      <div className="min-h-screen bg-theme-background" />
    );
  }

  return (
    <FeatureFlagContext.Provider value={value}>
      {children}
    </FeatureFlagContext.Provider>
  );
};

export const useFeatureFlags = (): FeatureFlagState => {
  const context = useContext(FeatureFlagContext);
  if (!context) {
    throw new Error('useFeatureFlags must be used within a FeatureFlagProvider');
  }
  return context;
};
