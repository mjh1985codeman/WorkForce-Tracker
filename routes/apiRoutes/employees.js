const express = require("express");
const router = express.Router();
const db = require("../../db/connection");

//added route to get all employees.
router.get("/employees", (req, res) => {
  const sql = `SELECT * FROM employees`;
  db.query(sql, (err, rows) => {
    if (err) {
      res.status(500).json({ error: err.message });
      return;
    }
    res.json({
      message: "success",
      data: rows,
    });
  });
});
