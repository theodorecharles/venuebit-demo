import { apiClient } from './client';
import { FeaturesResponse } from '../types/features';
import { HomescreenResponse } from '../types/homescreen';

export const featuresApi = {
  // Get all feature flags for a user
  getFeatures: async (userId: string, operatingSystem: string = 'desktop'): Promise<FeaturesResponse> => {
    const response = await apiClient.get(`/features/${userId}`, {
      params: { operating_system: operatingSystem },
    });
    return response.data;
  },

  // Get homescreen configuration
  getHomescreen: async (userId: string, operatingSystem: string = 'desktop'): Promise<HomescreenResponse> => {
    const response = await apiClient.get(`/homescreen/${userId}`, {
      params: { operating_system: operatingSystem },
    });
    return response.data;
  },

  // Track an event
  trackEvent: async (
    userId: string,
    eventKey: string,
    tags?: Record<string, string | number | boolean>
  ): Promise<void> => {
    await apiClient.post('/track', {
      userId,
      eventKey,
      tags,
    });
  },
};
