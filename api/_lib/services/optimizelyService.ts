import optimizely, { Client } from '@optimizely/optimizely-sdk';
import { HomescreenConfiguration, DEFAULT_HOMESCREEN_CONFIG } from '../types/homescreen';
import { config } from '../config';
import { buildUserAttributes } from './userAttributesService';

let optimizelyClient: Client | null = null;
let currentSdkKey: string | null = null;
let lastDatafileRevision: string | null = null;
let pollingIntervalTimer: ReturnType<typeof setInterval> | null = null;
let clientReadyPromise: Promise<{ success: boolean; reason?: string }> | null = null;

export function isPollingEnabled(): boolean {
  return config.pollingInterval !== null && config.pollingInterval > 0;
}

export function initializeOptimizely(sdkKey: string): void {
  if (!sdkKey) {
    console.warn('No Optimizely SDK key provided. Feature flags will use defaults.');
    return;
  }

  currentSdkKey = sdkKey;

  try {
    optimizelyClient = optimizely.createInstance({
      sdkKey,
      datafileOptions: {
        autoUpdate: true,
        updateInterval: 10_000, // 10 seconds for responsive demo
      }
    });

    clientReadyPromise = optimizelyClient.onReady({ timeout: 3000 });
    console.log('Optimizely SDK initialized, waiting for datafile...');

    if (isPollingEnabled()) {
      startPolling();
    } else {
      console.log('[Optimizely] Using SDK auto-update for datafile changes');
    }
  } catch (error) {
    console.error('Failed to initialize Optimizely SDK:', error);
  }
}

function startPolling(): void {
  if (pollingIntervalTimer) {
    clearInterval(pollingIntervalTimer);
  }

  const intervalMs = config.pollingInterval!;
  console.log(`[Optimizely] Starting datafile polling (every ${intervalMs}ms)`);

  pollingIntervalTimer = setInterval(async () => {
    await checkForDatafileUpdate();
  }, intervalMs);
}

async function checkForDatafileUpdate(): Promise<void> {
  if (!currentSdkKey) return;

  try {
    const datafileUrl = `https://cdn.optimizely.com/datafiles/${currentSdkKey}.json`;
    const response = await fetch(datafileUrl);

    if (!response.ok) return;

    const datafile = await response.text();
    const parsed = JSON.parse(datafile);
    const newRevision = parsed.revision;

    if (lastDatafileRevision !== null && newRevision !== lastDatafileRevision) {
      console.log(`[Optimizely] Datafile changed! Revision: ${lastDatafileRevision} -> ${newRevision}`);

      optimizelyClient = optimizely.createInstance({
        sdkKey: currentSdkKey,
        datafile,
        datafileOptions: {
          autoUpdate: true,
          updateInterval: 10_000,
        }
      });
    }

    lastDatafileRevision = newRevision;
  } catch (error) {
    // Silently ignore polling errors to avoid log spam
  }
}

export function getLastDatafileRevision(): string | null {
  return lastDatafileRevision;
}

export async function refreshDatafile(): Promise<boolean> {
  if (!currentSdkKey) {
    console.warn('Cannot refresh datafile: No SDK key configured');
    return false;
  }

  try {
    const datafileUrl = `https://cdn.optimizely.com/datafiles/${currentSdkKey}.json`;
    const response = await fetch(datafileUrl);

    if (!response.ok) {
      console.error(`Failed to fetch datafile: ${response.status}`);
      return false;
    }

    const datafile = await response.text();
    const parsed = JSON.parse(datafile);
    lastDatafileRevision = parsed.revision;

    optimizelyClient = optimizely.createInstance({
      sdkKey: currentSdkKey,
      datafile,
      datafileOptions: {
        autoUpdate: true,
        updateInterval: 10_000,
      }
    });

    console.log('Optimizely datafile refreshed successfully via webhook');
    return true;
  } catch (error) {
    console.error('Error refreshing Optimizely datafile:', error);
    return false;
  }
}

export interface FeatureDecisions {
  ticket_experience: boolean;
  variation_key: string;
  show_recommendations: boolean;
  checkout_layout: string;
  show_urgency_banner: boolean;
}

export function getFeatureDecisions(userId: string, operatingSystem?: string): FeatureDecisions {
  const defaults: FeatureDecisions = {
    ticket_experience: true,
    variation_key: 'off',
    show_recommendations: true,
    checkout_layout: 'standard',
    show_urgency_banner: false
  };

  if (!optimizelyClient) {
    return defaults;
  }

  try {
    const attributes = buildUserAttributes(userId, operatingSystem);
    const user = optimizelyClient.createUserContext(userId, attributes);
    if (!user) {
      return defaults;
    }

    console.log(`[Optimizely] Feature decisions for user ${userId} with attributes:`, attributes);

    const ticketExperience = user.decide('ticket_experience');
    const enabled = ticketExperience.enabled;

    const decisions: FeatureDecisions = {
      ticket_experience: enabled,
      variation_key: ticketExperience.variationKey || 'off',
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

export function getClientReadyPromise() {
  return clientReadyPromise;
}

export interface HomescreenDecision {
  enabled: boolean;
  variationKey: string;
  modules: HomescreenConfiguration;
}

export function getHomescreenDecision(userId: string, operatingSystem?: string): HomescreenDecision {
  const defaultDecision: HomescreenDecision = {
    enabled: false,
    variationKey: 'off',
    modules: DEFAULT_HOMESCREEN_CONFIG
  };

  if (!optimizelyClient) {
    return defaultDecision;
  }

  try {
    const attributes = buildUserAttributes(userId, operatingSystem);
    const user = optimizelyClient.createUserContext(userId, attributes);
    if (!user) {
      return defaultDecision;
    }

    console.log(`[Optimizely] Homescreen decision for user ${userId} with attributes:`, attributes);

    const decision = user.decide('venuebit_homescreen');

    if (!decision.enabled) {
      return {
        enabled: false,
        variationKey: decision.variationKey || 'off',
        modules: DEFAULT_HOMESCREEN_CONFIG
      };
    }

    const configVariable = decision.variables['homescreen_configuration'];
    let modules = DEFAULT_HOMESCREEN_CONFIG;

    if (configVariable && typeof configVariable === 'string') {
      try {
        const parsed = JSON.parse(configVariable);
        if (parsed.modules && Array.isArray(parsed.modules)) {
          modules = parsed.modules as HomescreenConfiguration;
        } else if (Array.isArray(parsed)) {
          modules = parsed as HomescreenConfiguration;
        }
      } catch {
        console.warn('Failed to parse homescreen_configuration variable');
      }
    } else if (configVariable && typeof configVariable === 'object') {
      const obj = configVariable as { modules?: HomescreenConfiguration };
      if (obj.modules && Array.isArray(obj.modules)) {
        modules = obj.modules;
      } else if (Array.isArray(configVariable)) {
        modules = configVariable as HomescreenConfiguration;
      }
    }

    return {
      enabled: decision.enabled,
      variationKey: decision.variationKey || 'on',
      modules
    };
  } catch (error) {
    console.error('Error getting homescreen decision:', error);
    return defaultDecision;
  }
}

export type AppTheme = 'off' | 'black' | 'dark' | 'beige' | 'light';

export interface AppThemeDecision {
  enabled: boolean;
  variationKey: string;
  theme: AppTheme;
}

export function getAppThemeDecision(userId: string, operatingSystem?: string): AppThemeDecision {
  const defaultDecision: AppThemeDecision = {
    enabled: false,
    variationKey: 'off',
    theme: 'off'
  };

  if (!optimizelyClient) {
    return defaultDecision;
  }

  try {
    const attributes = buildUserAttributes(userId, operatingSystem);
    const user = optimizelyClient.createUserContext(userId, attributes);
    if (!user) {
      return defaultDecision;
    }

    console.log(`[Optimizely] App theme decision for user ${userId} with attributes:`, attributes);

    const decision = user.decide('app_theme');

    if (!decision.enabled) {
      return {
        enabled: false,
        variationKey: decision.variationKey || 'off',
        theme: 'off'
      };
    }

    const variationKey = decision.variationKey || 'off';
    const validThemes: AppTheme[] = ['off', 'black', 'dark', 'beige', 'light'];
    const theme: AppTheme = validThemes.includes(variationKey as AppTheme)
      ? (variationKey as AppTheme)
      : 'off';

    return {
      enabled: decision.enabled,
      variationKey,
      theme
    };
  } catch (error) {
    console.error('Error getting app theme decision:', error);
    return defaultDecision;
  }
}

export function getHomescreenConfiguration(userId: string, operatingSystem?: string): HomescreenConfiguration {
  if (!optimizelyClient) {
    return DEFAULT_HOMESCREEN_CONFIG;
  }

  try {
    const attributes = buildUserAttributes(userId, operatingSystem);
    const user = optimizelyClient.createUserContext(userId, attributes);
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
        if (parsed.modules && Array.isArray(parsed.modules)) {
          return parsed.modules as HomescreenConfiguration;
        }
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

    if (configVariable && typeof configVariable === 'object') {
      const obj = configVariable as { modules?: HomescreenConfiguration };
      if (obj.modules && Array.isArray(obj.modules)) {
        return obj.modules;
      }
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
