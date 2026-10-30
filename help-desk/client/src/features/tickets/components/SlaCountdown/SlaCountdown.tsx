import { useState, useEffect, useRef } from 'react';
import { formatTimeRemaining } from '../../../../shared/utils/formatters';
import styles from './SlaCountdown.module.css';

interface SlaCountdownProps {
  deadline: string;
  resolvedAt: string | null;
  closedAt: string | null;
}

export function SlaCountdown({ deadline, resolvedAt, closedAt }: SlaCountdownProps) {
  const [timeRemaining, setTimeRemaining] = useState(formatTimeRemaining(deadline));
  const intervalRef = useRef<number | undefined>(undefined);
  useEffect(() => {
    if (resolvedAt || closedAt) {
      return;
    }
    intervalRef.current = window.setInterval(() => {
      setTimeRemaining(formatTimeRemaining(deadline));
    }, 1000);
    return () => {
      if (intervalRef.current !== undefined) {
        clearInterval(intervalRef.current);
      }
    };
  }, [deadline, resolvedAt, closedAt]);
  if (resolvedAt || closedAt) {
    return <div className={styles.completed}>Completed</div>;
  }

  const isBreached = timeRemaining === 'BREACHED';

  return (
    <div className={isBreached ? styles.breached : styles.countdown}>
      {timeRemaining}
    </div>
  );
}
