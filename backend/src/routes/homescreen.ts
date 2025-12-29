import { Router, Request, Response } from 'express';
import { getHomescreenDecision } from '../services/optimizelyService';

const router = Router();

router.get('/:userId', (req: Request, res: Response) => {
  try {
    const { userId } = req.params;

    if (!userId) {
      return res.status(400).json({
        success: false,
        error: 'userId is required'
      });
    }

    const decision = getHomescreenDecision(userId);

    return res.json({
      success: true,
      data: decision.modules,
      variationKey: decision.variationKey,
      enabled: decision.enabled
    });
  } catch (error) {
    console.error('Error fetching homescreen configuration:', error);
    return res.status(500).json({
      success: false,
      error: 'Failed to fetch homescreen configuration'
    });
  }
});

export default router;
