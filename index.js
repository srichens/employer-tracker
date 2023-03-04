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
        // choices: ['Sales Lead', 'Salesperson', 'Lead Engineer', 'Software Engineer', 'Account Manager', 'Accountant', 'Legal Team Lead', 'Lawyer']   
        choices: roleArray      
     },  
    {
        type: 'list',
        name: 'manager',
        message: "Who is the employee's manager?",
        choices: ['John Doe', 'Ashley Rodriguez', 'Kunal Singh', 'Sarah Lourd']               
    }                
];  

function rolesList() {
    db.query('SELECT role.title FROM role', function (err, results) {       
      
        for (let i = 0; i < results.length; i++)
        roleArray.push(results[i].title);
        return roleArray;
    })
}


function addEmployee() {
    rolesList();
    inquirer
    .prompt(addEmpQues)    
    .then(response => console.log(response))
};

const updateRoleQues = [
    {
        type: 'list',
        name: 'name',
        message: "Which employee's role do you want to update?",
        choices: ['John Doe', 'Mike Chan', 'Ashley Rodriguez', 'Kevin Tupik', 'Kunal Singh', 'Malie Brown', 'Sarah Lourd', 'Tom Allen']                      
    },     
    {
        type: 'list',
        name: 'role',
        message: "Which role do you want to assign the selected employee?",
        choices: ['Sales Lead', 'Salesperson', 'Lead Engineer', 'Software Engineer', 'Account Manager', 'Accountant', 'Legal Team Lead', 'Lawyer']               
    }                
];  

function updateRole() {

}

function viewRoles() {
    db.query('SELECT role.id, role.title, department.name AS department, role.salary FROM role JOIN department ON role.department_id = department.id', 
    function (err, results) {
        return results;
    })

};

function viewDepartments() {
    db.query('SELECT DISTINCT employee.id, employee.first_name, employee.last_name, role.title, department.name AS department, role.salary FROM employee JOIN role ON employee.role_id = role.id JOIN department ON role.department_id = department.id', 
    function (err, results) {
        console.table(results);
    })
}