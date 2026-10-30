import { useEffect, useState } from "react";
import axios from "axios";
import type { DashboardStats } from "../types/dashboard.types";
import type { Recipe } from "../../recipes/types/recipe.types";
import { LoadingSpinner } from "../../../shared/components/LoadingSpinner";
import { StatsPanel } from "./StatsPanel";
import { FeaturedRecipes } from "./FeaturedRecipes";
import styles from "./Dashboard.module.css";

export function Dashboard() {
  // 🔴 TODO:
  // 1. Fetch GET /stats using fetch and GET /stats/featured using axios (base URL: http://localhost:4000/api)
  // 2. Display loading state and handle errors
  // 3. Pass data to StatsPanel and FeaturedRecipes components

  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [recipes, setRecipes] = useState<Recipe[]>([]);
  const [isLoading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchDashboard = async () => {
      try {
        setLoading(true);
        setError(null);

        const response = await fetch("http://localhost:4000/api/stats");
        if (!response.ok) {
          throw new Error("Failed to load statistics");
        }
        const statsData: DashboardStats = await response.json();
        setStats(statsData);

        const res = await axios.get<Recipe[]>(
          "http://localhost:4000/api/stats/featured",
        );
        setRecipes(res.data);
      } catch (err) {
        console.error(err);
        setError("Failed to load dashboard");
      } finally {
        setLoading(false);
      }
    };
    fetchDashboard();
  }, []);

  return (
    <div className={styles.container}>
      <h1>Dashboard</h1>
      {isLoading && <LoadingSpinner />}
      {error && <p role="alert">{error}</p>}
      {!isLoading && !error && stats && (
        <>
          <StatsPanel stats={stats} />
          <FeaturedRecipes recipes={recipes} />
        </>
      )}
    </div>
  );
}
