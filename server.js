//importing connection.js file.
const db = require("./db/connection");
const express = require("express");
// Add near the top of the file
// const inquirer = require("inquirer");
const apiRoutes = require("./routes/apiRoutes");

const PORT = process.env.PORT || 3001;
const app = express();

// Express middleware
app.use(express.urlencoded({ extended: false }));
app.use(express.json());
// Add after Express middleware
app.use("/api", apiRoutes);

// Default response for any other request (Not Found) this always needs to be the LAST route.
app.use((req, res) => {
  res.status(404).end();
});

// Start server after DB connection
db.connect((err) => {
  if (err) throw err;
  console.log("Database connected.");
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
});
