import type { VercelRequest, VercelResponse } from '@vercel/node';
import { cors } from '../_lib/utils/cors';
import { ensureOptimizelyInitialized } from '../_lib/initOptimizely';
import { createCart, addItemToCart } from '../_lib/services/cartService';

export default function handler(req: VercelRequest, res: VercelResponse) {
  if (cors(req, res)) return;
  if (req.method !== 'POST') {
    return res.status(405).json({ success: false, error: 'Method not allowed' });
  }

  ensureOptimizelyInitialized();

  try {
    const { userId, eventId, seatIds } = req.body;

    if (!userId) {
      return res.status(400).json({
        success: false,
        error: 'userId is required'
      });
    }

    const cart = createCart(userId);

    // If eventId and seatIds provided, add items in the same request
    if (eventId && seatIds && Array.isArray(seatIds) && seatIds.length > 0) {
      const result = addItemToCart(cart.id, eventId, seatIds);

      if (!result.success) {
        return res.status(400).json({
          success: false,
          error: result.error
        });
      }

      return res.status(201).json({
        success: true,
        data: result.cart
      });
    }

    return res.status(201).json({
      success: true,
      data: cart
    });
  } catch (error) {
    console.error('Error creating cart:', error);
    return res.status(500).json({
      success: false,
      error: 'Failed to create cart'
    });
  }
}
