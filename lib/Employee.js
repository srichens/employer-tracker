const mysql = require('mysql2');

const db = mysql.createConnection(
    {
      host: '127.0.0.1',  
      user: 'root',   
      password: 'Asdfjk!2',    
      database: 'company_db'
    },
    console.log(`Connected to the company_db database.`)
  );

class Employee {
    
    constructor(firstname, lastname, manager, role) {        
        this.firstname = firstname;
        this.lastname = lastname;
        this.manager = manager;
        this.role = role;

        this.getRoleId = () => {   
            // console.log(this.role);         
            let roleId;
            db.query('SELECT employee.role_id, role.title FROM employee JOIN role ON employee.role_id = role.id', function (err, results) {
                // console.log(results);
                console.log(this.role);      
                for (let i = 0; i < results.length; i++) {                  
                    if(results[i].title == this.role) {
                        roleId = results[i].id;  
                        onsole.log(roleId);                  
                     }
                } 
            }) 
        };

        this.getManagerId = () => {       
            // console.log(this.manager);     
            let managerId;  
            db.query("SELECT concat(first_name,' ',last_name) AS manager, employee.id FROM employee WHERE manager_id IS NULL", function (err, results) {
                // console.log(results);
                console.log(this.manager);   
                for (let i = 0; i < results.length; i++) {              
                    if(results[i].manager == this.manager) {
                        managerId = results[i].id;                   
                        console.log(managerId);                    
                    }
                } 
            })     
        };                    
    }

    // getRoleId(){
    //     let roleIdArray = [];
    //     let employeeRoleId;
    //     db.query('SELECT employee.role_id, role.title FROM employee JOIN role ON employee.role_id = role.id', function (err, results) {
    //         for (let i = 0; i < results.length; i++) {
    //             roleIdArray.push(results[i]);
    //         if(roleIdArray[i].title == this.role) {
    //             employeeRoleId = roleIdArray[i].role_id;
    //             // this.employeeRoleId = employeeRoleId;
    //             // return this.employeeRoleId;
    //             console.log(employeeRoleId);
    //         }}
    //     }) 

    // };

    // getManagerId(){
        
    //     let managerId;  
    //     db.query("SELECT concat(first_name,' ',last_name) AS manager, employee.id FROM employee WHERE manager_id IS NULL", function (err, results) {
    //         console.log(results);
    //         for (let i = 0; i < results.length; i++) {
    //         // managerIdArray.push(results[i].id);
    //         // console.log(managerIdArray);
    //         if(results[i].manager == this.manager) {
    //             managerId = results[i].id;
    //             // this.employeeMgrId = employeeMgrId;
    //             // return employeeMgrId;
    //             console.log(managerId);
                
    //         }
    //         }
    //     })      
    // };      

}

module.exports = Employee;