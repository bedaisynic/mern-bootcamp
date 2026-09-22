import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import recipes from "./data";
import { Recipe } from "./types";
import RecipeList from "./components/RecipeList";
import RecipeDetails from "./components/RecipeDetails";
import Favorites from "./components/Favorites";
import { AppHeader } from "./components/AppHeader";
import { FavoritesProvider, useFavorite } from "./FavoriteContext";
import "./App.css";

const title: string = "Recipe Book";

const App: React.FC = () => {
  return (
    <FavoritesProvider>
      <div className="App">
        <AppHeader title={title} />
        <Router>
          <div className="app">
            <header>
              <nav data-testid="navbar">
                <Link to="/">Home</Link>
                <Link to="/favorites">Favorites</Link>
              </nav>
            </header>
          </div>
          <Routes>
            <Route path="/" element={<RecipeList />} />
            <Route path="/recipe/:id" element={<RecipeDetails />} />
            <Route path="/favorites" element={<Favorites />} />
          </Routes>
        </Router>
      </div>
    </FavoritesProvider>
  );
};

export default App;
