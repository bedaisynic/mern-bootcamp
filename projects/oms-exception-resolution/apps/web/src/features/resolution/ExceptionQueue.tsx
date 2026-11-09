import { useState } from 'react';
import { Button, InputAdornment, TextField } from '@mui/material';
import { ArrowRight, ClipboardList, PhoneCall, Search } from 'lucide-react';
import { Link } from 'react-router-dom';
import type { Workspace } from '@oms/oms-mock-adapters';
import { casePath, intakePath, nextStep } from './navigation';
import { Card, Tag } from './panels';
import s from './workspace.module.css';

export function ExceptionQueue({cases, canRegister}: {cases: Workspace[]; canRegister: boolean}) {
  const [search, setSearch] = useState('');
  const term = search.trim().toLowerCase();
  const matches = cases.filter(data => [data.id, data.orderId, data.customer, data.issue]
    .some(value => value.toLowerCase().includes(term)));
  return <div className={s.stack}>
    <header className={s.queueHeading}>
      <div className={s.pageHeading}>
        <span className={s.eyebrow}>CUSTOMER SUPPORT</span>
        <h1>Exception queue</h1>
        <p>Open a registered case to continue handling it, or register a call to start a new case.</p>
      </div>
      {canRegister && <Button component={Link} to={intakePath} variant="contained" startIcon={<PhoneCall size={16} />}>Register call</Button>}
    </header>
    <Card title="Registered cases" icon={<ClipboardList size={19} />}>
      <div className={s.queueToolbar}>
        <TextField label="Search exceptions" placeholder="Case ID, order number, or customer" size="small" sx={{width: 'min(100%, 320px)'}} value={search}
          onChange={event => setSearch(event.target.value)}
          slotProps={{input: {startAdornment: <InputAdornment position="start"><Search size={16} /></InputAdornment>}}} />
        <span className={s.muted} role="status">
          {matches.length === cases.length
            ? cases.length + (cases.length === 1 ? ' case' : ' cases')
            : matches.length + ' of ' + cases.length + ' cases'}
        </span>
      </div>
      <div className={s.tableScroll}>
        <table className={s.queueTable}>
          <thead><tr>
            <th scope="col">Case ID</th><th scope="col">Order number</th><th scope="col">Customer</th>
            <th scope="col">Handled by</th><th scope="col">Status</th><th scope="col">Next step</th><th scope="col">Action</th>
          </tr></thead>
          <tbody>{matches.length ? matches.map(data => <tr key={data.id}>
            <td><span className={s.mobileQueueLabel} aria-hidden="true">Case ID</span><strong>{data.id}</strong><small>{data.issue}</small></td>
            <td><span className={s.mobileQueueLabel} aria-hidden="true">Order number</span>{data.orderId}<small>{data.brand}</small></td>
            <td><span className={s.mobileQueueLabel} aria-hidden="true">Customer</span>{data.customer}</td>
            <td><span className={s.mobileQueueLabel} aria-hidden="true">Handled by</span>{data.assigned}</td>
            <td><span className={s.mobileQueueLabel} aria-hidden="true">Status</span><div className={s.heroTags}>
              <Tag tone={data.status === 'Open' ? 'blue' : 'green'}>{data.status}</Tag><Tag tone="amber">{data.priority} priority</Tag>
            </div></td>
            <td><span className={s.mobileQueueLabel} aria-hidden="true">Next step</span>{nextStep(data).label}</td>
            <td><Button component={Link} to={casePath(data.id)} variant="outlined" size="small" endIcon={<ArrowRight size={15} />}
              aria-label={'Open case ' + data.id}>Open case</Button></td>
          </tr>) : <tr><td colSpan={7} className={s.queueEmpty}>No cases match this search.
            <Button size="small" onClick={() => setSearch('')}>Clear search</Button>
          </td></tr>}</tbody>
        </table>
      </div>
    </Card>
  </div>;
}
