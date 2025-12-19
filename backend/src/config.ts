export interface Config {
  port: number;
  optimizelySdkKey: string;
  nodeEnv: string;
}

export const config: Config = {
  port: parseInt(process.env.PORT || '4001', 10),
  optimizelySdkKey: process.env.OPTIMIZELY_SDK_KEY || '',
  nodeEnv: process.env.NODE_ENV || 'development'
};
