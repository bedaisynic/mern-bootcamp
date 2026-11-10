# AI-assisted order exception resolution

A full-stack case study for a shared order management workspace. The application opens the exception queue. Customer service agents open Pottery Barn case **EX-2048** after Emma Carter reports a missed delivery. All customers, policies, orders, and OMS operations are simulated.

## Run the application locally

Use Node.js 22 and npm.

```sh
npm install
npm run dev
```

Open [the exception workspace](http://127.0.0.1:5173/). The command starts Vite, the BFF, and both feature services. The default configuration runs the LangGraph investigation with deterministic AI output and policy retrieval, stores feature state in local JSON files, and delivers outbox events between the services over loopback HTTP. It requires zero API keys and no Docker, Kafka, or database installation.

In local mode, select **Sign out** in the top-right corner to open the **Shared OMS** sign-in page. Select **Sign in** to return as Sarah Chen.

1. Open EX-2048 from the queue, start the investigation and mark the recommendations reviewed.
2. Select **Goodwill credit**, enter **75**, add a reason, and validate the action.
3. Open **Approval**, switch to **Supervisor · Marcus Lee**, add a note, and approve.
4. Switch to **Agent · Sarah Chen**, open **Resolution Actions**, and execute.
5. Open **Customer Response**, generate and edit the draft, confirm review, and send.
6. Close the case and check the timeline. Reload the browser to confirm persistence.

The queue also includes **EX-2050** (ready to investigate), **EX-2051** (awaiting supervisor approval), **EX-2052** (resolved and ready for customer follow-up), and **EX-2053–EX-2056** (new, investigation ready for review, approval granted, and closed).

To try the path without supervisor approval, select **Reschedule delivery** and choose an available window.

The sidebar also includes **Dashboard**, **Orders**, **Inventory**, **Warehouse**, **Delivery**, **Reports**, and **Settings**. The operational views use a separate 30-day dataset. Orders, stock positions, outbound work, and shipments support read-only pagination. Dashboard and Reports aggregate that operational dataset. The order numbers used for call registration come from the separate intake catalog. Case changes happen in **Exceptions**.

## Test order lookup and address verification

Start the local application and open [Register call](http://127.0.0.1:5173/exceptions/new) as **Agent · Sarah Chen**. All names and addresses below are sample records.

| Scenario | Order to select | Street number | ZIP code | Expected result |
| --- | --- | --- | --- | --- |
| Create a case for Liam Mitchell | `PB-10254` | `214` | `94114` | **Create exception case** opens `EX-2057` |
| Try an address mismatch for Liam | `PB-10254` | `215` | `94114` | Mismatch message. The form stays on address verification. |
| Open Emma Carter's existing case | `PB-10245` | `128` | `94110` | **Open existing case** opens `EX-2048` |

1. In **Find order**, search for `liam.mitchell@example.com` or `(415) 555-0124`. The results show **PB-10254** and **PB-10258**. Use the order number and date to select **PB-10254**.
2. In **Verify address**, enter the street number and ZIP code. Try the mismatch in the table, then correct the street number to **214**. Successful verification displays the full delivery address and pre-fills the contact fields.
3. Enter at least 10 characters in **Call notes**, such as “Customer reported that the delivery window passed.” Click **Create exception case**. The workspace opens **EX-2057**, and the case now appears in **Exceptions**.
4. Repeat lookup and verification for **PB-10254**, or use **PB-10245** with Emma's details. The final screen offers **Open existing case**.

To repeat the new-case path from a clean local workspace, stop the app and run `npm run reset`, then `npm run dev`. Reset clears the local mock case history. To run only the intake browser test, stop the running application first and use `npm run test:e2e -- --grep 'registers a support call'` after installing Chromium as shown below.

## Sign in with Okta

1. In Okta Admin, create an **OIDC Single-Page Application** and enable **Authorization Code** and **Refresh Token**. Add `http://localhost:5173/login/callback` as the sign-in redirect URI and `http://localhost:5173/` as the sign-out redirect URI. Add `http://localhost:5173` under Trusted Origins for CORS and redirects. Open the workspace using that same origin. [Okta SPA setup](https://developer.okta.com/docs/guides/sign-into-spa-redirect/)
2. Create two groups, `OMS-Agents` and `OMS-Supervisors`. Assign your test users to the corresponding groups and give those groups access to the SPA.
3. Use an Okta **custom authorization server** (for example, `default`) with an API audience such as `api://oms-workspace`. Configure an access policy and rule allowing this client and its assigned users to use the Authorization Code and Refresh Token grants and request `openid profile email offline_access`. Add a `groups` claim to the **access token**, include it on all scopes, and filter groups with the regex `^(OMS-Agents|OMS-Supervisors)$`. The workspace uses Supervisor permissions when a user belongs to both groups. [Okta authorization servers](https://developer.okta.com/docs/concepts/api-access-management/) · [Okta groups claims](https://developer.okta.com/docs/guides/customize-tokens-groups-claim/)
4. Copy `.env.example` to `.env`, or update your existing `.env`. Set the values below and restart the app. The SPA uses Authorization Code with PKCE and requires no client secret. [Okta Auth JS redirect flow](https://developer.okta.com/docs/guides/auth-js-redirect/main/)

```dotenv
AUTH_MODE=okta
OKTA_ISSUER=https://your-okta-domain/oauth2/default
OKTA_CLIENT_ID=your-spa-client-id
OKTA_AUDIENCE=api://oms-workspace
```

Open [the workspace](http://localhost:5173/) and select **Sign in with Okta**. In Okta mode, role selection is managed in Okta and the local session endpoint is disabled. To try the approval flow, sign in as an Agent and register a case for an unused order, such as **PB-10258** (street number **214**, ZIP code **94114**). Submit an action that requires approval, sign in as a Supervisor to review it, then sign back in as the original Agent to continue. Existing cases keep their original owner.

## Run with PostgreSQL and Kafka

Stop any existing local application processes first. Docker Compose runs PostgreSQL with pgvector, Redpanda, and the three backend applications. Each service runs its own TypeORM migrations before startup. The baseline adopts existing tables and retains their case records, investigation results, policy vectors, and event history. EX-2048 is loaded lazily from its seed on first access.

```sh
npm install
docker compose up -d --build
npm run dev -w @oms/web
```

Frontend at [port 5173](http://127.0.0.1:5173/), Swagger at [port 4100](http://127.0.0.1:4100/api/docs/). To run migrations against a host-side PostgreSQL instance with pgvector, set `STORAGE_MODE=postgres` and `DATABASE_URL`, then run `npm run db:migrate -w @oms/resolution` and `npm run db:migrate -w @oms/ai`. Backend logs are available via `docker compose logs -f bff resolution investigation`. To reset the Compose workspace, run `docker compose down -v`, which deletes this Compose project's database and broker volumes.

For live AI, copy `.env.example` to `.env`, set `AI_MODE=live` and `OPENAI_API_KEY`, and recreate the investigation container. Compose injects PostgreSQL and Kafka settings independently from the local defaults. At startup the investigation service embeds the sample policies and indexes them before accepting events. The key stays in the investigation process. Model selection is configurable with `OPENAI_MODEL`.

## Verify

```sh
npm run build
npm test
npx playwright install chromium
npm run test:e2e
```

Playwright starts an isolated mock stack. Stop any existing services on ports 4100–4102 and 5173 first. Set `CHROME_PATH` to use a locally installed Chromium executable. Set `OMS_E2E_URL` to run the same browser scenario against a fresh external stack, including a Compose or native PostgreSQL/Kafka setup.

## Project guide

| Path | Contents |
| --- | --- |
| [apps/web](apps/web) | Exception queue and routed workspace views with MUI, React Query, Zustand, React Hook Form, and Zod |
| [apps/bff](apps/bff) | Local and Okta authentication, request validation, Swagger, and service routing |
| [services/order-resolution-service](services/order-resolution-service) | Workflow, business checks, approvals, execution, audit, and outbox |
| [services/ai-investigation-service](services/ai-investigation-service) | LangGraph, read-only tools, OpenAI, vector retrieval, and drafting |
| [packages](packages) | Shared contracts, mock OMS adapters, server utilities, and Kafka transport |
| [infrastructure](infrastructure) | Docker image, GitHub Actions template, and AWS deployment design |

The project follows the `final-evaluation/recipe-box` separation of Express app and server entry points, router/controller/service/repository responsibilities, common errors, and routed React feature components with CSS Modules. Each business service owns its own persistence. The BFF has no database.

See the [architecture](docs/architecture.md), [user flow](docs/user-flow.md), [AI workflow](docs/ai-workflow.md), [API contracts](docs/api-contracts.md), and [Kafka events](docs/kafka-events.md). The [GitHub Actions template](infrastructure/ci.yml) can be installed in the bootcamp repository’s root `.github/workflows/` directory. The [AWS plan](infrastructure/terraform/README.md) documents the production topology.
