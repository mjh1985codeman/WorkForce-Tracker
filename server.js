//importing connection.js file.
const db = require("./db/connection");
const express = require("express");
// Add near the top of the file
const inquirer = require("inquirer");
const cTable = require("console.table");
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

// Question Variables.
// First Questions that user is prompted with.
const firstQuestions = [
  {
    type: "list",
    message: "What would you like to do?",
    name: "firstResponse",
    choices: [
      "View All Departments",
      "View All Roles",
      "View All Employees",
      "Add a Department",
      "Add a Role",
      "Add a Employee",
      "Update Employee Role",
    ],
  },
];

//Options that require additional Input.
const addDeptPrompts = [
  {
    type: "input",
    message: "Enter Department Name",
    name: "newDept",
  },
];

const addRolePrompts = [
  {
    type: "input",
    message: "Enter new Employees first name",
    name: "newEmpFirstName",
  },
  {
    type: "input",
    message: "Enter new Employees last name",
    name: "newEmpLastName",
  },
  {
    type: "list",
    message: "Choose this employee's Role",
    name: "newEmpRole",
    //Should this be an empty array as the choices will depend on the Roles that the user adds?
    choices: [],
  },
];

function initApp() {
  inquirer.prompt(firstQuestions);
}

// Start server after DB connection
db.connect((err) => {
  if (err) throw err;
  console.log("Database connected.");
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
});

initApp();
