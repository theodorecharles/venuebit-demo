import { Router, Request, Response } from 'express';
import { getHomescreenConfiguration } from '../services/optimizelyService';

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

    const configuration = getHomescreenConfiguration(userId);

    return res.json({
      success: true,
      data: configuration
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
