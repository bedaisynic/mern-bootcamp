import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import { RecipeCard } from "../RecipeCard/RecipeCard";
import { RecipeFilter } from "../RecipeFilter/RecipeFilter";
import { LoadingSpinner } from "../../../../shared/components/LoadingSpinner";
import type { Recipe } from "../../types/recipe.types";
import type { PaginatedResponse } from "../../../../shared/types/api.types";
import styles from "./RecipeList.module.css";

const API_URL = "http://localhost:4000/api";

export function RecipeList() {
  const [search, setSearch] = useState("");
  const [cuisine, setCuisine] = useState("");
  const [difficulty, setDifficulty] = useState("");
  const [isVegetarian, setIsVegetarian] = useState("");
  const [sortBy, setSortBy] = useState("createdAt");
  const [sortOrder, setSortOrder] = useState("desc");
  const [page, setPage] = useState(1);

  const [data, setData] = useState<PaginatedResponse<Recipe> | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchRecipes = async () => {
      setLoading(true);
      setError(null);
      try {
        //  TODO 1: GET `${API_URL}/recipes` with axios, passing the filters and page as query params
        // (search, cuisine, difficulty, isVegetarian, sortBy, sortOrder, page). Empty strings should be left out.
        // Then store response.data with setData.

        const res = await axios.get(`${API_URL}/recipes`, {
          params: {
            search: search || undefined,
            cuisine: cuisine || undefined,
            difficulty: difficulty || undefined,
            isVegetarian: isVegetarian || undefined,
            sortBy,
            sortOrder,
            page,
          },
        });

        setData(res.data);
      } catch (err) {
        setError(
          err instanceof Error ? err.message : "Failed to fetch recipes",
        );
      } finally {
        setLoading(false);
      }
    };

    fetchRecipes();
  }, [search, cuisine, difficulty, isVegetarian, sortBy, sortOrder, page]);

  // Changing any filter sends the user back to page 1
  const handleFilterChange =
    (setter: (value: string) => void) => (value: string) => {
      setter(value);
      setPage(1);
    };

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h1>Recipes</h1>
        <Link to="/recipes/new" className={styles.createButton}>
          Create Recipe
        </Link>
      </div>

      <RecipeFilter
        search={search}
        cuisine={cuisine}
        difficulty={difficulty}
        isVegetarian={isVegetarian}
        sortBy={sortBy}
        sortOrder={sortOrder}
        onSearchChange={handleFilterChange(setSearch)}
        onCuisineChange={handleFilterChange(setCuisine)}
        onDifficultyChange={handleFilterChange(setDifficulty)}
        onVegetarianChange={handleFilterChange(setIsVegetarian)}
        onSortByChange={handleFilterChange(setSortBy)}
        onSortOrderChange={handleFilterChange(setSortOrder)}
      />

      {loading && <LoadingSpinner />}
      {error && <p>{error}</p>}

      {!loading && !error && data && (
        <>
          <div className={styles.grid}>
            {/* TODO 2: Render one RecipeCard for each recipe in data.data (give it a key and pass the recipe) */}
            {data.data.map((item) => {
              const { id } = item;
              return <RecipeCard key={id} recipe={item} />;
            })}
          </div>

          <div className={styles.pagination}>
            {/* TODO 3: Make Previous go to the previous page and Next go to the next page */}
            <button
              disabled={page <= 1}
              onClick={() => {
                setPage((prev) => prev - 1);
              }}
              className={styles.pageButton}
            >
              Previous
            </button>
            <span className={styles.pageInfo}>
              Page {data.page} of {data.totalPages}
            </span>
            <button
              disabled={page >= data.totalPages}
              onClick={() => {
                setPage((prev) => prev + 1);
              }}
              className={styles.pageButton}
            >
              Next
            </button>
          </div>
        </>
      )}
    </div>
  );
}
