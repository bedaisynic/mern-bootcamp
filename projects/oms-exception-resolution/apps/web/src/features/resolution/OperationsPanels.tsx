import type { ReactNode } from 'react';
import { Activity, BarChart3, Boxes, ClipboardCheck, Clock3, FileText, Headphones, Package, ShieldCheck, Truck, Warehouse } from 'lucide-react';
import type { Workspace } from '@oms/oms-mock-adapters';
import { actors, type Actor } from '@oms/shared-types';
import { nextStep, responseTarget } from './navigation';
import { Card, Tag } from './panels';
import productImage from './toscana-table.jpg';
import s from './operations.module.css';
import w from './workspace.module.css';

const pages = {
  '/dashboard': {title: 'Operations dashboard', description: 'Track exception workload and see where customer orders need attention.'},
  '/orders': {title: 'Orders', description: 'Review order details, payments, and delivery status for orders linked to exceptions.'},
  '/inventory': {title: 'Inventory', description: 'Review stock and reservations for items on affected orders.'},
  '/warehouse': {title: 'Warehouse', description: 'Review fulfillment status, facilities, and revised release dates.'},
  '/delivery': {title: 'Delivery', description: 'Review original delivery windows, confirmed appointments, and carrier availability.'},
  '/reports': {title: 'Reports', description: 'Review resolution outcomes and response targets for the current case queue.'},
  '/settings': {title: 'Settings', description: 'Review your workspace profile, access, and service policies.'},
};
export type OperationsPath = keyof typeof pages;
type Row = {id: string; cells: ReactNode[]};

function Metrics({items}: {items: {label: string; value: number | string; detail: string; icon: ReactNode}[]}) {
  return <div className={s.metrics}>{items.map(item => <section className={s.metric} key={item.label}>
    <div className={s.metricLabel}><span>{item.label}</span>{item.icon}</div>
    <strong>{item.value}</strong><p>{item.detail}</p>
  </section>)}</div>;
}

function Records({label, columns, rows}: {label: string; columns: string[]; rows: Row[]}) {
  return <div className={s.tableWrap} tabIndex={0} role="region" aria-label={label}>
    <table className={s.table} aria-label={label}>
      <thead><tr>{columns.map(column => <th scope="col" key={column}>{column}</th>)}</tr></thead>
      <tbody>{rows.length ? rows.map(row => <tr key={row.id}>{row.cells.map((cell, index) =>
        index === 0 ? <th scope="row" key={columns[index]}>{cell}</th> : <td key={columns[index]}>{cell}</td>,
      )}</tr>) : <tr><td colSpan={columns.length}>No records to display.</td></tr>}</tbody>
    </table>
  </div>;
}

function CaseStatus({status}: {status: Workspace['status']}) {
  return <Tag tone={status === 'Open' ? 'blue' : 'green'}>{status}</Tag>;
}
function Workload({cases}: {cases: Workspace[]}) {
  const statusCounts = (['Open', 'Resolved', 'Closed'] as const).map(status => ({
    status, count: cases.filter(record => record.status === status).length,
  }));
  return <Card title="Case status breakdown" subtitle="All cases in the exception queue" icon={<BarChart3 size={19} />}>
    <div className={s.breakdown}>{statusCounts.map(item => <div key={item.status} className={s.breakdownRow}>
      <span>{item.status}</span>
      <div className={s.bar} aria-hidden="true"><span className={s[item.status.toLowerCase()]} style={{width: (100 * item.count / (cases.length || 1)) + '%'}} /></div>
      <strong>{item.count}</strong>
    </div>)}</div>
  </Card>;
}
function Dashboard({cases}: {cases: Workspace[]}) {
  const pending = cases.filter(record => record.workflow?.status === 'pending');
  const followUp = cases.filter(record => record.status === 'Resolved' && !record.response?.sentAt);
  const active = cases.filter(record => record.status !== 'Closed');
  return <>
    <Metrics items={[
      {label: 'Open exceptions', value: cases.filter(record => record.status === 'Open').length, detail: 'Awaiting a resolution', icon: <Activity size={17} />},
      {label: 'Pending approval', value: pending.length, detail: 'Awaiting a supervisor decision', icon: <ShieldCheck size={17} />},
      {label: 'Customer follow-up', value: followUp.length, detail: 'Resolved, customer update pending', icon: <Headphones size={17} />},
      {label: 'Closed cases', value: cases.length - active.length, detail: 'Resolution and follow-up complete', icon: <ClipboardCheck size={17} />},
    ]} />
    <div className={s.panelColumns}>
      <Card title="Active work" subtitle="Most recently opened cases" icon={<Activity size={19} />}>
        <Records label="Active exceptions" columns={['Case', 'Customer', 'Next step']} rows={active.slice(0, 6).map(record => ({
          id: record.id, cells: [record.id, record.customer, nextStep(record).label],
        }))} />
      </Card>
      <Workload cases={cases} />
    </div>
  </>;
}

function Orders({cases}: {cases: Workspace[]}) {
  return <Card title="Order records" subtitle={cases.length + ' orders linked to exceptions'} icon={<Package size={19} />}>
    <Records label="Order records" columns={['Order number', 'Customer', 'Item', 'Placed', 'Payment', 'Delivery', 'Case']} rows={cases.map(record => {
      const {order, delivery} = record.context;
      return {id: record.id, cells: [
        <>{record.orderId}<small>{record.brand}</small></>, record.customer,
        order ? <div className={s.product}><img src={productImage} alt="" /><span>{order.item}<small>{order.sku}</small></span></div> : 'Unavailable',
        order?.placed ?? 'Unavailable', <Tag tone={order?.payment === 'Captured' ? 'green' : 'neutral'}>{order?.payment ?? 'Unavailable'}</Tag>,
        <Tag tone={delivery?.appointment ? 'green' : 'amber'}>{delivery?.status ?? 'Unavailable'}</Tag>,
        <>{record.id} <CaseStatus status={record.status} /></>,
      ]};
    })} />
  </Card>;
}
function Inventory({cases}: {cases: Workspace[]}) {
  const records = cases.flatMap(record => record.context.inventory ? [{record, stock: record.context.inventory}] : []);
  return <>
    <Metrics items={[
      {label: 'Affected SKUs', value: new Set(records.map(({stock}) => stock.sku)).size, detail: 'Distinct SKUs on exception orders', icon: <Boxes size={17} />},
      {label: 'Reserved units', value: records.reduce((count, {stock}) => count + stock.reserved, 0), detail: 'Units reserved for these orders', icon: <Package size={17} />},
      {label: 'Stock locations', value: new Set(records.map(({stock}) => stock.location)).size, detail: 'Distribution locations in this view', icon: <Warehouse size={17} />},
    ]} />
    <Card title="Inventory by order" subtitle="Availability and reservation details" icon={<Boxes size={19} />}>
      <Records label="Inventory by order" columns={['Order', 'SKU', 'Stock location', 'Reserved', 'Sellable', 'Status']} rows={records.map(({record, stock}) => ({
        id: record.id, cells: [record.orderId, stock.sku, stock.location, stock.reserved, stock.sellable, <Tag tone="green">{stock.status}</Tag>],
      }))} />
    </Card>
  </>;
}
function WarehousePanel({cases}: {cases: Workspace[]}) {
  const records = cases.flatMap(record => record.context.warehouse ? [{record, site: record.context.warehouse}] : []);
  return <>
    <Metrics items={[
      {label: 'Facilities', value: new Set(records.map(({site}) => site.facility)).size, detail: 'Facilities handling affected orders', icon: <Warehouse size={17} />},
      {label: 'Orders tracked', value: records.length, detail: 'Orders with a warehouse record', icon: <Package size={17} />},
      {label: 'Fulfillment delays', value: records.filter(({site}) => site.status === 'Fulfillment delayed').length, detail: 'Orders with a recorded staging delay', icon: <Clock3 size={17} />},
    ]} />
    <Card title="Fulfillment records" subtitle="Outbound staging and facility notes" icon={<Warehouse size={19} />}>
      <Records label="Fulfillment records" columns={['Order', 'Facility', 'Release', 'Status', 'Warehouse notes']} rows={records.map(({record, site}) => ({
        id: record.id, cells: [record.orderId, site.facility, site.release, <Tag tone="amber">{site.status}</Tag>, site.fact],
      }))} />
    </Card>
  </>;
}
function Delivery({cases}: {cases: Workspace[]}) {
  const records = cases.flatMap(record => record.context.delivery ? [{record, delivery: record.context.delivery}] : []);
  return <>
    <Metrics items={[
      {label: 'Missed appointments', value: records.filter(({delivery}) => !delivery.appointment).length, detail: 'Orders without a new appointment', icon: <Clock3 size={17} />},
      {label: 'Rescheduled', value: records.filter(({delivery}) => delivery.appointment).length, detail: 'Orders with a confirmed new window', icon: <Truck size={17} />},
      {label: 'Carrier windows', value: new Set(records.flatMap(({delivery}) => delivery.slots.filter(slot => slot.capacity > 0).map(slot => slot.id))).size, detail: 'Distinct windows available across these orders', icon: <Activity size={17} />},
    ]} />
    <Card title="Delivery appointments" subtitle="Original and current carrier windows" icon={<Truck size={19} />}>
      <Records label="Delivery appointments" columns={['Order', 'Customer', 'Original window', 'Confirmed window', 'Status']} rows={records.map(({record, delivery}) => ({
        id: record.id, cells: [record.orderId, record.customer, delivery.original, delivery.appointment ?? 'Awaiting reschedule',
          <Tag tone={delivery.appointment ? 'green' : 'amber'}>{delivery.status}</Tag>],
      }))} />
    </Card>
  </>;
}
function Reports({cases}: {cases: Workspace[]}) {
  const completed = cases.filter(record => record.workflow?.execution);
  const notified = cases.filter(record => record.response?.sentAt);
  const onTime = notified.filter(record => !responseTarget(record).overdue).length;
  return <>
    <Metrics items={[
      {label: 'Resolutions executed', value: completed.length, detail: 'Cases with an execution receipt', icon: <ClipboardCheck size={17} />},
      {label: 'Customers notified', value: notified.length, detail: 'Cases with a recorded customer update', icon: <Headphones size={17} />},
      {label: 'Responses within target', value: notified.length ? Math.round(100 * onTime / notified.length) + '%' : '—',
        detail: onTime + ' of ' + notified.length + ' sent responses', icon: <Clock3 size={17} />},
    ]} />
    <div className={s.panelColumns}>
      <Card title="Resolution outcomes" subtitle="Cases with a completed resolution" icon={<FileText size={19} />}>
        <Records label="Resolution outcomes" columns={['Case', 'Outcome', 'Status']} rows={completed.map(record => ({
          id: record.id, cells: [record.id, record.workflow?.execution?.summary, <CaseStatus status={record.status} />],
        }))} />
      </Card>
      <Workload cases={cases} />
    </div>
  </>;
}
function SettingsPanel({role}: {role: Actor['role']}) {
  const actor = actors[role];
  return <div className={s.settings}>
    <Card title="Workspace profile" subtitle="Current session" icon={<Headphones size={19} />}>
      <dl className={s.fields}>
        <div><dt>Name</dt><dd>{actor.name}</dd></div><div><dt>Role</dt><dd>{role === 'agent' ? 'Customer service agent' : 'Supervisor'}</dd></div>
        <div><dt>Workspace</dt><dd>Customer Care · Order Operations</dd></div>
      </dl>
    </Card>
    <Card title="Access and approvals" subtitle="Exception workflow permissions" icon={<ShieldCheck size={19} />}>
      <dl className={s.fields}>
        <div><dt>Customer service agent</dt><dd>Register, investigate, execute, notify, and close cases</dd></div>
        <div><dt>Supervisor</dt><dd>Approve or decline resolution requests</dd></div>
        <div><dt>Goodwill credit approval</dt><dd>Required above $50</dd></div>
      </dl>
    </Card>
    <Card title="Service targets" subtitle="Delivery exception settings" icon={<Clock3 size={19} />}>
      <dl className={s.fields}>
        <div><dt>Customer response target</dt><dd>4 hours from case opening</dd></div>
        <div><dt>Service time zone</dt><dd>Pacific Time</dd></div>
        <div><dt>Currency</dt><dd>USD</dd></div>
      </dl>
    </Card>
  </div>;
}

export function OperationsPanel({path, cases, role}: {path: OperationsPath; cases: Workspace[]; role: Actor['role']}) {
  const {title, description} = pages[path];
  const content = {
    '/dashboard': <Dashboard cases={cases} />,
    '/orders': <Orders cases={cases} />,
    '/inventory': <Inventory cases={cases} />,
    '/warehouse': <WarehousePanel cases={cases} />,
    '/delivery': <Delivery cases={cases} />,
    '/reports': <Reports cases={cases} />,
    '/settings': <SettingsPanel role={role} />,
  };
  return <div className={w.stack}>
    <header className={w.pageHeading}>
      <span className={w.eyebrow}>ORDER OPERATIONS</span><h1>{title}</h1><p>{description}</p>
    </header>
    {content[path]}
  </div>;
}
