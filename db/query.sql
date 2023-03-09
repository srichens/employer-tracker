SELECT role.id, role.title, department.name AS department, role.salary
FROM role
JOIN department ON role.department_id = department.id;

SELECT DISTINCT employee.id, employee.first_name, employee.last_name, role.title, department.name AS department, role.salary
FROM employee
JOIN role ON employee.role_id = role.id
JOIN department ON role.department_id = department.id;

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
GROUP BY department.name, role.title, employee.last_name, employee.first_name;

SELECT concat(employees.first_name,' ',employees.last_name) AS Employee, concat(manager.first_name,' ',manager.last_name) as Manager
FROM employee employees
JOIN employee manager
ON employees.manager_id = manager.id
GROUP BY manager.last_name, manager.first_name, employees.last_name, employees.first_name;
