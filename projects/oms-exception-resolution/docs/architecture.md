# Architecture

```mermaid
flowchart LR
  UI[React workspace] --> BFF[Express BFF]
  BFF --> R[Order Resolution Service]
  R -->|Read context and execute authorized operations| OMS[Existing OMS mock adapters]
  R --> RDB[(Resolution schema)]
  R -->|Draft request| AI[AI Investigation Service]
  RDB -->|Outbox relay| K[Kafka or local HTTP transport]
  K -->|Investigation request| AI
  AI -->|Read-only context| OMS
  AI -->|Live inference and embeddings| OAI[OpenAI]
  AI --> ADB[(Investigation schema and pgvector)]
  ADB -->|Outbox relay| K
  K -->|Investigation outcome| R
```

The resolution service owns the case workflow snapshot, approval, execution receipt, response, and timeline. One JSON aggregate keeps case transitions coherent and small for this single-case exercise. The investigation service owns outcome records and its policy index. Both store outbox events and consumer receipts in their own schemas. Services exchange data via HTTP and Kafka.

```mermaid
sequenceDiagram
  participant UI as React
  participant BFF
  participant R as Resolution
  participant K as Kafka
  participant AI as Investigation
  UI->>BFF: POST investigate with JWT
  BFF->>R: Authenticated internal command
  R-->>UI: Queued workspace via BFF
  R->>K: investigation.requested
  K->>AI: Dispatch case task
  AI->>K: investigation.completed or investigation.failed
  K->>R: Persist correlated outcome
  UI->>BFF: Poll workspace until final state
```

Each backend uses `app.ts`, `server.ts`, Express routers, and thin controllers. Shared server utilities supply JSON errors, internal request authentication, logging, and the local file repository. Application services own transition rules. Prisma repositories own transactions and query construction. The BFF delegates commands and returns the aggregated workspace.

## Identity

Local authentication issues two-hour HS256 JWTs for the two seeded identities. The BFF verifies issuer, audience, signature, and role shape. It forwards the authenticated actor over an internal route secured by a shared secret. The resolution service enforces role and state on each command. Only a supervisor may decide approval. Agent-only commands cover selection, execution, response and closure.

In Okta mode, the browser uses Okta Auth JS with Authorization Code and PKCE. The BFF validates the access token signature using the custom authorization server's JWKS, checks issuer, API audience, expiry and client ID, then maps the signed `groups` claim to an OMS role. It derives an actor ID from the issuer and Okta user ID (`uid`). The resolution service uses that ID to enforce case ownership, so agents with the same display name cannot act on each other's cases. Supervisor approval stays separate from the agent's execution of the approved action.

## Execution boundaries

Existing OMS integrations are deterministic adapters. Rescheduling updates the visible appointment and capacity, a refund updates payment eligibility, replacement reduces sellable stock, and a goodwill credit appears on the order summary. The case’s persisted workflow ID keys the simulated receipt.

In production, separate a durable execution intent from the external call, submit the workflow ID as an idempotency key, and reconcile unknown outcomes before allowing a new action. The local transaction serializes case changes and commits the outbox with the workflow. An external OMS operation and a database transaction have separate commit boundaries.
