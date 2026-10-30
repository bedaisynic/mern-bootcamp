import * as statsRepository from "./stats.repository.js";

export const getStats = async () => {
  const [
    { statusCounts, priorityCounts },
    avgResolutionTime,
    slaBreachCount,
    totalCount,
  ] = await Promise.all([
    statsRepository.getTicketCounts(),
    statsRepository.getAvgResolutionTime(),
    statsRepository.getSlaBreachCount(),
    statsRepository.getTotalCount(),
  ]);

  const statusMap: Record<string, number> = {};
  statusCounts.forEach((item) => {
    statusMap[item.status] = item.count;
  });

  const priorityMap: Record<string, number> = {};
  priorityCounts.forEach((item) => {
    priorityMap[item.priority] = item.count;
  });

  return {
    success: true,
    data: {
      totalTickets: totalCount,
      openTickets: statusMap["open"] || 0,
      avgResolutionTimeSeconds: Math.round(avgResolutionTime),
      slaBreachCount,
      statusCounts: statusMap,
      priorityCounts: priorityMap,
    },
  };
};

// TODO: Accept a limit and pass it to the repository (it already takes one, default 5)
export const getRecent = async (count: number) => {
  const tickets = await statsRepository.getRecentTickets(count);

  return {
    success: true,
    data: tickets,
  };
};
