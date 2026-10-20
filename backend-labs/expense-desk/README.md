# Expense Desk

An expense-claims app for a company called Brightline. The app, the data and the tools already work.
What is missing is the AI that decides each claim. You build it in two parts: a **workflow** for
the routine claims and an **AI agent** for the unusual ones. Then you add the manager approval step.

```bash
npm install
cp .env.example .env    # paste your OPENAI_API_KEY
npm run dev             # API: http://localhost:3001   app: http://localhost:5173
npm run typecheck
```

Model calls use the OpenAI API and are billed to the account owning `OPENAI_API_KEY`.
The first workflow and read-only agent are implemented. Processing claims calls the OpenAI API; emails are saved drafts and payments are simulated in memory. Manager approval has no authentication in this lab.

## What exists today

- An inbox of 13 expense claims, a claim view with the receipt, and a "Process with AI" button.
- After processing: the decision, the amount, the rules, the email to the employee, and the payments.
- A form to submit your own claims, and "Reset data" to start over.
- `server/src/ai/workflow.ts` handles routine reviews; `server/src/ai/agent.ts` investigates unusual claims.
- A manager queue supports approval/payment and rejection. See `docs/design.md` for the first implementation and its limits.

## How much should the AI decide?

There is no single right AI design for this app. It depends on how much the business trusts the AI
to act on its own:

| Level                    | The AI                                                | A person                                               |
| ------------------------ | ----------------------------------------------------- | ------------------------------------------------------ |
| 1. Assist                | reads the claim, finds the evidence, recommends       | decides and pays every claim                           |
| 2. **Decide with gates** | decides and pays the claims the policy clearly covers | approves claims over $500, reviews claims the AI flags |
| 3. Fully autonomous      | decides and pays everything                           | only audits afterwards                                 |

**This lab builds level 2.** Level 1 wastes the AI on 400 boring claims a week; level 3 lets a model
send money nobody checked. The business brief spells out who decides what.

## Where each feature goes

| Feature                              | Endpoint                                           | Files you write                                                                                            |
| ------------------------------------ | -------------------------------------------------- | ---------------------------------------------------------------------------------------------------------- |
| The AI decision: workflow (part 1)   | `POST /api/claims/:id/process` (exists)            | `server/src/ai/workflow.ts`: `processClaim`, every claim starts here                                       |
| The AI decision: agent (part 2)      | the same endpoint, called from the workflow        | `server/src/ai/agent.ts`: `investigateClaim`, for the unusual claims                                       |
| Manager approval (human in the loop) | `POST /api/claims/:id/approve` and `/reject` (new) | `server/src/modules/claims/`: `claims.routes.ts`, `claims.controller.ts`, `claims.service.ts`              |
| The manager's review queue           | uses the two endpoints above                       | `client/src/api.ts` (two new calls), a new `client/src/components/ApprovalQueue.tsx`, wired into `App.tsx` |

The `process` endpoint is already wired: the "Process with AI" button calls it, and it runs your
`processClaim`. So for the AI decision you write code only in `server/src/ai/`; the approval
endpoints and the queue are new code in the claims module and the client.

## Your tasks

### 1. Design first

Read the [business brief](docs/business-brief.md) and the [policy](docs/policy.md), then fill in
[docs/design.md](docs/design.md): the steps, which claims the workflow handles, which ones go to the
agent, and why. Show it to a classmate before you build.

### 2. The workflow: `server/src/ai/workflow.ts`

Every claim starts in `processClaim`. Your code decides every step:

- checks the policy decides without judgment, in plain code (dates, missing receipt, ...),
- a route: is this claim routine or unusual?
- routine claims: decide with fixed steps (for example one forced tool call), apply the $500 rule,
  and pay approve/partial claims once with `tools.payClaim`,
- unusual claims: hand them to the agent with `investigateClaim(claimId)`.

### 3. The agent: `server/src/ai/agent.ts`

`investigateClaim` is for the claims whose steps you cannot write in advance, like a dinner that
looks split into small claims (C10) or a hotel with no matching trip (C11). The model decides what
to look at: a loop that calls the model with the read tools, runs the tools it asks for, and stops
when it reports a decision, with a turn cap.

### 4. Manager approval (human in the loop)

A claim over $500 must not be paid by the AI: `processClaim` returns `needs_approval` and pays
nothing. Build the gate:

- **Server** (`server/src/modules/claims/`): `POST /api/claims/:id/approve` pays the claim with
  `tools.payClaim`, exactly once even if called twice; `POST /api/claims/:id/reject` closes it
  without paying. Add the statuses you need to `ClaimStatus` in `server/src/types.ts`.
- **Client** (`client/src/`): an `ApprovalQueue` component listing the claims waiting for a
  manager, with the AI's summary and Approve / Reject buttons, calling two new functions in
  `api.ts`.

### 5. Try it on the inbox

Process all 13 claims in the app. In `docs/design.md`, write down each decision, which path it took
(workflow or agent), and anything you would change.

Hand in: `docs/design.md` and your code.

### Challenges (once everything works)

- **Evaluator loop:** check the email to the employee against a short rubric (polite, names the
  rule, says the amount) and rewrite it when it fails, with a round cap.
- **Parallel checks:** run the independent checks at the same time and compare the time.
- **Crash-safe runs:** save the run's state after each step, so a crash halfway resumes instead of
  starting over (and never pays twice).
- **Your own test claims:** submit three tricky claims with the form and see which path they take.

## Rules

- Use the provided `tools` for all data and `ai.responses.create` for all model calls. The model is
  `gpt-6-luna` by default; set `OPENAI_MODEL` in `.env` to use another OpenAI model.
- Do not change `server/src/tools`, `server/src/llm.ts` or `server/data`.
  Everything else is yours.
- Do not hard-code claim ids or answers. The system must work on claims it has not seen.

## Project map

| Path                        | What it is                                        |
| --------------------------- | ------------------------------------------------- |
| `server/src/ai/workflow.ts` | 👉 part 1: the workflow, where every claim starts |
| `server/src/ai/agent.ts`    | 👉 part 2: the agent, for the unusual claims      |
| `server/src/tools`          | the company data as tools, and `payClaim`         |
| `server/src/llm.ts`         | `ai.responses.create`, the model client           |
| `server/src/modules/claims` | the claims API (routes, controller, service)      |
| `server/data`               | the seed data and the policy                      |
| `client/src`                | the React app: `App.tsx`, `api.ts`, `components/` |

More: [architecture](docs/architecture.md), [tools](docs/tools.md).

## Validate the first implementation

Use Node.js 22 or newer. Run `npm run typecheck`, `npm run test -w server` (mocked OpenAI, no API charges), and `npm run build`. Set `OPENAI_API_KEY` in `.env` before reviewing real claims. Tests do not establish live model accuracy.
