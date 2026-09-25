import { useEffect, useState } from "react";
import { api, ApiError, type Order } from "../api";
import Pagination from "../components/Pagination";

const PAGE_SIZE = 20;

export default function OrdersPage({ customerId }: { customerId: number | null }) {
  const [orders, setOrders] = useState<Order[]>([]);
  const [page, setPage] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [actionError, setActionError] = useState<string | null>(null);
  const [updatingId, setUpdatingId] = useState<number | null>(null);

  useEffect(() => {
    setPage(0);
    if (customerId !== null) load(customerId);
    else setOrders([]);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [customerId]);

  async function load(id: number) {
    setLoading(true);
    setError(null);
    try {
      const data = await api.listOrdersByCustomer(id);
      setOrders(data.slice().sort((a, b) => b.id - a.id));
    } catch (err) {
      setError(err instanceof ApiError ? err.message : "Failed to load orders.");
    } finally {
      setLoading(false);
    }
  }

  async function updateStatus(id: number, status: "completed" | "cancelled") {
    setUpdatingId(id);
    setActionError(null);
    try {
      const updated = await api.updateOrderStatus(id, status);
      setOrders((rows) => rows.map((o) => (o.id === id ? updated : o)));
    } catch (err) {
      setActionError(err instanceof ApiError ? err.message : "Failed to update order.");
    } finally {
      setUpdatingId(null);
    }
  }

  if (customerId === null) {
    return (
      <section>
        <p className="muted">Log in with a customer ID above to view your orders.</p>
      </section>
    );
  }

  const pageRows = orders.slice(page * PAGE_SIZE, page * PAGE_SIZE + PAGE_SIZE);

  return (
    <section>
      <div className="toolbar">
        <button onClick={() => load(customerId)}>Refresh</button>
      </div>

      {loading && <p className="muted">Loading orders...</p>}
      {error && <p className="error">{error}</p>}
      {actionError && <p className="error">{actionError}</p>}

      {!loading && !error && (
        <table>
          <thead>
            <tr>
              <th>Order ID</th>
              <th>Product ID</th>
              <th>Quantity</th>
              <th>Status</th>
              <th>Placed</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {pageRows.map((o) => (
              <tr key={o.id}>
                <td>{o.id}</td>
                <td>{o.product_id}</td>
                <td>{o.quantity}</td>
                <td>
                  <span className={`status status-${o.status}`}>{o.status}</span>
                </td>
                <td>{new Date(o.created_at).toLocaleString()}</td>
                <td>
                  {o.status === "pending" && (
                    <div className="order-actions">
                      <button
                        disabled={updatingId === o.id}
                        onClick={() => updateStatus(o.id, "completed")}
                      >
                        Complete
                      </button>
                      <button
                        disabled={updatingId === o.id}
                        onClick={() => updateStatus(o.id, "cancelled")}
                      >
                        Cancel
                      </button>
                    </div>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}

      {!loading && !error && orders.length === 0 && (
        <p className="muted">No orders yet for customer #{customerId}.</p>
      )}

      <Pagination
        page={page}
        hasNext={page * PAGE_SIZE + PAGE_SIZE < orders.length}
        onPrev={() => setPage((p) => Math.max(0, p - 1))}
        onNext={() => setPage((p) => p + 1)}
      />
    </section>
  );
}
