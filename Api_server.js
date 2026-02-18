const express = require("express");
const mysql = require("mysql2/promise");
const cors = require("cors");

const app = express();
app.use(cors());
app.use(express.json());

const dbConfig = {
  host: "localhost",
  user: "root",
  password: "Naren@2005",
  database: "recipesdb"
};

app.get("/", (req, res) => {
  res.send("Recipes API is running 🚀");
});

/* ===============================
   PAGINATION + SORTING API
================================= */
app.get("/api/recipes", async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const offset = (page - 1) * limit;

    const connection = await mysql.createConnection(dbConfig);

    const [totalRows] = await connection.execute(
      "SELECT COUNT(*) as total FROM recipes"
    );

    const query = `
      SELECT *
      FROM recipes
      ORDER BY rating DESC
      LIMIT ${limit} OFFSET ${offset}
    `;

    const [rows] = await connection.query(query);

    await connection.end();

    res.json({
      page,
      limit,
      total: totalRows[0].total,
      data: rows
    });

  } catch (error) {
    console.error("API ERROR:", error);
    res.status(500).json({ error: error.message });
  }
});


app.get("/api/recipes/search", async (req, res) => {
  try {
    const connection = await mysql.createConnection(dbConfig);

    let query = "SELECT * FROM recipes WHERE 1=1";
    let values = [];

    const {
      title,
      cuisine,
      rating,
      ratingOp,
      total_time,
      totalTimeOp,
      calories,
      caloriesOp
    } = req.query;

    if (title) {
      query += " AND title LIKE ?";
      values.push(`%${title}%`);
    }

    if (cuisine) {
      query += " AND cuisine = ?";
      values.push(cuisine);
    }

    if (rating && ratingOp) {
      const ratingValue = parseFloat(rating);
      let operator = "=";

      if (ratingOp === "gt") operator = ">";
      else if (ratingOp === "lt") operator = "<";
      else if (ratingOp === "eq") operator = "=";

      query += ` AND rating ${operator} ?`;
      values.push(ratingValue);
    }

    if (total_time && totalTimeOp) {
      const timeValue = parseInt(total_time);
      let operator = "=";

      if (totalTimeOp === "gt") operator = ">";
      else if (totalTimeOp === "lt") operator = "<";
      else if (totalTimeOp === "eq") operator = "=";

      query += ` AND total_time ${operator} ?`;
      values.push(timeValue);
    }

    if (calories && caloriesOp) {
      const calorieValue = parseInt(calories);
      let operator = "=";

      if (caloriesOp === "gt") operator = ">";
      else if (caloriesOp === "lt") operator = "<";
      else if (caloriesOp === "eq") operator = "=";

      query += `
        AND CAST(
          REPLACE(
            JSON_UNQUOTE(JSON_EXTRACT(nutrients, '$.calories')),
            ' kcal',
            ''
          ) AS UNSIGNED
        ) ${operator} ?
      `;

      values.push(calorieValue);
    }

    const [rows] = await connection.execute(query, values);

    await connection.end();

    res.json({
      count: rows.length,
      data: rows
    });

  } catch (error) {
    console.error("SEARCH ERROR:", error);
    res.status(500).json({ error: error.message });
  }
});

app.listen(5000, () => {
  console.log("🚀 Server running at http://localhost:5000");
});
