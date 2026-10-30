import type { DashboardStats } from "../types/dashboard.types";
import styles from "./StatsPanel.module.css";

interface StatsPanelProps {
  stats: DashboardStats;
}

// 🔴 TODO: Accept stats prop and use its properties dynamically
export function StatsPanel({ stats }: StatsPanelProps) {
  return (
    <div className={styles.panel}>
      <div className={styles.card}>
        <h3>Total Recipes</h3>
        <p className={styles.number}>{stats.totalRecipes}</p>
      </div>

      <div className={styles.card}>
        <h3>Avg Prep Time</h3>
        <p className={styles.number}>{stats.avgPrepTime} min</p>
      </div>

      <div className={styles.card}>
        <h3>Cuisine Distribution</h3>
        <div className={styles.distribution}>
          {stats.cuisineDistribution.map((item) => (
            <div key={item.cuisine} className={styles.distributionItem}>
              <span>{item.cuisine}</span>
              <span className={styles.percentage}>{item.percentage}%</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
