import { createInstance, ReactSDKClient } from '@optimizely/react-sdk';

const OPTIMIZELY_SDK_KEY = import.meta.env.VITE_OPTIMIZELY_SDK_KEY || '';

if (!OPTIMIZELY_SDK_KEY) {
  console.warn('VITE_OPTIMIZELY_SDK_KEY is not set. Feature flags will not work.');
}

export const optimizelyClient: ReactSDKClient = createInstance({
  sdkKey: OPTIMIZELY_SDK_KEY,
  datafileOptions: {
    autoUpdate: true,
    updateInterval: 10000, // 10 seconds - more responsive for demo
  },
});

// Log when SDK is ready
optimizelyClient.onReady().then(() => {
  console.log('Optimizely SDK is ready');
});

// Function to force datafile refresh
export async function refreshOptimizelyDatafile(): Promise<void> {
  if (!OPTIMIZELY_SDK_KEY) return;

  try {
    const datafileUrl = `https://cdn.optimizely.com/datafiles/${OPTIMIZELY_SDK_KEY}.json`;
    const response = await fetch(datafileUrl, { cache: 'no-store' });
    if (response.ok) {
      const datafile = await response.json();
      // The React SDK doesn't have a direct setDatafile method exposed,
      // but we can access the underlying client
      const client = (optimizelyClient as any).client;
      if (client && typeof client.updateConfigFromData === 'function') {
        client.updateConfigFromData(datafile);
        console.log('[Optimizely] Datafile refreshed via WebSocket trigger');
      }
    }
  } catch (error) {
    console.error('[Optimizely] Failed to refresh datafile:', error);
  }
}
