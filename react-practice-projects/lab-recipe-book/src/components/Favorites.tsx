import RecipeCard from "./RecipeCard";
import { recipes } from "../data";
import { useFavorite } from "../FavoriteContext";

const Favorites: React.FC = () => {
  const { favoriteIds, toggleFavorite, isFavorite } = useFavorite();

  const favoriteRecipes = recipes.filter((recipe) => {
    return favoriteIds.includes(recipe.id);
  });

  return (
    <div className="favorites-container">
      {/* TODO: implement favorites list (data-testid="favorites-list") and "No favorites yet!" message (data-testid="no-favorites") */}
      {favoriteRecipes.length > 0 ? (
        favoriteRecipes.map((item) => {
          return (
            <div>
              <RecipeCard recipe={item} />
            </div>
          );
        })
      ) : (
        <div data-testid="no-favorites">"No favorites yet!"</div>
      )}
    </div>
  );
};

export default Favorites;
