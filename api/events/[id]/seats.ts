import type { VercelRequest, VercelResponse } from '@vercel/node';
import { cors } from '../../_lib/utils/cors';
import { ensureOptimizelyInitialized } from '../../_lib/initOptimizely';
import { getEventSeats } from '../../_lib/services/eventService';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (cors(req, res)) return;
  if (req.method !== 'GET') {
    return res.status(405).json({ success: false, error: 'Method not allowed' });
  }

  await ensureOptimizelyInitialized();

  try {
    const { id } = req.query;
    const seats = getEventSeats(id as string);

    res.json({
      success: true,
      data: seats,
      count: seats.length
    });
  } catch (error) {
    console.error('Error fetching seats:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch seats'
    });
  }
}
