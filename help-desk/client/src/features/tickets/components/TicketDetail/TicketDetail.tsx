import { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { LoadingSpinner } from '../../../../shared/components/LoadingSpinner/LoadingSpinner';
import { StatusBadge, PriorityBadge } from '../../../../shared/components/Badges/Badges';
import { SlaCountdown } from '../SlaCountdown/SlaCountdown';
import { formatDate } from '../../../../shared/utils/formatters';
import type { Ticket } from '../../types/ticket.types';
import type { ApiResponse } from '../../../../shared/types/api.types';
import styles from './TicketDetail.module.css';

const API_URL = 'http://localhost:4000/api';

export function TicketDetail() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [ticket, setTicket] = useState<Ticket | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const firstButtonRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    const fetchTicket = async () => {
      try {
        const response = await axios.get<ApiResponse<Ticket>>(`${API_URL}/tickets/${id}`);
        setTicket(response.data.data);
      } catch (err: any) {
        setError(err.response?.data?.message || 'Failed to fetch ticket');
      } finally {
        setLoading(false);
      }
    };

    fetchTicket();
  }, [id]);

  useEffect(() => {
    if (ticket && firstButtonRef.current) {
      firstButtonRef.current.focus();
    }
  }, [ticket]);

  const handleStatusChange = async (newStatus: string) => {
    if (!ticket) return;

    try {
      await axios.patch(`${API_URL}/tickets/${ticket.id}/status`, { status: newStatus });
      const response = await axios.get<ApiResponse<Ticket>>(`${API_URL}/tickets/${ticket.id}`);
      setTicket(response.data.data);
    } catch (err: any) {
      alert(err.response?.data?.message || 'Failed to update status');
    }
  };

  const handleDelete = async () => {
    if (!ticket) return;
    if (!confirm('Are you sure you want to delete this ticket?')) return;

    try {
      await axios.delete(`${API_URL}/tickets/${ticket.id}`);
      navigate('/tickets');
    } catch (err: any) {
      alert(err.response?.data?.message || 'Failed to delete ticket');
    }
  };

  if (loading) return <LoadingSpinner />;
  if (error) return <div className={styles.error}>{error}</div>;
  if (!ticket) return <div className={styles.error}>Ticket not found</div>;

  const canStartWorking = ticket.status === 'open';
  const canResolve = ticket.status === 'in_progress';
  const canClose = ticket.status === 'resolved';
  const canReopen = ticket.status === 'closed';

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h1>{ticket.title}</h1>
        <div className={styles.actions}>
          <button onClick={handleDelete} className={styles.deleteButton}>
            Delete
          </button>
        </div>
      </div>

      <div className={styles.content}>
        <div className={styles.section}>
          <h2>Details</h2>
          <div className={styles.grid}>
            <div className={styles.field}>
              <span className={styles.label}>Status:</span>
              <StatusBadge status={ticket.status} />
            </div>
            <div className={styles.field}>
              <span className={styles.label}>Priority:</span>
              <PriorityBadge priority={ticket.priority} />
            </div>
            <div className={styles.field}>
              <span className={styles.label}>Category:</span>
              <span className={styles.value}>{ticket.category.replace('_', ' ')}</span>
            </div>
            <div className={styles.field}>
              <span className={styles.label}>Reporter:</span>
              <span className={styles.value}>{ticket.reporterName} ({ticket.reporterEmail})</span>
            </div>
            <div className={styles.field}>
              <span className={styles.label}>Assignee:</span>
              <span className={styles.value}>
                {ticket.assignee ? ticket.assignee.displayName : 'Unassigned'}
              </span>
            </div>
            <div className={styles.field}>
              <span className={styles.label}>Created:</span>
              <span className={styles.value}>{formatDate(ticket.createdAt)}</span>
            </div>
            <div className={styles.field}>
              <span className={styles.label}>Updated:</span>
              <span className={styles.value}>{formatDate(ticket.updatedAt)}</span>
            </div>
            <div className={styles.field}>
              <span className={styles.label}>SLA Remaining:</span>
              <SlaCountdown 
                deadline={ticket.slaDeadline} 
                resolvedAt={ticket.resolvedAt}
                closedAt={ticket.closedAt}
              />
            </div>
          </div>
        </div>

        <div className={styles.section}>
          <h2>Description</h2>
          <p className={styles.description}>{ticket.description}</p>
        </div>

        <div className={styles.section}>
          <h2>Actions</h2>
          <div className={styles.statusActions}>
            {canStartWorking && (
              <button
                ref={firstButtonRef}
                onClick={() => handleStatusChange('in_progress')}
                className={styles.actionButton}
              >
                Start Working
              </button>
            )}
            {canResolve && (
              <button
                ref={firstButtonRef}
                onClick={() => handleStatusChange('resolved')}
                className={styles.actionButton}
              >
                Resolve
              </button>
            )}
            {canClose && (
              <button
                ref={firstButtonRef}
                onClick={() => handleStatusChange('closed')}
                className={styles.actionButton}
              >
                Close
              </button>
            )}
            {canReopen && (
              <button
                ref={firstButtonRef}
                onClick={() => handleStatusChange('open')}
                className={styles.actionButton}
              >
                Reopen
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

