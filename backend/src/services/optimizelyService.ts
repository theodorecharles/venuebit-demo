import optimizely, { Client } from '@optimizely/optimizely-sdk';
import { HomescreenConfiguration, DEFAULT_HOMESCREEN_CONFIG } from '../types/homescreen';

let optimizelyClient: Client | null = null;

export function initializeOptimizely(sdkKey: string): void {
  if (!sdkKey) {
    console.warn('No Optimizely SDK key provided. Feature flags will use defaults.');
    return;
  }

  try {
    optimizelyClient = optimizely.createInstance({
      sdkKey,
      datafileOptions: {
        autoUpdate: true,
        updateInterval: 1000
      }
    });

    console.log('Optimizely SDK initialized successfully');
  } catch (error) {
    console.error('Failed to initialize Optimizely SDK:', error);
  }
}

export interface FeatureDecisions {
  ticket_experience: boolean;
  show_seat_preview: boolean;
  show_recommendations: boolean;
  checkout_layout: string;
  show_urgency_banner: boolean;
}

export function getFeatureDecisions(userId: string): FeatureDecisions {
  const defaults: FeatureDecisions = {
    ticket_experience: true,
    show_seat_preview: true,
    show_recommendations: true,
    checkout_layout: 'standard',
    show_urgency_banner: false
  };

  if (!optimizelyClient) {
    return defaults;
  }

  try {
    const user = optimizelyClient.createUserContext(userId);
    if (!user) {
      return defaults;
    }

    const ticketExperience = user.decide('ticket_experience');
    const enabled = ticketExperience.enabled;

    const decisions: FeatureDecisions = {
      ticket_experience: enabled,
      show_seat_preview: ticketExperience.variables['show_seat_preview'] as boolean ?? defaults.show_seat_preview,
      show_recommendations: ticketExperience.variables['show_recommendations'] as boolean ?? defaults.show_recommendations,
      checkout_layout: ticketExperience.variables['checkout_layout'] as string ?? defaults.checkout_layout,
      show_urgency_banner: ticketExperience.variables['show_urgency_banner'] as boolean ?? defaults.show_urgency_banner
    };

    return decisions;
  } catch (error) {
    console.error('Error getting feature decisions:', error);
    return defaults;
  }
}

export interface TrackEventParams {
  userId: string;
  eventKey: string;
  tags?: { [key: string]: string | number | boolean };
}

export function trackEvent(params: TrackEventParams): void {
  if (!optimizelyClient) {
    console.log(`[Mock Track] Event: ${params.eventKey}, User: ${params.userId}`, params.tags);
    return;
  }

  try {
    const user = optimizelyClient.createUserContext(params.userId);
    if (!user) {
      console.warn(`Failed to create user context for: ${params.userId}`);
      return;
    }
    user.trackEvent(params.eventKey, params.tags);
    console.log(`Tracked event: ${params.eventKey} for user: ${params.userId}`);
  } catch (error) {
    console.error('Error tracking event:', error);
  }
}

export function getOptimizelyClient(): Client | null {
  return optimizelyClient;
}

export function getHomescreenConfiguration(userId: string): HomescreenConfiguration {
  if (!optimizelyClient) {
    return DEFAULT_HOMESCREEN_CONFIG;
  }

  try {
    const user = optimizelyClient.createUserContext(userId);
    if (!user) {
      return DEFAULT_HOMESCREEN_CONFIG;
    }

    const decision = user.decide('venuebit_homescreen');

    if (!decision.enabled) {
      return DEFAULT_HOMESCREEN_CONFIG;
    }

    const configVariable = decision.variables['homescreen_configuration'];
    if (configVariable && typeof configVariable === 'string') {
      try {
        const parsed = JSON.parse(configVariable);
        // Handle wrapped object format: { modules: [...] }
        if (parsed.modules && Array.isArray(parsed.modules)) {
          return parsed.modules as HomescreenConfiguration;
        }
        // Handle direct array format
        if (Array.isArray(parsed)) {
          return parsed as HomescreenConfiguration;
        }
        console.warn('Invalid homescreen_configuration format, using defaults');
        return DEFAULT_HOMESCREEN_CONFIG;
      } catch {
        console.warn('Failed to parse homescreen_configuration variable, using defaults');
        return DEFAULT_HOMESCREEN_CONFIG;
      }
    }

    // If variable is already an object (from Optimizely JSON type)
    if (configVariable && typeof configVariable === 'object') {
      // Handle wrapped object format: { modules: [...] }
      const obj = configVariable as { modules?: HomescreenConfiguration };
      if (obj.modules && Array.isArray(obj.modules)) {
        return obj.modules;
      }
      // Handle direct array format
      if (Array.isArray(configVariable)) {
        return configVariable as HomescreenConfiguration;
      }
    }

    return DEFAULT_HOMESCREEN_CONFIG;
  } catch (error) {
    console.error('Error getting homescreen configuration:', error);
    return DEFAULT_HOMESCREEN_CONFIG;
  }
}
