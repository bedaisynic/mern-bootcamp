import { Link } from "react-router-dom";
import { Recipe } from "../types";
import { recipes } from "../data";
import { useFavorite } from "../FavoriteContext";

interface RecipeCardProps {
  recipe: Recipe;
}

const RecipeCard: React.FC<RecipeCardProps> = ({ recipe }) => {
  const { toggleFavorite, isFavorite } = useFavorite();

  const handleAddToFav = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    toggleFavorite(id);
  };

  const { id, name, description } = recipe;

  return (
    <div className="recipe-card" data-testid="recipe-card">
      <h3>{name}</h3>
      <p>{description}</p>
      <div className="card-actions">
        <button onClick={handleAddToFav}>
          {isFavorite(id) ? "Remove from Favorites" : "Add to Favorites"}
        </button>
        <div>
          <Link to={`/recipe/${id}`}>View Details</Link>
        </div>
      </div>
    </div>
  );
};

export default RecipeCard;
