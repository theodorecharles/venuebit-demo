import { Router, Request, Response } from 'express';
import { getOrder, getUserOrders } from '../services/orderService';

const router = Router();

router.get('/:orderId', (req: Request, res: Response) => {
  try {
    const { orderId } = req.params;
    const order = getOrder(orderId);

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
});

router.get('/users/:userId', (req: Request, res: Response) => {
  try {
    const { userId } = req.params;
    const orders = getUserOrders(userId);

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
});

export default router;
