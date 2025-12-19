import { Router, Request, Response } from 'express';
import { createCart, getCart, addItemToCart, removeItemFromCart } from '../services/cartService';

const router = Router();

router.post('/', (req: Request, res: Response) => {
  try {
    const { userId } = req.body;

    if (!userId) {
      return res.status(400).json({
        success: false,
        error: 'userId is required'
      });
    }

    const cart = createCart(userId);

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
});

router.get('/:cartId', (req: Request, res: Response) => {
  try {
    const { cartId } = req.params;
    const cart = getCart(cartId);

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
});

router.post('/:cartId/items', (req: Request, res: Response) => {
  try {
    const { cartId } = req.params;
    const { eventId, seatIds } = req.body;

    if (!eventId || !seatIds || !Array.isArray(seatIds) || seatIds.length === 0) {
      return res.status(400).json({
        success: false,
        error: 'eventId and seatIds (array) are required'
      });
    }

    const result = addItemToCart(cartId, eventId, seatIds);

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
});

router.delete('/:cartId/items/:itemId', (req: Request, res: Response) => {
  try {
    const { cartId, itemId } = req.params;

    const result = removeItemFromCart(cartId, itemId);

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
});

export default router;
