import { createApp } from './app';
import { config } from './config';
import { initializeOptimizely } from './services/optimizelyService';

function startServer(): void {
  initializeOptimizely(config.optimizelySdkKey);

  const app = createApp();

  app.listen(config.port, () => {
    console.log('='.repeat(60));
    console.log('VenueBit Backend Server');
    console.log('='.repeat(60));
    console.log(`Environment: ${config.nodeEnv}`);
    console.log(`Server running on port: ${config.port}`);
    console.log(`API available at: http://localhost:${config.port}/api`);
    console.log(`Optimizely SDK: ${config.optimizelySdkKey ? 'Configured' : 'Not configured (using defaults)'}`);
    console.log('='.repeat(60));
    console.log('Available endpoints:');
    console.log(`  GET    /api/events`);
    console.log(`  GET    /api/events/:id`);
    console.log(`  GET    /api/events/:id/seats`);
    console.log(`  GET    /api/search?q=query`);
    console.log(`  POST   /api/cart`);
    console.log(`  GET    /api/cart/:cartId`);
    console.log(`  POST   /api/cart/:cartId/items`);
    console.log(`  DELETE /api/cart/:cartId/items/:itemId`);
    console.log(`  POST   /api/checkout`);
    console.log(`  GET    /api/orders/:orderId`);
    console.log(`  GET    /api/users/:userId/orders`);
    console.log(`  GET    /api/features/:userId`);
    console.log(`  POST   /api/track`);
    console.log(`  GET    /api/health`);
    console.log('='.repeat(60));
  });
}

startServer();
