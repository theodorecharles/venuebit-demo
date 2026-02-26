import { initializeOptimizely, getClientReadyPromise } from './services/optimizelyService';
import { config } from './config';

let initialized = false;

export async function ensureOptimizelyInitialized(): Promise<void> {
  if (!initialized) {
    initializeOptimizely(config.optimizelySdkKey);
    initialized = true;
  }

  const readyPromise = getClientReadyPromise();
  if (readyPromise) {
    const result = await readyPromise;
    if (!result.success) {
      console.warn('[Optimizely] SDK ready timed out, using defaults');
    }
  }
}
