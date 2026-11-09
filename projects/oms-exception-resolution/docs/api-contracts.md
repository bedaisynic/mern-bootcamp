# API contracts

The browser uses the same-origin Vite proxy at `/api`. The BFF serves Swagger at `/api/docs` and the [OpenAPI document](openapi.json). Obtain a demo JWT from `POST /api/session` with `{"role":"agent"}` or `{"role":"supervisor"}`. Send it in an `Authorization: Bearer` header on workspace requests.

`GET /api/cases` lists the seeded and registered exceptions. An agent can submit `POST /api/cases` with `orderId`, `customerName`, `email`, and `notes`. It returns the case ID and a `created` flag. A repeat request for the same demo order opens the existing case.

`GET /api/cases/EX-2048` returns the case, aggregated mock OMS context, current investigation and workflow, response, and audit timeline. `POST /api/cases/EX-2048/commands` accepts one command and returns the updated workspace.

| Command | Required payload | Role |
| --- | --- | --- |
| `investigate` | None | Agent |
| `review` | None | Agent |
| `select` | `input.action`, `input.reason`, action-specific `slotId` or `amount` | Agent |
| `approve` | `workflowId`, `input.decision` of `approved` or `rejected`, `input.note` | Supervisor |
| `execute` | `workflowId` of the validated action | Agent |
| `draft` | None | Agent |
| `send` | `input.text` and `input.confirmed: true` | Agent |
| `close` | None | Agent |

Responses use HTTP 400 for malformed payloads, 401 for missing or invalid authentication, 403 for disallowed roles, 404 for an unknown case, and 409 for unmet business rules or stale state. Errors have an `error` message. The service commands use the same schemas as the BFF.
