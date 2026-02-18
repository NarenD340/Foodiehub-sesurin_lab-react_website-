const fs = require("fs");
const mysql = require("mysql2/promise");

const dbConfig = {
  host: "localhost",
  user: "root",
  password: "Naren@2005",
  database: "recipesdb"
};

function cleanNumber(value) {
  if (value === null || value === undefined) return null;
  if (value === "NaN") return null;
  return isNaN(value) ? null : Number(value);
}

async function insertData() {
  try {
    const connection = await mysql.createConnection(dbConfig);

    console.log("Reading JSON file...");

    const rawData = fs.readFileSync("US_recipes_null.json", "utf8");
    const parsedData = JSON.parse(rawData);
    const dataArray = Array.isArray(parsedData)
      ? parsedData
      : Object.values(parsedData);

    console.log(`Total records found: ${dataArray.length}`);

    for (let item of dataArray) {
      await connection.execute(
        `INSERT INTO recipes 
        (cuisine, title, rating, prep_time, cook_time, total_time, description, nutrients, serves)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        [
          item.cuisine || null,
          item.title || null,
          cleanNumber(item.rating),
          cleanNumber(item.prep_time),
          cleanNumber(item.cook_time),
          cleanNumber(item.total_time),
          item.description || null,
          JSON.stringify(item.nutrients || {}),
          item.serves || null
        ]
      );
    }

    console.log("✅ Data inserted successfully");
    await connection.end();

  } catch (error) {
    console.error("❌ Error inserting data:", error);
  }
}

insertData();
