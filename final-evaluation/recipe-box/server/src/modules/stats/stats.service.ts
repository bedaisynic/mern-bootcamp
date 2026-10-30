import * as statsRepository from "./stats.repository.js";

export const getStats = async () => {
  const { totalCount, avgPrepTime, cuisineBreakdown } =
    await statsRepository.getStats();

  const cuisineDistribution = cuisineBreakdown.map((item) => ({
    cuisine: item.cuisine,
    count: Number(item.count),
    percentage:
      totalCount > 0 ? Math.round((Number(item.count) / totalCount) * 100) : 0,
  }));

  return {
    totalRecipes: totalCount,
    avgPrepTime: Math.round(avgPrepTime),
    cuisineDistribution,
  };
};

// TODO: Accept a count and pass it to the repository (it already takes one, default 3)
export const getFeatured = async (count: number) => {
  return statsRepository.getFeatured(count);
};
