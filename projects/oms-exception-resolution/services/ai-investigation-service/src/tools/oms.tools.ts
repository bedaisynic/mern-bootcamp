import { tool } from '@langchain/core/tools';
import { z } from 'zod';
import { oms } from '@oms/oms-mock-adapters';

export function toolsFor(orderId: string) {
  const schema = z.strictObject({});
  return [
    tool(() => oms.getOrder(orderId), {name: 'get_order', description: 'Read order and payment facts for this case', schema}),
    tool(async () => {
      const order = await oms.getOrder(orderId);
      return order ? oms.getInventory(order.sku) : null;
    }, {name: 'get_inventory', description: 'Read inventory facts for the order item', schema}),
    tool(() => oms.getWarehouse(orderId), {name: 'get_warehouse', description: 'Read outbound staging status', schema}),
    tool(() => oms.getDelivery(orderId), {name: 'get_delivery', description: 'Read the carrier appointment and available slots', schema}),
  ];
}
