import { StateGraph, START, END } from '@langchain/langgraph';
import { investigationSchema } from '@oms/shared-schemas';
import { oms } from '@oms/oms-mock-adapters';
import { State } from './investigation.state.js';
import { analyze } from './investigation.nodes.js';
import { retrievePolicies } from '../services/rag.service.js';

export const graph = new StateGraph(State)
  .addNode('load_order', async state => ({order: await oms.getOrder(state.orderId)}))
  .addNode('load_inventory', async state => ({inventory: state.order ? await oms.getInventory(state.order.sku) : null}))
  .addNode('load_warehouse', async state => ({warehouse: await oms.getWarehouse(state.orderId)}))
  .addNode('load_delivery', async state => ({delivery: await oms.getDelivery(state.orderId)}))
  .addNode('load_policies', async state => ({policies: await retrievePolicies([state.issue, state.warehouse?.status, state.delivery?.status].join(' '))}))
  .addNode('analyze', async state => ({result: investigationSchema.parse(await analyze(state))}))
  .addEdge(START, 'load_order')
  .addEdge('load_order', 'load_inventory').addEdge('load_inventory', 'load_warehouse').addEdge('load_warehouse', 'load_delivery')
  .addEdge('load_delivery', 'load_policies').addEdge('load_policies', 'analyze').addEdge('analyze', END)
  .compile();
