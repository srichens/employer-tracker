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
