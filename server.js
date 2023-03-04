// const mysql = require('mysql2');

const inquirer = require('inquirer');

// const db = mysql.createConnection(
//   {
//     host: '127.0.0.1',  
//     user: 'root',   
//     password: 'Asdfjk!2',
//     //change to actual database when created
//     database: 'movie_db'
//   },
//   console.log(`Connected to the movie_db database.`)
// );


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
        choices: ['View All Employees', 'Add Employee', 'Update Employee Role', 'View All Roles', 'Add Role', 'View All Departments', 'Add Department']        
    }      
];  

function startApp(){
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
        } else {
            addDepartment()
        }

    })     
};