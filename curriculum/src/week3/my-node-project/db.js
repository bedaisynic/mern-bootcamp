const { Pool } = require("pg");

const pool = new Pool({
  host: "localhost",
  port: 5432,
  user: "daisywang",
  database: "actors",
});

module.exports = pool;
