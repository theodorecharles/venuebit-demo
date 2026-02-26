import type { VercelRequest, VercelResponse } from '@vercel/node';
import { cors } from '../../../_lib/utils/cors';
import { ensureOptimizelyInitialized } from '../../../_lib/initOptimizely';
import { addItemToCart } from '../../../_lib/services/cartService';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (cors(req, res)) return;
  if (req.method !== 'POST') {
    return res.status(405).json({ success: false, error: 'Method not allowed' });
  }

  await ensureOptimizelyInitialized();

  try {
    const { cartId } = req.query;
    const { eventId, seatIds } = req.body;

    if (!eventId || !seatIds || !Array.isArray(seatIds) || seatIds.length === 0) {
      return res.status(400).json({
        success: false,
        error: 'eventId and seatIds (array) are required'
      });
    }

    const result = addItemToCart(cartId as string, eventId, seatIds);

    if (!result.success) {
      return res.status(400).json({
        success: false,
        error: result.error
      });
    }

    return res.json({
      success: true,
      data: result.cart
    });
  } catch (error) {
    console.error('Error adding item to cart:', error);
    return res.status(500).json({
      success: false,
      error: 'Failed to add item to cart'
    });
  }
}
