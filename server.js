//importing connection.js file.

const db = require("./db/connection");
// Add near the top of the file
const inquirer = require("inquirer");
const { printTable } = require("console-table-printer");

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
//These are empty arrays that gets updated in the updateEmployeeRole function
//so the user has the appropriate choices when assigning the new role to the employee.
let updateRoleEmpNameArray = [];
//CREATED FUNCTION TO REMOVE DUPLIATE NAMES FROM DB.QUERY FROM THE updateRoleEmpNameArray variable array.
let uniqueUpdateRoleEmpNameArray = (updateRoleEmpNameArray) =>
  updateRoleEmpNameArray.filter(
    (v, i) => updateRoleEmpNameArray.indexOf(v) === i
  );

let updateRoleForEmpArray = [];
//CREATED FUNCTION TO REMOVE DUPLIATE ROLES FROM DB.QUERY FROM THE updateRoleForEmpArray variable array.
let uniqueUpdateRoleForEmpArray = (updateRoleForEmpArray) =>
  updateRoleForEmpArray.filter(
    (v, i) => updateRoleForEmpArray.indexOf(v) === i
  );

// function so the addNewEmployee Function has a "None" option for the new employees manager.
function pushNoManagerOption() {
  let noManagerOption = "None";
  newEmpManagerArray.push(noManagerOption);
}

//Created this function because my db.query's to generate the choices were happening
//at the same time inquirer was trying to throw up the prompts and it was crashing my code!!!
function generateUpEmRleChs() {
  //DB Query to push the available employee names values from the employees table to the
  //newRoleEmpNameArray so the user has the appropriate choices.
  db.query(
    //Getting the first and last names of the employees from the employees table.
    `SELECT first_name, last_name FROM employees;`,
    function (err, results) {
      results.forEach((i) => {
        updateRoleEmpNameArray.push(i.first_name + " " + i.last_name);
      });

      if (err) {
        console.log(err);
      }
    }
  );

  //DB Query to push the available roles from the roles table
  //so the user can choose which role they want to update the employee to.
  db.query(`SELECT job_title FROM roles;`, function (err, results) {
    results.forEach((i) => {
      updateRoleForEmpArray.push(i.job_title);
    });

    if (err) {
      console.log(err);
    }
  });
  //Calling the uniqureUpdateRoleEmpNameArray to hopefully remove any duplicate names.
}

// ASK FIRST QUESTIONS FUNCTION //

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
        db.query(`SELECT * FROM departments`, function (err, results) {
          printTable(results);
          askFirstQuestions();
        });

        break;
      case "View All Roles":
        db.query(`SELECT * FROM roles`, function (err, results) {
          printTable(results);
          askFirstQuestions();
        });

        break;
      case "View All Employees":
        db.query(
          `SELECT employees.id, first_name, last_name, job_title, salary, dept_name FROM departments, roles, employees 
          WHERE employees.role_id = roles.id AND roles.department_id = departments.id ORDER BY employees.id;`,
          function (err, results) {
            printTable(results);
            askFirstQuestions();
          }
        );
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
        updateEmployeeRole();
        break;
      case "I'm Done":
        // progammatically exits from the node js program.
        process.exit();
    }
  });
  generateUpEmRleChs();
}

// ADD DEPARTMENT FUNCTION //

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

// ADD ROLE FUNCTION //

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

// ADD EMPLOYEE FUNCTION //

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

    //INQUIRER PROMPTS done. . .On to the step to INSERT the new Employee into the employees table
    //Need to get the Manager ID of the Manager that they selected and use that as the
    //new Employee's manager_id
    //*****************************************************//
    // IF / ELSE statement based on if this new employee has a manager or not.
    //*****************************************************//
    if (newEmpMr !== "None") {
      db.query(
        `SELECT id FROM employees WHERE CONCAT(first_name, " ", last_name) = "${newEmpMr}";`,
        function (err, results) {
          let newEmpMgrId = results[0].id;

          //Another db.query to get the role id that matches the role title they selected so we can
          //use that insert the new employee into the employees table:
          db.query(
            `SELECT id FROM roles WHERE ('${newEmpRle}') = roles.job_title;`,
            function (err, results) {
              let newEmpRleId = results[0].id;
              //INSERTING the new Employee into the Employees Table.
              db.query(
                `INSERT INTO employees (first_name, last_name, role_id, manager_id) VALUES('${newEmpFirstNme}','${newEmpLastNme}','${newEmpRleId}','${newEmpMgrId}')`
              );
            }
          );
        }
      );
    } else {
      db.query(
        `SELECT id FROM roles WHERE ('${newEmpRle}') = roles.job_title;`,
        function (err, results) {
          let newEmpRleId = results[0].id;
          //INSERTING the new Employee into the Employees Table.
          db.query(
            `INSERT INTO employees (first_name, last_name, role_id) VALUES('${newEmpFirstNme}','${newEmpLastNme}','${newEmpRleId}')`
          );
        }
      );
    }

    askFirstQuestions();
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
        console.log(err);
      }
    }
  );
}

// UPDATE EMPLOYEE ROLE //

function updateEmployeeRole() {
  db.query(
    //Getting the first and last names of the employees from the employees table.
    `SELECT first_name, last_name FROM employees;`,
    function (err, results) {
      results.forEach((i) => {
        updateRoleEmpNameArray.push(i.first_name + " " + i.last_name);
      });

      if (err) {
        console.log(err);
      }
    }
  );

  //DB Query to push the available roles from the roles table
  //so the user can choose which role they want to update the employee to.
  db.query(`SELECT job_title FROM roles;`, function (err, results) {
    results.forEach((i) => {
      updateRoleForEmpArray.push(i.job_title);
    });

    if (err) {
      console.log(err);
    }
  });
  const updateEmpRolePrompts = [
    {
      type: "list",
      message: "Choose the Employee that you want to update.",
      name: "updateRoleEmpName",
      choices: uniqueUpdateRoleEmpNameArray(updateRoleEmpNameArray),
    },
    {
      type: "list",
      message: "Choose the employee's new role.",
      name: "newRoleForEmp",
      choices: uniqueUpdateRoleForEmpArray(updateRoleForEmpArray),
    },
  ];
  inquirer.prompt(updateEmpRolePrompts).then((updateEmpRoleResponse) => {
    // saving the user responses to variables.
    let newRoleEmpNmeRes = updateEmpRoleResponse.updateRoleEmpName;
    let newRoleForEmpRes = updateEmpRoleResponse.newRoleForEmp;
    //updating the selected employee's role on the employee's table.
    db.query(`UPDATE employees SET role_id = (SELECT id FROM roles WHERE job_title = '${newRoleForEmpRes}')
    WHERE CONCAT(first_name, " ", last_name) = '${newRoleEmpNmeRes}'`);
    askFirstQuestions();
  });
}

// Start server after DB connection
db.connect((err) => {
  if (err) throw err;
  // Database Connect and Starter Title
  console.log(
    `====================================================================================
    
      WorkForce-Tracker
    
      Created By: Michael Hodges
    
====================================================================================`
  );
  pushNoManagerOption();
  generateUpEmRleChs();
  askFirstQuestions();
});
