import { initializeOptimizely } from './services/optimizelyService';
import { config } from './config';

let initialized = false;

export function ensureOptimizelyInitialized(): void {
  if (!initialized) {
    initializeOptimizely(config.optimizelySdkKey);
    initialized = true;
  }
}
