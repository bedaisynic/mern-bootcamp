import { Link } from 'react-router-dom';
import { formatTimeRemaining } from '../../../../shared/utils/formatters';
import { StatusBadge, PriorityBadge } from '../../../../shared/components/Badges/Badges';
import type { Ticket } from '../../types/ticket.types';
import styles from './TicketCard.module.css';

interface TicketCardProps {
  ticket: Ticket;
}

export function TicketCard({ ticket }: TicketCardProps) {
  const slaRemaining = formatTimeRemaining(ticket.slaDeadline);
  const isBreached = slaRemaining === 'BREACHED';

  return (
    <Link to={`/tickets/${ticket.id}`} className={styles.card}>
      <div className={styles.header}>
        <h3 className={styles.title}>{ticket.title}</h3>
        <div className={styles.badges}>
          <StatusBadge status={ticket.status} />
          <PriorityBadge priority={ticket.priority} />
        </div>
      </div>
      
      <div className={styles.info}>
        <div className={styles.infoItem}>
          <span className={styles.label}>Reporter:</span>
          <span>{ticket.reporterName}</span>
        </div>
        {ticket.assignee && (
          <div className={styles.infoItem}>
            <span className={styles.label}>Assignee:</span>
            <span>{ticket.assignee.displayName}</span>
          </div>
        )}
        <div className={styles.infoItem}>
          <span className={styles.label}>SLA:</span>
          <span className={isBreached ? styles.breached : styles.sla}>
            {slaRemaining}
          </span>
        </div>
      </div>
    </Link>
  );
}
