import type { Policy } from '@oms/oms-mock-adapters';
import { db, PolicyDocument } from '../config/database.js';

const vectorLiteral = (vector: number[]) => '[' + vector.join(',') + ']';
export async function indexPolicies(documents: Policy[], chunks: {id: string; policyId: string; text: string; embedding: number[]}[]) {
  if (!db) throw new Error('Policy indexing requires PostgreSQL');
  await db.transaction(async tx => {
    for (const {policyId: id, title, text} of documents) {
      await tx.upsert(PolicyDocument, {id, title, text}, ['id']);
    }
    for (const chunk of chunks) {
      await tx.query(`INSERT INTO "investigation"."PolicyChunk" ("id", "policyId", "text", "embedding")
        VALUES ($1, $2, $3, $4::public.vector)
        ON CONFLICT ("id") DO UPDATE SET "text" = EXCLUDED."text", "embedding" = EXCLUDED."embedding"`,
      [chunk.id, chunk.policyId, chunk.text, vectorLiteral(chunk.embedding)]);
    }
  });
}
export async function findPolicies(vector: number[]) {
  if (!db) throw new Error('Live RAG requires PostgreSQL');
  return db.query<Policy[]>(`SELECT doc."id" AS "policyId", doc."title", chunk."text"
    FROM "investigation"."PolicyChunk" chunk
    JOIN "investigation"."PolicyDocument" doc ON doc."id" = chunk."policyId"
    ORDER BY chunk."embedding" OPERATOR(public.<=>) $1::public.vector LIMIT 5`, [vectorLiteral(vector)]);
}
