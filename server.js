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

//Global Variables.
//This is an empty array that gets updated in the addRole function
//so the user has the appropriate choices when assigning the role they are creating
//to a department.
let newRoleDeptArray = [];
//This is an empty array that gets updated in the addEmployee function
//so the user has the appropriate choices when assigning the role to the new employee they are creating
//and assigning a manager for the new employee.
let newEmpRoleArray = [];
let newEmpManagerArray = [];

function askFirstQuestions() {
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

  inquirer.prompt(firstQuestions).then((firstQuestionsResponses) => {
    // firstResponse is the name value of the firstQuestions Array.
    let userResponses = firstQuestionsResponses.firstResponse;
    switch (userResponses) {
      case "View All Departments":
        console.log("user picked view all departments");
        db.query(`SELECT * FROM departments`, function (err, results) {
          printTable(results);
          askFirstQuestions();
        });

        break;
      case "View All Roles":
        console.log("user picked view all roles");
        db.query(`SELECT * FROM roles`, function (err, results) {
          printTable(results);
          askFirstQuestions();
        });

        break;
      case "View All Employees":
        console.log("user picked View All Employees");
        db.query(`SELECT * FROM employees`, function (err, results) {
          printTable(results);
          askFirstQuestions();
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
        //updateRole();
        break;
      case "I'm Done":
        // progammatically exits from the node js program.
        process.exit();
    }
  });
}

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
    askFirstQuestions();
  });
}

//Add Role Function.

function addRole() {
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
      //newRoleDeptArray is a global variable set to an empty array then gets updated in this addRole function.
      choices: newRoleDeptArray,
    },
  ];

  inquirer.prompt(addRolePrompts).then((addRoleResponse) => {
    let newRoleName = addRoleResponse.newRole;
    let newRoleSalary = addRoleResponse.newRoleSalary;
    let newRoleDepartmentName = addRoleResponse.newRoleDept;
    // let newRoleDeptId = "";
    console.log(newRoleName);
    console.log(newRoleSalary);

    db.query(
      //Getting the department id that corresponds with the new role's department name.

      `SELECT departments.id FROM departments WHERE ('${newRoleDepartmentName}') = departments.dept_name;`,
      //Call Back Function.
      function (err, results) {
        //narrowing down the results to the value of the id that I'm trying to grab. (just the results returned [ TextRow { id: 4 } ] and I needed to get the 4)
        let newRoleDeptId = results[0].id;
        //Running the INSERT db.query to add the new role to the roles table.
        db.query(
          `INSERT INTO roles (job_title, salary, department_id) VALUES('${newRoleName}','${newRoleSalary}','${newRoleDeptId}');`,
          function (err, results) {
            if (err) {
              console.log(err);
            } else {
              console.log("New Role Added!");
            }
          }
        );
      }
    );

    askFirstQuestions();
  });

  db.query(
    //Getting the dept_name values from the departments table
    `SELECT departments.dept_name FROM departments;`,
    function (err, results) {
      //for looping through the current dept_name values and displaying
      //pushing each one to the newRoleDeptArray so the user can assign the new role to a department.
      results.forEach((index) => {
        newRoleDeptArray.push(index.dept_name);
      });
    }
  );
}

function addEmployee() {
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
    {
      type: "list",
      message: "Choose this employee's Manager",
      name: "newEmpMgr",
      choices: newEmpManagerArray,
    },
  ];
  inquirer.prompt(addEmpPrompts).then((addEmpResponse) => {
    let newEmpFirstNme = addEmpResponse.newEmpFirstName;
    let newEmpLastNme = addEmpResponse.newEmpLastName;
    let newEmpRle = addEmpResponse.newEmpRole;
    let newEmpMr = addEmpResponse.newEmpMgr;

    console.log(newEmpFirstNme);
    console.log(newEmpLastNme);
    console.log(newEmpRle);
    console.log(newEmpMr);
  });

  //DB Query to push the available job_title values from the roles table to the
  //newEmpRoleArray so the user has the appropriate choices.
  db.query(
    //Getting the job_title values from the roles table.
    `SELECT roles.job_title FROM roles;`,
    function (err, results) {
      results.forEach((index) => {
        newEmpRoleArray.push(index.job_title);
      });

      if (err) {
        console.log("first err: ");
        console.log(err);
      }
    }
  );

  //DB Query to push the available employees first_name and last_name from the employees table
  //that ARE a manager (aka their manager id is NOT NULL) to the newEmpManagerArray so they
  //can assign a manager to the new employee.
  db.query(
    `SELECT first_name, last_name FROM employees WHERE employees.manager_id IS NOT NULL;`,
    function (err, results) {
      results.forEach((index) => {
        newEmpManagerArray.push(index.first_name + " " + index.last_name);
      });

      if (err) {
        console.log("second err: ");
        console.log(err);
      }
    }
  );
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
    
====================================================================================`
  );
  askFirstQuestions();
});
