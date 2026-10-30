import { Request, Response, NextFunction } from "express";
import * as recipeService from "./recipe.service.js";
import { CUISINES, DIFFICULTIES, RecipeInput } from "./recipe.types.js";
import { ValidationError } from "../../shared/errors.js";

// "/recipes/abc" -> 400, instead of querying the database with NaN
const parseId = (raw: string): number => {
  const id = Number(raw);
  if (!Number.isInteger(id) || id < 1) {
    throw new ValidationError("Recipe id must be a positive integer");
  }
  return id;
};

// Manual validation. For create every field is checked; for update (partial)
// a field is only checked if the client sent it.
const validateBody = (body: any, partial: boolean): Partial<RecipeInput> => {
  if (typeof body !== "object" || body === null) {
    throw new ValidationError("Request body is required");
  }

  const check = (field: string) => !partial || body[field] !== undefined;

  if (
    check("title") &&
    (typeof body.title !== "string" || body.title.trim().length < 3)
  ) {
    throw new ValidationError("Title must be at least 3 characters");
  }
  if (
    check("description") &&
    (typeof body.description !== "string" || body.description.trim() === "")
  ) {
    throw new ValidationError("Description is required");
  }
  if (check("cuisine") && !CUISINES.includes(body.cuisine)) {
    throw new ValidationError(`Cuisine must be one of: ${CUISINES.join(", ")}`);
  }
  if (check("difficulty") && !DIFFICULTIES.includes(body.difficulty)) {
    throw new ValidationError(
      `Difficulty must be one of: ${DIFFICULTIES.join(", ")}`,
    );
  }
  if (
    check("prepTimeMinutes") &&
    !(Number.isInteger(body.prepTimeMinutes) && body.prepTimeMinutes > 0)
  ) {
    throw new ValidationError("Prep time must be a positive whole number");
  }
  if (
    check("cookTimeMinutes") &&
    !(Number.isInteger(body.cookTimeMinutes) && body.cookTimeMinutes >= 0)
  ) {
    throw new ValidationError("Cook time must be a non-negative whole number");
  }
  if (
    check("servings") &&
    !(Number.isInteger(body.servings) && body.servings > 0)
  ) {
    throw new ValidationError("Servings must be a positive whole number");
  }
  if (
    body.isVegetarian !== undefined &&
    typeof body.isVegetarian !== "boolean"
  ) {
    throw new ValidationError("isVegetarian must be true or false");
  }
  if (check("ingredients")) {
    if (!Array.isArray(body.ingredients) || body.ingredients.length === 0) {
      throw new ValidationError("At least one ingredient is required");
    }
    for (const item of body.ingredients) {
      if (typeof item?.name !== "string" || item.name.trim() === "") {
        throw new ValidationError("Ingredient name is required");
      }
      if (typeof item?.amount !== "string" || item.amount.trim() === "") {
        throw new ValidationError("Ingredient amount is required");
      }
    }
  }
  if (
    check("instructions") &&
    (typeof body.instructions !== "string" || body.instructions.trim() === "")
  ) {
    throw new ValidationError("Instructions are required");
  }
  if (
    body.imageUrl !== undefined &&
    body.imageUrl !== "" &&
    !/^https?:\/\//.test(body.imageUrl)
  ) {
    throw new ValidationError("Image URL must start with http:// or https://");
  }

  // Copy only the known fields so unexpected keys never reach the database
  const input: Partial<RecipeInput> = {};
  const fields: (keyof RecipeInput)[] = [
    "title",
    "description",
    "cuisine",
    "difficulty",
    "prepTimeMinutes",
    "cookTimeMinutes",
    "servings",
    "isVegetarian",
    "ingredients",
    "instructions",
    "imageUrl",
  ];
  for (const field of fields) {
    if (body[field] !== undefined) {
      (input as any)[field] = body[field];
    }
  }
  return input;
};

export const getAllRecipes = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const filters = {
      page: req.query.page ? parseInt(req.query.page as string) : undefined,
      limit: req.query.limit ? parseInt(req.query.limit as string) : undefined,
      search: req.query.search as string,
      cuisine: req.query.cuisine as string,
      difficulty: req.query.difficulty as string,
      isVegetarian:
        req.query.isVegetarian === "true"
          ? true
          : req.query.isVegetarian === "false"
            ? false
            : undefined,
      sortBy: req.query.sortBy as string,
      sortOrder: (req.query.sortOrder as "asc" | "desc") || "desc",
    };

    const result = await recipeService.getAllRecipes(filters);
    res.json(result);
  } catch (error) {
    next(error);
  }
};

export const getRecipeById = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const id = parseId(req.params.id);
    const recipe = await recipeService.getRecipeById(id);
    res.json(recipe);
  } catch (error) {
    next(error);
  }
};

export const createRecipe = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    // TODO: Validate req.body with validateBody (create mode), create the recipe using the service, return it with status 201
    const input = validateBody(req.body, false);
    const recipe = await recipeService.createRecipe(input as RecipeInput);
    res.status(201).json(recipe);
  } catch (error) {
    next(error);
  }
};

export const updateRecipe = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    // TODO: Get the recipe ID from params with parseId, validate req.body with validateBody (partial mode), update using the service, return the updated recipe
    const id = parseId(req.params.id);
    const input = validateBody(req.body, true);
    const recipe = await recipeService.updateRecipe(id, input);
    res.json(recipe);
  } catch (error) {
    next(error);
  }
};

export const deleteRecipe = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    // TODO: Get the recipe ID from params with parseId, delete using the service, return status 204
    const id = parseId(req.params.id);
    await recipeService.deleteRecipe(id);
    res.status(204).end();
  } catch (error) {
    next(error);
  }
};
