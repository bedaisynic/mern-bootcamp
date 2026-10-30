import styles from "./LoginForm.module.css";
import axios from "axios";
import { useAuth } from "../../context/AuthContext";
import { useState } from "react";

export function LoginForm() {
  // 🔴 Todo: implement login logic.
  // 1. handle the form submission and validation logic.
  //    - username: admin, alice, bob, carol, or dave
  //    - password: 123
  // 2. call the login API with axios and handle the response. api: POST http://localhost:4000/api/users/login
  // 3. display error message if login fails.
  // 4. on successful login, update the auth context with the user information
  //    (the dropdown closes by itself, because UserBadge re-renders once there is a user).

  const [name, setName] = useState("");
  const [password, setPassword] = useState("");
  const [err, setErr] = useState("");
  const [loading, setLoading] = useState(false);

  const { login } = useAuth();

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setErr("");

    try {
      setLoading(true);
      const res = await axios.post("http://localhost:4000/api/users/login", {
        username: name,
        password,
      });

      console.log("!@#$%", res.data);
      login(res.data.data);
    } catch (err) {
      console.log(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <form onSubmit={handleSubmit}>
        <div className={styles.field}>
          <label className={styles.label}>Username</label>
          <input
            type="text"
            className={styles.input}
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
        </div>
        <div className={styles.field}>
          <label className={styles.label}>Password</label>
          <input
            type="password"
            className={styles.input}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>

        {err && <div className={styles.error}>Wrong username or password</div>}

        <button type="submit" className={styles.submit}>
          {loading ? "Loggin..." : "Login"}
        </button>
      </form>
      <div className={styles.hint}>
        <p>Try: admin, alice, bob, carol, or dave</p>
        <p>Password: 123</p>
      </div>
    </>
  );
}
