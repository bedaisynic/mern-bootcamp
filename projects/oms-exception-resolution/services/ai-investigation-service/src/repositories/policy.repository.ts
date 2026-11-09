import { PrismaClient } from '../generated/index.js';
import { env } from '@oms/server-kit';
import type { Policy } from '@oms/oms-mock-adapters';

const db = env.database ? new PrismaClient() : undefined;
const vectorLiteral = (vector: number[]) => '[' + vector.join(',') + ']';
export async function indexPolicies(documents: Policy[], chunks: {id: string; policyId: string; text: string; embedding: number[]}[]) {
  if (!db) throw new Error('Policy indexing requires PostgreSQL');
  await db.$transaction(async tx => {
    for (const {policyId: id, title, text} of documents) {
      await tx.policyDocument.upsert({where: {id}, update: {title, text}, create: {id, title, text}});
    }
    for (const chunk of chunks) {
      await tx.$executeRaw`INSERT INTO "PolicyChunk" ("id", "policyId", "text", "embedding")
        VALUES (${chunk.id}, ${chunk.policyId}, ${chunk.text}, ${vectorLiteral(chunk.embedding)}::public.vector)
        ON CONFLICT ("id") DO UPDATE SET "text" = EXCLUDED."text", "embedding" = EXCLUDED."embedding"`;
    }
  });
}
export async function findPolicies(vector: number[]) {
  if (!db) throw new Error('Live RAG requires PostgreSQL');
  return db.$queryRaw<Policy[]>`SELECT doc."id" AS "policyId", doc."title", chunk."text"
    FROM "PolicyChunk" chunk JOIN "PolicyDocument" doc ON doc."id" = chunk."policyId"
    ORDER BY chunk."embedding" OPERATOR(public.<=>) ${vectorLiteral(vector)}::public.vector LIMIT 5`;
}
