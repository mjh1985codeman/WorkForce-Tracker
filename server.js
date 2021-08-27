//importing connection.js file.
const db = require("./db/connection");
// Add near the top of the file
const inquirer = require("inquirer");
const { printTable } = require("console-table-printer");

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
      "I'm Done",
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
  inquirer.prompt(firstQuestions).then((firstQuestionsResponses) => {
    // firstResponse is the name value of the firstQuestions Array.
    let userResponses = firstQuestionsResponses.firstResponse;
    switch (userResponses) {
      case "View All Departments":
        console.log("user picked view all departments");
        db.query(`SELECT * FROM departments`, function (err, results) {
          printTable(results);
          initApp();
        });

        break;
      case "View All Roles":
        console.log("user picked view all roles");
        db.query(`SELECT * FROM roles`, function (err, results) {
          printTable(results);
          initApp();
        });

        break;
      case "View All Employees":
        console.log("user picked View All Employees");
        db.query(`SELECT * FROM employees`, function (err, results) {
          printTable(results);
          initApp();
        });
        break;
      case "Add a Department":
        console.log("user picked Add a Department");
        break;
      case "Add a Role":
        console.log("user picked Add a Role");
        break;
      case "Add a Employee":
        console.log("user picked Add a Employee");
        break;
      case "Update Employee Role":
        console.log("user picked update employee role");
        break;
      case "I'm Done":
        db.end();
        break;
    }
  });
}

// Start server after DB connection
db.connect((err) => {
  if (err) throw err;
  console.log("Database connected.");
  initApp();
});
