import { useState, type ReactNode } from 'react';
import { Alert, Button, Checkbox, CircularProgress, FormControlLabel, MenuItem, TextField } from '@mui/material';
import { ArrowRight, BadgeCheck, CalendarClock, Check, ClipboardCheck, Clock3, FileText, History, Mail, Package, RefreshCw, Send, ShieldCheck, Sparkles, Truck, Warehouse } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Controller, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import type { Workspace } from '@oms/oms-mock-adapters';
import { actionInputSchema, type Command } from '@oms/shared-schemas';
import { actionLabels, ACTIONS, type Action, type ActionInput, type Actor } from '@oms/shared-types';
import { casePath } from './navigation';
import productImage from './toscana-table.jpg';
import s from './workspace.module.css';

export type PanelProps = {
  data: Workspace; role: Actor['role']; busy: boolean; run: (command: Command, next?: string) => void;
};
export function Tag({children, tone = 'neutral'}: {children: ReactNode; tone?: 'neutral'|'blue'|'green'|'amber'}) {
  return <span className={s.tag + ' ' + s[tone]}>{children}</span>;
}
export function Card({title, subtitle, icon, children}: {title: string; subtitle?: string; icon: ReactNode; children: ReactNode}) {
  return <section className={s.card}>
    <div className={s.cardHeading}><span className={s.cardIcon}>{icon}</span><div><h2>{title}</h2>{subtitle && <p>{subtitle}</p>}</div></div>
    {children}
  </section>;
}
function Fact({name, children}: {name: string; children: ReactNode}) {
  return <div className={s.fact}><dt>{name}</dt><dd>{children ?? 'Unavailable'}</dd></div>;
}
function money(amount: number) {
  return new Intl.NumberFormat('en-US', {style: 'currency', currency: 'USD'}).format(amount);
}
export function OrderSummary({data, detailed = false}: {data: Workspace; detailed?: boolean}) {
  const {order, delivery} = data.context;
  return <Card title={detailed ? 'Order details' : 'Order summary'} subtitle={data.orderId} icon={<Package size={19} />}>
    {order ? <div className={s.orderSummary}>
      <div className={s.productRow}>
        <img className={detailed ? s.largeProductImage : s.productImage} src={productImage} alt="Natural oak extendable dining table" />
        <div>
          <p className={s.product}>{order.item}</p>
          <p className={s.muted}>SKU {order.sku}</p>
          <p className={s.muted}>Qty {order.quantity} · {money(order.total)}</p>
          {!detailed && <Link className={s.textLink} to={casePath(data.id, 'order')}>View order details</Link>}
        </div>
      </div>
      <dl className={s.orderFacts}>
        <Fact name="Brand">{data.brand}</Fact><Fact name="Order date">{order.placed}</Fact>
        <Fact name="Original delivery">{delivery?.original}</Fact>
        <Fact name="Current delivery">{delivery?.appointment ?? (delivery ? 'Awaiting reschedule' : undefined)}</Fact>
        {detailed && <><Fact name="Order channel">{order.channel}</Fact><Fact name="Payment">{order.payment}</Fact></>}
        {order.goodwillCredit && <Fact name="Goodwill credit">{money(order.goodwillCredit)}</Fact>}
      </dl>
    </div> : <p className={s.muted}>Order unavailable.</p>}
  </Card>;
}
function CrossSystemEvidence({data, refreshedAt, refresh, refreshing}: {data: Workspace; refreshedAt: number; refresh: () => void; refreshing: boolean}) {
  const {inventory, warehouse, delivery} = data.context;
  const available = delivery?.slots.filter(slot => slot.capacity > 0) ?? [];
  return <Card title="Cross-system evidence" subtitle="Order, inventory, warehouse, and carrier records" icon={<ClipboardCheck size={19} />}>
    <div className={s.evidenceBar}>
      <Tag tone={inventory && warehouse && delivery ? 'green' : 'amber'}>{inventory && warehouse && delivery ? '3 systems reporting' : 'Evidence incomplete'}</Tag>
      {refreshedAt > 0 && <span className={s.muted}>Updated {new Date(refreshedAt).toLocaleTimeString('en-US', {hour: 'numeric', minute: '2-digit'})}</span>}
      <Button size="small" startIcon={<RefreshCw size={14} />} disabled={refreshing} onClick={refresh}>Refresh evidence</Button>
    </div>
    <div className={s.evidenceGrid}>
      <Card title="Inventory" subtitle={inventory?.location} icon={<Package size={17} />}>
        <Tag tone={inventory ? 'green' : 'amber'}>{inventory?.status ?? 'Unavailable'}</Tag>
        <dl><Fact name="Reserved">{inventory?.reserved}</Fact><Fact name="Sellable">{inventory?.sellable}</Fact></dl>
      </Card>
      <Card title="Warehouse" subtitle={warehouse?.facility} icon={<Warehouse size={17} />}>
        <Tag tone="amber">{warehouse?.status ?? 'Unavailable'}</Tag>
        <dl><Fact name="Revised release">{warehouse?.release}</Fact></dl>
      </Card>
      <Card title="Delivery" subtitle="Carrier appointment" icon={<Truck size={17} />}>
        <Tag tone={delivery?.appointment ? 'green' : 'amber'}>{delivery?.status ?? 'Unavailable'}</Tag>
        <dl><Fact name={delivery?.appointment ? 'Confirmed' : 'Next available'}>{delivery?.appointment ?? available[0]?.label}</Fact>
          <Fact name="Available windows">{delivery && available.length}</Fact></dl>
      </Card>
    </div>
  </Card>;
}
function InvestigationSummary({data, role, busy, run, choose}: PanelProps & {choose: (action: Action) => void}) {
  const investigation = data.investigation;
  const result = investigation?.result;
  const canSelect = investigation?.reviewed && role === 'agent' && data.status === 'Open'
    && (!data.workflow || ['ready', 'rejected', 'escalated'].includes(data.workflow.status));
  return <>
    <Card title="AI investigation summary" subtitle="Root cause and supporting evidence" icon={<Sparkles size={19} />}>
      {result ? <>
        <div className={s.finding}><strong>{result.rootCause}</strong>
          {result.evidence[0] && <p>{result.evidence[0].description}</p>}
        </div>
        <Button component={Link} to={casePath(data.id, 'investigation')} endIcon={<ArrowRight size={15} />}>View investigation</Button>
      </> : <>
        {investigation?.status === 'failed' && <Alert severity="error" sx={{mb: 2}}>{investigation.error}</Alert>}
        {investigation?.status === 'queued' ? <div role="status" className={s.loading}><CircularProgress size={18} /> Checking OMS evidence and policies…</div> :
          <>
            <p className={s.muted}>Check the order, inventory, warehouse, and carrier records for the cause of the delay.</p>
            <Button sx={{mt: 1.5}} onClick={() => run({type: 'investigate'})} disabled={busy || role !== 'agent'} variant="contained"
              endIcon={<ArrowRight size={16} />}>{investigation ? 'Retry investigation' : 'Start AI investigation'}</Button>
          </>}
      </>}
    </Card>
    {result && <Card title="Policy & recommended action" icon={<FileText size={19} />}>
      {result.policyReferences[0] && <div className={s.policyExcerpt}>
        <Tag tone="blue">{result.policyReferences[0].policyId}</Tag>
        <strong>{result.policyReferences[0].title}</strong>
        <p>{data.policyDetails.find(policy => policy.policyId === result.policyReferences[0].policyId)?.text}</p>
      </div>}
      <div className={s.recommendations}>
        {result.recommendedActions.map((item, index) => <div key={item.action} className={index === 0 ? s.topRecommendation : s.otherRecommendation}>
          {index === 0 && <span className={s.eyebrow}>RECOMMENDED ACTION</span>}
          <strong>{actionLabels[item.action]}</strong>
          <p>{item.reason}</p>
          {canSelect && <Button component={Link} to={casePath(data.id, 'actions')} onClick={() => choose(item.action)}
            variant={index === 0 ? 'contained' : 'outlined'} size="small">Select {actionLabels[item.action].toLowerCase()}</Button>}
        </div>)}
        {!investigation?.reviewed && <Button component={Link} to={casePath(data.id, 'investigation')} variant="outlined"
          endIcon={<ArrowRight size={15} />}>Review recommendations</Button>}
      </div>
    </Card>}
  </>;
}
export function Overview(props: PanelProps & {choose: (action: Action) => void; refreshedAt: number; refresh: () => void; refreshing: boolean}) {
  return <div className={s.stack}>
    <div className={s.summaryGrid}><CaseDetails data={props.data} compact /><OrderSummary data={props.data} /></div>
    <div className={s.overviewGrid}>
      <div className={s.stack}>
        <CrossSystemEvidence {...props} />
        <TimelinePanel {...props} preview />
      </div>
      <aside className={s.stack}><InvestigationSummary {...props} /></aside>
    </div>
  </div>;
}
export function InvestigationPanel({data, busy, role, run, choose}: PanelProps & {choose: (action: Action) => void}) {
  const investigation = data.investigation;
  if (!investigation || investigation.status === 'failed') {
    return <Card title="AI investigation" subtitle="Review the root cause and suggested actions." icon={<Sparkles size={19} />}>
      {investigation?.error && <Alert severity="error" sx={{mb: 2}}>{investigation.error}</Alert>}
      <Button variant="contained" disabled={busy || role !== 'agent'} onClick={() => run({type: 'investigate'})}>
        {investigation ? 'Retry investigation' : 'Start AI investigation'}
      </Button>
    </Card>;
  }
  if (investigation.status === 'queued') {
    return <Card title="Investigation in progress" subtitle="Reading order, inventory, warehouse, and carrier records." icon={<Sparkles size={19} />}>
      <div role="status" className={s.loading}><CircularProgress size={22} /> Gathering evidence and checking policies…</div>
    </Card>;
  }
  const result = investigation.result!;
  return <div className={s.stack}>
    <Card title={result.rootCause} subtitle="Root cause assessment" icon={<Sparkles size={19} />}>
      <Tag tone="green"><Check size={13} /> Investigation complete</Tag>
      <h3>Supporting evidence</h3>
      {result.evidence.length ? <ul className={s.detailList}>{result.evidence.map(evidence => <li key={evidence.source}><strong>{evidence.source}</strong><p>{evidence.description}</p></li>)}</ul> : <p className={s.muted}>No supporting evidence was available.</p>}
    </Card>
    <Card title="Policy references" subtitle="Policies cited in this assessment" icon={<FileText size={19} />}>
      {result.policyReferences.length ? <ul className={s.detailList}>{result.policyReferences.map(policy => <li key={policy.policyId}><Tag tone="blue">{policy.policyId}</Tag> <strong>{policy.title}</strong><p>{data.policyDetails.find(item => item.policyId === policy.policyId)?.text}</p></li>)}</ul> : <p className={s.muted}>No policies cited.</p>}
    </Card>
    <Card title="Recommended actions" subtitle="Review the recommendations before choosing a resolution." icon={<BadgeCheck size={19} />}>
      <ul className={s.detailList}>{result.recommendedActions.map(item => <li className={s.recommendation} key={item.action}>
        <div><strong>{actionLabels[item.action]}</strong><p>{item.reason}</p></div>
        {investigation.reviewed && role === 'agent' && data.status === 'Open' && (!data.workflow || ['ready', 'rejected', 'escalated'].includes(data.workflow.status)) && <Button component={Link} to={casePath(data.id, 'actions')} onClick={() => choose(item.action)}>Select</Button>}
      </li>)}</ul>
      {investigation.reviewed ? <Tag tone="green"><Check size={13} /> Reviewed</Tag> :
        <Button variant="contained" disabled={busy || role !== 'agent'} onClick={() => run({type: 'review'})}>Mark recommendations reviewed</Button>}
    </Card>
  </div>;
}
export function ActionPanel({data, busy, role, run, selected}: PanelProps & {selected?: Action}) {
  const workflow = data.workflow;
  const agent = role === 'agent';
  const canSelect = data.status === 'Open' && data.investigation?.reviewed && (!workflow || ['ready', 'rejected', 'escalated'].includes(workflow.status));
  const selection = workflow?.status === 'escalated' ? undefined : workflow?.selection;
  const initialSelection = selected && selected !== selection?.action
    ? {action: selected, reason: '', slotId: ''}
    : selection ?? {action: 'RESCHEDULE_DELIVERY' as const, reason: '', slotId: ''};
  const form = useForm<ActionInput>({
    resolver: zodResolver(actionInputSchema),
    defaultValues: initialSelection,
    shouldUnregister: true,
  });
  const action = form.watch('action');
  return <div className={s.stack}>
    {!data.investigation?.reviewed && <Alert severity="info" action={<Button component={Link} to={casePath(data.id, 'investigation')}>Investigation</Button>}>Review the AI investigation before selecting a resolution.</Alert>}
    {workflow && <Card title={actionLabels[workflow.selection.action]} subtitle="Current resolution" icon={<ClipboardCheck size={19} />}>
      <Tag tone={workflow.status === 'executed' ? 'green' : 'blue'}>{workflow.status === 'pending' ? 'Awaiting approval' : workflow.status === 'escalated' ? 'Manager reviewed' : workflow.status}</Tag>
      <ul className={s.detailList}>{workflow.checks.map(check => <li key={check}><Check size={14} /> {check}</li>)}</ul>
      {workflow.error && <Alert severity="error" sx={{mb: 2}}>{workflow.error}</Alert>}
      {workflow.execution && <Alert severity="success" sx={{mb: 2}}>{workflow.execution.summary} · {workflow.execution.reference}</Alert>}
      {workflow.status === 'pending' && <Button component={Link} to={casePath(data.id, 'approval')} variant="outlined">Open approval workflow</Button>}
      {['ready', 'approved', 'failed'].includes(workflow.status) &&
        <Button variant="contained" disabled={busy || !agent} onClick={() => run({type: 'execute', workflowId: workflow.id})}>{
          workflow.status === 'failed' ? 'Retry execution' : 'Execute resolution'
        }</Button>}
      {workflow.status === 'executed' && <Button component={Link} to={casePath(data.id, 'response')} variant="contained">Review customer response</Button>}
    </Card>}
    {canSelect && <Card title="Select a resolution" subtitle="The resolution service checks eligibility and approval requirements." icon={<ShieldCheck size={19} />}>
      <form className={s.form} onSubmit={form.handleSubmit(input => run({type: 'select', input}))}>
        <Controller name="action" control={form.control} render={({field}) => <TextField {...field} label="Resolution action" select fullWidth disabled={!agent}>
          {ACTIONS.map(value => <MenuItem key={value} value={value}>{actionLabels[value]}</MenuItem>)}
        </TextField>} />
        {action === 'RESCHEDULE_DELIVERY' && <Controller name="slotId" control={form.control} defaultValue="" render={({field, fieldState}) =>
          <TextField {...field} value={field.value ?? ''} select label="Delivery window" fullWidth disabled={!agent}
            error={!!fieldState.error} helperText={fieldState.error?.message}>
            {(data.context.delivery?.slots ?? []).filter(slot => slot.capacity > 0).map(slot => <MenuItem key={slot.id} value={slot.id}>{slot.label}</MenuItem>)}
          </TextField>
        } />}
        {action === 'GOODWILL_CREDIT' && <Controller name="amount" control={form.control} render={({field, fieldState}) =>
          <TextField {...field} value={field.value ?? ''} onChange={event => field.onChange(event.target.value === '' ? undefined : Number(event.target.value))}
            type="number" label="Credit amount (USD)" disabled={!agent} error={!!fieldState.error} helperText={fieldState.error?.message ?? 'Credits over $50 require approval. Maximum $150.'} />
        } />}
        <Controller name="reason" control={form.control} defaultValue="" render={({field, fieldState}) =>
          <TextField {...field} label="Resolution notes" multiline minRows={2} fullWidth disabled={!agent} error={!!fieldState.error} helperText={fieldState.error?.message} />
        } />
        <Button type="submit" variant="contained" disabled={busy || !agent}>Validate action</Button>
      </form>
    </Card>}
  </div>;
}
export function ApprovalPanel({data, busy, role, run}: PanelProps) {
  const workflow = data.workflow;
  const [note, setNote] = useState('');
  return <Card title="Supervisor approval" subtitle="Approval is recorded against the validated action." icon={<ShieldCheck size={19} />}>
    {!workflow && <Alert severity="info">There is no resolution to approve yet.</Alert>}
    {workflow && <>
      <div className={s.stack}>
        <strong>{actionLabels[workflow.selection.action]}{workflow.selection.amount ? ' · $' + workflow.selection.amount : ''}</strong>
        <div className={s.muted}>{workflow.selection.reason}</div>
        {workflow.approval && <Alert severity={workflow.approval.decision === 'approved' ? 'success' : 'warning'}>{workflow.approval.decision} by {workflow.approval.by}. {workflow.approval.note}</Alert>}
        {workflow.status === 'escalated' && <Alert severity="info">Manager review complete. The original agent can return to Resolution Actions and choose a resolution.</Alert>}
        {!workflow.approval && workflow.status !== 'pending' && <Alert severity="info">This action is within agent authorization.</Alert>}
      </div>
      {workflow.status === 'pending' && (role === 'agent'
        ? <Alert sx={{mt: 2}} severity="warning">Awaiting supervisor approval.</Alert>
        : <div className={s.form}>
          <TextField fullWidth multiline minRows={2} label="Supervisor decision notes" value={note} onChange={event => setNote(event.target.value)} />
          <div className={s.buttonRow}>
            <Button variant="contained" disabled={busy || note.trim().length < 5} onClick={() => run({type: 'approve', workflowId: workflow.id, input: {decision: 'approved', note}})}>Approve action</Button>
            <Button variant="outlined" color="error" disabled={busy || note.trim().length < 5} onClick={() => run({type: 'approve', workflowId: workflow.id, input: {decision: 'rejected', note}})}>Decline</Button>
          </div>
        </div>)}
    </>}
  </Card>;
}
function ResponseEditor({data, role, busy, run}: PanelProps) {
  const response = data.response!;
  const [text, setText] = useState(response.text);
  const [confirmed, setConfirmed] = useState(false);
  return <div className={s.form}>
    <TextField label="Customer message" fullWidth multiline minRows={7} value={text} onChange={event => {setText(event.target.value); setConfirmed(false);}}
      disabled={!!response.sentAt || role !== 'agent'} slotProps={{htmlInput: {maxLength: 3000}}} />
    {response.sentAt ? <>
      <Alert severity="success">Message sent · {response.reference}</Alert>
      {data.status !== 'Closed' && <Button variant="contained" disabled={busy || role !== 'agent'} onClick={() => run({type: 'close'}, casePath(data.id, 'timeline'))}>Close case</Button>}
    </> : <>
      <FormControlLabel label="I reviewed this message and confirm it is ready to send."
        control={<Checkbox checked={confirmed} onChange={event => setConfirmed(event.target.checked)} disabled={role !== 'agent'} />} />
      <Button variant="contained" startIcon={<Send size={16} />} disabled={busy || !confirmed || text.trim().length < 15 || role !== 'agent'}
        onClick={() => run({type: 'send', input: {text, confirmed: true}})}>Send to customer</Button>
    </>}
  </div>;
}
export function ResponsePanel(props: PanelProps) {
  const {data, role, busy, run} = props;
  return <Card title="Customer response review" subtitle={'Recipient · ' + data.customer} icon={<Mail size={19} />}>
    {data.response ? <ResponseEditor key={data.response.sentAt ?? 'draft'} {...props} /> :
      data.status === 'Resolved'
        ? <Button variant="contained" startIcon={<Sparkles size={16} />} disabled={busy || role !== 'agent'} onClick={() => run({type: 'draft'})}>Generate AI draft</Button>
        : <Alert severity="info">Execute a resolution before drafting a customer message.</Alert>}
  </Card>;
}
export function TimelinePanel({data, preview = false}: PanelProps & {preview?: boolean}) {
  const [filter, setFilter] = useState('all');
  const events = (filter === 'investigation'
    ? data.audit.filter(event => event.title.startsWith('AI investigation') || event.title === 'Recommendations reviewed')
    : data.audit).slice().reverse();
  return <Card title={preview ? 'Case activity' : 'Resolution timeline'} subtitle="Newest events first" icon={<History size={19} />}>
    <div className={s.evidenceBar}>
      <TextField select label="Event filter" size="small" value={filter} onChange={event => setFilter(event.target.value)}>
        <MenuItem value="all">All events</MenuItem><MenuItem value="investigation">Investigation only</MenuItem>
      </TextField>
      {preview && <Button component={Link} to={casePath(data.id, 'timeline')} endIcon={<ArrowRight size={15} />}>View full timeline</Button>}
    </div>
    {events.length ? <ol className={s.timeline}>{(preview ? events.slice(0, 4) : events).map(event => <li key={event.id}>
      <span className={s.timelineDot}><Clock3 size={14} /></span>
      <div><strong>{event.title}</strong><p>{event.detail}</p><small>{event.actor} · {new Date(event.at).toLocaleString('en-US')}</small></div>
    </li>)}</ol> : <p className={s.muted}>No investigation events yet.</p>}
  </Card>;
}
export function CaseDetails({data, compact = false}: {data: Workspace; compact?: boolean}) {
  return <Card title={compact ? 'Customer' : 'Case details'} subtitle={data.customer} icon={<CalendarClock size={19} />}>
    <div className={s.contactDetails}><span><Mail size={14} /> {data.intake.email}</span><span>{data.intake.phone}</span></div>
    <p className={s.intakeNote}><strong>{data.intake.channel}</strong><br />{data.intake.summary}</p>
    {!compact && <dl>
      <Fact name="Exception">{data.issue}</Fact><Fact name="Handled by">{data.assigned}</Fact>
      <Fact name="Opened">{new Date(data.openedAt).toLocaleDateString('en-US', {month: 'short', day: 'numeric', year: 'numeric'})}</Fact>
    </dl>}
  </Card>;
}
