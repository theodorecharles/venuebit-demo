import type { VercelRequest, VercelResponse } from '@vercel/node';
import { cors } from './_lib/utils/cors';
import { ensureOptimizelyInitialized } from './_lib/initOptimizely';
import { refreshDatafile, isPollingEnabled } from './_lib/services/optimizelyService';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (cors(req, res)) return;
  if (req.method !== 'POST') {
    return res.status(405).json({ success: false, error: 'Method not allowed' });
  }

  ensureOptimizelyInitialized();

  console.log('Received Optimizely datafile webhook');

  if (isPollingEnabled()) {
    console.log('[Webhook] Ignored - polling is enabled');
    res.json({ success: true, message: 'Webhook ignored - polling is enabled' });
    return;
  }

  const success = await refreshDatafile();

  if (success) {
    res.json({ success: true, message: 'Datafile refreshed successfully' });
  } else {
    res.status(500).json({ success: false, message: 'Failed to refresh datafile' });
  }
}
