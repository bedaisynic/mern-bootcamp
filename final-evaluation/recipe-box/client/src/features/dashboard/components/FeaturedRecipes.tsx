import { RecipeCard } from "../../recipes/components/RecipeCard/RecipeCard";
import type { Recipe } from "../../recipes/types/recipe.types";
import styles from "./FeaturedRecipes.module.css";

interface FeaturedRecipesProps {
  recipes: Recipe[];
}

export function FeaturedRecipes({ recipes }: FeaturedRecipesProps) {
  return (
    <div className={styles.container}>
      <h2>Featured Recipes</h2>
      <div className={styles.grid}>
        {recipes.map((recipe) => (
          <RecipeCard key={recipe.id} recipe={recipe} />
        ))}
      </div>
      {recipes.length === 0 && <p>No featured recipes yet</p>}
    </div>
  );
}
