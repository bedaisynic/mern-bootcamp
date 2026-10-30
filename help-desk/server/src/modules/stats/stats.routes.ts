import { Router } from 'express';
import * as statsController from './stats.controller.js';

const router = Router();

router.get('/', statsController.getStats);
router.get('/recent', statsController.getRecent);

export default router;
