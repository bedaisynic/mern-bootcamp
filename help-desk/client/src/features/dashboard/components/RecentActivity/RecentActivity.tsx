import { Link } from "react-router-dom";
import { StatusBadge } from "../../../../shared/components/Badges/Badges";
import styles from "./RecentActivity.module.css";

// TODO: Accept tickets prop (Ticket[]) and render each ticket as a link with title, updated date, and status badge
export function RecentActivity({ tickets }) {
  return (
    <div className={styles.panel}>
      <h2 className={styles.title}>Recent Activity</h2>
      <div className={styles.list}>
        {tickets.map((item) => {
          const { id, updatedAt, status } = item;
          const date = new Date(updatedAt).toLocaleString();

          return (
            <Link key={id} to="/tickets/1" className={styles.item}>
              <div className={styles.itemRow}>
                <div>
                  <div className={styles.itemTitle}>{item.title}</div>
                  <div className={styles.itemDate}>Updated {date} </div>
                </div>
                <StatusBadge status={status} />
              </div>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
