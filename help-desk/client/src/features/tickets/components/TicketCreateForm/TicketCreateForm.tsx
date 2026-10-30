import { useNavigate } from "react-router-dom";
import styles from "./TicketForm.module.css";
import { useEffect, useState } from "react";

export function TicketCreateForm() {
  const navigate = useNavigate();
  const [users, setUsers] = useState([]);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [priority, setPriority] = useState("low");
  const [category, setCategory] = useState("Bug");
  const [reporterName, setReporterName] = useState("");
  const [reporterEmail, setReporterEmail] = useState("");
  const [assigneeId, setSssigneeId] = useState("");
  const [submit, setSubmit] = useState(false);
  //const [newticket, setNewticket] = useState(null);

  // 🔴 TODO:
  // 1. set up controlled component state for: title, description, priority, category,
  //    reporterName, reporterEmail, assigneeId
  // 2. fetch users from GET /api/users on mount (for the assignee dropdown)
  // 3. on submit, POST to /api/tickets with the form data,
  //    then navigate to /tickets/:id using the returned ticket id
  // 4. track a "submitting" state — disable the submit button and show "Saving..." while the request is in flight

  const handleSubmit = async (e: SubmitEvent) => {
    e.preventDefault();
    console.log("clicked!");

    const data = {
      title,
      description,
      priority,
      category,
      reporterName,
      reporterEmail,
      assigneeId,
    };

    try {
      setSubmit(true);
      const res = await fetch("http://localhost:4000/api/tickets", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      if (!res.ok) {
        throw new Error("Network response was not ok");
      }

      const ticket = await res.json();
      console.log("%%%%%%%%%%%%%%%%%%%ticket", ticket.data);
      navigate(`/tickets/${ticket.data.id}`);
    } catch (err) {
      console.log(err);
    } finally {
      setSubmit(false);
    }
  };

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const res = await fetch("http://localhost:4000/api/users");

        if (!res.ok) {
          throw new Error("Request Error");
        }

        const data = await res.json();
        setUsers(data.data);
      } catch (err) {
        console.log(err);
      }
    };
    fetchUsers();
  }, []);

  return (
    <div className={styles.container}>
      <h1>Create Ticket</h1>

      <form onSubmit={handleSubmit} className={styles.form}>
        <div className={styles.field}>
          <label htmlFor="title">Title *</label>
          <input
            id="title"
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />
        </div>

        <div className={styles.field}>
          <label htmlFor="description">Description *</label>
          <textarea
            id="description"
            rows={6}
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />
        </div>

        <div className={styles.row}>
          <div className={styles.field}>
            <label htmlFor="priority">Priority *</label>
            <select
              id="priority"
              value={priority}
              onChange={(e) => setPriority(e.target.value)}
            >
              <option value="low">Low</option>
              <option value="medium">Medium</option>
              <option value="high">High</option>
              <option value="urgent">Urgent</option>
            </select>
          </div>

          <div className={styles.field}>
            <label htmlFor="category">Category *</label>
            <select
              id="category"
              value={category}
              onChange={(e) => setCategory(e.target.value)}
            >
              <option value="bug">Bug</option>
              <option value="feature_request">Feature Request</option>
              <option value="question">Question</option>
              <option value="account_issue">Account Issue</option>
              <option value="other">Other</option>
            </select>
          </div>
        </div>

        <div className={styles.row}>
          <div className={styles.field}>
            <label htmlFor="reporterName">Reporter Name *</label>
            <input
              id="reporterName"
              type="text"
              value={reporterName}
              onChange={(e) => setReporterName(e.target.value)}
            />
          </div>

          <div className={styles.field}>
            <label htmlFor="reporterEmail">Reporter Email *</label>
            <input
              id="reporterEmail"
              type="email"
              value={reporterEmail}
              onChange={(e) => setReporterEmail(e.target.value)}
            />
          </div>
        </div>

        <div className={styles.field}>
          <label htmlFor="assigneeId">Assignee</label>
          <select
            id="assigneeId"
            value={assigneeId}
            onChange={(e) => setSssigneeId(e.target.value)}
          >
            <option value="">Unassigned</option>
            {/* render one <option> per user from the fetched users list */}
            {users.map((item) => (
              <option key={item.id} value={item.id}>
                {item.displayName}
              </option>
            ))}
          </select>
        </div>

        <div className={styles.actions}>
          <button type="submit" className={styles.submitButton}>
            {submit ? "Saving" : "Create TIcket"}
          </button>
          <button
            type="button"
            className={styles.cancelButton}
            onClick={() => navigate("/tickets")}
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
}
