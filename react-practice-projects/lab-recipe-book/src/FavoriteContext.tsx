import { createContext, useContext, useState, ReactNode } from "react";

export interface Recipe {
  id: number;
  name: string;
  image: string;
  description: string;
  ingredients: string[];
  instructions: string;
}

export interface FavoriteContextType {
  favoriteIds: number[];
  toggleFavorite: (id: number) => void;
  isFavorite: (id: number) => boolean;
}

export interface FavoritesProviderProps {
  children: ReactNode;
}

export const FavoriteContext = createContext<FavoriteContextType | null>(null);

export function FavoritesProvider({ children }: FavoritesProviderProps) {
  const [favoriteIds, setFavoriteIds] = useState([]);

  const toggleFavorite = (id: number) => {
    setFavoriteIds((prev) => {
      return prev.includes(id)
        ? prev.filter((favId) => favId !== id)
        : [...prev, id];
    });
  };

  const isFavorite = (id: number) => {
    return favoriteIds.includes(id);
  };

  return (
    <FavoriteContext.Provider
      value={{ favoriteIds, toggleFavorite, isFavorite }}
    >
      {children}
    </FavoriteContext.Provider>
  );
}

export function useFavorite() {
  const favoriteContext = useContext(FavoriteContext);

  if (!favoriteContext) {
    throw new Error("Cannot use context outside of a provider");
  }

  return favoriteContext;
}
