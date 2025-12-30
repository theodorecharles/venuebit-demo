import { Router, Request, Response } from 'express';
import { refreshDatafile, isPollingEnabled } from '../services/optimizelyService';
import { broadcastDatafileUpdate } from '../services/websocketService';

const router = Router();

// POST /api/datafileUpdated - Webhook endpoint for Optimizely datafile updates
router.post('/datafileUpdated', async (_req: Request, res: Response) => {
  console.log('Received Optimizely datafile webhook');

  // If polling is enabled, ignore webhooks (polling handles updates)
  if (isPollingEnabled()) {
    console.log('[Webhook] Ignored - polling is enabled');
    res.json({ success: true, message: 'Webhook ignored - polling is enabled' });
    return;
  }

  const success = await refreshDatafile();

  if (success) {
    // Broadcast to all connected WebSocket clients
    broadcastDatafileUpdate();
    res.json({ success: true, message: 'Datafile refreshed successfully' });
  } else {
    res.status(500).json({ success: false, message: 'Failed to refresh datafile' });
  }
});

export default router;
