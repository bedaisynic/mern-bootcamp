# What you get: tools and the model client

Everything below is already built. Import it from your code in `server/src/ai/`.

## `tools` (server/src/tools)

The only way to reach company data. Each tool works in both styles:

```ts
import { tools, readToolSchemas, payClaimSchema, runTool } from "../tools";
import { ai, toOpenAITools } from "../llm";

// In a workflow step: your code calls the function
const trips = tools.getTravelCalendar({ employeeId: "E01" });

// In an agent: give the model the schemas, then run what it asks for
const response = await ai.responses.create({
  max_output_tokens: 1000,
  tools: toOpenAITools(readToolSchemas),
  input: [{ role: "user", content: "Investigate this expense claim." }],
});
const toolResults = response.output.flatMap((item) => {
  if (item.type !== "function_call") return [];
  return [
    {
      type: "function_call_output" as const,
      call_id: item.call_id,
      output: runTool(item.name, JSON.parse(item.arguments)),
    },
  ];
});
// Continue only when the model requested tools. Add a turn cap in your agent.
if (toolResults.length > 0) {
  const next = await ai.responses.create({
    previous_response_id: response.id,
    input: toolResults,
    tools: toOpenAITools(readToolSchemas),
    max_output_tokens: 1000,
  });
}
```

| Tool                | Input                 | Returns                                                                          |
| ------------------- | --------------------- | -------------------------------------------------------------------------------- |
| `getClaim`          | `{ claimId }`         | the claim: employee id, amount, dates, note, receipt text (`""` = no receipt)    |
| `getEmployee`       | `{ employeeId }`      | name, title, department, home city, manager id and name                          |
| `getPolicy`         | `{ topic? }`          | every rule, or only the rules for one topic (`meals`, `hotels`, `receipts`, ...) |
| `getPastClaims`     | `{ employeeId }`      | claims this employee was already paid for                                        |
| `getTravelCalendar` | `{ employeeId }`      | the employee's work trips: city, first and last day                              |
| `payClaim`          | `{ claimId, amount }` | sends money and returns the payment. **Calling it twice pays twice.**            |

- Tools throw a `ToolError` when something is wrong (unknown id, paying more than the claim).
  `runTool` turns errors into text, so an agent can read them and try again.
- `readToolSchemas` has the five read tools. `payClaimSchema` is separate on purpose: decide in your
  design whether a model should ever be able to pay.

## `ai` (server/src/llm.ts)

The OpenAI Responses API, with the configured model applied by the wrapper:

```ts
import { ai } from "../llm";

const response = await ai.responses.create({
  max_output_tokens: 500,
  instructions: "...",
  input: [{ role: "user", content: "..." }],
  // tools: toOpenAITools(readToolSchemas),
  // tool_choice: { type: "function", name: "getPolicy" },
});
console.log(response.output_text);
```

- The default model is `gpt-6-luna`. Set `OPENAI_MODEL` in `.env` to choose another OpenAI model.
- You do not pass `model`; the wrapper applies the configured model and always uses OpenAI's endpoint.
- The fixed tools module keeps the course's original `name`, `description`, and `input_schema` format. Convert those schemas with `toOpenAITools` from `llm.ts` before passing them to OpenAI. The adapter returns `type: "function"`, `name`, and `parameters`; `strict: false` preserves optional arguments such as policy topic. Native OpenAI tools (such as the decision-report tool) need no conversion.
- Function-call arguments are JSON strings: parse them before passing them to `runTool`.
- Return tool results as `function_call_output` items with the matching `call_id`.
- If `response.status` is `"incomplete"`, inspect `response.incomplete_details` and handle the failure before acting on a decision.
