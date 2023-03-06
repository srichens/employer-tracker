const mysql = require('mysql2');
// const Employee = require('./lib/Employee');

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
let employeeMgrId;

function roleList() { 
    db.query('SELECT title FROM role', function (err, results) {      
        for (let i = 0; i < results.length; i++) 
            roleArray.push(results[i].title);       
    })
};

function departmentList() {    
    db.query('SELECT name FROM department', function (err, results) {      
        for (let i = 0; i < results.length; i++)
            departmentArray.push(results[i].name); 
    })
};

function employeeList() {    
    db.query("SELECT concat(employee.first_name,' ',employee.last_name) AS name FROM employee", function (err, results) {      
        for (let i = 0; i < results.length; i++) 
        employeeArray.push(results[i].name);     
    })
};

function newEmployee(firstName, lastName, employeeRoleId, managerName) {     
    db.query("SELECT concat(first_name,' ',last_name) AS manager, employee.id FROM employee", function (err, results) {    
        for (let i = 0; i < results.length; i++){           
            if(results[i].manager === managerName) {
                employeeMgrId  = results[i].id;               
                
                db.query(`INSERT INTO employee (first_name, last_name, role_id, manager_id) VALUES ('${firstName}', '${lastName}', '${employeeRoleId}', '${employeeMgrId}')`, function (err, results) {
                    employeeArray.push(`${firstName} ${lastName}`);
                    console.log(`The employee ${firstName} ${lastName} has been added to the database`)
                    askQuestions();                   
                });                
            }
        }
    })
};    
    
function addUpdatedRole(employee, employeeRoleId) {           
    db.query("SELECT concat(first_name,' ',last_name) AS fullname, employee.id FROM employee", function (err, results) {         
        for (let i = 0; i < results.length; i++){           
            if(results[i].fullname === employee) {
                let employeeId  = results[i].id;               
                
                db.query(`UPDATE employee SET role_id = ${employeeRoleId} WHERE id = ${employeeId}`, function (err, results) {                        
                    (console.log(`${employee}'s role has been updated`))
                    askQuestions();                        
                });                
            }
        }
    });      
};

function newRole(rolename, salary, departmentId) {
    db.query(`INSERT INTO role (title, salary, department_id) VALUES ('${rolename}', '${salary}', '${departmentId}')`, function (err, results) {     
        roleArray.push(`${rolename}`);
        console.log(`The role ${rolename} has been added to the database`)
        askQuestions();
    })  
};

const startMessage = [
    {
        type: 'list',
        name: 'start',
        message: "What would you like to do?",
        choices: ['View All Employees', 'Add Employee', 'Update Employee Role', 'View All Roles', 'Add Role', 'View All Departments', 'Add Department', 'Quit']        
    }      
];  

function startApp(){
    console.log("----------------------------------\n|         E m p l o y e e        |\n|          M a n a g e r         |\n----------------------------------");
    roleList();
    departmentList();        
    employeeList();  
    askQuestions();
};

function askQuestions() {
    inquirer
    .prompt(startMessage)    
    .then(response => {
        if(response.start === 'View All Employees'){
            viewEmployees()
        } else if (response.start === 'Add Employee'){
            addEmployee()
        } else if (response.start === 'Update Employee Role'){
            updateRole()
        } else if (response.start === 'View All Roles'){
            viewRoles()
        } else if (response.start === 'Add Role'){
            addRole()
        } else if (response.start === 'View All Departments'){
            viewDepartments()
        } else if (response.start === 'Add Department'){
            addDepartment()
        } else {console.log('Goodbye')}

    })     
};

startApp();

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
        choices: roleArray     
     },  
    {
        type: 'list',
        name: 'manager',
        message: "Who is the employee's manager?",
        choices: employeeArray             
    }                
];  

function addEmployee() {        
    inquirer
    .prompt(addEmpQues)    
    .then(response => {    
        let firstName = response.firstname;
        let lastName = response.lastname;
        let managerName = response.manager;
        db.query('SELECT employee.role_id AS id, role.title AS title FROM employee JOIN role ON employee.role_id = role.id', function (err, results) {
            for (let i = 0; i < results.length; i++){                
                if(results[i].title == response.role) {
                    let employeeRoleId = results[i].id;                 
                    newEmployee(firstName, lastName, employeeRoleId, managerName);                
                }
            }                
        })            
    })    
};

const updateRoleQues = [
    {
        type: 'input',
        name: 'confirm',
        message: "You are about to update and employee's role - hit enter to continue"                

    },  
    {
        type: 'list',
        name: 'employee',
        message: "Which employee's role do you want to update?",       
        choices: employeeArray     
     },  
    {
        type: 'list',
        name: 'newrole',
        message: "Which role do you want to assign the selected employee?",
        choices: roleArray             
    }                
];  

function updateRole() {  
    inquirer
    .prompt(updateRoleQues)    
    .then(response => {
        let employee = response.employee;
        
        db.query('SELECT employee.role_id AS id, role.title AS title FROM employee JOIN role ON employee.role_id = role.id', function (err, results) {
            for (let i = 0; i < results.length; i++){                
                if(results[i].title == response.newrole) {
                    let employeeRoleId = results[i].id;
                    addUpdatedRole(employee, employeeRoleId);                
                }
            }                
        })
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
        choices: departmentArray             
    }                
];  

function addRole() {    
    inquirer
    .prompt(addRoleQues)    
    .then(response => {
        let rolename = response.rolename;
        let salary = response.salary;
        db.query('SELECT * FROM department', function (err, results) {
            for (let i = 0; i < results.length; i++){
                departmentIdArray.push(results[i]);
                if(departmentIdArray[i].name == response.department) {
                    let departmentId = departmentIdArray[i].id;                    
                    newRole(rolename, salary, departmentId);
                }
            }
        });  
      
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
    .then(response =>  {
        let department = response.addDept;
        db.query(`INSERT INTO department (name) VALUES ('${department}')`, function (err, results) {
        console.log(`The department ${department} has been added to the database`);
        askQuestions();
        })
    })
};