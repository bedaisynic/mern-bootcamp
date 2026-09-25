import type { Request, Response } from "express";

import { getSecret } from "../../lib/config";

// #demo-secrets-manager (see DEMOS.md)
//
// This endpoint doesn't call any real AI API — no SDK is installed, no
// network request leaves this process. It exists purely to show the
// Secrets Manager retrieval pattern end to end: a "real" API key is read
// through getSecret() below exactly the way a genuine integration would,
// the only thing faked is what happens with it afterward.
const CANNED_REPLIES = [
  "That's a great question — have you tried turning it off and on again?",
  "Based on my analysis, the answer is probably 42.",
  "I'd recommend adding more tests, then more coffee, then more tests.",
  "Let me think about that... yes. Or no. Statistically, one of those.",
];

export const aiController = {
  async ask(req: Request, res: Response) {
    // #demo-secrets-manager — the whole point of this handler: fetch the
    // key the same way whether it's coming from .env (local) or Secrets
    // Manager (deployed). Nothing below this line ever sends it anywhere.
    const apiKey = await getSecret("CLAUDE_API_KEY");

    const reply = CANNED_REPLIES[Math.floor(Math.random() * CANNED_REPLIES.length)];

    res.json({
      reply,
      note: `(fake response — no AI was called; retrieved a key ending in "${apiKey.slice(-4)}" to prove the Secrets Manager path works)`,
    });
  },
};
