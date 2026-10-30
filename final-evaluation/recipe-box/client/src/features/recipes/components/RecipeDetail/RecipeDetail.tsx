import { Link, useNavigate, useParams } from "react-router-dom";
import { FavoriteButton } from "../../../favorites/components/FavoriteButton";
import { CookTimer } from "../CookTimer/CookTimer";
import { formatTime } from "../../../../shared/utils/formatters";
import styles from "./RecipeDetail.module.css";
import { useEffect, useState } from "react";
import type { Recipe } from "../../types/recipe.types";
import axios from "axios";
import { LoadingSpinner } from "../../../../shared/components/LoadingSpinner";

export function RecipeDetail() {
  // 🔴 TODO:
  // 1. Get recipe ID from URL params using useParams
  // 2. Fetch GET /recipes/:id with axios on component mount, and send DELETE /recipes/:id from the delete handler
  // 3. Display loading state and handle errors
  // 4. Implement delete handler with confirmation dialog
  const [data, setData] = useState<Recipe | null>(null);
  const [isLoading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [deleteError, setDeleteError] = useState<string | null>(null);

  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchDetails = async () => {
      try {
        setLoading(true);
        setError(null);
        setDeleteError(null);
        const res = await axios.get<Recipe>(
          `http://localhost:4000/api/recipes/${id}`,
        );
        setData(res.data);
      } catch (err) {
        console.error(err);
        setError("Failed to load recipe");
      } finally {
        setLoading(false);
      }
    };
    fetchDetails();
  }, [id]);

  const handleDelete = async () => {
    const confirmed = window.confirm("Are you sure you want to delete this recipe?");
    if (!confirmed) return;

    try {
      setDeleteError(null);
      await axios.delete(`http://localhost:4000/api/recipes/${id}`);
      navigate("/recipes");
    } catch (err) {
      console.error("Error deleting recipe:", err);
      setDeleteError("Failed to delete recipe");
    }
  };

  if (isLoading) {
    return <LoadingSpinner />;
  }

  if (error) {
    return <p role="alert" className={styles.error}>{error}</p>;
  }

  if (data === null) {
    return <p>No recipe ;)</p>;
  }

  const {
    title,
    description,
    cuisine,
    difficulty,
    isVegetarian,
    prepTimeMinutes,
    cookTimeMinutes,
    imageUrl,
    servings,
    ingredients,
    instructions,
  } = data;

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <Link to="/recipes" className={styles.back}>
          ← Back to Recipes
        </Link>
        <div className={styles.actions}>
          <FavoriteButton recipeId={data.id} />
          <Link to={`/recipes/${data.id}/edit`} className={styles.editButton}>
            Edit
          </Link>
          <button onClick={handleDelete} className={styles.deleteButton}>
            Delete
          </button>
        </div>
      </div>
      {deleteError && (
        <p role="alert" className={styles.error}>{deleteError}</p>
      )}
      {imageUrl && <img src={imageUrl} alt={title} className={styles.image} />}
      <h1>{title}</h1>
      <p className={styles.description}>{description}</p>
      <div className={styles.meta}>
        <span className={styles.badge}>{cuisine}</span>
        <span className={styles.badge}>{difficulty}</span>
        {isVegetarian && <span className={styles.badge}>Vegetarian</span>}
      </div>
      <div className={styles.info}>
        <div className={styles.infoItem}>
          <strong>Prep Time:</strong> {formatTime(prepTimeMinutes)}
        </div>
        <div className={styles.infoItem}>
          <strong>Cook Time:</strong> {formatTime(cookTimeMinutes)}
        </div>
        <div className={styles.infoItem}>
          <strong>Servings:</strong> {servings}
        </div>
      </div>
      <CookTimer />
      <section className={styles.section}>
        <h2>Ingredients</h2>
        <ul className={styles.ingredients}>
          {ingredients.map((ingredient, index) => (
            <li key={index}>
              <strong>{ingredient.amount}</strong> {ingredient.name}
            </li>
          ))}
        </ul>
      </section>
      <section className={styles.section}>
        <h2>Instructions</h2>
        <p className={styles.instructions}>{instructions}</p>
      </section>
    </div>
  );
}
