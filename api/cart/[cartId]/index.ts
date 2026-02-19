import type { VercelRequest, VercelResponse } from '@vercel/node';
import { cors } from '../../_lib/utils/cors';
import { ensureOptimizelyInitialized } from '../../_lib/initOptimizely';
import { getCart } from '../../_lib/services/cartService';

export default function handler(req: VercelRequest, res: VercelResponse) {
  if (cors(req, res)) return;
  if (req.method !== 'GET') {
    return res.status(405).json({ success: false, error: 'Method not allowed' });
  }

  ensureOptimizelyInitialized();

  try {
    const { cartId } = req.query;
    const cart = getCart(cartId as string);

    if (!cart) {
      return res.status(404).json({
        success: false,
        error: 'Cart not found'
      });
    }

    return res.json({
      success: true,
      data: cart
    });
  } catch (error) {
    console.error('Error fetching cart:', error);
    return res.status(500).json({
      success: false,
      error: 'Failed to fetch cart'
    });
  }
}
