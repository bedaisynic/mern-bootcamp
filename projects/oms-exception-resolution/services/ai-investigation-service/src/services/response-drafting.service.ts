import { z } from 'zod';
import { env, HttpError } from '@oms/server-kit';
import { model, openai } from '../integrations/openai.js';

export const draftInput = z.object({customer: z.string(), issue: z.string(), summary: z.string(), reference: z.string()});
export async function draftResponse(input: z.infer<typeof draftInput>) {
  if (env.aiMode === 'mock') return {
    text: 'Hi ' + input.customer.split(' ')[0] + ',\n\nI’m sorry we missed your original delivery appointment. Here is the confirmed update for your order: ' + input.summary + '.\n\nYour reference is ' + input.reference + '. Please reply if you have questions.\n\nSarah Chen\nCustomer Service',
  };
  const response = await openai().chat.completions.create({
    model: model(), max_completion_tokens: 550,
    messages: [
      {role: 'system', content: 'Draft a short customer support message. Use only supplied confirmed facts. Never add timelines, amounts, or promises. The human agent reviews the draft.'},
      {role: 'user', content: JSON.stringify(input)},
    ],
  });
  const text = response.choices[0]?.message.content?.trim();
  if (!text || text.length < 15 || text.length > 3000) throw new HttpError(502, 'AI did not return a usable draft');
  return {text};
}
