import type { VercelRequest, VercelResponse } from '@vercel/node';
import { cors } from './_lib/utils/cors';
import { ensureOptimizelyInitialized } from './_lib/initOptimizely';
import { trackEvent } from './_lib/services/optimizelyService';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (cors(req, res)) return;
  if (req.method !== 'POST') {
    return res.status(405).json({ success: false, error: 'Method not allowed' });
  }

  await ensureOptimizelyInitialized();

  try {
    const { userId, eventKey, tags } = req.body;

    if (!userId) {
      return res.status(400).json({
        success: false,
        error: 'userId is required'
      });
    }

    if (!eventKey) {
      return res.status(400).json({
        success: false,
        error: 'eventKey is required'
      });
    }

    trackEvent({ userId, eventKey, tags });

    return res.json({
      success: true,
      message: 'Event tracked successfully'
    });
  } catch (error) {
    console.error('Error tracking event:', error);
    return res.status(500).json({
      success: false,
      error: 'Failed to track event'
    });
  }
}
