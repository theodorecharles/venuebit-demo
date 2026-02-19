import type { VercelRequest, VercelResponse } from '@vercel/node';
import { cors } from './_lib/utils/cors';
import { ensureOptimizelyInitialized } from './_lib/initOptimizely';
import { searchEventsService } from './_lib/services/eventService';

export default function handler(req: VercelRequest, res: VercelResponse) {
  if (cors(req, res)) return;
  if (req.method !== 'GET') {
    return res.status(405).json({ success: false, error: 'Method not allowed' });
  }

  ensureOptimizelyInitialized();

  try {
    const query = req.query.q as string;

    if (!query || query.trim() === '') {
      return res.status(400).json({
        success: false,
        error: 'Search query is required'
      });
    }

    const results = searchEventsService(query);

    return res.json({
      success: true,
      data: results,
      count: results.length,
      query
    });
  } catch (error) {
    console.error('Error searching events:', error);
    return res.status(500).json({
      success: false,
      error: 'Failed to search events'
    });
  }
}
