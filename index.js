const mysql = require('mysql2');

const inquirer = require('inquirer');

const db = mysql.createConnection(
    {
        host: '127.0.0.1',
        user: 'root',
        password: 'Asdfjk!2',
        database: 'company_db'
    },
);

//used in the Inquirer choices so that the lists are updated while the user is in the app
let roleArray = [];
let departmentArray = [];
let employeeArray = [];
let managerArray = [];

const startMessage = [
    {
        type: 'list',
        name: 'start',
        message: "What would you like to do?",
        choices: ['View All Employees', 'Add Employee', 'Update Employee Role', 
        'Update Employee Manager', 'View All Roles', 'Add Role', 'View All Departments', 'Add Department', 
        'View Employees by Manager', 'View Employees by Department', 'Quit']
    }
];

startApp();

function startApp() {
    console.log("----------------------------------\n|         E m p l o y e e        |\n|          M a n a g e r         |\n----------------------------------");
    roleList();   
};

//the four functions below create the arrays for the Inquirer choices. They are called one by one at the start of the app - 
//each function calling the nextone - to make sure each query happens
function roleList() {
    db.query('SELECT id, title FROM role', function (err, results) {
        if (err) throw err;
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
        if (err) throw err;
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
        if (err) throw err;
        for (let i = 0; i < results.length; i++)
            employeeArray.push({
                name: results[i].name,
                id: results[i].id
            });
            managerList()
    })
};

function managerList() {
    db.query("SELECT concat(employee.first_name,' ',employee.last_name) AS name, id FROM employee", function (err, results) {
        if (err) throw err;
        for (let i = 0; i < results.length; i++)
            managerArray.push({
                name: results[i].name,
                id: results[i].id
            });
            managerArray.unshift({
                name: "None",
                id: 0
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
            } else { console.log('Goodbye') }
        })
};

function viewEmployees() {

    db.query("SELECT DISTINCT employee.id AS Employee_ID, concat(employee.first_name, ' ' ,employee.last_name) AS Employee, role.title AS Title, department.name AS Department, role.salary AS Salary, concat(e.first_name, ' ' ,e.last_name) AS Manager FROM employee INNER JOIN role ON employee.role_id = role.id INNER JOIN department ON department.id = role.department_id LEFT JOIN employee e on employee.manager_id = e.id", function (err, results) {              
        if (err) throw err;
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
            return managerArray.map(e => {
                return {
                    name: e.name,
                    value: e.id
                }
            })
        }
    }
];

//two separate query functions are used to add employee, since the employee has to be added to the employee array with it's employee ID, and the ID is not created until the new employee is added to database
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
    if(employeeMgrId === 0){
        db.query(`INSERT INTO employee (first_name, last_name, role_id) VALUES ('${firstName}', '${lastName}', '${employeeRoleId}')`, function (err, results) {
            if (err) throw err;
            let name = `${firstName} ${lastName}`;      
            getEmployeeId(name);       
        })  
    } else {
        db.query(`INSERT INTO employee (first_name, last_name, role_id, manager_id) VALUES ('${firstName}', '${lastName}', '${employeeRoleId}', '${employeeMgrId}')`, function (err, results) {
            if (err) throw err;
            let name = `${firstName} ${lastName}`;      
            getEmployeeId(name);       
        })  
    }
};

function getEmployeeId(name) {
       db.query("SELECT concat(first_name,' ',last_name) AS name, employee.id AS id FROM employee", function (err, results) {
        if (err) throw err;
        for (let i = 0; i < results.length; i++) {
            if (results[i].name === name) {
                let employeeId = results[i].id;
                employeeArray.push({
                    name: results[i].name,
                    id: employeeId
                });
                managerArray.push({
                    name: results[i].name,
                    id: employeeId
                });
                console.log(`The employee ${name} has been added to the database`);
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
        if (err) throw err;
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
    if (err) throw err;
    (console.log("The employee's manager has been updated"))
    askQuestions();
 })
};

function viewRoles() {
    db.query('SELECT role.id AS Title_ID, role.title AS Title, department.name AS Department, role.salary AS Salary FROM role JOIN department ON role.department_id = department.id',
        function (err, results) {
            if (err) throw err;
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

//like the employee add, the role add needs two separate query functions so that the newly created role ID can be retrieved after the role is added to the database, and then the role title and ID added to role array
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
        if (err) throw err;   
        getRoleId(rolename);
    })
};

function getRoleId(rolename) {   
    db.query("SELECT title, id FROM role", function (err, results) {      
        if (err) throw err;  
        for (let i = 0; i < results.length; i++) {
            if (results[i].title === rolename) {
                let roleId = results[i].id;
                roleArray.push({
                    title: results[i].title,
                    id: roleId
                });
             console.log(`The role ${rolename} has been added to the database`);
             askQuestions();               
            }
        }
    })
};

function viewDepartments() {
    db.query('SELECT id AS Department_ID, name AS Department FROM department', function (err, results) {   
        if (err) throw err;     
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

//new department needs a separated get ID, just like add employee and add role - ID does not exists until department is added, and ID is needed to add new department to the department array for Inquirer choices
function addDepartment() {
    inquirer
        .prompt(addDeptQues)
        .then(response => {
            let department = response.addDept;
            db.query(`INSERT INTO department (name) VALUES ('${department}')`, function (err, results) {     
                if (err) throw err;        
                getDeptId(department);
            })
        })
};

function getDeptId(department) {  
    db.query("SELECT name, id FROM department", function (err, results) {
        if (err) throw err;  
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

function viewEmpByMgr() {
    db.query("SELECT concat(manager.first_name,' ',manager.last_name) as Manager, concat(employees.first_name,' ',employees.last_name) AS Employee FROM employee employees JOIN employee manager ON employees.manager_id = manager.id ORDER BY manager.id", function (err, results) {        
        if (err) throw err;
        console.table(results);
        askQuestions();
    })
};

function viewEmpByDept() {
    db.query("SELECT department.name AS Department, concat(first_name,' ',last_name) AS Employee, role.title AS Title FROM department JOIN role ON department.id = role.department_id JOIN employee ON role.id = employee.role_id ORDER BY department.id", function (err, results) {        
        if (err) throw err;
        console.table(results);
        askQuestions();
    })
};

