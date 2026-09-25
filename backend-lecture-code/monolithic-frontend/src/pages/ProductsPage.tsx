import { useEffect, useState } from "react";
import { api, ApiError, type Product } from "../api";
import Pagination from "../components/Pagination";

const PAGE_SIZE = 12;

type OrderFeedback = { type: "success" | "error"; message: string };

export default function ProductsPage({ customerId }: { customerId: number | null }) {
  const [products, setProducts] = useState<Product[]>([]);
  const [q, setQ] = useState("");
  const [debouncedQ, setDebouncedQ] = useState("");
  const [page, setPage] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [quantities, setQuantities] = useState<Record<number, number>>({});
  const [feedback, setFeedback] = useState<Record<number, OrderFeedback>>({});
  const [placingId, setPlacingId] = useState<number | null>(null);

  // debounce the raw search text before it drives any fetch
  useEffect(() => {
    const timeout = setTimeout(() => setDebouncedQ(q), 300);
    return () => clearTimeout(timeout);
  }, [q]);

  // a new search always starts back at page 1
  useEffect(() => {
    setPage(0);
  }, [debouncedQ]);

  useEffect(() => {
    load(debouncedQ, page);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [debouncedQ, page]);

  async function load(search: string, pageNum: number) {
    setLoading(true);
    setError(null);
    try {
      const rows = await api.listProducts({
        q: search.trim() || undefined,
        skip: pageNum * PAGE_SIZE,
        limit: PAGE_SIZE,
      });
      setProducts(rows);
    } catch (err) {
      setError(err instanceof ApiError ? err.message : "Failed to load products.");
    } finally {
      setLoading(false);
    }
  }

  async function placeOrder(productId: number) {
    if (customerId === null) {
      setFeedback((f) => ({
        ...f,
        [productId]: { type: "error", message: "Log in with a customer ID above before ordering." },
      }));
      return;
    }

    const quantity = quantities[productId] ?? 1;
    setPlacingId(productId);
    setFeedback((f) => {
      const next = { ...f };
      delete next[productId];
      return next;
    });
    try {
      const order = await api.placeOrder(productId, quantity, customerId);
      setFeedback((f) => ({
        ...f,
        [productId]: { type: "success", message: `Order #${order.id} placed for customer #${customerId}.` },
      }));
    } catch (err) {
      const message = err instanceof ApiError ? err.message : "Failed to place order.";
      setFeedback((f) => ({ ...f, [productId]: { type: "error", message } }));
    } finally {
      setPlacingId(null);
    }
  }

  return (
    <section>
      <div className="toolbar">
        <input
          placeholder="Search products by name or SKU..."
          value={q}
          onChange={(e) => setQ(e.target.value)}
        />
      </div>

      {customerId === null && (
        <p className="muted">Log in with a customer ID above to place orders.</p>
      )}
      {loading && <p className="muted">Loading products...</p>}
      {error && <p className="error">{error}</p>}

      <div className="grid">
        {products.map((p) => (
          <div className="card" key={p.id}>
            <h3>{p.name}</h3>
            <p className="muted">SKU: {p.sku}</p>
            <p className="price">${(p.priceCents / 100).toFixed(2)}</p>
            <div className="order-row">
              <input
                type="number"
                min={1}
                value={quantities[p.id] ?? 1}
                onChange={(e) =>
                  setQuantities((q) => ({
                    ...q,
                    [p.id]: Math.max(1, Number(e.target.value) || 1),
                  }))
                }
              />
              <button disabled={placingId === p.id} onClick={() => placeOrder(p.id)}>
                {placingId === p.id ? "Placing..." : "Order"}
              </button>
            </div>
            {feedback[p.id] && (
              <p className={feedback[p.id].type === "error" ? "error" : "success"}>
                {feedback[p.id].message}
              </p>
            )}
          </div>
        ))}
      </div>

      {!loading && !error && products.length === 0 && <p className="muted">No products found.</p>}

      <Pagination
        page={page}
        hasNext={products.length === PAGE_SIZE}
        onPrev={() => setPage((p) => Math.max(0, p - 1))}
        onNext={() => setPage((p) => p + 1)}
      />
    </section>
  );
}
