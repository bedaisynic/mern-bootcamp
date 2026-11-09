import { HttpError } from '@oms/server-kit';
import { getContext } from '@oms/oms-mock-adapters';
import type { ActionInput } from '@oms/shared-types';

export async function validateAction(orderId: string, input: ActionInput) {
  const {order, inventory, delivery} = await getContext(orderId);
  if (!order || !delivery) throw new HttpError(409, 'Required OMS context is unavailable');
  if (order.payment !== 'Captured') throw new HttpError(409, 'A captured payment is required');
  const checks = ['Order and payment confirmed'];
  let needsApproval = false;
  switch (input.action) {
    case 'RESCHEDULE_DELIVERY':
      if (!delivery.slots.some(slot => slot.id === input.slotId && slot.capacity > 0)) {
        throw new HttpError(409, 'The selected delivery window is no longer available');
      }
      checks.push('Carrier capacity and fulfillment release checked');
      break;
    case 'GOODWILL_CREDIT':
      if (!input.amount || input.amount > 150) throw new HttpError(409, 'Goodwill credits must be between $1 and $150');
      needsApproval = input.amount > 50;
      checks.push('Credit is within the $150 case limit');
      break;
    case 'REPLACE_ITEM':
      if (!inventory || inventory.sellable < order.quantity) throw new HttpError(409, 'Replacement inventory is unavailable');
      needsApproval = true;
      checks.push('Replacement stock confirmed');
      break;
    case 'REFUND_ORDER':
      if (!order.refundEligible || delivery.status !== 'Appointment missed') throw new HttpError(409, 'Order is ineligible for a refund');
      needsApproval = true;
      checks.push('Undelivered order is eligible for a full refund');
      break;
    case 'ESCALATE':
      needsApproval = true;
      checks.push('Manager review requires a supervisor decision');
      break;
  }
  checks.push(needsApproval ? 'Supervisor approval required' : 'Within agent authorization');
  return {checks, needsApproval};
}
