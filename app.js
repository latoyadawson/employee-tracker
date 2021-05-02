const inquirer = require('inquirer');
const db = require('./db/connection');
const cTable = require('console.table');
const chalk = require('chalk');
const express = require('express');


const PORT = process.env.PORT || 3001;
const app = express();

//Express middleware
app.use(express.urlencoded({extended: false}));
app.use(express.json());

// Default response for any other request (Not Found)
app.use((req, res) => {
    res.status(404).end();
});

//==================================== Connection ID ====================================//
db.connect( err => {
    if (err) throw err;
    console.log('Database connected.');
    app.listen(PORT, () => {
        console.log(`Server running on port ${PORT}`);
    });
});

//==================================== Inquirer Promot ====================================//
// GIVEN a command-line application that accepts user input
// WHEN I start the application
function startPrompt() {

    inquirer.prompt({
        // THEN I am presented with the following options: view all departments, view all roles, view all employees, add a department, add a role, add an employee, and update an employee role
        type: 'list',
        name: 'action',
        message:'Please choose one option',
        choices: [
            'view all departments', 
            'view all roles', 
            'view all employees',
            'view all employees by manager',
            'view all employees by department',
            'view department budgets',
            'add a department', 
            'add a role', 
            'add an employee',
            'update an employee role',
            'update an employee manager',
            'delete department', 
            'delete roles', 
            'delete employee',
            'Exit'
        ]
    
    }).then((answer) => {
        switch (answer.action) {
            case 'view all departments':
                viewAllDept();
                break;

            case "view all roles":
                viewAllRoles();
                break;

            case "view all employees":
                viewAllEmployees();
                break;

            case "view all employees by manager":
                viewAllEmpByManager();
                break;
    
            case "view all employees by department":
                viewAllEmpByDept();
                break;

            case "view department budgets":
                viewDeptBudget();
                break;
                
            case "add a department":
                addDepartment();
                break;

            case "add a role":
                addRole();
                break;

            case "add an employee":
                addEmployee();
                break;

            case "update an employee role":
                updateEmpRole();
                break;

            case "update an employee manager":
                updateEmpMngr();
                break;

            case "delete department":
                deleteDepartment();
                break;
            
            case "delete roles":
                deleteRole();
                break;

            case "delete employee":
                deleteEmployee();
                break;

            case 'Exit':
                db.end();
                break;
            default: console.log('not found');

        }

    });
}

//==================================== View All Departments ====================================//
// WHEN I choose to view all departments
// THEN I am presented with a formatted table showing department names and department ids
function viewAllDept() {
    const sql = `SELECT id,
                department_name AS departments 
                FROM department`;
    db.query(sql, (err, result) => {
        if(err) {
            res.status(400).json({ error: err.message });
            return;
        }
        console.table(result);
        startPrompt();
    });
}

//==================================== View All Roles ====================================//
// WHEN I choose to view all roles
// THEN I am presented with the job title, role id, the department that role belongs to, and the salary for that role
function viewAllRoles() {
  const sql = `SELECT * FROM roles`;
  const params = []
    db.query(sql, (err, result) => {
        if(err) {
            res.status(400).json({ error: err.message });
            return;
        }
        console.table(result);
        startPrompt();
    });
}

//==================================== View All Employees ====================================//
// WHEN I choose to view all employees
// THEN I am presented with a formatted table showing employee data, including employee ids, first names, last names, job titles, departments, salaries, and managers that the employees report to
function viewAllEmployees() {
    const sql = `SELECT employee.id, 
                employee.first_name, 
                employee.last_name,  
                roles.title AS Title,
                department.department_name, 
                roles.salary,
                CONCAT(manager.first_name, ' ' ,manager.last_name) AS manager
                FROM employee 
                JOIN roles ON employee.role_id = roles.id
                JOIN department ON roles.department_id = department.id
                LEFT JOIN  employee AS manager ON employee.manager_id = manager.id
                ORDER BY employee.id`;

    db.query(sql, (err, result) => {
        if(err) throw err;
        console.table(result);
        startPrompt();
    });
}

//==================================== View All Employees By Manager ====================================//
function viewAllEmpByManager() {
    const sql = `  SELECT 
            CONCAT(manager.first_name, ' ' ,manager.last_name) AS manager,
            employee.id, 
            employee.first_name, 
            employee.last_name,  
            roles.title AS Title,
            department.department_name, 
            roles.salary
            FROM employee 
            JOIN roles ON employee.role_id = roles.id
            JOIN department ON roles.department_id = department.id
            LEFT JOIN  employee AS manager ON employee.manager_id = manager.id
            ORDER BY manager`;
      db.query(sql, (err, result) => {
          if(err) {
              res.status(400).json({ error: err.message });
              return;
          }
          console.table(result);
          startPrompt();
      });
}

//==================================== View All Employees By Department ====================================//
function viewAllEmpByDept() {
    const sql = `SELECT department.department_name,
                employee.id, 
                employee.first_name, 
                employee.last_name,  
                roles.title AS Title,
                roles.salary,
                CONCAT(manager.first_name, ' ' ,manager.last_name) AS manager
                FROM employee 
                JOIN roles ON employee.role_id = roles.id
                JOIN department ON roles.department_id = department.id
                LEFT JOIN  employee AS manager ON employee.manager_id = manager.id
                ORDER BY department_name`;
      db.query(sql, (err, result) => {
          if(err) {
              res.status(400).json({ error: err.message });
              return;
          }
          console.table(result);
          startPrompt();
      });
}

function viewDeptBudget(){
    const sql = `SELECT department.department_name,
                SUM(roles.salary) AS salary
                FROM employee
                JOIN roles ON employee.role_id = roles.id
                JOIN department ON roles.department_id = department.id 
                GROUP by department.department_name`;
                
      db.query(sql, (err, result) => {
          if(err) throw err;
          console.table(result);
          startPrompt();
      });
}
//==================================== Add Deparment ====================================//
// WHEN I choose to add a department
// THEN I am prompted to enter the name of the department and that department is added to the database
function addDepartment() {
    inquirer.prompt([
        {
        name: "department_name",
        type: "input",
        message: "What Department would you like to add?"
        }
    ]).then((answer) => {
        const sql = `INSERT INTO department (department_name) VALUES (?)`;
        const param = [answer.department_name]; 
        db.query (sql,param, (err, result) => {
            if (err) throw err;
            
            db.query(`SELECT * FROM department`, (err, results) => {
                if (err) throw err;
                console.table(results);

                startPrompt();
            });
            
            
                
        });
    
    });
}

//==================================== Add Role ====================================//
// WHEN I choose to add a role
// THEN I am prompted to enter the name, salary, and department for the role and that role is added to the database
function addRole() {
    const addRoleSql = `SELECT * FROM department`;
    db.query(addRoleSql, (err, results) => {
        if (err) throw err;

        inquirer.prompt([
            {
                name: "title",
                type: "input",
                message: "What is the roles Title?"
            },
            {
                name: "salary",
                type: "input",
                message: "What is the roles Salary?"

            }, 
            {
                name: "department_name",
                type: "list",
                message: "Which deparment is this role in?",
                choices: function () {
                    let departmentArr = results.map(choice => choice.department_name);
                    return departmentArr;
                }    
            },
        ]).then((answer) => {
            const sql = `INSERT INTO roles (title, salary, department_id) VALUES ('${answer.title}','${answer.salary}',(SELECT id FROM department WHERE department_name = '${answer.department_name}'))`;
            //const params = [answer.title, answer.salary, answer.department_id];
            db.query(sql, (err, result) => {
                if (err) throw err;
                
                db.query(`SELECT * FROM roles`, (err, results) => {
                    if (err) throw err;
                    console.table(results);
    
                    startPrompt();
                });
            });

        });
    });
}

//==================================== Add Employee ====================================//
// WHEN I choose to add an employee
// THEN I am prompted to enter the employee’s first name, last name, role, and manager and that employee is added to the database
function addEmployee() {
    // const addEmployeeSql = `SELECT employee.id, 
    //             employee.first_name, 
    //             employee.last_name,  
    //             roles.title,
    //             CONCAT(employee.first_name, ' ' ,employee.last_name) AS employee_name
    //             FROM employee 
    //             JOIN roles ON employee.role_id = roles.id
    //             LEFT JOIN  employee AS manager ON employee.manager_id = manager.id
    //             ORDER BY employee.id
    //             employee.manager_id`;
    const returnManager = `SELECT DISTINCT 
                            CONCAT(manager.first_name," ",manager.last_name) AS manager
                            FROM employee
                            LEFT JOIN  employee AS manager ON employee.manager_id = manager.id
                            `;
    //var returnManager2;
    db.query(returnManager, (err, managerResults) => {
        if (err) throw err;
        //console.table(managerResults);
        //returnManager2 = managerResults;
    });

    const returnTitle = `SELECT roles.title FROM roles`;
    var titleResults2;
    db.query(returnTitle, (err, titleResults) => {
        if (err) throw err;
        console.table(titleResults);
        titleResults2 = titleResults;
    });
  
    db.query(returnManager, (err, results) => { 
        if (err) throw err;
        console.table(results)
        inquirer.prompt([
            {
                name: "first_name",
                type: "input",
                message: "Enter their first name "
            },
            {
                name: "last_name",
                type: "input",
                message: "Enter their last name "
            },
            {
                name: "title",
                type: "list",
                message: "Pick the employee's role title? ",
                choices:  function () {
                    let choiceArray = titleResults2.map(choice => choice.title);
                    return choiceArray;
                }
            },
            {
                name: "manager",
                type: "list",
                message: "Pick the manager for this role",
                choices: function () {
                    let choiceArray = results.map(choice => choice.manager);
                    return choiceArray;
                }    
        
            }
        ]).then(function (answer) {
            const sql = `INSERT INTO employee (first_name, last_name, role_id, manager_id) 
                        VALUES (?,?,
                        (SELECT id FROM roles WHERE title = ?),
                        (SELECT id FROM employee emp WHERE CONCAT(emp.first_name," ",emp.last_name) = ?))`;
        
            const params = [answer.first_name, answer.last_name, answer.title, answer.manager];
            db.query(sql, params, (err, result) => {
                if (err) throw err;
                
                db.query(`SELECT * FROM employee`, (err, results) => {
                    if (err) throw err;
                    console.table(results);
    
                    startPrompt();
                });

            });
                
            
        })
    });
}

//==================================== Update Employee Role  ====================================//
// WHEN I choose to update an employee role
// THEN I am prompted to select an employee to update and their new role and this information is updated in the database 
function updateEmpRole() {
    const sql = `SELECT CONCAT(employee.first_name," ",employee.last_name) AS full_name, roles.title FROM employee
    JOIN roles ON employee.role_id = roles.id`;

    const returnTitle = `SELECT roles.title FROM roles`;
    var titleResults2;
    db.query(returnTitle, (err, titleResults) => {
        if (err) throw err;
        console.table(titleResults);
        titleResults2 = titleResults;
    });

    db.query(sql, (err, results) => {
        if(err) throw err;
        inquirer.prompt([
            {
                name: 'employee_name',
                type: 'list',
                message: 'Select an employee to update their role.',
                choices: function () {
                    let choiceArray = results.map(choice => choice.full_name);
                    return choiceArray;
                },
                
            },
            {
                name: 'new_role',
                type: 'list',
                message: 'Select new title',
                choices: function () {
                    let choiceArray = titleResults2.map(choice => choice.title);
                    return choiceArray;
                }
            }
        ]).then((answer) => {
            const sql = `UPDATE employee 
                        SET role_id = (SELECT id FROM roles WHERE title = ?)  
                        WHERE CONCAT(employee.first_name," ",employee.last_name) = ?`;
            const params = [answer.new_role, answer.employee_name]
            db.query(sql, params, (err, results) => {
                if (err) throw err;
                const sqlDisplayUpdate = `SELECT employee.first_name,
                                    employee.last_name,
                                    employee.role_id,
                                    roles.title
                                    FROM employee
                                    JOIN roles ON employee.role_id = roles.id`;

                db.query(sqlDisplayUpdate, (err, results) => {
                    if (err) throw err;
                    console.table(results);
                    startPrompt();
                });
             })
        })

    });
}

//==================================== Update Employee  Manager ====================================//
function updateEmpMngr() {
    const sql = `SELECT employee.id, CONCAT(employee.first_name," ",employee.last_name) AS employee_name  FROM employee`;
      db.query(sql, (err, results) => {
          if(err) throw err;
          inquirer.prompt([
              {
                name: "employee",
                type: "list",
                message: "Who would you like to edit?",
                choices: function () {
                    let choiceArray = results.map(choice => choice.employee_name);
                    return choiceArray;
                }    

              },
              {
                name: "manager",
                type: "list",
                message: "Who is their new manager?",
                choices: function () {
                    let choiceArray = results.map(choice => choice.employee_name);
                    return choiceArray;
                }
              }
            ]).then((answer) => {
                const sql = `UPDATE employee 
                            SET manager_id = (SELECT id FROM(SELECT id FROM employee WHERE CONCAT(employee.first_name," ",employee.last_name) = ?) as M)
                            WHERE CONCAT(first_name," ",last_name) = ?`;
                const params = [answer.manager, answer.employee]
                db.query(sql, params, (err, results) => {
                        if (err) throw err;
                        const sqlDisplayUpdate = `SELECT employee.id,
                                                employee.first_name,
                                                employee.last_name,
                                                CONCAT(manager.first_name," ",manager.last_name) AS manager
                                                FROM employee
                                                LEFT JOIN  employee AS manager ON employee.manager_id = manager.id`;

                        db.query(sqlDisplayUpdate, (err, results) => {
                            if (err) throw err;
                            console.table(results);
                            startPrompt();
                        });
                    });
            });
      });
}
//==================================== Delete Department ====================================//
function deleteDepartment() {
    const sql = `SELECT * FROM department`;
    db.query(sql, (err, result) => {
        if(err) throw err;
        inquirer.prompt([
            {
                name: 'remove_department_name',
                type: 'list',
                message: 'Select the department to remove:',
                choices: function () {
                    let choiceArray = result.map(choice => choice.department_name);
                    return choiceArray;
                }  
            }
        ]).then((answer) => {
            const sql = `DELETE FROM department WHERE department_name = ?`;
            const param = [answer.remove_department_name];
            db.query(sql, param, (err,result) => {
                if (err) throw err;
                db.query(`SELECT * FROM department`, (err, results) => {
                    if (err) throw err;
                    console.table(results);
                    startPrompt();
                });
            });
        });
    });
}

//==================================== Delete Role ====================================//
function deleteRole() {
    const sql = `SELECT * FROM roles`;
    db.query(sql, (err, results) => {
        if (err) throw err;
        
        inquirer.prompt([
        {
            name: 'removeRole',
            type: 'list',
            message: 'Please select a Role to remove:',
            choices: function () {
                let choiceArray = results.map(choice => choice.title);
                return choiceArray;
            },
            
        }
        ]).then((answer) => {
            const sql = `DELETE FROM roles WHERE ? `;
            db.query(sql, {title: answer.removeRole}, (err,result) => {
                if (err) throw err;
                db.query(`SELECT * FROM roles`, (err, results) => {
                    if (err) throw err;
                    console.table(results);
                    startPrompt();
                });
            });
        });
    }); 
}

//==================================== Delete Employee ====================================//
function deleteEmployee() {
    const sql = `
                SELECT employee.id, 
                employee.first_name, 
                employee.last_name,  
                roles.title AS Title,
                department.department_name, 
                roles.salary,
                CONCAT(manager.first_name, ' ' ,manager.last_name) AS manager
                FROM employee 
                JOIN roles ON employee.role_id = roles.id
                JOIN department ON roles.department_id = department.id
                LEFT JOIN  employee AS manager ON employee.manager_id = manager.id`;
    
    db.query(sql, (err, result) => {
        console.table(result);
        inquirer.prompt([
            {
                name: 'id',
                type: 'input',
                message: 'Enter the Employee ID of the person to remove:'
            }
        ]).then((answer) => {
            const sql = `DELETE FROM employee WHERE ?`;
            const param = [answer.id];
            db.query(sql, param, (err,result) => {
                if (err) throw err;
                db.query(`SELECT * FROM employee`, (err, results) => {
                    if (err) throw err;
                    console.table(results);
                    startPrompt();
                });
            });
        });
        
    });
}

startPrompt();