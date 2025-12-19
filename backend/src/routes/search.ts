import { Router, Request, Response } from 'express';
import { searchEventsService } from '../services/eventService';

const router = Router();

router.get('/', (req: Request, res: Response) => {
  try {
    const query = req.query.q as string;

    if (!query || query.trim() === '') {
      return res.status(400).json({
        success: false,
        error: 'Search query is required'
      });
    }

    const results = searchEventsService(query);

    return res.json({
      success: true,
      data: results,
      count: results.length,
      query
    });
  } catch (error) {
    console.error('Error searching events:', error);
    return res.status(500).json({
      success: false,
      error: 'Failed to search events'
    });
  }
});

export default router;
