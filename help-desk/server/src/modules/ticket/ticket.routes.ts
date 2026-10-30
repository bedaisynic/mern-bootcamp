import { Router } from 'express';
import * as ticketController from './ticket.controller.js';

const router = Router();

router.get('/', ticketController.getAllTickets);
router.get('/:id', ticketController.getTicketById);
router.post('/', ticketController.createTicket);
router.put('/:id', ticketController.updateTicket);
router.patch('/:id/status', ticketController.updateTicketStatus);
router.delete('/:id', ticketController.deleteTicket);

export default router;
