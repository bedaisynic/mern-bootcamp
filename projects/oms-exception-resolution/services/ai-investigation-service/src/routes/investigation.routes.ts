import { Router } from 'express';
import { internalOnly } from '@oms/server-kit';
import { postDraft, postEvent } from '../controllers/investigation.controller.js';
export const router = Router();
router.use(internalOnly);
router.post('/events', postEvent);
router.post('/draft', postDraft);
