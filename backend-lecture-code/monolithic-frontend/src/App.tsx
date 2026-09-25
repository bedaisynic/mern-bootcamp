import { useEffect, useState } from "react";
import "./App.css";
import ProductsPage from "./pages/ProductsPage";
import InventoryPage from "./pages/InventoryPage";
import OrdersPage from "./pages/OrdersPage";
import AskAI from "./components/AskAI";

type Tab = "products" | "inventory" | "orders";
type Theme = "light" | "dark";

function getInitialTheme(): Theme {
  const stored = localStorage.getItem("shop-theme");
  if (stored === "light" || stored === "dark") return stored;
  return window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
}

// orders are only ever attributed to whichever customer ID is logged in —
// there's no real auth here, just a number typed into a box (see readme).
function getInitialCustomerId(): number | null {
  const stored = localStorage.getItem("shop-customer-id");
  const parsed = stored ? Number(stored) : NaN;
  return Number.isInteger(parsed) ? parsed : null;
}

function App() {
  const [tab, setTab] = useState<Tab>("products");
  const [customerId, setCustomerId] = useState<number | null>(getInitialCustomerId);
  const [customerIdDraft, setCustomerIdDraft] = useState(() => getInitialCustomerId()?.toString() ?? "");
  const [theme, setTheme] = useState<Theme>(getInitialTheme);

  useEffect(() => {
    document.documentElement.setAttribute("data-theme", theme);
    localStorage.setItem("shop-theme", theme);
  }, [theme]);

  function handleLogin() {
    const parsed = Number(customerIdDraft);
    if (!Number.isInteger(parsed) || parsed <= 0) {
      alert("Customer ID must be a positive whole number.");
      return;
    }
    setCustomerId(parsed);
    localStorage.setItem("shop-customer-id", String(parsed));
  }

  return (
    <div className="app">
      <header className="app-header">
        <div className="app-title">
          <h1>Simple Shop</h1>
          <p className="current-user">
            {customerId !== null
              ? `Logged in as customer #${customerId}`
              : "Not logged in — enter a customer ID below and click Log in"}
          </p>
        </div>
        <div className="user-box">
          <label htmlFor="customerId">Customer ID</label>
          <input
            id="customerId"
            type="number"
            min={1}
            value={customerIdDraft}
            onChange={(e) => setCustomerIdDraft(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleLogin()}
            placeholder="e.g. 123"
          />
          <button onClick={handleLogin}>Log in</button>
          <button
            className="theme-toggle"
            onClick={() => setTheme((t) => (t === "dark" ? "light" : "dark"))}
            aria-label="Toggle color theme"
          >
            {theme === "dark" ? "☀️ Light" : "🌙 Dark"}
          </button>
        </div>
      </header>

      <nav className="tabs">
        <button className={tab === "products" ? "active" : ""} onClick={() => setTab("products")}>
          Products
        </button>
        <button className={tab === "inventory" ? "active" : ""} onClick={() => setTab("inventory")}>
          Inventory
        </button>
        <button className={tab === "orders" ? "active" : ""} onClick={() => setTab("orders")}>
          Orders
        </button>
      </nav>

      <main>
        {tab === "products" && <ProductsPage customerId={customerId} />}
        {tab === "inventory" && <InventoryPage />}
        {tab === "orders" && <OrdersPage customerId={customerId} />}
      </main>

      <footer className="app-footer">
        <AskAI />
      </footer>
    </div>
  );
}

export default App;
