import type { VercelRequest, VercelResponse } from '@vercel/node';
import { cors } from '../_lib/utils/cors';
import { ensureOptimizelyInitialized } from '../_lib/initOptimizely';
import { getOrder } from '../_lib/services/orderService';

export default function handler(req: VercelRequest, res: VercelResponse) {
  if (cors(req, res)) return;
  if (req.method !== 'GET') {
    return res.status(405).json({ success: false, error: 'Method not allowed' });
  }

  ensureOptimizelyInitialized();

  try {
    const { orderId } = req.query;
    const order = getOrder(orderId as string);

    if (!order) {
      return res.status(404).json({
        success: false,
        error: 'Order not found'
      });
    }

    return res.json({
      success: true,
      data: order
    });
  } catch (error) {
    console.error('Error fetching order:', error);
    return res.status(500).json({
      success: false,
      error: 'Failed to fetch order'
    });
  }
}
