export interface Ingredient {
  name: string;
  amount: string;
}

export interface Recipe {
  id: number;
  title: string;
  description: string;
  cuisine: string;
  difficulty: string;
  prepTimeMinutes: number;
  cookTimeMinutes: number;
  servings: number;
  isVegetarian: boolean;
  ingredients: Ingredient[];
  instructions: string;
  imageUrl: string | null;
  totalTimeMinutes?: number;
  createdAt: string;
  updatedAt: string;
}

export interface RecipeFormData {
  title: string;
  description: string;
  cuisine: string;
  difficulty: string;
  prepTimeMinutes: number;
  cookTimeMinutes: number;
  servings: number;
  isVegetarian: boolean;
  ingredients: Ingredient[];
  instructions: string;
  imageUrl: string;
}
