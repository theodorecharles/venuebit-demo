import { Router } from 'express';
import eventsRouter from './events';
import searchRouter from './search';
import cartRouter from './cart';
import checkoutRouter from './checkout';
import ordersRouter from './orders';
import featuresRouter from './features';
import trackRouter from './track';
import homescreenRouter from './homescreen';
import datafileRouter from './datafile';

const router = Router();

router.use('/events', eventsRouter);
router.use('/search', searchRouter);
router.use('/cart', cartRouter);
router.use('/checkout', checkoutRouter);
router.use('/orders', ordersRouter);
router.use('/users/:userId/orders', (req, _res, next) => {
  req.params.userId = req.params.userId;
  next();
}, ordersRouter);
router.use('/features', featuresRouter);
router.use('/track', trackRouter);
router.use('/homescreen', homescreenRouter);
router.use('/', datafileRouter);

router.get('/health', (_req, res) => {
  res.json({
    success: true,
    message: 'VenueBit API is running',
    timestamp: new Date().toISOString()
  });
});

export default router;
