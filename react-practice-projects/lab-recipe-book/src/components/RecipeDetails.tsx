import { useParams, Link } from "react-router-dom";
import { recipes } from "../data";

const RecipeDetails: React.FC = () => {
  const { id } = useParams();

  const recipe = recipes.find((item) => item.id === Number(id));

  if (!recipe) {
    return <div>Recipe not found.</div>;
  }

  const { name, description, ingredients } = recipe;

  return (
    <div className="recipe-details" data-testid="recipe-details">
      <h3>{name}</h3>
      <div>
        <ul>
          {ingredients.map((ingredient) => {
            return (
              <div>
                <li>{ingredient}</li>
              </div>
            );
          })}
        </ul>
      </div>
      <p>{description}</p>

      <Link className="back-button" to="/">
        Back
      </Link>
    </div>
  );
};

export default RecipeDetails;
