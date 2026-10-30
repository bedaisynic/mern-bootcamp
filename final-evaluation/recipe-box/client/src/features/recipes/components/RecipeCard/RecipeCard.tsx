import { Link } from "react-router-dom";
import { FavoriteButton } from "../../../favorites/components/FavoriteButton";
import { formatTime } from "../../../../shared/utils/formatters";
import type { Recipe } from "../../types/recipe.types";
import styles from "./RecipeCard.module.css";

interface RecipeCardProps {
  recipe: Recipe;
}

// TODO: Accept recipe prop and use all its properties dynamically
export function RecipeCard({ recipe }: RecipeCardProps) {
  const {
    id,
    title,
    description,
    cuisine,
    difficulty,
    isVegetarian,
    prepTimeMinutes,
    cookTimeMinutes,
    imageUrl,
    servings,
  } = recipe;

  console.log("!!!!!!!!!!!data", recipe);
  return (
    <div className={styles.card}>
      {imageUrl && <img src={imageUrl} alt={title} className={styles.image} />}
      <div className={styles.content}>
        <div className={styles.header}>
          <h3 className={styles.title}>
            <Link to={`/recipes/${recipe.id}`}>{title}</Link>
          </h3>
          <FavoriteButton recipeId={id} />
        </div>
        <p className={styles.description}>{description}</p>
        <div className={styles.meta}>
          <span className={styles.badge}>{cuisine}</span>
          <span className={styles.badge}>{difficulty}</span>
          {isVegetarian && <span className={styles.badge}>Vegetarian</span>}
        </div>
        <div className={styles.time}>
          <span>Prep: {formatTime(prepTimeMinutes)}</span>
          <span>Cook: {formatTime(cookTimeMinutes)}</span>
          <span>Servings: {servings}</span>
        </div>
      </div>
    </div>
  );
}
