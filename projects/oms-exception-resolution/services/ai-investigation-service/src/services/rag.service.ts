import { env } from '@oms/server-kit';
import { oms } from '@oms/oms-mock-adapters';
import { openai } from '../integrations/openai.js';
import { findPolicies, indexPolicies } from '../repositories/policy.repository.js';

async function embed(input: string[]) {
  const result = await openai().embeddings.create({model: 'text-embedding-3-small', dimensions: 1536, input});
  return result.data.sort((a, b) => a.index - b.index).map(item => item.embedding);
}
export async function retrievePolicies(query: string) {
  if (env.aiMode === 'mock') {
    return (await oms.getPolicies()).filter(policy => policy.policyId.startsWith('DELIVERY') || policy.policyId === 'CREDIT-001');
  }
  const [vector] = await embed([query]);
  return findPolicies(vector);
}
export async function seedPolicies() {
  const policies = await oms.getPolicies();
  const chunks = policies.flatMap(policy => policy.text.split(/(?<=\.)\s+/).map((text, index) => ({
    id: policy.policyId + '-' + index, policyId: policy.policyId, text,
  })));
  const embeddings = await embed(chunks.map(chunk => chunk.policyId + ' ' + chunk.text));
  await indexPolicies(policies, chunks.map((chunk, index) => ({...chunk, embedding: embeddings[index]})));
}
