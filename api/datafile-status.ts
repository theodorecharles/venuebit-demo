import type { VercelRequest, VercelResponse } from '@vercel/node';
import { cors } from './_lib/utils/cors';
import { ensureOptimizelyInitialized } from './_lib/initOptimizely';
import { getLastDatafileRevision } from './_lib/services/optimizelyService';

export default function handler(req: VercelRequest, res: VercelResponse) {
  if (cors(req, res)) return;
  if (req.method !== 'GET') {
    return res.status(405).json({ success: false, error: 'Method not allowed' });
  }

  ensureOptimizelyInitialized();

  try {
    const revision = getLastDatafileRevision();

    res.json({
      success: true,
      revision,
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    console.error('Error fetching datafile status:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch datafile status'
    });
  }
}
