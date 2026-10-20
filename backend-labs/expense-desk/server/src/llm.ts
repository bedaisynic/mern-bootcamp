import OpenAI from "openai";
import type {
  FunctionTool,
  Response,
  ResponseCreateParamsNonStreaming,
} from "openai/resources/responses/responses";

// All model calls go through this wrapper and the official OpenAI endpoint.
export const MODEL = process.env.OPENAI_MODEL?.trim() || "gpt-6-luna";

type CreateParams = Omit<ResponseCreateParamsNonStreaming, "model" | "stream"> & {
  model?: string;
};

let client: OpenAI | undefined;

async function create(params: CreateParams): Promise<Response> {
  if (!process.env.OPENAI_API_KEY?.trim()) {
    throw new Error("OPENAI_API_KEY is missing: copy .env.example to .env and paste your key");
  }
  client ??= new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
    baseURL: "https://api.openai.com/v1",
  });
  if (params.model && params.model !== MODEL) {
    console.warn(`[llm] model "${params.model}" replaced with ${MODEL}`);
  }

  return client.responses.create({
    ...params,
    model: MODEL,
    stream: false,
  });
}

export const ai = { responses: { create } };

// Adapt the lab's original tool schemas without changing the fixed tools module.
// strict:false preserves optional inputs such as getPolicy.topic.
type LabToolSchema = {
  name: string;
  description?: string;
  input_schema: { type: "object"; [key: string]: unknown };
};
export function toOpenAITools(schemas: readonly LabToolSchema[]): FunctionTool[] {
  return schemas.map((schema) => ({
    type: "function",
    name: schema.name,
    description: schema.description,
    parameters: structuredClone(schema.input_schema),
    strict: false,
  }));
}
