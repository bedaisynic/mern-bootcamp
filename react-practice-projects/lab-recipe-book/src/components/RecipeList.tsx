import type { Recipe } from "./types";
import RecipeCard from "./RecipeCard";
import { recipes } from "../data";
import { useState } from "react";

const RecipeList: React.FC = () => {
  const [query, setQuery] = useState("");

  const filterRecipes = recipes.filter((recipe) => {
    return recipe.name.toLowerCase().includes(query.toLowerCase());
  });

  return (
    <div className="recipe-list-container">
      {/* TODO: implement search bar (filter recipes by name, case insensitive) */}
      <input
        type="text"
        placeholder="Search recipes..."
        className="search-input"
        data-testid="search-input"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
      />

      {/* TODO: render a RecipeCard for each recipe that matches the search query */}
      {/* <div className="recipe-list" data-testid="recipe-list">
        <RecipeCard />
      </div> */}

      <div>
        {filterRecipes.length > 0 ? (
          <div className="recipe-list" data-testid="recipe-list">
            {filterRecipes.map((item) => {
              const { id } = item;
              return <RecipeCard key={id} recipe={item} />;
            })}
          </div>
        ) : (
          <div data-testid="no-recipes-message">
            "No recipes match your search."
          </div>
        )}
      </div>
      {/* TODO: display "No recipes match your search." (data-testid="no-recipes-message") when the search query matches nothing */}
    </div>
  );
};

export default RecipeList;
