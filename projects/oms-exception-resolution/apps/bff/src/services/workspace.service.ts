import { env, internalRequest } from '@oms/server-kit';
import type { AddressVerification, Command, IntakeInput } from '@oms/shared-schemas';
import type { Actor, IntakeOrderMatch, VerifiedIntakeOrder } from '@oms/shared-types';
import type { Workspace } from '@oms/oms-mock-adapters';

const casesUrl = env.resolution + '/internal/cases';
const caseUrl = (id: string) => casesUrl + '/' + encodeURIComponent(id);
export const listQueue = () => internalRequest<Workspace[]>(casesUrl);
export const createCase = (actor: Actor, input: IntakeInput) =>
  internalRequest<{id: string; created: boolean}>(casesUrl, {actor, input});
export const getCase = (id: string) => internalRequest<Workspace>(caseUrl(id));
export const commandCase = (id: string, actor: Actor, command: Command) =>
  internalRequest<Workspace>(caseUrl(id) + '/commands', {actor, command});

const ordersUrl = env.resolution + '/internal/intake/orders';
export const findOrders = (query: string) =>
  internalRequest<IntakeOrderMatch[]>(ordersUrl + '?' + new URLSearchParams({q: query}));
export const verifyOrder = (id: string, input: AddressVerification) =>
  internalRequest<VerifiedIntakeOrder>(ordersUrl + '/' + encodeURIComponent(id) + '/verify', input);
