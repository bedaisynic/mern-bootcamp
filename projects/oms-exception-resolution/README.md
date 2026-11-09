# AI-assisted order exception resolution

A runnable full-stack case study for a fictional Williams-Sonoma shared order management system. The demo opens the exception queue. Customer service agents open Pottery Barn case **EX-2048** after Emma Carter reports a missed delivery. All customers, policies, orders, and OMS operations are simulated.

## Run the interactive demo

Use Node.js 22 and npm.

```sh
npm install
npm run dev
```

Open [the exception workspace](http://127.0.0.1:5173/). The command starts Vite, the BFF, and both feature services. The default configuration runs the LangGraph investigation with deterministic AI output and policy retrieval, stores feature state in local files under `.demo/`, and delivers outbox events between the services over loopback HTTP. It requires zero API keys and no Docker, Kafka, or database installation.

1. Open EX-2048 from the queue, start the investigation and mark the recommendations reviewed.
2. Select **Goodwill credit**, enter **75**, add a reason, and validate the action.
3. Open **Approval**, switch to **Supervisor · Marcus Lee**, add a note, and approve.
4. Switch to **Agent · Sarah Chen**, open **Resolution Actions**, and execute.
5. Open **Customer Response**, generate and edit the draft, confirm review, and send.
6. Close the case and check the timeline. Reload the browser to confirm persistence.

The queue also includes **EX-2050** (ready to investigate), **EX-2051** (awaiting supervisor approval), **EX-2052** (resolved and ready for customer follow-up), and **EX-2053–EX-2056** (new, investigation ready for review, approval granted, and closed).

To demo phone intake, select **Register call** on the queue, choose **PB-10246**, enter fictional call notes, and submit. This opens **EX-2049** for Sarah. The demo allows one case per order and reopens the existing case on repeat registration.

To demo the path without supervisor approval, select **Reschedule delivery** and choose an available window. Stop the local processes and run `npm run reset` to reopen the case from its seed.

## Run with PostgreSQL and Kafka

Stop any existing local demo first. Docker Compose runs PostgreSQL with pgvector, Redpanda, and the three backend applications. Each service runs its own Prisma migration at startup. EX-2048 is loaded lazily from its seed on first access.

```sh
npm install
docker compose up -d --build
npm run dev -w @oms/web
```

Frontend at [port 5173](http://127.0.0.1:5173/), Swagger at [port 4100](http://127.0.0.1:4100/api/docs/). Backend logs are available via `docker compose logs -f bff resolution investigation`. To clear the Compose demo, run `docker compose down -v`, which deletes this Compose project's database and broker volumes.

For live AI, copy `.env.example` to `.env`, set `AI_MODE=live` and `OPENAI_API_KEY`, and recreate the investigation container. Compose injects PostgreSQL and Kafka settings independently from the quick demo defaults. At startup the investigation service embeds the fictional policies and indexes them before accepting events. The key stays in the investigation process. Model selection is configurable with `OPENAI_MODEL`.

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
| [apps/bff](apps/bff) | Demo authentication, request validation, Swagger, and service routing |
| [services/order-resolution-service](services/order-resolution-service) | Workflow, business checks, approvals, execution, audit, and outbox |
| [services/ai-investigation-service](services/ai-investigation-service) | LangGraph, read-only tools, OpenAI, vector retrieval, and drafting |
| [packages](packages) | Shared contracts, mock OMS adapters, server utilities, and Kafka transport |
| [infrastructure](infrastructure) | Docker image, GitHub Actions template, and AWS deployment design |

The project follows the `final-evaluation/recipe-box` separation of Express app and server entry points, router/controller/service/repository responsibilities, common errors, and routed React feature components with CSS Modules. Each business service owns its own persistence. The BFF has no database.

See the [architecture](docs/architecture.md), [user flow](docs/user-flow.md), [AI workflow](docs/ai-workflow.md), [API contracts](docs/api-contracts.md), and [Kafka events](docs/kafka-events.md). The [GitHub Actions template](infrastructure/ci.yml) can be installed in the bootcamp repository’s root `.github/workflows/` directory. The [AWS plan](infrastructure/terraform/README.md) documents the production topology.
