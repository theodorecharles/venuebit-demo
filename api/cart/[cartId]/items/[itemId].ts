import type { VercelRequest, VercelResponse } from '@vercel/node';
import { cors } from '../../../_lib/utils/cors';
import { ensureOptimizelyInitialized } from '../../../_lib/initOptimizely';
import { removeItemFromCart } from '../../../_lib/services/cartService';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (cors(req, res)) return;
  if (req.method !== 'DELETE') {
    return res.status(405).json({ success: false, error: 'Method not allowed' });
  }

  await ensureOptimizelyInitialized();

  try {
    const { cartId, itemId } = req.query;

    const result = removeItemFromCart(cartId as string, itemId as string);

    if (!result.success) {
      return res.status(404).json({
        success: false,
        error: result.error
      });
    }

    return res.json({
      success: true,
      data: result.cart
    });
  } catch (error) {
    console.error('Error removing item from cart:', error);
    return res.status(500).json({
      success: false,
      error: 'Failed to remove item from cart'
    });
  }
}
