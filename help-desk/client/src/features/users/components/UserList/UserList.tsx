import { useState, useMemo } from "react";
import type { User, UserRole } from "../../types/user.types";
import styles from "./UserList.module.css";

export function UserList() {
  // 🔴 TODO (bonus):
  // 1. Fetch GET http://localhost:4000/api/users with axios inside useEffect, and store response.data.data with setUsers
  //    (the response looks like { success: true, data: User[] })
  // 2. Track loading and error states, and show them instead of the table
  // 3. Replace the hardcoded <tr> rows below with filteredAndSorted.map() — remember the key prop
  // 4. Show "No users found" when filteredAndSorted is empty
  // 5. Replace the hardcoded count with filteredAndSorted.length
  const [users, setUsers] = useState<User[]>([]);
  const [roleFilter, setRoleFilter] = useState("");
  const [sortOrder, setSortOrder] = useState("asc");

  // already written: filter by role and sort by display name
  const filteredAndSorted = useMemo(() => {
    const filtered = roleFilter ? users.filter((u) => u.role === roleFilter) : users;
    return [...filtered].sort((a, b) =>
      sortOrder === "asc"
        ? a.displayName.localeCompare(b.displayName)
        : b.displayName.localeCompare(a.displayName),
    );
  }, [users, roleFilter, sortOrder]);

  // don't change, helper function to get the CSS class for the role badge
  const getRoleBadgeClass = (role: UserRole) => {
    if (role === "admin") return `${styles.roleBadge} ${styles.roleAdmin}`;
    if (role === "agent") return `${styles.roleBadge} ${styles.roleAgent}`;
    return `${styles.roleBadge} ${styles.roleViewer}`;
  };

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h1>Users</h1>
      </div>

      <div className={styles.controls}>
        <label>
          Role
          <select value={roleFilter} onChange={(e) => setRoleFilter(e.target.value)}>
            <option value="">All Roles</option>
            <option value="admin">Admin</option>
            <option value="agent">Agent</option>
            <option value="viewer">Viewer</option>
          </select>
        </label>

        <label>
          Sort by Name
          <select value={sortOrder} onChange={(e) => setSortOrder(e.target.value)}>
            <option value="asc">A → Z</option>
            <option value="desc">Z → A</option>
          </select>
        </label>

        <span className={styles.resultCount}>
          {/* 🔴 TODO (bonus): replace hardcoded count with the number of filtered users */}
          3 users
        </span>
      </div>
      <table className={styles.table}>
        <thead>
          <tr>
            <th>Display Name</th>
            <th>Username</th>
            <th>Email</th>
            <th>Role</th>
            <th>Created At</th>
          </tr>
        </thead>
        <tbody>
          {/* 🔴 TODO (bonus): replace hardcoded rows with filteredAndSorted.map() */}
          <tr>
            <td>Admin User</td>
            <td>admin</td>
            <td>admin@helpdesk.com</td>
            <td>
              <span className={getRoleBadgeClass("admin")}>admin</span>
            </td>
            <td>6/1/2026</td>
          </tr>
          <tr>
            <td>Alice Johnson</td>
            <td>alice</td>
            <td>alice@helpdesk.com</td>
            <td>
              <span className={getRoleBadgeClass("agent")}>agent</span>
            </td>
            <td>6/1/2026</td>
          </tr>
          <tr>
            <td>Dave Brown</td>
            <td>dave</td>
            <td>dave@helpdesk.com</td>
            <td>
              <span className={getRoleBadgeClass("viewer")}>viewer</span>
            </td>
            <td>6/1/2026</td>
          </tr>
        </tbody>
      </table>
    </div>
  );
}
