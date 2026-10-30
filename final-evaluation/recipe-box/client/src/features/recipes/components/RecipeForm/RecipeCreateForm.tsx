import { useNavigate } from "react-router-dom";
import styles from "./RecipeForm.module.css";
import { useState, type SubmitEvent } from "react";
import axios from "axios";
import type {
  Ingredient,
  Recipe,
  RecipeFormData,
} from "../../types/recipe.types";

export function RecipeCreateForm() {
  const navigate = useNavigate();
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [cuisine, setCuisine] = useState("Other");
  const [difficulty, setDifficulty] = useState("Medium");
  const [prepTimeMinutes, setPrepTimeMinutes] = useState(0);
  const [cookTimeMinutes, setCookTimeMinutes] = useState(0);
  const [servings, setServings] = useState(1);
  const [isVegetarian, setIsVegetarian] = useState(false);
  const [ingredients, setIngredients] = useState<Ingredient[]>([
    { name: "", amount: "" },
  ]);
  const [instructions, setInstructions] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  // TODO:
  // 1. Create form state for all recipe fields using useState (the inputs below should become controlled inputs)
  // 2. Implement form validation (title, description, times, servings, at least one ingredient, instructions)
  // 3. Handle form submission: POST /recipes with axios (base URL http://localhost:4000/api),
  //    then navigate to the new recipe's detail page
  // 4. Implement dynamic ingredient list (add/remove)

  const validate = () => {
    const newErrors: Record<string, string> = {};

    if (title.trim().length < 3) {
      newErrors.title = "Title must be at least 3 characters";
    }
    if (!description.trim()) {
      newErrors.description = "Description is required";
    }
    if (!Number.isInteger(prepTimeMinutes) || prepTimeMinutes <= 0) {
      newErrors.prepTimeMinutes = "Prep time must be a positive whole number";
    }
    if (!Number.isInteger(cookTimeMinutes) || cookTimeMinutes < 0) {
      newErrors.cookTimeMinutes =
        "Cook time must be a non-negative whole number";
    }
    if (!Number.isInteger(servings) || servings <= 0) {
      newErrors.servings = "Servings must be a positive whole number";
    }
    if (
      ingredients.length === 0 ||
      ingredients.some((item) => !item.name.trim() || !item.amount.trim())
    ) {
      newErrors.ingredients =
        "Add at least one ingredient and fill in every name and amount";
    }
    if (!instructions.trim()) {
      newErrors.instructions = "Instructions are required";
    }
    if (imageUrl && !/^https?:\/\//.test(imageUrl)) {
      newErrors.imageUrl = "Image URL must start with http:// or https://";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: SubmitEvent) => {
    e.preventDefault();
    if (submitting) return;
    setError(null);
    if (!validate()) return;

    const data: RecipeFormData = {
      title,
      description,
      cuisine,
      difficulty,
      prepTimeMinutes,
      cookTimeMinutes,
      servings,
      isVegetarian,
      ingredients,
      instructions,
      imageUrl,
    };

    try {
      setSubmitting(true);
      const res = await axios.post<Recipe>(
        "http://localhost:4000/api/recipes",
        data,
      );
      navigate(`/recipes/${res.data.id}`);
    } catch (err) {
      console.error("Error creating recipe:", err);
      if (axios.isAxiosError<{ error?: string }>(err)) {
        setError(err.response?.data?.error || "Failed to create recipe");
      } else {
        setError("Failed to create recipe");
      }
    } finally {
      setSubmitting(false);
    }
  };

  const addIngredient = () => {
    setIngredients((prev) => [...prev, { name: "", amount: "" }]);
  };

  const removeIngredient = (index: number) => {
    setIngredients((prev) => prev.filter((_, i) => i !== index));
  };

  const updateIngredient = (
    index: number,
    field: keyof Ingredient,
    value: string,
  ) => {
    setIngredients((prev) =>
      prev.map((item, i) => (i === index ? { ...item, [field]: value } : item)),
    );
  };

  return (
    <div className={styles.container}>
      <h1>Create Recipe</h1>
      {error && (
        <p role="alert" className={styles.error}>
          {error}
        </p>
      )}

      <form onSubmit={handleSubmit} className={styles.form}>
        <div className={styles.field}>
          <label htmlFor="title">Title *</label>
          <input
            id="title"
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />
          {errors.title && <span className={styles.error}>{errors.title}</span>}
        </div>

        <div className={styles.field}>
          <label htmlFor="description">Description *</label>
          <textarea
            id="description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            rows={3}
          />
          {errors.description && (
            <span className={styles.error}>{errors.description}</span>
          )}
        </div>

        <div className={styles.row}>
          <div className={styles.field}>
            <label htmlFor="cuisine">Cuisine *</label>
            <select
              id="cuisine"
              value={cuisine}
              onChange={(e) => setCuisine(e.target.value)}
            >
              <option value="Chinese">Chinese</option>
              <option value="Japanese">Japanese</option>
              <option value="Italian">Italian</option>
              <option value="Mexican">Mexican</option>
              <option value="American">American</option>
              <option value="Indian">Indian</option>
              <option value="French">French</option>
              <option value="Thai">Thai</option>
              <option value="Other">Other</option>
            </select>
          </div>

          <div className={styles.field}>
            <label htmlFor="difficulty">Difficulty *</label>
            <select
              id="difficulty"
              value={difficulty}
              onChange={(e) => setDifficulty(e.target.value)}
            >
              <option value="Easy">Easy</option>
              <option value="Medium">Medium</option>
              <option value="Hard">Hard</option>
            </select>
          </div>
        </div>

        <div className={styles.row}>
          <div className={styles.field}>
            <label htmlFor="prepTime">Prep Time (minutes) *</label>
            <input
              id="prepTime"
              type="number"
              min="1"
              value={prepTimeMinutes}
              onChange={(e) => setPrepTimeMinutes(Number(e.target.value))}
            />
            {errors.prepTimeMinutes && (
              <span className={styles.error}>{errors.prepTimeMinutes}</span>
            )}
          </div>

          <div className={styles.field}>
            <label htmlFor="cookTime">Cook Time (minutes) *</label>
            <input
              id="cookTime"
              type="number"
              min="0"
              value={cookTimeMinutes}
              onChange={(e) => setCookTimeMinutes(Number(e.target.value))}
            />
            {errors.cookTimeMinutes && (
              <span className={styles.error}>{errors.cookTimeMinutes}</span>
            )}
          </div>

          <div className={styles.field}>
            <label htmlFor="servings">Servings *</label>
            <input
              id="servings"
              type="number"
              min="1"
              value={servings}
              onChange={(e) => setServings(Number(e.target.value))}
            />
            {errors.servings && (
              <span className={styles.error}>{errors.servings}</span>
            )}
          </div>
        </div>

        <div className={styles.field}>
          <label>
            <input
              type="checkbox"
              checked={isVegetarian}
              onChange={(e) => setIsVegetarian(e.target.checked)}
            />{" "}
            Vegetarian
          </label>
        </div>

        <div className={styles.field}>
          <label>Ingredients *</label>
          {ingredients.map((ingredient, index) => (
            <div key={index} className={styles.ingredientRow}>
              <input
                type="text"
                placeholder="Amount"
                value={ingredient.amount}
                onChange={(e) =>
                  updateIngredient(index, "amount", e.target.value)
                }
                className={styles.ingredientInput}
              />
              <input
                type="text"
                placeholder="Ingredient name"
                value={ingredient.name}
                onChange={(e) =>
                  updateIngredient(index, "name", e.target.value)
                }
                className={styles.ingredientInput}
              />
              {ingredients.length > 1 && (
                <button
                  type="button"
                  onClick={() => removeIngredient(index)}
                  className={styles.removeButton}
                >
                  Remove
                </button>
              )}
            </div>
          ))}
          <button
            type="button"
            onClick={addIngredient}
            className={styles.addButton}
          >
            Add Ingredient
          </button>
          {errors.ingredients && (
            <span className={styles.error}>{errors.ingredients}</span>
          )}
        </div>

        <div className={styles.field}>
          <label htmlFor="instructions">Instructions *</label>
          <textarea
            id="instructions"
            value={instructions}
            onChange={(e) => setInstructions(e.target.value)}
            rows={6}
          />
          {errors.instructions && (
            <span className={styles.error}>{errors.instructions}</span>
          )}
        </div>

        <div className={styles.field}>
          <label htmlFor="imageUrl">Image URL (optional)</label>
          <input
            id="imageUrl"
            type="text"
            value={imageUrl}
            onChange={(e) => setImageUrl(e.target.value)}
          />
          {errors.imageUrl && (
            <span className={styles.error}>{errors.imageUrl}</span>
          )}
        </div>

        <div className={styles.actions}>
          <button
            type="submit"
            disabled={submitting}
            className={styles.submitButton}
          >
            {submitting ? "Creating..." : "Create Recipe"}
          </button>
          <button
            type="button"
            onClick={() => navigate("/recipes")}
            className={styles.cancelButton}
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
}
