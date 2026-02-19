import type { VercelRequest, VercelResponse } from '@vercel/node';
import { cors } from '../_lib/utils/cors';
import { ensureOptimizelyInitialized } from '../_lib/initOptimizely';
import { getEvents } from '../_lib/services/eventService';
import { EventCategory } from '../_lib/types/event';

export default function handler(req: VercelRequest, res: VercelResponse) {
  if (cors(req, res)) return;
  if (req.method !== 'GET') {
    return res.status(405).json({ success: false, error: 'Method not allowed' });
  }

  ensureOptimizelyInitialized();

  try {
    const category = req.query.category as EventCategory | undefined;
    const featured = req.query.featured === 'true' ? true : req.query.featured === 'false' ? false : undefined;
    const limit = req.query.limit ? parseInt(req.query.limit as string) : undefined;
    const offset = req.query.offset ? parseInt(req.query.offset as string) : undefined;

    const events = getEvents({ category, featured, limit, offset });

    res.json({
      success: true,
      data: events,
      count: events.length
    });
  } catch (error) {
    console.error('Error fetching events:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch events'
    });
  }
}
