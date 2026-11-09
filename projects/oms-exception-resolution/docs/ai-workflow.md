# AI investigation workflow

```mermaid
sequenceDiagram
  participant K as Event transport
  participant G as LangGraph
  participant T as Read-only OMS tools
  participant P as Policy index
  participant O as OpenAI
  K->>G: Correlated case, order, and issue
  G->>T: Load order, inventory, warehouse, delivery
  G->>P: Retrieve relevant sample policies
  opt Live mode
    P->>O: Embed case query
    P-->>G: Nearest pgvector chunks
    G->>O: Request read-only tool calls
    O-->>G: Function calls
    G->>T: Invoke allowlisted case-bound tools
    G->>O: Tool results and verified context
    O-->>G: Structured cause, action codes, and policy IDs
  end
  G->>G: Ground evidence, filter citations, validate output
  G-->>K: Persist result and stage outcome event
```

Sample policy documents are split into sentences, embedded with `text-embedding-3-small`, and stored as 1,536-dimensional vectors. Retrieval ranks by cosine distance. Policy text provides context for recommendations. Separate deterministic checks govern approvals and execution.

The model selects from a small case-study cause and action vocabulary. Evidence is rendered from verified tool data and policy references are intersected with retrieved records. A cause must agree with observed warehouse and carrier states. Missing evidence, unsupported actions, or a model refusal can produce a manual-review recommendation. Transport and service errors produce a failed investigation that the agent can retry.

The live integration uses strict function definitions and a strict Chat Completions response schema, then validates the result with Zod. [OpenAI function calling](https://developers.openai.com/api/docs/guides/function-calling), [OpenAI Structured Outputs](https://developers.openai.com/api/docs/guides/structured-outputs?api-mode=chat)

Drafting receives the execution summary and reference. It has no notification or modification tools. Agent confirmation is required before the resolution service calls the mock notification adapter.
