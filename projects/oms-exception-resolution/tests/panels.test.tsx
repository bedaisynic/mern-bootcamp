// @vitest-environment jsdom
import { cleanup, render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter } from 'react-router-dom';
import { afterEach, expect, it, vi } from 'vitest';
import { demoIntake, getContext, seedCase } from '@oms/oms-mock-adapters';
import { ActionPanel, InvestigationPanel, Overview, ResponsePanel, type PanelProps } from '../apps/web/src/features/resolution/panels';

afterEach(cleanup);
async function props(overrides: Partial<PanelProps['data']> = {}): Promise<PanelProps> {
  const seed = seedCase();
  return {data: {...seed, intake: demoIntake, policyDetails: [], context: await getContext(seed.orderId), ...overrides}, role: 'agent', busy: false, run: vi.fn()};
}
it('shows the OMS context and starts an investigation', async () => {
  const input = await props();
  render(<MemoryRouter><Overview {...input} choose={vi.fn()} refreshedAt={0} refresh={vi.fn()} refreshing={false} /></MemoryRouter>);
  expect(screen.getByText('Toscana Extendable Dining Table')).toBeTruthy();
  await userEvent.click(screen.getByRole('button', {name: 'Start AI investigation'}));
  expect(input.run).toHaveBeenCalledWith({type: 'investigate'});
});
it('renders queued and failed investigations', async () => {
  const queued = await props({investigation: {id: '1', status: 'queued'}});
  const {rerender} = render(<InvestigationPanel {...queued} choose={vi.fn()} />);
  expect(screen.getByRole('status').textContent).toContain('Gathering evidence');
  const failed = await props({investigation: {id: '1', status: 'failed', error: 'Retry the case'}});
  rerender(<InvestigationPanel {...failed} choose={vi.fn()} />);
  expect(screen.getByRole('alert').textContent).toContain('Retry the case');
});
it('requires a delivery window and resolution notes before submission', async () => {
  const input = await props({investigation: {id: '1', status: 'completed', reviewed: true}});
  render(<ActionPanel {...input} selected="RESCHEDULE_DELIVERY" />);
  await userEvent.click(screen.getByRole('button', {name: 'Validate action'}));
  expect(await screen.findByText('Select an available delivery window')).toBeTruthy();
  expect(await screen.findByText('Enter at least 5 characters')).toBeTruthy();
  expect(input.run).not.toHaveBeenCalled();
});
it('requires confirmation and sends the reviewed edit', async () => {
  const input = await props({status: 'Resolved', response: {text: 'Your delivery appointment is confirmed.'}});
  render(<ResponsePanel {...input} />);
  const button = screen.getByRole<HTMLButtonElement>('button', {name: 'Send to customer'});
  expect(button.disabled).toBe(true);
  const user = userEvent.setup();
  const editor = screen.getByRole('textbox', {name: 'Customer message'});
  await user.clear(editor);
  await user.type(editor, 'Your new delivery window is confirmed.');
  await user.click(screen.getByRole('checkbox'));
  await user.click(button);
  expect(input.run).toHaveBeenCalledWith({type: 'send', input: {text: 'Your new delivery window is confirmed.', confirmed: true}});
});
