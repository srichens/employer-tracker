# Employee Tracker

[![License: MIT](https://img.shields.io/badge/License-MIT-purple.svg)](https://opensource.org/licenses/MIT)

## Bootcamp Week 12 Challenge
This week's challenge was to build a command-line application from scratch to manage a company's employee database, using Node.js, Inquirer, and MySQL. The requirements were the following:

1. When the app is started, the user is given a list of options that include viewing employees, departments or roles; adding employees, departments or roles; and updating an employee role.
2. The employees, departments, and roles are tables in a SQL database. The inquirer questions return answers that query the database. 
3. The queries for viewing departments, roles and employees must be displayed as tables, using console.table. The tables must include specified columns, some that come from different tables, so the queries must join tables.
4. When a department, role, or employee is added to the database, those new adds must be immediately available to choose from when continuing on to a different option in the menu.
5. *Bonus Tasks that are also included:* Update employee managers, view employees by managers, and view employees by department.


## Table of Contents
1. [Installation](#installation)
2. [Usage](#usage)
3. [Process Highlights](#process-highlights)
4. [License](#license)
5. [Contributing](#contributing)
6. [Questions](#questions)

## Installation
This app requires Node.js, npm, inquirer, mysql2 and console.table.

## Usage
Log into MySQL, use the company_db database, run schema.sql in the db folder, and then run seeds.sql in the db folder. Quit mysql and run node index.js to start the app. Choose from the list of options to view and modify employees, roles and departments. Please see the demo video linked below.

![image](https://user-images.githubusercontent.com/117301473/224130751-6b10e157-9f9d-4620-88cd-a2900c4c9b5f.png)

[*LINK TO EMPLOYER TRACKER DEMO VIDEO*](https://watch.screencastify.com/v/1F5Abv1drUYiy2pM1Qi0)

## Process Highlights
1. I started with setting up the Inquirer questions and testing with the easiest query - View All Departments. That query did not require any table joining. That gave me a good place to build on for the more complicated queries, and developing a basic framework for all the questions and queries went pretty smoothly.

2. *Challenges:* The first real challenge I encountered was the lists of employees and roles and departments that were options in the Inquirer questions: I couldn't just hard code an array in; since we were adding departments, employees and roles as we went along, the array in the Inquirer choices would have to be dynamic and update with each add. So I created arrays for the role, departments and employees using a query and a for loop for each. I first tried calling that function each time I needed an updated array, but of course that continued to add on to the existing array, which had to be a global variable to be used in the Inquirer questions. So I added each array function at the beginning of the app and then every time a role, department or employee was added, I pushed it to the array at the end of the add function. Other challenges were getting the manager on the View All Employees query (I had to use a left join with the other joins), and trying to do the bonus deletes. I gave up on the deletes, because I got it to a point where it would delete from the database, but would delete everything connected to the deleted item, and I ran out of time to keep trying. 

3. *Successes:* I almost finished the app without adding "None" to the list of managers. I was using the employee array as the manager list in the Inquirer choices, so first I had to have a separate manager list, which was just the employee array, but with None added to the front. However, since my tutor had helped me tighten up getting the IDs from the name adds by making the arrays with objects that included name and ID, I had to add None in the same format. So I figured that out, and I also had to make a condition to add the employee without a manager ID if None was chosen. I got it working very quickly, so that felt good.

4. *Wish List:* I really wanted to have the queries in a different file, but the way I set it up to begin with made it too complicated to separate the queries from the Inquirer questions, so I settled for one, long file. 


## License
This product is licensed under MIT.

## Contributing
If you would like to contribute to this application, please refer to the [Contributor Covenant](https://www.contributor-covenant.org/).

## Questions
If you have any questions, please contact me at sarahgrichens@gmail.com or view my projects at https://github.com/srichens.