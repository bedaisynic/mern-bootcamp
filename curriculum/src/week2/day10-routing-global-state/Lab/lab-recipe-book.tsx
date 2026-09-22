import { useState } from "react";
import {
  BrowserRouter,
  Routes,
  Route,
  useParams,
  createContext,
  useContext,
} from "react-router-dom";

const recipes: Recipes[] = [
  {
    id: 1,
    name: "Spaghetti Carbonara",
    content: "A classic Italian pasta dish.",
  },
  {
    id: 2,
    name: "Caprese Salad",
    content: "A fresh salad with tomatoes, mozzarella, and basil.",
  },
  {
    id: 3,
    name: "Chicken Tikka Masala",
    contents: "A creamy and spicy Indian dish.",
  },
  {
    id: 4,
    name: "Vegetable Stir Fry",
    content: "A quick and healthy vegetable dish.",
  },
];

interface Recipes {
  id: number;
  name: string;
  content: string;
}

interface RecipesProps {
  recipes: Recipes[];
}

function Home({ recipes }: RecipesBoxProps) {
  return (
    <div>
      <h1>Homepage</h1>
      <h2>This is a homepage</h2>
    </div>
  );
}

function Homepage({ recipes }: RecipesBoxProps) {
  return (
    <div>
      <h1>Recipes</h1>

      {recipes.map((item) => {
        return (
          <div key={item.id}>
            {item.name} - {item.minutes} minutes
          </div>
        );
      })}
    </div>
  );
}
