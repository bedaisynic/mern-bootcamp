import { useRef, useState, type ReactNode } from 'react';
import { TablePagination } from '@mui/material';
import { Activity, BarChart3, Boxes, ClipboardCheck, Clock3, FileText, Headphones, Package, ShieldCheck, Truck, Warehouse } from 'lucide-react';
import type { Actor } from '@oms/shared-types';
import { booked, channels, dayAt, delivered, facilities, inventory, openWork, orders, periodStart, shipments, snapshotDate, warehouseWork } from './operations-data';
import { Card, Tag } from './panels';
import s from './operations.module.css';
import w from './workspace.module.css';

const pages = {
  '/dashboard': {title: 'Operations dashboard', description: 'Track order volume, fulfillment workload, and delivery performance across the network.'},
  '/orders': {title: 'Orders', description: 'Review orders across brands, sales channels, and fulfillment locations.'},
  '/inventory': {title: 'Inventory', description: 'Review stock positions and incoming quantities by SKU and location.'},
  '/warehouse': {title: 'Warehouse', description: 'Track outbound work from release and picking through dispatch.'},
  '/delivery': {title: 'Delivery', description: 'Track scheduled and shipped orders by carrier, service, and delivery status.'},
  '/reports': {title: 'Reports', description: 'Review order volume, booked value, and fulfillment performance for the reporting period.'},
  '/settings': {title: 'Settings', description: 'Review your workspace profile, access, and service policies.'},
};
export type OperationsPath = keyof typeof pages;
type Row = {id: string; cells: ReactNode[]};
const count = (value: number) => value.toLocaleString('en-US');
const dollars = new Intl.NumberFormat('en-US', {style: 'currency', currency: 'USD', maximumFractionDigits: 0});
const dates = new Intl.DateTimeFormat('en-US', {month: 'short', day: 'numeric', timeZone: 'UTC'});
const date = (value: string) => dates.format(new Date(value + 'T00:00:00Z'));
const period = date(periodStart) + ' – ' + date(snapshotDate) + ', 2026';
const onTime = delivered.filter(({shipment}) => shipment.onTime).length;
const deliveryRate = Math.round(100 * onTime / (delivered.length || 1)) + '%';
const transit = shipments.filter(({shipment}) => ['In transit', 'Out for delivery'].includes(shipment.status));
const delayed = shipments.filter(({shipment}) => shipment.status === 'Delayed');
const bookedValue = booked.reduce((total, order) => total + order.total, 0);
const PAGE_SIZE = 25;

function Metrics({items}: {items: {label: string; value: number | string; detail: string; icon: ReactNode}[]}) {
  return <div className={s.metrics}>{items.map(item => <section className={s.metric} key={item.label}>
    <div className={s.metricLabel}><span>{item.label}</span>{item.icon}</div>
    <strong>{typeof item.value === 'number' ? count(item.value) : item.value}</strong><p>{item.detail}</p>
  </section>)}</div>;
}

function Records<T>({label, columns, records, row}: {label: string; columns: string[]; records: T[]; row: (record: T) => Row}) {
  const [page, setPage] = useState(0);
  const scrollArea = useRef<HTMLDivElement>(null);
  const paged = records.length > PAGE_SIZE;
  const rows = records.slice(page * PAGE_SIZE, (page + 1) * PAGE_SIZE).map(row);
  return <>
    <div ref={scrollArea} className={s.tableWrap + (paged ? ' ' + s.pagedTable : '')} tabIndex={0} role="region" aria-label={label}>
      <table className={s.table} aria-label={label}>
        <thead><tr>{columns.map(column => <th scope="col" key={column}>{column}</th>)}</tr></thead>
        <tbody>{rows.length ? rows.map(item => <tr key={item.id}>{item.cells.map((cell, index) =>
          index === 0 ? <th scope="row" key={columns[index]}>{cell}</th> : <td key={columns[index]}>{cell}</td>,
        )}</tr>) : <tr><td colSpan={columns.length}>No records to display.</td></tr>}</tbody>
      </table>
    </div>
    {paged && <TablePagination component="div" count={records.length} page={page} rowsPerPage={PAGE_SIZE}
      rowsPerPageOptions={[PAGE_SIZE]} onPageChange={(_event, next) => {
        setPage(next);
        if (scrollArea.current) scrollArea.current.scrollTop = 0;
      }} labelDisplayedRows={({from, to, count: total}) => count(from) + '–' + count(to) + ' of ' + count(total)} />}
  </>;
}

function Status({label}: {label: string}) {
  const tone = ['Paid', 'Fulfilled', 'Delivered', 'Dispatched', 'In stock'].includes(label) ? 'green'
    : ['On hold', 'Delayed', 'Low stock', 'Out of stock', 'Overdue'].includes(label) ? 'amber'
    : ['Canceled', 'Refunded', 'Voided'].includes(label) ? 'neutral' : 'blue';
  return <Tag tone={tone}>{label}</Tag>;
}

function Breakdown({rows}: {rows: {label: string; value: number}[]}) {
  const max = Math.max(1, ...rows.map(row => row.value));
  return <div className={s.breakdown}>{rows.map(row => <div key={row.label} className={s.breakdownRow}>
    <span>{row.label}</span>
    <div className={s.bar} aria-hidden="true"><span style={{width: (100 * row.value / max) + '%'}} /></div>
    <strong>{count(row.value)}</strong>
  </div>)}</div>;
}
function Dashboard() {
  const recent = Array.from({length: 7}, (_, index) => dayAt(6 - index));
  return <>
    <Metrics items={[
      {label: 'Orders received', value: orders.length, detail: 'All orders in the last 30 days', icon: <Package size={17} />},
      {label: 'Awaiting dispatch', value: openWork.length, detail: 'Outbound orders still in the warehouse', icon: <Warehouse size={17} />},
      {label: 'In transit', value: transit.length, detail: 'Includes out-for-delivery shipments', icon: <Truck size={17} />},
      {label: 'Delivered on time', value: deliveryRate, detail: count(delivered.length) + ' completed deliveries', icon: <ClipboardCheck size={17} />},
    ]} />
    <div className={s.panelColumns}>
      <Card title="Order volume" subtitle="Orders placed over the last 7 days" icon={<BarChart3 size={19} />}>
        <Breakdown rows={recent.map(day => ({label: date(day), value: orders.filter(order => order.placed === day).length}))} />
      </Card>
      <Card title="Fulfillment status" subtitle="Order distribution across the reporting period" icon={<Activity size={19} />}>
        <Breakdown rows={['Fulfilled', 'Unfulfilled', 'Scheduled', 'On hold', 'Canceled'].map(label => ({
          label, value: orders.filter(order => order.fulfillment === label).length,
        }))} />
      </Card>
    </div>
    <Card title="Distribution network" subtitle="Outbound work and deliveries by facility" icon={<Warehouse size={19} />}>
      <Records label="Distribution network" columns={['Facility', 'Region', 'Awaiting dispatch', 'Overdue', 'Delivered']} records={facilities} row={facility => ({
        id: facility.id, cells: [facility.name, facility.region,
          count(openWork.filter(({order}) => order.facility.id === facility.id).length),
          count(openWork.filter(({order, work}) => order.facility.id === facility.id && work.overdue).length),
          count(delivered.filter(({order}) => order.facility.id === facility.id).length)],
      })} />
    </Card>
  </>;
}

function Orders() {
  return <Card title="Order records" subtitle={count(orders.length) + ' orders · ' + period} icon={<Package size={19} />}>
    <Records label="Order records" columns={['Order number', 'Placed', 'Customer', 'Item', 'Channel', 'Total', 'Payment', 'Fulfillment']}
      records={orders} row={order => ({id: order.id, cells: [
        <>{order.id}<small>{order.product.brand}</small></>, date(order.placed), order.customer,
        <>{order.product.name}<small>{order.product.sku} · {order.quantity} unit{order.quantity > 1 ? 's' : ''}</small></>,
        order.channel, dollars.format(order.total), <Status label={order.payment} />, <Status label={order.fulfillment} />,
      ]})} />
  </Card>;
}
function Inventory() {
  return <>
    <Metrics items={[
      {label: 'Active SKUs', value: new Set(inventory.map(record => record.product.sku)).size, detail: 'Distinct products and variants', icon: <Boxes size={17} />},
      {label: 'On-hand units', value: inventory.reduce((sum, record) => sum + record.onHand, 0), detail: 'Physical stock across all locations', icon: <Package size={17} />},
      {label: 'Low-stock positions', value: inventory.filter(record => record.available <= 5).length, detail: 'Five or fewer units available to sell', icon: <Activity size={17} />},
    ]} />
    <Card title="Stock by location" subtitle={count(inventory.length) + ' SKU and facility combinations'} icon={<Boxes size={19} />}>
      <Records label="Stock by location" columns={['SKU / item', 'Location', 'On hand', 'Available', 'Committed', 'Unavailable', 'Incoming', 'Status']}
        records={inventory} row={record => ({id: record.id, cells: [
          <>{record.product.sku}<small>{record.product.name}</small></>, record.facility.name,
          count(record.onHand), count(record.available), count(record.committed), count(record.unavailable), count(record.incoming),
          <Status label={record.available === 0 ? 'Out of stock' : record.available <= 5 ? 'Low stock' : 'In stock'} />,
        ]})} />
    </Card>
  </>;
}
function WarehousePanel() {
  return <>
    <Metrics items={[
      {label: 'Facilities', value: facilities.length, detail: 'Outbound distribution network', icon: <Warehouse size={17} />},
      {label: 'Open outbound work', value: openWork.length, detail: 'Awaiting release, picking, packing, or dispatch', icon: <Package size={17} />},
      {label: 'Overdue for dispatch', value: openWork.filter(({work}) => work.overdue).length, detail: 'Open work past planned dispatch date', icon: <Clock3 size={17} />},
    ]} />
    <Card title="Outbound work orders" subtitle={count(warehouseWork.length) + ' work orders · ' + period} icon={<Warehouse size={19} />}>
      <Records label="Outbound work orders" columns={['Work order', 'Customer order', 'Facility', 'SKU', 'Units', 'Dispatch due', 'Stage']}
        records={warehouseWork} row={({order, work}) => ({id: work.id, cells: [
          work.id, order.id, order.facility.name, order.product.sku, order.quantity, date(work.due),
          <div className={w.heroTags}><Status label={work.status} />{work.overdue && <Status label="Overdue" />}</div>,
        ]})} />
    </Card>
  </>;
}
function Delivery() {
  return <>
    <Metrics items={[
      {label: 'Shipments', value: shipments.length, detail: 'Scheduled and dispatched shipments', icon: <Truck size={17} />},
      {label: 'In transit', value: transit.length, detail: 'Including out-for-delivery shipments', icon: <Activity size={17} />},
      {label: 'Delayed', value: delayed.length, detail: 'Open shipments past their promised date', icon: <Clock3 size={17} />},
    ]} />
    <Card title="Shipment tracking" subtitle={count(shipments.length) + ' shipments · ' + period} icon={<Truck size={19} />}>
      <Records label="Shipment tracking" columns={['Shipment', 'Order', 'Carrier / service', 'Tracking number', 'Promised', 'Delivered', 'Status']}
        records={shipments} row={({order, shipment}) => ({id: shipment.id, cells: [
          shipment.id, order.id, <>{shipment.carrier}<small>{shipment.service}</small></>, shipment.tracking ?? '—',
          date(shipment.promised), shipment.delivered ? date(shipment.delivered) : '—', <Status label={shipment.status} />,
        ]})} />
    </Card>
  </>;
}
function Reports() {
  const channelSummary = channels.map(channel => {
    const channelOrders = booked.filter(order => order.channel === channel);
    const value = channelOrders.reduce((sum, order) => sum + order.total, 0);
    return {channel, orders: channelOrders.length, value, average: value / (channelOrders.length || 1)};
  });
  const carrierSummary = [...new Set(shipments.map(({shipment}) => shipment.carrier))].map(carrier => {
    const carrierShipments = delivered.filter(({shipment}) => shipment.carrier === carrier);
    const metTarget = carrierShipments.filter(({shipment}) => shipment.onTime).length;
    return {carrier, delivered: carrierShipments.length, onTime: metTarget,
      rate: carrierShipments.length ? Math.round(100 * metTarget / carrierShipments.length) + '%' : '—'};
  });
  return <>
    <Metrics items={[
      {label: 'Booked order value', value: dollars.format(bookedValue), detail: 'Excludes canceled orders', icon: <BarChart3 size={17} />},
      {label: 'Average order value', value: dollars.format(bookedValue / (booked.length || 1)), detail: 'Booked value per non-canceled order', icon: <FileText size={17} />},
      {label: 'On-time deliveries', value: deliveryRate, detail: count(onTime) + ' of ' + count(delivered.length) + ' delivered by promise date', icon: <Truck size={17} />},
    ]} />
    <div className={s.panelColumns}>
      <Card title="Orders by sales channel" subtitle={period} icon={<FileText size={19} />}>
        <Records label="Orders by sales channel" columns={['Channel', 'Orders', 'Booked value', 'Average order']} records={channelSummary}
          row={item => ({id: item.channel, cells: [item.channel, count(item.orders), dollars.format(item.value), dollars.format(item.average)]})} />
      </Card>
      <Card title="Carrier performance" subtitle="Completed deliveries by promise date" icon={<BarChart3 size={19} />}>
        <Records label="Carrier performance" columns={['Carrier', 'Delivered', 'On time', 'Rate']} records={carrierSummary}
          row={item => ({id: item.carrier, cells: [item.carrier, count(item.delivered), count(item.onTime), item.rate]})} />
      </Card>
    </div>
  </>;
}
function SettingsPanel({actor}: {actor: Actor}) {
  return <div className={s.settings}>
    <Card title="Workspace profile" subtitle="Current session" icon={<Headphones size={19} />}>
      <dl className={s.fields}>
        <div><dt>Name</dt><dd>{actor.name}</dd></div><div><dt>Role</dt><dd>{actor.role === 'agent' ? 'Customer service agent' : 'Supervisor'}</dd></div>
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

export default function OperationsPanel({path, actor}: {path: OperationsPath; actor: Actor}) {
  const {title, description} = pages[path];
  const content = {
    '/dashboard': <Dashboard />, '/orders': <Orders />, '/inventory': <Inventory />, '/warehouse': <WarehousePanel />,
    '/delivery': <Delivery />, '/reports': <Reports />, '/settings': <SettingsPanel actor={actor} />,
  };
  return <div className={w.stack}>
    <header className={w.pageHeading}>
      <span className={w.eyebrow}>ORDER OPERATIONS</span><h1>{title}</h1><p>{description}</p>
      {path !== '/settings' && <span className={s.period}>Reporting period · {period}</span>}
    </header>
    {content[path]}
  </div>;
}
