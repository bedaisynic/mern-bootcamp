import { db } from "../../db/index.js";
import { recipes } from "../../db/schema.js";
import { sql } from "drizzle-orm";

export const getStats = async () => {
  const totalCount = await db
    .select({ count: sql<number>`count(*)` })
    .from(recipes);
  const avgPrepTime = await db
    .select({ avg: sql<number>`avg(prep_time_minutes)` })
    .from(recipes);
  const cuisineBreakdown = await db
    .select({
      cuisine: recipes.cuisine,
      count: sql<number>`count(*)`,
    })
    .from(recipes)
    .groupBy(recipes.cuisine);

  return {
    totalCount: Number(totalCount[0]?.count || 0),
    avgPrepTime: Number(avgPrepTime[0]?.avg || 0),
    cuisineBreakdown,
  };
};

export const getFeatured = async (count = 3) => {
  const featured = await db
    .select()
    .from(recipes)
    .orderBy(sql`RANDOM()`)
    .limit(count);

  return featured;
};
