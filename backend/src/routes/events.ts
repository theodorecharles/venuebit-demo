import { Router, Request, Response } from 'express';
import { getEvents, getEvent, getEventSeats } from '../services/eventService';
import { EventCategory } from '../types/event';

const router = Router();

router.get('/', (req: Request, res: Response) => {
  try {
    const category = req.query.category as EventCategory | undefined;
    const featured = req.query.featured === 'true' ? true : req.query.featured === 'false' ? false : undefined;
    const limit = req.query.limit ? parseInt(req.query.limit as string) : undefined;
    const offset = req.query.offset ? parseInt(req.query.offset as string) : undefined;

    const events = getEvents({ category, featured, limit, offset });

    res.json({
      success: true,
      data: events,
      count: events.length
    });
  } catch (error) {
    console.error('Error fetching events:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch events'
    });
  }
});

router.get('/:id', (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const event = getEvent(id);

    if (!event) {
      return res.status(404).json({
        success: false,
        error: 'Event not found'
      });
    }

    return res.json({
      success: true,
      data: event
    });
  } catch (error) {
    console.error('Error fetching event:', error);
    return res.status(500).json({
      success: false,
      error: 'Failed to fetch event'
    });
  }
});

router.get('/:id/seats', (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const seats = getEventSeats(id);

    res.json({
      success: true,
      data: seats,
      count: seats.length
    });
  } catch (error) {
    console.error('Error fetching seats:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch seats'
    });
  }
});

export default router;
