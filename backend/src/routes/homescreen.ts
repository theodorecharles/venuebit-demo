import { Router, Request, Response } from 'express';
import { getHomescreenDecision } from '../services/optimizelyService';

const router = Router();

router.get('/:userId', (req: Request, res: Response) => {
  try {
    const { userId } = req.params;
    const { operating_system } = req.query;

    console.log(`[Homescreen] Request for user ${userId}, operating_system=${operating_system}`);

    if (!userId) {
      return res.status(400).json({
        success: false,
        error: 'userId is required'
      });
    }

    const os = typeof operating_system === 'string' ? operating_system : undefined;
    const decision = getHomescreenDecision(userId, os);

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
