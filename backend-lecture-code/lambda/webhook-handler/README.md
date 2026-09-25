# webhook-handler

**Reference code — not deployed.** Read it, don't `apply` it; see the
top-level [`../README.md`](../README.md) for why.

## What it does

Simulates receiving a webhook from an outside payment processor — the kind
of one-off "here's what just happened" POST that Stripe, PayPal, or any
third-party service sends when something happens on *their* side, not
yours. Validates the payload shape and logs it. A real version would call
the `monolithic` API to move the order to `completed`; this stays a log
line since the function isn't wired up to anything live.

## The point of this one is the traffic shape, not the code

Compare it to `thumbnail-resize`: that one runs because of something *your
own app* did (a user uploaded a file, right now, in response to a click).
This one runs because of something happening on someone else's schedule
entirely — a payment provider doesn't call on a fixed interval, and it
doesn't warn you before a burst of transactions comes through.

That's exactly the shape Lambda is built for. Sizing a dedicated,
always-on server for this would mean paying for idle capacity almost all
the time — the server sits there waiting for a call that might not come
for hours, then has to handle five at once. Lambda scales to zero between
calls and to as many concurrent copies as needed the moment a burst
arrives, and the cost model (pay per invocation) matches the traffic
pattern instead of fighting it.

## Running it locally, without deploying anything

No AWS services involved — plain Node:

```bash
node -e "
import('./handler.mjs').then(async ({ handler }) => {
  console.log(await handler({
    body: JSON.stringify({ type: 'payment.succeeded', orderId: 601606 }),
  }));
});
"
```

Try an unrecognized `type`, a missing `orderId`, or malformed JSON to see
the validation branches.
