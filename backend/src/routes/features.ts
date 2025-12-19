import { Router, Request, Response } from 'express';
import { getFeatureDecisions } from '../services/optimizelyService';

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

    const decisions = getFeatureDecisions(userId);

    return res.json({
      success: true,
      data: decisions
    });
  } catch (error) {
    console.error('Error fetching feature decisions:', error);
    return res.status(500).json({
      success: false,
      error: 'Failed to fetch feature decisions'
    });
  }
});

export default router;
