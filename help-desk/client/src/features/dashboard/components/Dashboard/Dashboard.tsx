import { StatsPanel } from "../StatsPanel/StatsPanel";
import { RecentActivity } from "../RecentActivity/RecentActivity";
import styles from "./Dashboard.module.css";
import { useEffect, useState } from "react";
import axios from "axios";

export function Dashboard() {
  // TODO:
  // 1. Fetch GET /stats and GET /stats/recent with axios (base URL: http://localhost:4000/api)
  // 2. Display the stats and recent activity data (pass them to StatsPanel and RecentActivity)
  // 3. Handle loading and error states

  const [stats, setStats] = useState(null);
  const [recent, setRecent] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const statsRes = await axios.get("http://localhost:4000/api/stats");
        const recRes = await axios.get(
          "http://localhost:4000/api/stats/recent",
        );

        setStats(statsRes.data.data);
        setRecent(recRes.data.data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  if (loading) return <p>Loading</p>;
  if (error) return <p>{error}</p>;

  return (
    <div className={styles.dashboard}>
      <h1>Dashboard</h1>
      {stats && <StatsPanel stats={stats} />}
      {recent && <RecentActivity tickets={recent} />}
    </div>
  );
}
