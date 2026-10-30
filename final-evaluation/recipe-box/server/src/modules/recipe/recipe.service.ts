import * as recipeRepository from "./recipe.repository.js";
import { RecipeFilters, RecipeInput } from "./recipe.types.js";
import { NotFoundError } from "../../shared/errors.js";
import { PaginatedResponse } from "../../shared/types.js";
import { Recipe } from "../../db/schema.js";

type RecipeWithTotalTime = Recipe & { totalTimeMinutes: number };

// 🔴 TODO (bonus): add totalTimeMinutes (prepTimeMinutes + cookTimeMinutes) to every recipe in `data`
export const getAllRecipes = async (
  filters: RecipeFilters,
): Promise<PaginatedResponse<RecipeWithTotalTime>> => {
  const page = Math.max(1, filters.page || 1);
  const limit = Math.min(50, Math.max(1, filters.limit || 10));

  const sanitizedFilters = {
    ...filters,
    page,
    limit,
  };

  const { data, totalCount } = await recipeRepository.findAll(sanitizedFilters);
  const totalPages = Math.ceil(totalCount / limit);

  return {
    data: data.map((recipe) => ({
      ...recipe,
      totalTimeMinutes: recipe.prepTimeMinutes + recipe.cookTimeMinutes,
    })),
    page,
    limit,
    totalPages,
    totalCount,
  };
};

// 🔴 TODO (bonus): return the recipe with totalTimeMinutes (prepTimeMinutes + cookTimeMinutes) added
export const getRecipeById = async (id: number): Promise<RecipeWithTotalTime> => {
  const recipe = await recipeRepository.findById(id);
  if (!recipe) {
    throw new NotFoundError(`Recipe with id ${id} not found`);
  }
  return {
    ...recipe,
    totalTimeMinutes: recipe.prepTimeMinutes + recipe.cookTimeMinutes,
  };
};

// TODO: Fill in imageUrl (empty -> null) and the timestamps, then create via the repository
export const createRecipe = async (data: RecipeInput): Promise<Recipe> => {
  const now = new Date();

  const recipe = await recipeRepository.create({
    ...data,
    imageUrl: data.imageUrl || null,
    createdAt: now,
    updatedAt: now,
  });

  return recipe;
};

// TODO: Check the recipe exists (reuse getRecipeById), turn an empty imageUrl into null, set updatedAt, update via the repository
export const updateRecipe = async (
  id: number,
  data: Partial<RecipeInput>,
): Promise<Recipe> => {
  await getRecipeById(id);

  const now = new Date();

  const updatedRecipe = await recipeRepository.update(id, {
    ...data,
    imageUrl: data.imageUrl === "" ? null : data.imageUrl,
    updatedAt: now,
  });

  return updatedRecipe;
};

// TODO: Check the recipe exists (reuse getRecipeById), then delete via the repository
export const deleteRecipe = async (id: number): Promise<void> => {
  await getRecipeById(id);
  await recipeRepository.deleteById(id);
};
