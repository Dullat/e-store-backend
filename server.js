import app from "./app.js";
import pool from "./config/db.js";

async function startServer() {
  try {
    const result = await pool.query("select 3 * 6");
    console.log("connected to db:", result.rows[0]);
    app.listen(5000);
    console.log("Server is runing on http://localhost:5000");
  } catch (err) {
    console.log(err);
  }
}

startServer();
