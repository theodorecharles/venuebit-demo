import express, { Express, Request, Response, NextFunction } from 'express';
import cors from 'cors';
import path from 'path';
import routes from './routes';

export function createApp(): Express {
  const app = express();

  app.use(cors({
    origin: '*',
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization']
  }));

  // Serve static files from public folder
  app.use('/images', express.static(path.join(__dirname, '../public/images')));

  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));

  app.use((req: Request, _res: Response, next: NextFunction) => {
    console.log(`${new Date().toISOString()} - ${req.method} ${req.path}`);
    next();
  });

  app.use('/api', routes);

  app.get('/', (_req: Request, res: Response) => {
    res.json({
      success: true,
      message: 'VenueBit API',
      version: '1.0.0',
      endpoints: {
        events: '/api/events',
        search: '/api/search',
        cart: '/api/cart',
        checkout: '/api/checkout',
        orders: '/api/orders',
        features: '/api/features/:userId',
        track: '/api/track',
        health: '/api/health'
      }
    });
  });

  app.use((_req: Request, res: Response) => {
    res.status(404).json({
      success: false,
      error: 'Endpoint not found'
    });
  });

  app.use((err: Error, _req: Request, res: Response, _next: NextFunction) => {
    console.error('Unhandled error:', err);
    res.status(500).json({
      success: false,
      error: 'Internal server error'
    });
  });

  return app;
}
