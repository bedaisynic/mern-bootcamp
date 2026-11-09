import { Annotation } from '@langchain/langgraph';
import type { Policy, oms } from '@oms/oms-mock-adapters';
import type { InvestigationResult } from '@oms/shared-types';

export const State = Annotation.Root({
  orderId: Annotation<string>(),
  issue: Annotation<string>(),
  order: Annotation<Awaited<ReturnType<typeof oms.getOrder>>>(),
  inventory: Annotation<Awaited<ReturnType<typeof oms.getInventory>>>(),
  warehouse: Annotation<Awaited<ReturnType<typeof oms.getWarehouse>>>(),
  delivery: Annotation<Awaited<ReturnType<typeof oms.getDelivery>>>(),
  policies: Annotation<Policy[]>(),
  result: Annotation<InvestigationResult>(),
});
export type InvestigationState = typeof State.State;
