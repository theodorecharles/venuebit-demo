import { Router, Request, Response } from 'express';
import { refreshDatafile } from '../services/optimizelyService';
import { broadcastDatafileUpdate } from '../services/websocketService';

const router = Router();

// POST /api/datafileUpdated - Webhook endpoint for Optimizely datafile updates
router.post('/datafileUpdated', async (_req: Request, res: Response) => {
  console.log('Received Optimizely datafile webhook');

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
