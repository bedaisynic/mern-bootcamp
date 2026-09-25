import { useEffect, useState } from "react";
import { api, ApiError, type InventoryRow } from "../api";
import Pagination from "../components/Pagination";

const PAGE_SIZE = 20;

export default function InventoryPage() {
  const [rows, setRows] = useState<InventoryRow[]>([]);
  const [page, setPage] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [filter, setFilter] = useState("");

  useEffect(() => {
    load(page);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [page]);

  async function load(pageNum: number) {
    setLoading(true);
    setError(null);
    try {
      const data = await api.listInventory({ offset: pageNum * PAGE_SIZE, limit: PAGE_SIZE });
      setRows(data);
    } catch (err) {
      setError(err instanceof ApiError ? err.message : "Failed to load inventory.");
    } finally {
      setLoading(false);
    }
  }

  const filtered = filter.trim()
    ? rows.filter((r) => String(r.productId).includes(filter.trim()))
    : rows;

  return (
    <section>
      <div className="toolbar">
        <input
          placeholder="Filter by product ID..."
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
        />
        <button onClick={() => load(page)}>Refresh</button>
      </div>

      {loading && <p className="muted">Loading inventory...</p>}
      {error && <p className="error">{error}</p>}

      {!loading && !error && (
        <table>
          <thead>
            <tr>
              <th>Product ID</th>
              <th>Quantity in stock</th>
              <th>Last updated</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((row) => (
              <tr key={row.id}>
                <td>{row.productId}</td>
                <td className={row.quantity === 0 ? "error" : ""}>
                  {row.quantity === 0 ? "Out of stock" : row.quantity}
                </td>
                <td>{new Date(row.updatedAt).toLocaleString()}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}

      {!loading && !error && filtered.length === 0 && <p className="muted">No inventory rows found.</p>}

      <Pagination
        page={page}
        hasNext={rows.length === PAGE_SIZE}
        onPrev={() => setPage((p) => Math.max(0, p - 1))}
        onNext={() => setPage((p) => p + 1)}
      />
    </section>
  );
}
