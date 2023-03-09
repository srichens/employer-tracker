SELECT role.id, role.title, department.name AS department, role.salary
FROM role
JOIN department ON role.department_id = department.id;

SELECT DISTINCT employee.id, concat(employee.first_name, ' ' ,employee.last_name) AS Employee, role.title AS Title, department.name AS Department, role.salary AS Salary, concat(e.first_name, ' ' ,e.last_name) AS Manager
FROM employee
INNER JOIN role ON employee.role_id = role.id
INNER JOIN department ON department.id = role.department_id
LEFT JOIN employee e on employee.manager_id = e.id;

SELECT title FROM role;

SELECT concat(first_name,' ',last_name) AS manager
FROM employee WHERE manager_id IS NULL;

SELECT employee.role_id, role.title
FROM employee
JOIN role ON employee.role_id = role.id;

SELECT concat(first_name,' ',last_name) AS manager, employee.id
FROM employee WHERE manager_id IS NULL;

SELECT role.department_id AS id, department.name AS department 
FROM department JOIN role ON role.department_id = department.id;

SELECT department.name AS Department, concat(first_name,' ',last_name) AS Employee, role.title AS Title
FROM department
JOIN role ON department.id = role.department_id
JOIN employee ON role.id = employee.role_id
ORDER BY department.id;

SELECT concat(employees.first_name,' ',employees.last_name) AS Employee, concat(manager.first_name,' ',manager.last_name) as Manager
FROM employee employees
JOIN employee manager
ON employees.manager_id = manager.id
ORDER BY manager.id;




