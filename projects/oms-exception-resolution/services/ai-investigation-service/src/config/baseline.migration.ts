import type { MigrationInterface, QueryRunner } from 'typeorm';

export class InvestigationBaseline1794009600000 implements MigrationInterface {
  async up(runner: QueryRunner) {
    // Adopt existing tables with the same schema, preserving their data.
    await runner.query(`CREATE EXTENSION IF NOT EXISTS vector WITH SCHEMA public`);
    await runner.query(`CREATE TABLE IF NOT EXISTS "investigation"."OutboxEvent" (
        "id" TEXT NOT NULL,
        "payload" JSONB NOT NULL,
        "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
        "publishedAt" TIMESTAMP(3),

        CONSTRAINT "OutboxEvent_pkey" PRIMARY KEY ("id")
    )`);
    await runner.query(`CREATE TABLE IF NOT EXISTS "investigation"."ProcessedEvent" (
        "id" TEXT NOT NULL,
        "processedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

        CONSTRAINT "ProcessedEvent_pkey" PRIMARY KEY ("id")
    )`);
    await runner.query(`CREATE TABLE IF NOT EXISTS "investigation"."Investigation" (
        "id" TEXT NOT NULL,
        "caseId" TEXT NOT NULL,
        "outcome" JSONB NOT NULL,

        CONSTRAINT "Investigation_pkey" PRIMARY KEY ("id")
    )`);
    await runner.query(`CREATE TABLE IF NOT EXISTS "investigation"."PolicyDocument" (
        "id" TEXT NOT NULL,
        "title" TEXT NOT NULL,
        "text" TEXT NOT NULL,

        CONSTRAINT "PolicyDocument_pkey" PRIMARY KEY ("id")
    )`);
    await runner.query(`CREATE TABLE IF NOT EXISTS "investigation"."PolicyChunk" (
        "id" TEXT NOT NULL,
        "policyId" TEXT NOT NULL,
        "text" TEXT NOT NULL,
        "embedding" public.vector(1536) NOT NULL,

        CONSTRAINT "PolicyChunk_pkey" PRIMARY KEY ("id"),
        CONSTRAINT "PolicyChunk_policyId_fkey" FOREIGN KEY ("policyId")
          REFERENCES "investigation"."PolicyDocument"("id") ON DELETE CASCADE ON UPDATE CASCADE
    )`);
    await runner.query(`CREATE INDEX IF NOT EXISTS "OutboxEvent_publishedAt_createdAt_idx" ON "investigation"."OutboxEvent"("publishedAt", "createdAt")`);
  }

  async down() {
    throw new Error('The baseline may contain pre-existing OMS data and cannot be reverted');
  }
}
