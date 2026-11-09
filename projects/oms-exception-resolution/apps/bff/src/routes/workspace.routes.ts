import { Router } from 'express';
import { authenticate } from '../middleware/auth.js';
import { demoSession, exceptionQueue, registerCall, runCommand, workspace } from '../controllers/workspace.controller.js';
export const router = Router();
router.post('/session', demoSession);
router.get('/cases', authenticate, exceptionQueue);
router.post('/cases', authenticate, registerCall);
router.get('/cases/:id', authenticate, workspace);
router.post('/cases/:id/commands', authenticate, runCommand);
