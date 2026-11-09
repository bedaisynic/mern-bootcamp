import OpenAI from 'openai';

export const model = () => process.env.OPENAI_MODEL ?? 'gpt-4.1-mini';
export function openai() {
  return new OpenAI({timeout: 18_000, maxRetries: 1});
}
