import { randomUUID } from 'node:crypto';
import { env, log } from '@oms/server-kit';
import type { FeatureEvent } from '@oms/shared-types';
import { graph } from '../agents/investigation.graph.js';
import { hasResult, saveOutcome } from '../repositories/investigation.repository.js';

export async function receiveRequest(event: FeatureEvent) {
  if (event.topic !== 'investigation.requested' || await hasResult(event.correlationId)) return;
  const envelope = {id: randomUUID(), correlationId: event.correlationId, caseId: event.caseId, at: new Date().toISOString()};
  let outcome: FeatureEvent;
  try {
    if (env.aiMode === 'mock') await new Promise(resolve => setTimeout(resolve, 1200));
    const {result} = await graph.invoke(event.data);
    outcome = {...envelope, topic: 'investigation.completed', data: result};
  } catch (error) {
    log.error({err: error, correlationId: event.correlationId}, 'Investigation failed');
    outcome = {...envelope, topic: 'investigation.failed', data: {error: 'Investigation failed. Check the service configuration and retry.'}};
  }
  await saveOutcome(event.id, outcome);
}
