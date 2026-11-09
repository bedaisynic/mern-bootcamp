import { useState, type ReactNode } from 'react';
import { Alert, Button, CircularProgress, MenuItem, TextField } from '@mui/material';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { Activity, ArrowRight, BadgeCheck, ChevronRight, CircleHelp, ClipboardCheck, FileText, History, LayoutDashboard, Mail, Package, PanelTop, Settings, ShieldCheck, Sparkles, Truck, Warehouse } from 'lucide-react';
import { Link, matchPath, NavLink, Navigate, Route, Routes, useLocation, useNavigate } from 'react-router-dom';
import type { Action, Actor } from '@oms/shared-types';
import type { Command } from '@oms/shared-schemas';
import { CASE_ID, type Workspace } from '@oms/oms-mock-adapters';
import { errorMessage, loadQueue, loadWorkspace, sendCommand, signIn, useRole } from './api';
import { ActionPanel, ApprovalPanel, CaseDetails, InvestigationPanel, OrderSummary, Overview, ResponsePanel, Tag, TimelinePanel } from './panels';
import { ExceptionQueue } from './ExceptionQueue';
import { RegisterCall } from './RegisterCall';
import { casePath, intakePath, nextStep, queuePath, responseTarget } from './navigation';
import s from './workspace.module.css';

const modules = [
  {label: 'Dashboard', icon: LayoutDashboard}, {label: 'Orders', icon: Package}, {label: 'Inventory', icon: ClipboardCheck},
  {label: 'Warehouse', icon: Warehouse}, {label: 'Delivery', icon: Truck}, {label: 'Exceptions', icon: Activity, active: true},
  {label: 'Reports', icon: FileText}, {label: 'Settings', icon: Settings},
];
const tabs = [
  {label: 'Resolution Workspace', view: '', icon: PanelTop}, {label: 'Order Details', view: 'order', icon: Package},
  {label: 'AI Investigation', view: 'investigation', icon: Sparkles}, {label: 'Resolution Actions', view: 'actions', icon: ClipboardCheck},
  {label: 'Approval', view: 'approval', icon: ShieldCheck}, {label: 'Customer Response', view: 'response', icon: Mail},
  {label: 'Timeline', view: 'timeline', icon: History},
];
function Sidebar() {
  return <aside className={s.sidebar}>
    <Link className={s.brand} to={queuePath}><span className={s.brandIcon}>W</span><div><strong>Shared OMS</strong><small>WILLIAMS-SONOMA</small></div></Link>
    <div className={s.sidebarLabel}>WORKSPACE</div>
    <nav aria-label="OMS modules">{modules.map(({label, icon: Icon, active}) => active
      ? <Link key={label} to={queuePath} className={s.activeModule} aria-current="page"><Icon size={17} />{label}</Link>
      : <button key={label} disabled title="Existing OMS module outside this demo"><Icon size={17} />{label}</button>)}</nav>
    <div className={s.sidebarFoot}><CircleHelp size={17} /><div><strong>Training environment</strong><small>Fictional case study</small></div></div>
  </aside>;
}
function Journey({data}: {data: Workspace}) {
  const steps = [
    {label: 'Investigate', hint: 'Identify the root cause', done: data.investigation?.reviewed, to: casePath(data.id, 'investigation')},
    {label: 'Validate action', hint: 'Check OMS business rules', done: !!data.workflow && data.workflow.selection.action !== 'ESCALATE' && data.workflow.status !== 'rejected', to: casePath(data.id, 'actions')},
    {label: 'Execute resolution', hint: 'Get approval when required', done: data.status !== 'Open', to: casePath(data.id, data.workflow?.status === 'pending' ? 'approval' : 'actions')},
    {label: 'Notify and close', hint: 'Review the customer message', done: data.status === 'Closed', to: casePath(data.id, 'response')},
  ];
  const active = steps.findIndex(step => !step.done);
  return <section className={s.card + ' ' + s.journey}>
    <h2>Resolution progress</h2><p>Case workflow</p>
    <ol>{steps.map((step, index) => <li key={step.label} className={index === active ? s.currentStep : ''}>
      <span className={s.stepNumber}>{step.done ? <BadgeCheck size={16} /> : index + 1}</span>
      <Link to={step.to}><strong>{step.label}</strong><small>{step.hint}</small></Link>
      {index === active && <ArrowRight size={15} />}
    </li>)}</ol>
  </section>;
}
export function WorkspaceApp() {
  const {role, setRole} = useRole();
  const navigate = useNavigate();
  const {pathname, state} = useLocation();
  const registering = pathname === intakePath;
  const viewingQueue = pathname === queuePath;
  const caseId = registering ? undefined : matchPath(queuePath + '/:id/*', pathname)?.params.id;
  const queryClient = useQueryClient();
  const [selected, setSelected] = useState<Action>();
  const session = useQuery({queryKey: ['session', role], queryFn: () => signIn(role), staleTime: 60 * 60 * 1000});
  const token = session.data?.token;
  const query = useQuery({
    queryKey: ['workspace', caseId, role], queryFn: () => loadWorkspace(token!, caseId!), enabled: !!token && !!caseId,
    refetchInterval: query => query.state.data?.investigation?.status === 'queued' ? 700 : false,
  });
  const queue = useQuery({
    queryKey: ['queue', role], queryFn: () => loadQueue(token!), enabled: !!token && viewingQueue,
  });
  const mutation = useMutation({
    mutationFn: ({command}: {command: Command; next?: string}) => sendCommand(token!, caseId!, command),
    onSuccess: (data, {command, next}) => {
      if (command.type === 'select') setSelected(undefined);
      queryClient.setQueryData(['workspace', data.id, role], data);
      void queryClient.invalidateQueries({queryKey: ['queue']});
      void queryClient.invalidateQueries({queryKey: ['workspace']});
      if (next) navigate(next);
    },
  });
  const data = query.data;
  let content: ReactNode;
  const activeQuery = viewingQueue ? queue : query;
  if (!viewingQueue && !registering && !caseId) {
    const legacy = tabs.find(tab => tab.view && pathname === '/' + tab.view);
    content = <Navigate to={legacy ? casePath(CASE_ID, legacy.view) : queuePath} replace />;
  } else if (session.isError || activeQuery.isError) {
    content = <Alert severity="error" action={<Button onClick={() => void (session.isError ? session.refetch() : activeQuery.refetch())}>Retry</Button>}>
      {errorMessage(session.error ?? activeQuery.error)}
    </Alert>;
  } else if (registering && session.data) {
    content = <RegisterCall actor={session.data.actor} token={session.data.token} />;
  } else if (viewingQueue && queue.data) {
    content = <ExceptionQueue cases={queue.data} canRegister={role === 'agent'} />;
  } else if (!data || !caseId) {
    content = <div role="status" className={s.loading}><CircularProgress size={24} /> Loading exception workspace…</div>;
  } else {
    const props = {data, role, busy: mutation.isPending, run: (command: Command, next?: string) => mutation.mutate({command, next})};
    const step = nextStep(data);
    const target = responseTarget(data);
    const withContext = (panel: ReactNode) => <div className={s.columns}>
      <div className={s.primary}>{panel}</div>
      <aside className={s.contextAside}><Journey data={data} /><CaseDetails data={data} /></aside>
    </div>;
    const caseContent = <>
      <header className={s.pageHeading}>
        <span className={s.eyebrow}>CASE {data.id} <span className={s.inlineDivider}>/</span> ORDER {data.orderId}</span>
        <h1>Exception Resolution Workspace</h1>
        <p>Investigate the issue, validate the resolution, and respond to the customer.</p>
      </header>
      <div className={s.hero}>
        <div className={s.heroTop}><div className={s.heroIcon}><Package size={22} /></div><div>
          <h2>{data.issue}</h2><p>{data.customer} · {data.brand}</p>
        </div></div>
        <div className={s.heroTags}>
          <Tag tone="amber">{data.priority} priority</Tag>
          <Tag tone={data.status === 'Open' ? 'blue' : 'green'}><span className={s.dot} /> {data.status}</Tag>
          <Tag tone={target.overdue ? 'amber' : 'neutral'}>{data.intake.slaHours}h response SLA · {target.overdue ? 'Missed' : 'Due'} {target.label}</Tag>
        </div>
      </div>
      <section className={s.nextStep} aria-label="Next step"><strong>Next step</strong>
        {step.view ? <Link to={casePath(data.id, step.view)}>{step.label} <ArrowRight size={14} /></Link> : <span>{step.label}</span>}
      </section>
      <nav aria-label="Case views" className={s.tabs}>{tabs.map(({view, label, icon: Icon}) =>
        <NavLink key={view} to={casePath(data.id, view)} end onClick={() => { if (mutation.isError) mutation.reset(); }} className={({isActive}) => isActive ? s.activeTab : ''}><Icon size={16} />{label}</NavLink>
      )}</nav>
      {state?.registration && <Alert severity="success" sx={{mb: 2}}>{state.registration}</Alert>}
      {mutation.isError && <Alert severity="error" sx={{mb: 2}} onClose={() => mutation.reset()}>{errorMessage(mutation.error)}</Alert>}
      <Routes>
        <Route index element={<Overview {...props} choose={setSelected} refreshedAt={query.dataUpdatedAt}
          refresh={() => void query.refetch()} refreshing={query.isFetching} />} />
        <Route path="order" element={<OrderSummary data={data} detailed />} />
        <Route path="investigation" element={withContext(<InvestigationPanel {...props} choose={setSelected} />)} />
        <Route path="actions" element={withContext(<ActionPanel key={(data.workflow?.id ?? '') + selected}
          {...props} selected={selected} />)} />
        <Route path="approval" element={withContext(<ApprovalPanel key={data.workflow?.id ?? 'none'} {...props} />)} />
        <Route path="response" element={withContext(<ResponsePanel {...props} />)} />
        <Route path="timeline" element={withContext(<TimelinePanel {...props} />)} />
        <Route path="*" element={<Navigate to={casePath(data.id)} replace />} />
      </Routes>
    </>;
    content = <Routes>
      <Route path={queuePath + '/:id/*'} element={caseContent} />
    </Routes>;
  }
  return <div className={s.layout}>
    <Sidebar />
    <div className={s.shell}>
      <header className={s.topbar}>
        <nav className={s.breadcrumb} aria-label="Breadcrumb"><span>Operations</span><ChevronRight size={14} />
          {caseId || registering ? <><Link to={queuePath}>Exceptions</Link><ChevronRight size={14} /><strong>{registering ? 'Register call' : caseId}</strong></> : <strong>Exceptions</strong>}
        </nav>
        <div className={s.account}>
          <span className={s.demo}>DEMO</span>
          <TextField label="Demo role" select size="small" value={role} disabled={mutation.isPending}
            onChange={event => { mutation.reset(); setRole(event.target.value as Actor['role']); }}>
            <MenuItem value="agent">Agent · Sarah Chen</MenuItem><MenuItem value="supervisor">Supervisor · Marcus Lee</MenuItem>
          </TextField>
          <span className={s.avatar}>{role === 'agent' ? 'SC' : 'ML'}</span>
        </div>
      </header>
      <main className={s.main}>{content}</main>
    </div>
  </div>;
}
