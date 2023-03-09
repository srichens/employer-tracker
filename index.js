const mysql = require('mysql2');

const inquirer = require('inquirer');

const db = mysql.createConnection(
    {
        host: '127.0.0.1',
        user: 'root',
        password: 'Asdfjk!2',
        database: 'company_db'
    },
    console.log(`Connected to the company_db database.`)
);

let roleArray = [];
let departmentArray = [];
let employeeArray = [];
let departmentIdArray = [];

const startMessage = [
    {
        type: 'list',
        name: 'start',
        message: "What would you like to do?",
        choices: ['View All Employees', 'Add Employee', 'Update Employee Role', 
        'Update Employee Manager', 'View All Roles', 'Add Role', 'View All Departments', 'Add Department', 
        'View Employees by Manager', 'View Employees by Department', 'Delete Department', 'Quit']
    }
];

startApp();

function startApp() {
    console.log("----------------------------------\n|         E m p l o y e e        |\n|          M a n a g e r         |\n----------------------------------");
    roleList();   
};

function roleList() {
    db.query('SELECT id, title FROM role', function (err, results) {
        for (let i = 0; i < results.length; i++)
            roleArray.push({
                title: results[i].title,
                id: results[i].id
            });
        departmentList()
    })
};

function departmentList() {
    db.query('SELECT name, id FROM department', function (err, results) {
        for (let i = 0; i < results.length; i++)
            departmentArray.push({
                name: results[i].name,
                id: results[i].id
            });
            employeeList()
    })
};

function employeeList() {
    db.query("SELECT concat(employee.first_name,' ',employee.last_name) AS name, id FROM employee", function (err, results) {
        for (let i = 0; i < results.length; i++)
            employeeArray.push({
                name: results[i].name,
                id: results[i].id
            });
            askQuestions()
    })
};

function askQuestions() {  
    inquirer
        .prompt(startMessage)
        .then(response => {
            if (response.start === 'View All Employees') {
                viewEmployees()
            } else if (response.start === 'Add Employee') {
                addEmployee()
            } else if (response.start === 'Update Employee Role') {
                updateRole()
            } else if (response.start === 'Update Employee Manager') {
                updateMgr()
            } else if (response.start === 'View All Roles') {
                viewRoles()
            } else if (response.start === 'Add Role') {
                addRole()
            } else if (response.start === 'View All Departments') {
                viewDepartments()
            } else if (response.start === 'Add Department') {
                addDepartment()
            } else if (response.start === 'View Employees by Manager') {
                viewEmpByMgr()
            } else if (response.start === 'View Employees by Department') {
                viewEmpByDept()
            } else if (response.start === 'Delete Department') {
                deleteDepartment()
            } else { console.log('Goodbye') }
        })
};

function viewEmployees() {

    db.query('SELECT employee.id, employee.first_name, employee.last_name, role.title, department.name AS department, role.salary FROM employee JOIN role ON employee.role_id = role.id JOIN department ON role.department_id = department.id', function (err, results) {              
        console.table(results);
        askQuestions();
    });
};

const addEmpQues = [
    {
        type: 'input',
        name: 'firstname',
        message: "What is the employee's first name?"
    },
    {
        type: 'input',
        name: 'lastname',
        message: "What is the employee's last name?"
    },
    {
        type: 'list',
        name: 'role',
        message: "What is the employee's role?",
        choices: () => {
            return roleArray.map(r => {
                return {
                    name: r.title,
                    value: r.id
                }
            })
        }
    },
    {
        type: 'list',
        name: 'manager',
        message: "Who is the employee's manager?",
        choices: () => {
            return employeeArray.map(e => {
                return {
                    name: e.name,
                    value: e.id
                }
            })
        }
    }
];

function addEmployee() {
    inquirer
        .prompt(addEmpQues)
        .then(response => {
            let firstName = response.firstname;
            let lastName = response.lastname;
            let employeeMgrId = response.manager;
            let employeeRoleId = response.role;
            newEmployee(firstName, lastName, employeeRoleId, employeeMgrId);          
        })
};

function newEmployee(firstName, lastName, employeeRoleId, employeeMgrId) {
    db.query(`INSERT INTO employee (first_name, last_name, role_id, manager_id) VALUES ('${firstName}', '${lastName}', '${employeeRoleId}', '${employeeMgrId}')`, function (err, results) {
        let name = `${firstName} ${lastName}`;      
        getEmployeeId(name);       
    })  
};

function getEmployeeId(name) {
       db.query("SELECT concat(first_name,' ',last_name) AS name, employee.id AS id FROM employee", function (err, results) {
        for (let i = 0; i < results.length; i++) {
            if (results[i].name === name) {
                let employeeId = results[i].id;
                employeeArray.push({
                    name: results[i].name,
                    id: employeeId
                });
                console.log(`${name} has been added to the database`);
                askQuestions();               
            }
        }
    })
};

const updateRoleQues = [
       {
        type: 'list',
        name: 'employee',
        message: "Which employee's role do you want to update?",
        choices: () => {
            return employeeArray.map(e => {
                return {
                    name: e.name,
                    value: e.id
                }
            })
        }
    },
    {
        type: 'list',
        name: 'newrole',
        message: "Which role do you want to assign the selected employee?",
        choices: () => {
            return roleArray.map(r => {
                return {
                    name: r.title,
                    value: r.id
                }
            })
        }
    }
];

function updateRole() {    
    inquirer
        .prompt(updateRoleQues)
        .then(response => {
            let employeeId = response.employee;
            let roleId = response.newrole;
            addUpdatedRole(employeeId, roleId);               
        })
};

function addUpdatedRole(employeeId, roleId) {
    db.query(`UPDATE employee SET role_id = ${roleId} WHERE id = ${employeeId}`, function (err, results) {
        if (err) { console.log(err) };
        (console.log("The employee's role has been updated"))
        askQuestions();
    })
};


const updateMgrQues = [
    {
     type: 'list',
     name: 'employee',
     message: "For which employee do you want to update the manager?",
     choices: () => {
         return employeeArray.map(e => {
             return {
                 name: e.name,
                 value: e.id
             }
         })
     }
 },
 {
     type: 'list',
     name: 'newmgr',
     message: "Which manager do you want to assign the selected employee?",
     choices: () => {
        return employeeArray.map(e => {
            return {
                name: e.name,
                value: e.id
            }
        })
    }
 }
];

function updateMgr() {    
 inquirer
     .prompt(updateMgrQues)
     .then(response => {
         let employeeId = response.employee;
         let mgrId = response.newmgr;
         addUpdatedMgr(employeeId, mgrId);               
     })
};

function addUpdatedMgr(employeeId, mgrId) {
 db.query(`UPDATE employee SET manager_id = ${mgrId} WHERE id = ${employeeId}`, function (err, results) {
     if (err) { console.log(err) };
     (console.log("The employee's manager has been updated"))
     askQuestions();
 })
};

function viewRoles() {
    db.query('SELECT role.id, role.title, department.name AS department, role.salary FROM role JOIN department ON role.department_id = department.id',
        function (err, results) {
            console.table(results);
            askQuestions();
        })
};

const addRoleQues = [
    {
        type: 'input',
        name: 'rolename',
        message: "What is the name of the role?"
    },
    {
        type: 'input',
        name: 'salary',
        message: "What is the salary of the role?"
    },
    {
        type: 'list',
        name: 'department',
        message: "Which department does the role belong to?",
        choices: () => {
            return departmentArray.map(d => {
                return {
                    name: d.name,
                    value: d.id
                }
            })
        }
    }
];

function addRole() {    
    inquirer
        .prompt(addRoleQues)
        .then(response => {
            let rolename = response.rolename;
            let salary = response.salary;
            let departmentId = response.department;
            newRole(rolename, salary, departmentId);           
        })
};

function newRole(rolename, salary, departmentId) {
    db.query(`INSERT INTO role (title, salary, department_id) VALUES ('${rolename}', '${salary}', '${departmentId}')`, function (err, results) {       
       getRoleId(rolename);
    })
};

function getRoleId(rolename) {   
    db.query("SELECT title, id FROM role", function (err, results) {        
     for (let i = 0; i < results.length; i++) {
         if (results[i].title === rolename) {
             let roleId = results[i].id;
             roleArray.push({
                 title: results[i].title,
                 id: roleId
             });
             console.log(`${rolename} has been added to the database`);
             askQuestions();               
         }
     }
 })
};

function viewDepartments() {
    db.query('SELECT * FROM department', function (err, results) {        
        console.table(results);
        askQuestions();
    })
};

const addDeptQues = [
    {
        type: 'input',
        name: 'addDept',
        message: "What is the name of the department?"
    }
];

function addDepartment() {
    inquirer
        .prompt(addDeptQues)
        .then(response => {
            let department = response.addDept;
            db.query(`INSERT INTO department (name) VALUES ('${department}')`, function (err, results) {             
                getDeptId(department);
            })
        })
};

function getDeptId(department) {  
    db.query("SELECT name, id FROM department", function (err, results) {    
     for (let i = 0; i < results.length; i++) {
         if (results[i].name === department) {
             let deptId = results[i].id;
             departmentArray.push({
                 name: results[i].name,
                 id: deptId
             });
             console.log(`The department ${department} has been added to the database`);
             askQuestions();               
         }
     }
 })
};

const deleteDeptQues = [
    {
        type: 'list',
        name: 'delDept',
        message: "Which department would you like to delete?",
        choices: () => {
            return departmentArray.map(d => {
                return {
                    name: d.name,
                    value: d.name
                }
            })
        }
    }
];

function deleteDepartment() {
    inquirer
        .prompt(deleteDeptQues)
        .then(response => {
            let department = response.delDept;
            db.query("SELECT name, id FROM department", function (err, results) {    
                for (let i = 0; i < results.length; i++) {
                    if (results[i].name === department) {
                        let deptId = results[i].id;
                        useDeptIdForDelete(department, deptId);
                    }}
            })  
                        
            
            //     db.query(`DELETE FROM department WHERE name='${department}'`, function (err, results) {
            //         const index = departmentArray.indexOf(department);
            //         departmentArray.splice(index, 1);                
            //         // departmentArray.push(department);
            //         console.log(`The department ${department} has been deleted from the database`);
            //         askQuestions();
            //     })
        })
};

function useDeptIdForDelete(department, deptId) {  
    db.query(`DELETE FROM department WHERE name='${department}'`, function (err, results) {
                const index = departmentArray.indexOf({name: department, id: deptId});
                // console.log(index);
                departmentArray.splice(index, 1);     
                // console.log(departmentArray);           
                // departmentArray.push(department);
                console.log(`The department ${department} has been deleted from the database`);
                askQuestions();
            })
//     db.query("SELECT name, id FROM department", function (err, results) {    
//      for (let i = 0; i < results.length; i++) {
//          if (results[i].name === department) {
//              let deptId = results[i].id;
//              departmentArray.push({
//                  name: results[i].name,
//                  id: deptId
//              });
//              console.log(`The department ${department} has been added to the database`);
//              askQuestions();               
//          }
//      }
//  })
};

function viewEmpByMgr() {
    db.query("SELECT concat(manager.first_name,' ',manager.last_name) as Manager, concat(employees.first_name,' ',employees.last_name) AS Employee FROM employee employees JOIN employee manager ON employees.manager_id = manager.id GROUP BY manager.last_name, manager.first_name, employees.last_name, employees.first_name;", function (err, results) {        
        console.table(results);
        askQuestions();
    })
};

function viewEmpByDept() {
    db.query("SELECT department.name AS Department, concat(first_name,' ',last_name) AS Employee, role.title AS Title FROM department JOIN role ON department.id = role.department_id JOIN employee ON role.id = employee.role_id GROUP BY department.name, role.title, employee.last_name, employee.first_name", function (err, results) {        
        console.table(results);
        askQuestions();
    })
};

