// Webhook Lambda: receives a one-off notification from an outside service
// (here, a fake payment processor) through a Function URL or API Gateway.
//
// Reference code — not deployed as part of this repo's Terraform (see
// ../README.md for why). Maps to the "webhook handlers" bullet in the
// Notes' Lambda section — and the point of THIS function specifically is
// the traffic shape, not the logic inside it. Read that section of the
// README before the code; it matters more here than in thumbnail-resize.

const KNOWN_EVENT_TYPES = new Set(["payment.succeeded", "payment.failed"]);

export async function handler(event) {
  let body;
  try {
    body = JSON.parse(event.body ?? "{}");
  } catch {
    return { statusCode: 400, body: JSON.stringify({ error: "invalid JSON body" }) };
  }

  const { type, orderId } = body;
  if (!KNOWN_EVENT_TYPES.has(type) || typeof orderId !== "number") {
    return {
      statusCode: 400,
      body: JSON.stringify({ error: `expected {type: one of ${[...KNOWN_EVENT_TYPES]}, orderId: number}` }),
    };
  }

  // a real version would call the monolithic API to move the order to
  // "completed" or flag it for follow-up — kept as a log line here since
  // this function is reference code, not a live integration.
  console.log(`[webhook] order ${orderId}: ${type} at ${new Date().toISOString()}`);

  return { statusCode: 200, body: JSON.stringify({ received: true }) };
}
