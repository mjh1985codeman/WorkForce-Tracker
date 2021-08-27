//importing connection.js file.

const db = require("./db/connection");
// Add near the top of the file
const inquirer = require("inquirer");
const { printTable } = require("console-table-printer");
const express = require("express");

const PORT = process.env.PORT || 3001;
const app = express();

// Express middleware
app.use(express.urlencoded({ extended: false }));
app.use(express.json());

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
function addDepartment() {
  const addDeptPrompt = [
    {
      type: "input",
      message: "Enter Department Name",
      name: "newDept",
    },
  ];
  inquirer.prompt(addDeptPrompt).then((addDeptResponse) => {
    let newDepartment = addDeptResponse.newDept;
    db.query(
      //Getting the dept_name values from the departments table
      `INSERT INTO departments (dept_name) VALUES('${newDepartment}');`
    );
    initApp();
  });
}

//Add Role Function.

function addRole() {
  //created newRoleDeptArray variable to be used as the "choices" for the dept_name (from the departments table) that the
  //new role will belong.
  let newRoleDeptArray = [];
  const addRolePrompts = [
    {
      type: "input",
      message: "Enter new Role's name",
      name: "newRole",
    },
    {
      type: "input",
      message: "What is this role's Salary?",
      name: "newRoleSalary",
    },
    {
      type: "list",
      message: "Which Department does this role belong to?",
      name: "newRoleDept",
      choices: newRoleDeptArray,
    },
  ];
  db.query(
    //Getting the dept_name values from the departments table
    `SELECT departments.dept_name FROM departments;`,
    function (err, results) {
      //for looping through the current dept_name values and displaying
      //pushing each one to the newRoleDeptArray.
      results.forEach((i) => {
        newRoleDeptArray.push(i.dept_name);
      });
    }
  );
  inquirer.prompt(addRolePrompts).then;
}

function addEmployee() {
  let newEmpRoleArray = [];
  const addEmpPrompts = [
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
      choices: newEmpRoleArray,
    },
  ];
  db.query(`SELECT roles.job_title FROM roles;`, function (err, results) {
    results.forEach((i) => {
      newEmpRoleArray.push(i.job_title);
    });
  });
  inquirer.prompt(addEmpPrompts).then;
}

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
        addDepartment();
        break;
      // Add a Role Case Functionality.
      case "Add a Role":
        addRole();
        break;
      case "Add a Employee":
        addEmployee();
        break;
      case "Update Employee Role":
        console.log("user picked update employee role");
        break;
      case "I'm Done":
        // progammatically exits from the node js program.
        process.exit();
    }
  });
}

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

// Start server after DB connection
db.connect((err) => {
  if (err) throw err;
  console.log("Database connected.");
  // Database Connect and Starter Title
  console.log(
    `====================================================================================
    
      WorkForce-Tracker
    
      Created By: Michael Hodges
    
=====================================================================================`
  );

  initApp();
});
