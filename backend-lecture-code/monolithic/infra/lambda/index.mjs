// A deliberately tiny "hello world" Lambda for the lecture.
//
// Notes callback: the client is created OUTSIDE the handler, so it survives
// between warm invocations; only the handler body runs on every request.
const startedAt = new Date().toISOString();

export async function handler(event) {
  return {
    statusCode: 200,
    headers: { "content-type": "application/json" },
    body: JSON.stringify({
      message: "Hello from Lambda 👋",
      runtime: `nodejs ${process.version}`,
      coldStartAt: startedAt, // same value while the environment stays warm
      now: new Date().toISOString(),
    }),
  };
}
