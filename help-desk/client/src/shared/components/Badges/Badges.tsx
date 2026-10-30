import styles from './Badges.module.css';

export function StatusBadge({ status }: { status: string }) {
  return (
    <span className={`${styles.badge} ${styles[`status_${status}`]}`}>
      {status.replace('_', ' ')}
    </span>
  );
}

export function PriorityBadge({ priority }: { priority: string }) {
  return (
    <span className={`${styles.badge} ${styles[`priority_${priority}`]}`}>
      {priority}
    </span>
  );
}
