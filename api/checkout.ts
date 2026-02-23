import type { VercelRequest, VercelResponse } from '@vercel/node';
import { cors } from './_lib/utils/cors';
import { ensureOptimizelyInitialized } from './_lib/initOptimizely';
import { createOrderFromCart } from './_lib/services/orderService';

export default function handler(req: VercelRequest, res: VercelResponse) {
  if (cors(req, res)) return;
  if (req.method !== 'POST') {
    return res.status(405).json({ success: false, error: 'Method not allowed' });
  }

  ensureOptimizelyInitialized();

  try {
    const { userId, cart, payment } = req.body;

    if (!userId) {
      return res.status(400).json({
        success: false,
        error: 'userId is required'
      });
    }

    if (!cart || !cart.items || cart.items.length === 0) {
      return res.status(400).json({
        success: false,
        error: 'cart with items is required'
      });
    }

    if (!payment || !payment.cardLast4) {
      return res.status(400).json({
        success: false,
        error: 'payment information with cardLast4 is required'
      });
    }

    const result = createOrderFromCart({ userId, cart, payment });

    if (!result.success) {
      return res.status(400).json({
        success: false,
        error: result.error
      });
    }

    return res.status(201).json({
      success: true,
      data: result.order
    });
  } catch (error) {
    console.error('Error processing checkout:', error);
    return res.status(500).json({
      success: false,
      error: 'Failed to process checkout'
    });
  }
}
