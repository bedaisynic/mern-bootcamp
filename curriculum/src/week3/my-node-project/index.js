const express = require("express");

const app = express();

app.use(express.json());

let articles = [];
let nextId = 1;

app.listen(3000, () => {
  console.log("Server running on http://localhost:3000");
});

app.get("/api/hello", (req, res) => {
  res.json({ message: "Hello API!" });
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
