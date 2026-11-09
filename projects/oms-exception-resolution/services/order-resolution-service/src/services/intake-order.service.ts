import { HttpError } from '@oms/server-kit';
import { deliveryAddresses, intakeOrders, oms } from '@oms/oms-mock-adapters';
import type { AddressVerification } from '@oms/shared-schemas';
import type { IntakeOrderMatch, VerifiedIntakeOrder } from '@oms/shared-types';
import { listCases } from '../repositories/case.repository.js';

type IntakeOrder = (typeof intakeOrders)[number];
const digits = (value: string) => value.replace(/\D/g, '');
const normalizeOrderId = (value: string) => value.toLowerCase().replace(/[^a-z0-9]/g, '');

async function summarize(order: IntakeOrder): Promise<IntakeOrderMatch> {
  const [details, delivery] = await Promise.all([oms.getOrder(order.orderId), oms.getDelivery(order.orderId)]);
  if (!details || !delivery) throw new HttpError(404, 'Order details were not found');
  return {orderId: order.orderId, customer: order.customer, item: details.item, placed: details.placed, deliveryStatus: delivery.status};
}

export async function searchIntakeOrders(query: string) {
  const term = query.toLowerCase();
  const orderKey = normalizeOrderId(query);
  const phone = digits(query);
  const matches = intakeOrders.filter(order =>
    (orderKey && normalizeOrderId(order.orderId).includes(orderKey)) ||
    order.customer.toLowerCase().includes(term) || order.email.toLowerCase().includes(term) ||
    (phone.length >= 4 && !/[a-z@]/i.test(term) && digits(order.phone).includes(phone)),
  );
  return Promise.all(matches.slice(0, 10).map(summarize));
}

export function requireVerifiedAddress(orderId: string, verification: AddressVerification) {
  const order = intakeOrders.find(candidate => candidate.orderId === orderId);
  const address = deliveryAddresses[orderId];
  if (!order || !address) throw new HttpError(404, 'Delivery order was not found');
  if (address.streetNumber.toLowerCase() !== verification.streetNumber.toLowerCase()
      || address.postalCode !== verification.postalCode.slice(0, 5)) {
    throw new HttpError(422, 'The street number and ZIP code do not match this order. Confirm both with the customer.');
  }
  return {order, address};
}

export async function verifyIntakeOrder(orderId: string, verification: AddressVerification): Promise<VerifiedIntakeOrder> {
  const {order, address} = requireVerifiedAddress(orderId, verification);
  const [summary, records] = await Promise.all([summarize(order), listCases()]);
  const existing = records.find(record => record.orderId === orderId);
  return {
    ...summary, email: order.email, caseId: existing?.id,
    address: `${address.streetNumber} ${address.street}, ${address.city}, ${address.state} ${address.postalCode}`,
  };
}
