# lambda/ — reference code, two Lambda use-case shapes

Two small, real, runnable functions — **not deployed as part of this
repo's Terraform**, and not meant to be. A genuine class exercise around
deploying a Lambda needs its own AWS account, API Gateway or Function URL,
and an IAM execution role; that's more setup than the payoff is worth here.
These exist to be *read and run locally*, each mapping to a different
"commonly used for" bullet from the Lambda section of the Day 15 Notes.

| Function | Maps to | Traffic shape |
| --- | --- | --- |
| [`thumbnail-resize/`](./thumbnail-resize) | "Event-driven processing" | Triggered by your own app (a user just uploaded a file) |
| [`webhook-handler/`](./webhook-handler) | "Webhook handlers" | Triggered by someone else's schedule — unpredictable, bursty |

Each folder has its own `README.md` with what it does, how it maps to the
Notes, and how to run it locally. `thumbnail-resize` has been verified
against a real upload through `monolithic`'s `#demo-s3` flow (see its
README for the exact command and result); `webhook-handler` needs nothing
but Node.

## Not the same thing as `monolithic/infra/lambda/`

This project also has a **real**, actually-deployable Lambda at
`monolithic/infra/lambda/index.mjs`, wired up in `monolithic/infra/lambda.tf`
as part of the full Terraform deploy described in `monolithic/infra/README.md`.
That one is a deliberately trivial "hello world" — its job is to prove the
deploy pipeline works (Function URL, IAM role, the works) so the lecture has
something real to point at, not to demonstrate a specific use case. These
two reference functions are the opposite: realistic logic, but never
deployed. Different jobs, worth not confusing.
