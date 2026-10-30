import { useState, useEffect } from "react";
import axios from "axios";
import { RecipeCard } from "../../recipes/components/RecipeCard/RecipeCard";
import { useFavorites } from "../context/FavoritesContext";
import type { Recipe } from "../../recipes/types/recipe.types";
import { LoadingSpinner } from "../../../shared/components/LoadingSpinner";
import styles from "./FavoritesPage.module.css";

export function FavoritesPage() {
  const [data, setData] = useState<Recipe[]>([]);
  const [isLoading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  //  TODO: Get favorites from context, fetch recipe details for each favorite ID, handle loading/error states
  const { favorites } = useFavorites();

  useEffect(() => {
    let cancelled = false;

    const fetchFav = async () => {
      try {
        setLoading(true);
        setError(null);
        setData([]);
        const recipes: Recipe[] = [];

        for (const id of favorites) {
          const res = await axios.get<Recipe>(
            `http://localhost:4000/api/recipes/${id}`,
          );
          recipes.push(res.data);
        }

        if (!cancelled) setData(recipes);
      } catch (err) {
        console.error(err);
        if (!cancelled) setError("Failed to load favorite recipes");
      } finally {
        if (!cancelled) setLoading(false);
      }
    };
    fetchFav();

    return () => {
      cancelled = true;
    };
  }, [favorites]);

  return (
    <div className={styles.container}>
      <h1>Favorite Recipes</h1>

      {isLoading && <LoadingSpinner />}
      {error && (
        <p role="alert" className={styles.error}>
          {error}
        </p>
      )}

      {!isLoading && !error && favorites.length === 0 && (
        <div className={styles.empty}>
          <p>No favorite recipes yet</p>
          <p>Click the star icon on any recipe to add it to your favorites!</p>
        </div>
      )}

      {!isLoading && !error && favorites.length > 0 && (
        <div className={styles.grid}>
          {data.map((item) => (
            <RecipeCard key={item.id} recipe={item} />
          ))}
        </div>
      )}
    </div>
  );
}
