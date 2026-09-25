// Event-driven Lambda: triggered by S3's ObjectCreated event whenever the
// uploads flow in monolithic/src/modules/uploads (see #demo-s3) finishes
// writing a new product image. Resizes it and writes a thumbnail back
// alongside the original.
//
// Reference code — not deployed as part of this repo's Terraform (see
// ../README.md for why). Maps to the "event-driven processing" bullet in
// the Notes' Lambda section: "the moment a user uploads a photo, a Lambda
// function can resize it — nobody has to trigger anything by hand."

import { GetObjectCommand, PutObjectCommand, S3Client } from "@aws-sdk/client-s3";
import sharp from "sharp";

// Notes callback ("Key ideas" → Cold start): created ONCE per cold start,
// then reused by every warm invocation after that — this is the exact
// pattern shown in the Lambda CodeBlock in Notes.tsx. If this were created
// inside the handler instead, every single invocation would pay the cost
// of setting up a new client.
//
// forcePathStyle only matters for local testing against localstack (real
// S3 needs no override at all — see README.md "Running it locally").
const s3 = new S3Client({
  forcePathStyle: Boolean(process.env.AWS_ENDPOINT_URL_S3),
});

const THUMBNAIL_WIDTH = 200;

export async function handler(event) {
  // Notes callback ("Key ideas" → Stateless by design): nothing here
  // persists between invocations except what was set up above, outside the
  // handler. Everything this call needs comes from the event or gets
  // fetched fresh from S3 below.
  const record = event.Records[0];
  const bucket = record.s3.bucket.name;
  const key = decodeURIComponent(record.s3.object.key.replace(/\+/g, " "));

  // avoid an infinite loop: don't re-thumbnail a thumbnail
  if (key.startsWith("thumbnails/")) {
    return { statusCode: 200, body: "skipped (already a thumbnail)" };
  }

  const original = await s3.send(new GetObjectCommand({ Bucket: bucket, Key: key }));
  const originalBytes = await original.Body.transformToByteArray();

  const thumbnailBytes = await sharp(originalBytes)
    .resize({ width: THUMBNAIL_WIDTH })
    .toBuffer();

  const thumbnailKey = `thumbnails/${key.split("/").pop()}`;
  await s3.send(
    new PutObjectCommand({
      Bucket: bucket,
      Key: thumbnailKey,
      Body: thumbnailBytes,
      ContentType: original.ContentType,
    }),
  );

  return { statusCode: 200, body: `wrote ${thumbnailKey}` };
}
