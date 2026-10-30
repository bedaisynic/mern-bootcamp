import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import { LoadingSpinner } from "../../../../shared/components/LoadingSpinner/LoadingSpinner";
import { TicketCard } from "../TicketCard/TicketCard";
import { TicketFilter } from "../TicketFilter/TicketFilter";
import type { Ticket } from "../../types/ticket.types";
import type { PaginatedResponse } from "../../../../shared/types/api.types";
import styles from "./TicketList.module.css";

const API_URL = "http://localhost:4000/api";

export function TicketList() {
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("");
  const [priority, setPriority] = useState("");
  const [category, setCategory] = useState("");
  const [assigneeId, setAssigneeId] = useState("");
  const [sortBy, setSortBy] = useState("createdAt");
  const [sortOrder, setSortOrder] = useState("desc");
  const [page, setPage] = useState(1);

  const [response, setResponse] = useState<PaginatedResponse<Ticket> | null>(
    null,
  );
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchTickets = async () => {
      setLoading(true);
      setError(null);
      try {
        // TODO 1: GET `${API_URL}/tickets` with axios, passing the filters and page as query params
        // (search, status, priority, category, assigneeId, sortBy, sortOrder, page, limit: 10).
        // Then store response.data with setResponse.
        const res = await axios.get(`${API_URL}/tickets`, {
          params: {
            search,
            status,
            priority,
            category,
            assigneeId,
            sortBy,
            sortOrder,
            page,
            limit: 10,
          },
        });

        setResponse(res.data);
      } catch (err: any) {
        setError(err.response?.data?.message || "Failed to fetch tickets");
      } finally {
        setLoading(false);
      }
    };

    fetchTickets();
  }, [search, status, priority, category, assigneeId, sortBy, sortOrder, page]);

  // Called by TicketFilter with the name of the filter and its new value.
  // Changing any filter sends the user back to page 1.
  const handleFilterChange = (key: string, value: string) => {
    const setters: Record<string, (value: string) => void> = {
      status: setStatus,
      priority: setPriority,
      category: setCategory,
      assigneeId: setAssigneeId,
      sortBy: setSortBy,
      sortOrder: setSortOrder,
    };
    setters[key](value);
    setPage(1);
  };

  const handleSearchChange = (value: string) => {
    setSearch(value);
    setPage(1);
  };

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h1>Tickets</h1>
        <Link to="/tickets/new" className={styles.createButton}>
          Create Ticket
        </Link>
      </div>

      <TicketFilter
        search={search}
        onSearchChange={handleSearchChange}
        status={status}
        priority={priority}
        category={category}
        assigneeId={assigneeId}
        sortBy={sortBy}
        sortOrder={sortOrder}
        onFilterChange={handleFilterChange}
      />

      {loading && <LoadingSpinner />}
      {error && <p className={styles.error}>{error}</p>}

      {!loading && !error && response && (
        <>
          <div className={styles.ticketGrid}>
            {/* TODO 2: if response.data is empty show "No tickets found", otherwise render one TicketCard
                for each ticket (give it a key and pass the ticket) */}
            {response.data.length === 0 ? (
              <div>"No tickets found"</div>
            ) : (
              response.data.map((item) => {
                console.log("!!!!!!item", item);
                const {
                  id,
                  title,
                  description,
                  status,
                  priority,
                  category,
                  reporterName,
                  reporterEmail,
                  assigneeId,
                  resolvedAt,
                  closedAt,
                } = item;
                return (
                  <TicketCard
                    key={item.id}
                    ticket={{
                      id,
                      title,
                      description,
                      status,
                      priority,
                      category,
                      reporterName,
                      reporterEmail,
                      assigneeId,
                      slaDeadline: new Date(
                        Date.now() + 2 * 60 * 60 * 1000,
                      ).toISOString(),
                      resolvedAt,
                      closedAt,
                      createdAt: new Date().toISOString(),
                      updatedAt: new Date().toISOString(),
                    }}
                  />
                );
              })
            )}
          </div>

          {response.pagination.totalPages > 1 && (
            <div className={styles.pagination}>
              {/* TODO 3: Make Previous go to the previous page and Next go to the next page */}
              <button
                onClick={() => {
                  setPage((prev) => prev - 1);
                }}
                disabled={page === 1}
                className={styles.pageButton}
              >
                Previous
              </button>
              <span className={styles.pageInfo}>
                Page {page} of {response.pagination.totalPages}
              </span>
              <button
                onClick={() => {
                  setPage((prev) => prev + 1);
                }}
                disabled={page === response.pagination.totalPages}
                className={styles.pageButton}
              >
                Next
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
}
