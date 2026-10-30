import { useEffect, useState } from 'react';
import axios from 'axios';
import styles from './TicketFilter.module.css';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:4000/api';

interface TicketFilterProps {
  search: string;
  onSearchChange: (value: string) => void;
  status: string;
  priority: string;
  category: string;
  assigneeId: string;
  sortBy: string;
  sortOrder: string;
  onFilterChange: (key: string, value: string) => void;
}

export function TicketFilter({
  search,
  onSearchChange,
  status,
  priority,
  category,
  assigneeId,
  sortBy,
  sortOrder,
  onFilterChange,
}: TicketFilterProps) {
  const [users, setUsers] = useState<any[]>([]);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await axios.get(`${API_URL}/users`);
        setUsers(response.data.data);
      } catch (err) {
        console.error('Failed to fetch users:', err);
      }
    };
    fetchUsers();
  }, []);

  return (
    <div className={styles.filters}>
      <input
        type="text"
        placeholder="Search tickets..."
        value={search}
        onChange={(e) => onSearchChange(e.target.value)}
        className={styles.searchInput}
      />

      <select
        value={status}
        onChange={(e) => onFilterChange('status', e.target.value)}
        className={styles.select}
      >
        <option value="">All Statuses</option>
        <option value="open">Open</option>
        <option value="in_progress">In Progress</option>
        <option value="resolved">Resolved</option>
        <option value="closed">Closed</option>
      </select>

      <select
        value={priority}
        onChange={(e) => onFilterChange('priority', e.target.value)}
        className={styles.select}
      >
        <option value="">All Priorities</option>
        <option value="low">Low</option>
        <option value="medium">Medium</option>
        <option value="high">High</option>
        <option value="urgent">Urgent</option>
      </select>

      <select
        value={category}
        onChange={(e) => onFilterChange('category', e.target.value)}
        className={styles.select}
      >
        <option value="">All Categories</option>
        <option value="bug">Bug</option>
        <option value="feature_request">Feature Request</option>
        <option value="question">Question</option>
        <option value="account_issue">Account Issue</option>
        <option value="other">Other</option>
      </select>

      <select
        value={assigneeId}
        onChange={(e) => onFilterChange('assigneeId', e.target.value)}
        className={styles.select}
      >
        <option value="">All Assignees</option>
        {users.map(user => (
          <option key={user.id} value={user.id}>{user.displayName}</option>
        ))}
      </select>

      <select
        value={sortBy}
        onChange={(e) => onFilterChange('sortBy', e.target.value)}
        className={styles.select}
      >
        <option value="createdAt">Created Date</option>
        <option value="updatedAt">Updated Date</option>
        <option value="priority">Priority</option>
        <option value="slaDeadline">SLA Deadline</option>
      </select>

      <select
        value={sortOrder}
        onChange={(e) => onFilterChange('sortOrder', e.target.value)}
        className={styles.select}
      >
        <option value="desc">Descending</option>
        <option value="asc">Ascending</option>
      </select>
    </div>
  );
}
