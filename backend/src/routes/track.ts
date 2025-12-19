import { Router, Request, Response } from 'express';
import { trackEvent } from '../services/optimizelyService';

const router = Router();

router.post('/', (req: Request, res: Response) => {
  try {
    const { userId, eventKey, tags } = req.body;

    if (!userId) {
      return res.status(400).json({
        success: false,
        error: 'userId is required'
      });
    }

    if (!eventKey) {
      return res.status(400).json({
        success: false,
        error: 'eventKey is required'
      });
    }

    trackEvent({ userId, eventKey, tags });

    return res.json({
      success: true,
      message: 'Event tracked successfully'
    });
  } catch (error) {
    console.error('Error tracking event:', error);
    return res.status(500).json({
      success: false,
      error: 'Failed to track event'
    });
  }
});

export default router;
