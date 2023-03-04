const mysql = require('mysql2');

const inquirer = require('inquirer');

const db = mysql.createConnection(
  {
    host: '127.0.0.1',  
    user: 'root',   
    password: 'Asdfjk!2',
    //change to actual database when created
    database: 'company_db'
  },
  console.log(`Connected to the company_db database.`)
);


// // Query database
// db.query('SELECT * FROM movies', function (err, results) {
//   console.log(results);
// });

// db.query('SELECT * FROM reviews', function (err, results) {
//     console.log(results);
//   });

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
            viewDepartments()
        } else {console.log('Goodbye')}

    })     
};

startApp();

function viewEmployees() {

    db.query('SELECT * FROM employee', function (err, results) {
        console.table(results);
      });
};

function viewRoles() {
    db.query('SELECT role.id, role.title, department.name AS department, role.salary FROM role JOIN department ON role.department_id = department.id', 
    function (err, results) {
        console.table(results);
    })

};

function viewDepartments() {
    db.query('SELECT DISTINCT employee.id, employee.first_name, employee.last_name, role.title, department.name AS department, role.salary FROM employee JOIN role ON employee.role_id = role.id JOIN department ON role.department_id = department.id', 
    function (err, results) {
        console.table(results);
    })
}