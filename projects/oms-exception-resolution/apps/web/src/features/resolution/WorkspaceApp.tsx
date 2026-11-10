import { lazy, Suspense, useState, type ReactNode } from 'react';
import { Alert, Button, CircularProgress, MenuItem, TextField } from '@mui/material';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { Activity, ArrowRight, BadgeCheck, ChevronRight, ClipboardCheck, Headphones, FileText, History, LayoutDashboard, Mail, Package, PanelTop, Settings, ShieldCheck, Sparkles, Truck, Warehouse } from 'lucide-react';
import { Link, matchPath, NavLink, Navigate, Route, Routes, useLocation, useNavigate } from 'react-router-dom';
import { isCaseOwner, type Action, type Actor } from '@oms/shared-types';
import type { Command } from '@oms/shared-schemas';
import { CASE_ID, type Workspace } from '@oms/oms-mock-adapters';
import { errorMessage, loadQueue, loadWorkspace, sendCommand, type Session } from './api';
import { ActionPanel, ApprovalPanel, CaseDetails, InvestigationPanel, OrderSummary, Overview, ResponsePanel, Tag, TimelinePanel } from './panels';
import { ExceptionQueue } from './ExceptionQueue';
import type { OperationsPath } from './OperationsPanels';
import { RegisterCall } from './RegisterCall';
import { casePath, intakePath, nextStep, queuePath, responseTarget } from './navigation';
import s from './workspace.module.css';

const OperationsPanel = lazy(() => import('./OperationsPanels'));

const modules = [
  {label: 'Dashboard', path: '/dashboard', icon: LayoutDashboard}, {label: 'Orders', path: '/orders', icon: Package},
  {label: 'Inventory', path: '/inventory', icon: ClipboardCheck}, {label: 'Warehouse', path: '/warehouse', icon: Warehouse},
  {label: 'Delivery', path: '/delivery', icon: Truck}, {label: 'Exceptions', path: queuePath, icon: Activity},
  {label: 'Reports', path: '/reports', icon: FileText}, {label: 'Settings', path: '/settings', icon: Settings},
] satisfies {label: string; path: OperationsPath | typeof queuePath; icon: typeof Activity}[];
const tabs = [
  {label: 'Resolution Workspace', view: '', icon: PanelTop}, {label: 'Order Details', view: 'order', icon: Package},
  {label: 'AI Investigation', view: 'investigation', icon: Sparkles}, {label: 'Resolution Actions', view: 'actions', icon: ClipboardCheck},
  {label: 'Approval', view: 'approval', icon: ShieldCheck}, {label: 'Customer Response', view: 'response', icon: Mail},
  {label: 'Timeline', view: 'timeline', icon: History},
];
function ModuleNavigation({className}: {className?: string}) {
  return <nav aria-label="OMS modules" className={className}>
    {modules.map(({label, path, icon: Icon}) => <NavLink key={path} to={path} end={path !== queuePath}
      className={({isActive}) => isActive ? s.moduleLink + ' ' + s.activeModule : s.moduleLink}>
      <Icon size={17} />{label}
    </NavLink>)}
  </nav>;
}
function Sidebar() {
  return <aside className={s.sidebar}>
    <Link className={s.brand} to={queuePath}><span className={s.brandIcon}>W</span><div><strong>Shared OMS</strong><small>WILLIAMS-SONOMA</small></div></Link>
    <div className={s.sidebarLabel}>WORKSPACE</div>
    <ModuleNavigation />
    <div className={s.sidebarFoot}><Headphones size={17} /><div><strong>Customer Care</strong><small>Order Operations</small></div></div>
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
export function WorkspaceApp({session, onRoleChange, onSignOut}: {
  session: Session; onRoleChange?: (role: Actor['role']) => void; onSignOut?: () => void;
}) {
  const {actor, token} = session;
  const {role} = actor;
  const navigate = useNavigate();
  const {pathname, state} = useLocation();
  const registering = pathname === intakePath;
  const viewingQueue = pathname === queuePath;
  const module = modules.find(item => item.path !== queuePath && item.path === pathname);
  const operationsPath = module?.path === queuePath ? undefined : module?.path;
  const caseId = registering ? undefined : matchPath(queuePath + '/:id/*', pathname)?.params.id;
  const queryClient = useQueryClient();
  const [selected, setSelected] = useState<Action>();
  const query = useQuery({
    queryKey: ['workspace', caseId, actor.id], queryFn: () => loadWorkspace(token, caseId!), enabled: !!caseId,
    refetchInterval: query => query.state.data?.investigation?.status === 'queued' ? 700 : false,
  });
  const queue = useQuery({
    queryKey: ['queue', actor.id], queryFn: () => loadQueue(token), enabled: viewingQueue,
  });
  const mutation = useMutation({
    mutationFn: ({command}: {command: Command; next?: string}) => sendCommand(token, caseId!, command),
    onSuccess: (data, {command, next}) => {
      if (command.type === 'select') setSelected(undefined);
      queryClient.setQueryData(['workspace', data.id, actor.id], data);
      void queryClient.invalidateQueries({queryKey: ['queue']});
      void queryClient.invalidateQueries({queryKey: ['workspace']});
      if (next) navigate(next);
    },
  });
  const data = query.data;
  let content: ReactNode;
  const activeQuery = viewingQueue ? queue : query;
  if (!viewingQueue && !registering && !caseId && !operationsPath) {
    const legacy = tabs.find(tab => tab.view && pathname === '/' + tab.view);
    content = <Navigate to={legacy ? casePath(CASE_ID, legacy.view) : queuePath} replace />;
  } else if (activeQuery.isError) {
    content = <Alert severity="error" action={<Button onClick={() => void activeQuery.refetch()}>Retry</Button>}>
      {errorMessage(activeQuery.error)}
    </Alert>;
  } else if (registering) {
    content = <RegisterCall actor={actor} token={token} />;
  } else if (operationsPath) {
    content = <Suspense fallback={<div role="status" className={s.loading}><CircularProgress size={24} /> Loading operations…</div>}>
      <OperationsPanel path={operationsPath} actor={actor} />
    </Suspense>;
  } else if (viewingQueue && queue.data) {
    content = <ExceptionQueue cases={queue.data} canRegister={role === 'agent'} />;
  } else if (!data || !caseId) {
    content = <div role="status" className={s.loading}><CircularProgress size={24} /> Loading workspace…</div>;
  } else {
    const mayAct = role !== 'agent' || isCaseOwner(data, actor);
    const props = {data, role, busy: mutation.isPending || !mayAct, run: (command: Command, next?: string) => mutation.mutate({command, next})};
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
      {!mayAct && <Alert severity="info" sx={{mb: 2}}>This case is handled by {data.assigned}.</Alert>}
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
          {caseId || registering ? <><Link to={queuePath}>Exceptions</Link><ChevronRight size={14} /><strong>{registering ? 'Register call' : caseId}</strong></> : <strong>{module?.label ?? 'Exceptions'}</strong>}
        </nav>
        <div className={s.account}>
          {onRoleChange ? <TextField label="Active role" select size="small" value={role} disabled={mutation.isPending}
            onChange={event => { mutation.reset(); onRoleChange(event.target.value as Actor['role']); }}>
            <MenuItem value="agent">Agent · Sarah Chen</MenuItem><MenuItem value="supervisor">Supervisor · Marcus Lee</MenuItem>
          </TextField> : <div className={s.accountIdentity}><strong>{actor.name}</strong><small>{role === 'agent' ? 'Agent' : 'Supervisor'}</small></div>}
          <span className={s.avatar}>{actor.name.trim().split(/\s+/).slice(0, 2).map(part => part[0]?.toUpperCase()).join('')}</span>
          {onSignOut && <Button variant="outlined" size="small" sx={{whiteSpace: 'nowrap'}} disabled={mutation.isPending} onClick={onSignOut}>Sign out</Button>}
        </div>
      </header>
      <ModuleNavigation className={s.mobileNavigation} />
      <main className={s.main}>{content}</main>
    </div>
  </div>;
}
