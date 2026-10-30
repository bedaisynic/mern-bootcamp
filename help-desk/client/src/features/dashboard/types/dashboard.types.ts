export interface DashboardStats {
  totalTickets: number;
  openTickets: number;
  avgResolutionTimeSeconds: number;
  slaBreachCount: number;
  statusCounts: Record<string, number>;
  priorityCounts: Record<string, number>;
}
