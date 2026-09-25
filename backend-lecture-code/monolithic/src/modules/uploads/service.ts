import { randomUUID } from "crypto";
import { CreateBucketCommand, HeadBucketCommand, PutObjectCommand } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";

import { s3Client, UPLOADS_BUCKET } from "./s3-client";
import type { PresignBody } from "./validation";

const PRESIGN_TTL_SECONDS = 60 * 5; // the link is only good for 5 minutes

// #demo-s3 — local dev only: real S3 buckets are created once, ahead of
// time (by Terraform, in this project — see infra/s3_frontend.tf), never by
// the app on the fly. localstack starts empty every time, so the app makes
// sure its bucket exists the first time anything tries to use it.
let bucketReady: Promise<void> | null = null;
async function ensureBucket(): Promise<void> {
  if (!bucketReady) {
    bucketReady = s3Client
      .send(new HeadBucketCommand({ Bucket: UPLOADS_BUCKET }))
      .catch(() => s3Client.send(new CreateBucketCommand({ Bucket: UPLOADS_BUCKET })))
      .then(() => undefined);
  }
  return bucketReady;
}

function objectUrlFor(key: string): string {
  // localstack (or MinIO): path-style URL straight at the emulator.
  // real S3: the bucket's regular virtual-hosted-style URL.
  if (process.env.S3_ENDPOINT) {
    return `${process.env.S3_ENDPOINT}/${UPLOADS_BUCKET}/${key}`;
  }
  return `https://${UPLOADS_BUCKET}.s3.${process.env.S3_REGION || "us-east-1"}.amazonaws.com/${key}`;
}

export const uploadsService = {
  // #demo-s3 — the server never touches the file's bytes. It only signs a
  // short-lived URL; the browser PUTs the file straight to S3 (or, here,
  // localstack) from there.
  async presign({ filename, contentType }: PresignBody) {
    await ensureBucket();

    const safeName = filename.replace(/[^a-zA-Z0-9._-]/g, "-");
    const key = `products/${randomUUID()}-${safeName}`;

    const uploadUrl = await getSignedUrl(
      s3Client,
      new PutObjectCommand({ Bucket: UPLOADS_BUCKET, Key: key, ContentType: contentType }),
      { expiresIn: PRESIGN_TTL_SECONDS },
    );

    return { uploadUrl, objectUrl: objectUrlFor(key), key };
  },
};
