const pool = require("./db");

const express = require("express");

const app = express();

app.use(express.json());

let articles = [];
let nextId = 1;

app.get("/test-db", async (req, res) => {
  try {
    const result = await pool.query("SELECT current_database()");
    res.json(result.rows);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Database connection failed" });
  }
});

app.listen(3000, () => {
  console.log("Server running on http://localhost:3000");
});

app.get("/api/hello", (req, res) => {
  res.json({ message: "Hello API!" });
});

app.get("/customers/rentals/movies", async (req, res) => {
  console.log("get request received");

  try {
    const { rows } = await pool.query(`
      SELECT
        customers.name,
        movies.title,
        rentals.rented_on
      From rentals
      JOIN customers
        ON rentals.customer_id = customers.id
      JOIN movies
        ON rentals.movie_id = movies.id
      ORDER BY rentals.rented_on;
    `);

    res.json(rows);
  } catch (err) {
    console.error(err);
    res.status(400).json({
      error: {
        message: "bad request",
      },
    });
  }
});

app.get("/actors/movie", async (req, res) => {
  console.log("get request recived");

  try {
    const { rows } = await pool.query(`
      SELECT DISTINCT
        actors.id AS "ACTOR ID",
        actors.lname AS "LAST NAME(LNAME)"
      FROM actors
      JOIN movie_cast
        ON actors.id = movie_cast.actor_id
      JOIN movies
        ON movie_cast.movie_id = movies.id
      WHERE movies.year = '1895'
      ORDER BY actors.lname;
    `);

    res.json(rows);
  } catch (err) {
    res.status(400).json({
      error: {
        message: "bad request",
      },
    });
  }
});

app.get("/classes/attendance", async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT
          classes.id,
          classes.name,
          classes.instructor,
          COUNT(attendance.id) AS attendance_count
      FROM classes
      LEFT JOIN attendance
          ON classes.id = attendance.class_id
      GROUP BY
          classes.id,
          classes.name,
          classes.instructor
      ORDER BY attendance_count DESC;
    `);

    res.json(result.rows);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Database error" });
  }
});

app.get("/instructors/attendance", async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT
        classes.instructor,
        COUNT(attendance.id) AS total_attendance
      FROM classes
      LEFT JOIN attendance
        ON classes.id = attendance.class_id
      GROUP BY classes.instructor;
    `);

    res.json(result.rows);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Database error" });
  }
});

// POST /articles
app.post("/articles", (req, res) => {
  const { url, tag } = req.body;

  if (!url) {
    return res.status(400).json({ error: "url is required" });
  }

  const article = {
    id: nextId++,
    url,
    tag,
    read: false,
  };

  articles.push(article);

  res.status(201).json(article);
});

// app.get("/articles", (req, res) => {
//   res.json(articles);
// });

// http://localhost:3000/articles?tag=Java&read=true
app.get("/articles", (req, res) => {
  let result = articles;

  if (req.query.tag) {
    result = result.filter((article) => article.tag === req.query.tag);
  }

  if (req.query.read) {
    const read = req.query.read === "true";
    result = result.filter((article) => article.read === read);
  }

  res.json(result);
});

// GET /articles/:id — 404 if the id doesn't exist.
app.get("/articles/:id", (req, res) => {
  const { id } = req.params;

  const article = articles.find((p) => p.id === Number(id));

  if (!article) {
    return res.status(404).json({
      error: {
        message: `Article with id ${id} cannot be found`,
      },
    });
  }

  res.json(article);
});

// DELETE /articles/:id
app.delete("/articles/:id", (req, res) => {
  const { id } = req.params;

  const index = articles.findIndex((article) => article.id === Number(id));

  if (index === -1) {
    return res.status(404).json({
      error: {
        message: `Article with id ${id} cannot be found`,
      },
    });
  }

  const deletedArticle = articles.splice(index, 1)[0];

  res.status(200).json(deletedArticle);
});
