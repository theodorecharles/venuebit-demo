import { createInstance } from '@optimizely/react-sdk';

const OPTIMIZELY_SDK_KEY = import.meta.env.VITE_OPTIMIZELY_SDK_KEY || '';

if (!OPTIMIZELY_SDK_KEY) {
  console.warn('VITE_OPTIMIZELY_SDK_KEY is not set. Feature flags will not work.');
}

export const optimizelyClient = createInstance({
  sdkKey: OPTIMIZELY_SDK_KEY,
  datafileOptions: {
    autoUpdate: true,
    updateInterval: 300000, // 5 minutes
  },
});

// Log when SDK is ready
optimizelyClient.onReady().then(() => {
  console.log('Optimizely SDK is ready');
});
