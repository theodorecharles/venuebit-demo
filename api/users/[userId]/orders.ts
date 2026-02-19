import type { VercelRequest, VercelResponse } from '@vercel/node';
import { cors } from '../../_lib/utils/cors';
import { ensureOptimizelyInitialized } from '../../_lib/initOptimizely';
import { getUserOrders } from '../../_lib/services/orderService';

export default function handler(req: VercelRequest, res: VercelResponse) {
  if (cors(req, res)) return;
  if (req.method !== 'GET') {
    return res.status(405).json({ success: false, error: 'Method not allowed' });
  }

  ensureOptimizelyInitialized();

  try {
    const { userId } = req.query;
    const orders = getUserOrders(userId as string);

    res.json({
      success: true,
      data: orders,
      count: orders.length
    });
  } catch (error) {
    console.error('Error fetching user orders:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch user orders'
    });
  }
}
