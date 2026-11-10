import type { MigrationInterface, QueryRunner } from 'typeorm';

export class ResolutionBaseline1794009600000 implements MigrationInterface {
  async up(runner: QueryRunner) {
    // Adopt existing tables with the same schema, preserving their data.
    await runner.query(`CREATE TABLE IF NOT EXISTS "resolution"."OutboxEvent" (
        "id" TEXT NOT NULL,
        "payload" JSONB NOT NULL,
        "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
        "publishedAt" TIMESTAMP(3),

        CONSTRAINT "OutboxEvent_pkey" PRIMARY KEY ("id")
    )`);
    await runner.query(`CREATE TABLE IF NOT EXISTS "resolution"."ProcessedEvent" (
        "id" TEXT NOT NULL,
        "processedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

        CONSTRAINT "ProcessedEvent_pkey" PRIMARY KEY ("id")
    )`);
    await runner.query(`CREATE TABLE IF NOT EXISTS "resolution"."ResolutionCase" (
        "id" TEXT NOT NULL,
        "snapshot" JSONB NOT NULL,
        "revision" INTEGER NOT NULL DEFAULT 0,

        CONSTRAINT "ResolutionCase_pkey" PRIMARY KEY ("id")
    )`);
    await runner.query(`CREATE INDEX IF NOT EXISTS "OutboxEvent_publishedAt_createdAt_idx" ON "resolution"."OutboxEvent"("publishedAt", "createdAt")`);
  }

  async down() {
    throw new Error('The baseline may contain pre-existing OMS data and cannot be reverted');
  }
}
