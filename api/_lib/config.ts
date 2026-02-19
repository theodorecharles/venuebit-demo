export interface Config {
  optimizelySdkKey: string;
  nodeEnv: string;
  pollingInterval: number | null;
}

function parsePollingInterval(): number | null {
  const value = process.env.POLLING_INTERVAL;
  if (value === undefined || value === '') {
    return null;
  }
  const parsed = parseInt(value, 10);
  if (isNaN(parsed) || parsed < 0) {
    return null;
  }
  return parsed;
}

export const config: Config = {
  optimizelySdkKey: process.env.OPTIMIZELY_SDK_KEY || '',
  nodeEnv: process.env.NODE_ENV || 'development',
  pollingInterval: parsePollingInterval()
};
