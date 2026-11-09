import { z } from 'zod';
import { ACTIONS, ROLES } from '@oms/shared-types';

export const orderLookupSchema = z.string().trim().min(3, 'Enter at least 3 characters to search').max(100);
export const addressVerificationSchema = z.object({
  streetNumber: z.string().trim().regex(/^\d{1,8}[a-z]?$/i, 'Enter the delivery street number'),
  postalCode: z.string().trim().regex(/^\d{5}(?:-\d{4})?$/, 'Enter a valid US ZIP code'),
});
export type AddressVerification = z.infer<typeof addressVerificationSchema>;

export const intakeSchema = z.object({
  orderId: z.string().trim().min(1, 'Select an order').max(30),
  addressVerification: addressVerificationSchema,
  customerName: z.string().trim().min(1, 'Enter the customer name').max(100),
  email: z.string().trim().max(254).email('Enter a valid email address'),
  notes: z.string().trim().min(10, 'Enter at least 10 characters').max(500, 'Use 500 characters or fewer'),
});
export type IntakeInput = z.infer<typeof intakeSchema>;

export const roleSchema = z.enum(ROLES);
export const actorSchema = z.object({id: z.string(), name: z.string(), role: roleSchema});
export const actionInputSchema = z.object({
  action: z.enum(ACTIONS), slotId: z.string().optional(), amount: z.number().int().positive().max(1000).optional(),
  reason: z.string().trim().min(5, 'Enter at least 5 characters').max(500),
}).superRefine((input, ctx) => {
  if (input.action === 'RESCHEDULE_DELIVERY' && !input.slotId) {
    ctx.addIssue({code: 'custom', path: ['slotId'], message: 'Select an available delivery window'});
  }
  if (input.action === 'GOODWILL_CREDIT' && !input.amount) {
    ctx.addIssue({code: 'custom', path: ['amount'], message: 'Enter a whole-dollar credit amount'});
  }
});
export const approvalSchema = z.object({
  decision: z.enum(['approved', 'rejected']), note: z.string().trim().min(5).max(500),
});
export const responseSchema = z.object({text: z.string().trim().min(15).max(3000), confirmed: z.literal(true)});
export const investigationSchema = z.object({
  rootCause: z.string(),
  evidence: z.array(z.object({source: z.string(), description: z.string()})),
  recommendedActions: z.array(z.object({action: z.enum(ACTIONS), reason: z.string()})),
  policyReferences: z.array(z.object({policyId: z.string(), title: z.string()})),
});
const envelope = z.object({id: z.string().uuid(), caseId: z.string(), correlationId: z.string().uuid(), at: z.iso.datetime()});
const event = <T extends string, S extends z.ZodType>(topic: T, data: S) => envelope.extend({topic: z.literal(topic), data});
export const eventSchema = z.discriminatedUnion('topic', [
  event('investigation.requested', z.object({orderId: z.string(), issue: z.string()})),
  event('investigation.completed', investigationSchema),
  event('investigation.failed', z.object({error: z.string()})),
  event('resolution.approved', z.object({workflowId: z.string()})),
  event('resolution.completed', z.object({workflowId: z.string(), reference: z.string()})),
  event('resolution.failed', z.object({workflowId: z.string(), error: z.string()})),
]);
export const commandSchema = z.discriminatedUnion('type', [
  z.object({type: z.literal('investigate')}), z.object({type: z.literal('review')}),
  z.object({type: z.literal('select'), input: actionInputSchema}),
  z.object({type: z.literal('approve'), workflowId: z.string().uuid(), input: approvalSchema}),
  z.object({type: z.literal('execute'), workflowId: z.string().uuid()}),
  z.object({type: z.literal('draft')}),
  z.object({type: z.literal('send'), input: responseSchema}),
  z.object({type: z.literal('close')}),
]);
export type Command = z.infer<typeof commandSchema>;
