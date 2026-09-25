import { S3Client } from "@aws-sdk/client-s3";

// #demo-s3 — one client, created once at module load (not per-request) and
// reused for the life of the process. S3_ENDPOINT + forcePathStyle only
// exist for local dev, where this points at the localstack container
// instead of real S3. In a real deployment, S3_ENDPOINT is unset, the SDK
// talks to AWS directly, and credentials come from the EC2/Lambda's IAM
// role — not the access-key env vars below (see the Notes' "roles, not
// access keys" rule).
export const s3Client = new S3Client({
  region: process.env.S3_REGION || "us-east-1",
  endpoint: process.env.S3_ENDPOINT || undefined,
  forcePathStyle: Boolean(process.env.S3_ENDPOINT), // required for localstack/MinIO-style endpoints
  credentials: process.env.S3_ENDPOINT
    ? {
        accessKeyId: process.env.S3_ACCESS_KEY || "lecture",
        secretAccessKey: process.env.S3_SECRET_KEY || "lecture12345",
      }
    : undefined,
  // the SDK now auto-attaches a checksum header to every request by
  // default, including presigned URLs — but the browser doing a plain PUT
  // to that URL has no SDK and won't send one, so the request lands
  // unsigned-relative-to-the-checksum-the-URL-expects. WHEN_REQUIRED keeps
  // presigned uploads working with a plain `fetch(url, { method: "PUT" })`.
  requestChecksumCalculation: "WHEN_REQUIRED",
});

export const UPLOADS_BUCKET = process.env.S3_BUCKET || "product-images";
