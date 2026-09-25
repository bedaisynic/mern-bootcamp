# thumbnail-resize

**Reference code — not deployed.** Read it, don't `apply` it; see the
top-level [`../README.md`](../README.md) for why.

## What it does

Triggered by S3's `ObjectCreated` event, the moment the presigned-upload
flow in `monolithic/src/modules/uploads` (`#demo-s3`) finishes writing a
product image. Downloads the original, resizes it to 200px wide with
`sharp`, and writes the result back to the same bucket under
`thumbnails/<original filename>`.

## Maps to the Notes

The "event-driven processing" bullet in the Lambda section: *"the moment a
user uploads a photo, a Lambda function can resize it — nobody has to
trigger anything by hand."* This is that, made concrete.

It also demonstrates the existing Lambda **Key ideas** from the Notes —
read the comments in `handler.mjs` for exactly where:

- **Cold start** — the `S3Client` is created once, outside the handler, so
  only the first invocation after a cold start pays to set it up.
- **Stateless by design** — nothing persists between invocations except
  that one client; everything else comes from the event or gets re-fetched
  from S3.

## Running it locally, without deploying anything

This needs `monolithic`'s `localstack` container up (`docker-compose up -d
localstack` from `monolithic/`) and a product image already uploaded
through the `#demo-s3` flow — see `monolithic/DEMOS.md`.

```bash
npm install
AWS_ENDPOINT_URL_S3=http://localhost:4566 \
AWS_ACCESS_KEY_ID=lecture \
AWS_SECRET_ACCESS_KEY=lecture12345 \
AWS_REGION=us-east-1 \
node -e "
import('./handler.mjs').then(({ handler }) =>
  handler({
    Records: [{
      s3: {
        bucket: { name: 'product-images' },
        object: { key: 'products/<key-from-the-upload-response>' },
      },
    }],
  }).then(console.log)
);
"
```

The `AWS_ENDPOINT_URL_S3` env var is how the SDK finds localstack instead of
real S3 — a real deployment sets none of these four variables at all, and
the exact same `handler.mjs` talks straight to AWS with credentials from the
Lambda's IAM role. Verified working: uploading a 400×300 test PNG through
the real `#demo-s3` flow and running this produces a genuine 200×150
`thumbnails/<key>` object back in the bucket.
