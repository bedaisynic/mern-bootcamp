import { NavLink } from 'react-router-dom';
import { UserBadge } from '../../features/auth/components/UserBadge/UserBadge';
import styles from './Navbar.module.css';

export function Navbar() {
  return (
    <nav className={styles.navbar}>
      <div className={styles.container}>
        <div className={styles.brand}>Helpdesk Tracker</div>
        <div className={styles.links}>
          <NavLink 
            to="/" 
            className={({ isActive }) => isActive ? `${styles.link} ${styles.active}` : styles.link}
            end
          >
            Dashboard
          </NavLink>
          <NavLink
            to="/tickets"
            className={({ isActive }) => isActive ? `${styles.link} ${styles.active}` : styles.link}
          >
            Tickets
          </NavLink>
          <NavLink
            to="/users"
            className={({ isActive }) => isActive ? `${styles.link} ${styles.active}` : styles.link}
          >
            Users
          </NavLink>
        </div>
        <UserBadge />
      </div>
    </nav>
  );
}
