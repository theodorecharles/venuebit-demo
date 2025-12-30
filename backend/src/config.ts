export interface Config {
  port: number;
  optimizelySdkKey: string;
  nodeEnv: string;
  pollingInterval: number | null; // null = disabled, >0 = interval in ms
}

function parsePollingInterval(): number | null {
  const value = process.env.POLLING_INTERVAL;
  if (value === undefined || value === '') {
    return null; // Not provided = disabled
  }
  const parsed = parseInt(value, 10);
  if (isNaN(parsed) || parsed < 0) {
    return null; // -1 or invalid = disabled
  }
  return parsed; // Positive number = interval in ms
}

export const config: Config = {
  port: parseInt(process.env.PORT || '4001', 10),
  optimizelySdkKey: process.env.OPTIMIZELY_SDK_KEY || '',
  nodeEnv: process.env.NODE_ENV || 'development',
  pollingInterval: parsePollingInterval()
};
