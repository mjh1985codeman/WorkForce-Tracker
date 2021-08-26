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

//Create a employee
router.post("/employee", ({ body }, res) => {
  const sql = `INSERT INTO employees (first_name, last_name, role_id)
  VALUES (?,?,?)`;
  const params = [body.first_name, body.last_name, body.role_id];

  db.query(sql, params, (err, result) => {
    if (err) {
      res.status(400).json({ error: err.message });
      return;
    }
    res.json({
      message: "success",
      data: body,
    });
  });
});

module.exports = router;
