import { useFavorites } from "../context/FavoritesContext";
import styles from "./FavoriteButton.module.css";

interface FavoriteButtonProps {
  recipeId: number;
}

export function FavoriteButton({ recipeId }: FavoriteButtonProps) {
  // TODO: Use useFavorites hook, check if favorited, handle toggle click
  const { toggleFavorite, isFavorite } = useFavorites();

  const favorited = isFavorite(recipeId);

  return (
    <button
      onClick={() => toggleFavorite(recipeId)}
      className={styles.button}
      aria-label={favorited ? "Remove from favorites" : "Add to favorites"}
      aria-pressed={favorited}
    >
      {favorited ? "★" : "☆"}
    </button>
  );
}
