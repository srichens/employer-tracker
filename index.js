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
let managerArray = [];
let employeeArray = [];
let roleIdArray = [];

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

function managerList() {
    db.query("SELECT concat(employee.first_name,' ',employee.last_name) AS manager FROM employee WHERE manager_id IS NULL", function (err, results) {      
        for (let i = 0; i < results.length; i++)
        managerArray.push(results[i].manager);        
    })
};

function employeeList() {
    db.query("SELECT concat(employee.first_name,' ',employee.last_name) AS name FROM employee", function (err, results) {      
        for (let i = 0; i < results.length; i++)
        employeeArray.push(results[i].name);        
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
    console.log("----------------------------------\n|         E m p l o y e e        |\n|          M a n a g e r         |\n----------------------------------")
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

// function roleById() {
//     db.query('SELECT employee.role_id, role.title FROM employee JOIN role ON employee.role_id = role.id', function (err, results) {
//         for (let i = 0; i < results.length; i++){
//             let employeeRole;
//             if(employeeRole = results[i].title) {
//                 let employeeRoleID= results[i].role_id;
//             }
//         }
//       });
// }
function viewEmployees() {

    db.query('SELECT employee.id, employee.first_name, employee.last_name, role.title, department.name AS department, role.salary FROM employee JOIN role ON employee.role_id = role.id JOIN department ON role.department_id = department.id', function (err, results) {
        console.table(results);
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
        choices: managerArray             
    }                
];  

function addEmployee() {
    roleList();
    managerList();
    inquirer
    .prompt(addEmpQues)    
    .then(response => {
        db.query(`INSERT INTO employee (first_name, last_name) VALUES ('${response.firstname}', '${response.lastname}')`, function (err, results) {
            console.log(results);
        });
        db.query('SELECT employee.role_id, role.title FROM employee JOIN role ON employee.role_id = role.id', function (err, results) {
            for (let i = 0; i < results.length; i++){
                roleIdArray.push(results[i]);
                if(roleIdArray[i].title == response.role) {
                    let employeeRoleID= roleIdArray[i].role_id;
                    console.log(employeeRoleID)
                }
            }
          });
        
        })
    
};

const updateRoleQues = [
    {
        type: 'list',
        name: 'name',
        message: "Which employee's role do you want to update?",
        choices: employeeArray                      
    },     
    {
        type: 'list',
        name: 'role',
        message: "Which role do you want to assign the selected employee?",
        choices: roleArray               
    }                
];  

function updateRole() {
    employeeList();
    roleList();
    inquirer
    .prompt(updateRoleQues)    
    .then(response => console.log(response))

}

function viewRoles() {
    db.query('SELECT role.id, role.title, department.name AS department, role.salary FROM role JOIN department ON role.department_id = department.id', 
    function (err, results) {
        console.table(results);
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
    departmentList();
    inquirer
    .prompt(addRoleQues)    
    .then(response => {
        db.query(`INSERT INTO employee (first_name, last_name VALUES (${response.firstname}, ${response.lastname}))`, function (err, results) {
            console.table(results);
        })
    })
};

function viewDepartments() {
    db.query('SELECT * FROM department', function (err, results) {
        console.table(results);
    })
}

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
    .then(response => console.log(response))
};