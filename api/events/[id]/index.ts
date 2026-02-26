import type { VercelRequest, VercelResponse } from '@vercel/node';
import { cors } from '../../_lib/utils/cors';
import { ensureOptimizelyInitialized } from '../../_lib/initOptimizely';
import { getEvent } from '../../_lib/services/eventService';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (cors(req, res)) return;
  if (req.method !== 'GET') {
    return res.status(405).json({ success: false, error: 'Method not allowed' });
  }

  await ensureOptimizelyInitialized();

  try {
    const { id } = req.query;
    const event = getEvent(id as string);

    if (!event) {
      return res.status(404).json({
        success: false,
        error: 'Event not found'
      });
    }

    return res.json({
      success: true,
      data: event
    });
  } catch (error) {
    console.error('Error fetching event:', error);
    return res.status(500).json({
      success: false,
      error: 'Failed to fetch event'
    });
  }
}
