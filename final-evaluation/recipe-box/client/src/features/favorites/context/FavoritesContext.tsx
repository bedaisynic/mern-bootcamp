import { createContext, useContext, useState, type ReactNode } from "react";
import type { FavoritesContextType } from "../types/favorites.types";

const FavoritesContext = createContext<FavoritesContextType | undefined>(
  undefined,
);

export function FavoritesProvider({ children }: { children: ReactNode }) {
  // TODO: Create favorites state, toggleFavorite and isFavorite functions, wrap children in Provider
  const [favorite, setFavorite] = useState<number[]>([]);

  const toggleFavorite = (id: number) => {
    setFavorite((prev) => {
      if (prev.includes(id)) {
        return prev.filter((item) => item !== id);
      }
      return [...prev, id];
    });
  };

  const isFavorite = (id: number) => {
    return favorite.includes(id);
  };

  return (
    <FavoritesContext.Provider
      value={{
        favorites: favorite,
        toggleFavorite,
        isFavorite,
      }}
    >
      {children}
    </FavoritesContext.Provider>
  );
}

export function useFavorites() {
  const context = useContext(FavoritesContext);
  if (!context) {
    throw new Error("useFavorites must be used within FavoritesProvider");
  }
  return context;
}
