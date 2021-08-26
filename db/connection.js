const mysql = require("mysql2");

// Connect to database
const db = mysql.createConnection(
  {
    host: "localhost",
    // Your MySQL username,
    user: "mhodges",
    // Your MySQL password
    password: "mjh1",
    database: "workforce_tracker_db",
  },
  console.log("Connected to the workforce_tracker_db database.")
);

module.exports = db;
