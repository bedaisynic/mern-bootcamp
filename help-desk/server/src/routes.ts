import { Router } from 'express';
import ticketRoutes from './modules/ticket/ticket.routes.js';
import userRoutes from './modules/user/user.routes.js';
import statsRoutes from './modules/stats/stats.routes.js';

const router = Router();

router.use('/tickets', ticketRoutes);
router.use('/users', userRoutes);
router.use('/stats', statsRoutes);

export default router;
