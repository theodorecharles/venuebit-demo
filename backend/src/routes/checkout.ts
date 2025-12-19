import { Router, Request, Response } from 'express';
import { createOrder } from '../services/orderService';

const router = Router();

router.post('/', (req: Request, res: Response) => {
  try {
    const { cartId, userId, payment } = req.body;

    if (!cartId) {
      return res.status(400).json({
        success: false,
        error: 'cartId is required'
      });
    }

    if (!userId) {
      return res.status(400).json({
        success: false,
        error: 'userId is required'
      });
    }

    if (!payment || !payment.cardLast4) {
      return res.status(400).json({
        success: false,
        error: 'payment information with cardLast4 is required'
      });
    }

    const result = createOrder({ cartId, userId, payment });

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
});

export default router;
