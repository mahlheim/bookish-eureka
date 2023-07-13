// import and require express and mysql2
const express = require('express');
const inquirer = require('inquirer');
const mysql = require('mysql2');
const { validateString } = require('./validate');

const PORT = process.env.PORT || 3001;
const app = express();

// express middleware
app.use(express.urlencoded({ extended: false }));
app.use(express.json());

// connect to database
const db = mysql.createConnection(
  {
    host: 'localhost',
    // MySQL username,
    user: 'root',
    // MySQL password
    password: 'M0niqu3$$',
    database: 'employees_db'
  },
  console.log(`You are connected to the employees_db database.`)
);

// prompt
const prompt = () => {
  inquirer.prompt ([{
    name: 'choices',
    type: 'list',
    message: 'What would you like to do?',
    choices: [
      'View all departments',
      'View all roles',
      'View all employees',
      'Add a department',
      'Add a role',
      'Add an employee',
      'Update an employee role',
      'Remove employee',
      'Remove role',
      'Remove department',
      'Exit'
    ]
  }])
  .then((answers) => {
    const {choices} = answers;
    if (choices === 'View all departments') {
      viewAllDepartments();
    }
    if (choices === 'View all roles') {
      viewAllRoles();
    }
    if (choices === 'View all employees') {
      viewAllEmployees();
    } 
    if (choices === 'Add a department') {
      addADepartment();
    }
    if (choices === 'Add a role') {
      addARole();
    }
    if (choices === 'Add an employee') {
      addAnEmployee();
    }
    if (choices === 'Update an employee role') {
      updateEmployeeRole();
    }
    if (choices === 'Remove employee') {
      removeEmployee();
    }
    if (choices === 'Remove role') {
      removeRole();
    } 
    if (choices === 'Remove department') {
      removeDepartment();
    }
    if (choices === 'Exit') {
      db.end();
    }
  });
  };


// view

// view all departments
const viewAllDepartments = () => {
  let sql = `SELECT department.id AS id, department.department_name AS department FROM department`;
  db.promise().query(sql, (error, response) => {
    if (error) throw error;
    console.table(response);
    prompt();
  });
};

// view all roles
const viewAllRoles = () => {
  let sql = `SELECT role.id, role.title, department.department_name AS department
            FROM role
            INNER JOIN department ON role.department_id = department.id`;
  db.promise().query(sql, (error, response) => {
    if (error) throw error;
    console.table(response);
    prompt();
  });
};

// view all employees
const viewAllEmployees = () => {
  let sql = `SELECT employee.id,
            employee.first_name,
            employee.last_name,
            role.title,
            department.department_name AS 'department',
            role.salary,
            FROM employee, role, department
            WHERE department.id = role.department_id
            AND role.id = employee.role_id
            ORDER BY employee.id ASC`;
  db.promise().query(sql, (error, response) => {
    if (error) throw error;
    console.table(response);
    prompt();
  });
};


// add

// add a department
const addADepartment = () => {
  inquirer.prompt([{
    name: 'newDepartment',
    type: 'input',
    message: 'Please enter the name of the new department.',
    validate: validate.validateString
  }])
  .then((answer) => {
    let sql = `INSERT INTO department (department_name) VALUES (?)`;
    db.query(sql, answer.newDepartment, (error, response) => {
      if (error) throw error;
      console.log('Department added successfully!');
      viewAllDepartments();
    })
  })
}

// add a role
const addARole = () => {
  const sql = 'SELECT * FROM department';
  db.promise().query(sql, (error, response) => {
    if (error) throw error;
    let departments = [];
    response.forEach((department) => {departments.push(department.department_name);
    });
    departments.push('Create department');
    inquirer.prompt([{
      name: 'departmentName',
      type: 'list',
      message: 'To which department does this role belong?',
      choices: departments
    }])
    .then((answer) => {
      if (answer.departmentName === 'Create department') {
        this.addADepartment();
      } else {
        addRoleDesc(answer);
      }
    });
    const addRoleDesc = (departmentData) => {
      inquirer.prompt([{
        name: 'newRole',
        type: 'input',
        message: 'Please enter the name of the new role.',
        validate: validate.validateString
      }, 
    {
      name: validateSalary,
      type: 'input',
      message: 'Please enter the salary of the new role.',
      validate: validate.validateSalary
    }])
    .then((answer) => {
      let createdRole = answer.newRole;
      let departmentID;
      response.forEach((department) => {
        if (departmentData.departmentName === department.department_name) {departmentID = department.id;}
      });
      let sql = `INSERT INTO role (title, salary, department_id) VALUES (?, ?, ?)`;
      let crit = [createdRole, answer.salary, departmentID];
      db.promise().query(sql, crit, (error) => {
        if (error) throw error;
        console.log('Role added successfully!');
        viewAllRoles();
      });
    });
    };
  });
}

// add an employee
const addAnEmployee = () => {
  inquirer.prompt([{
    type: 'input',
    name: 'firstName',
    message: "Please enter the employee's first name.",
    validate: validate.validateString
  },
{
  type: 'input',
  name: 'lastName',
  message: "Please enter the employee's last name.",
  validate: validate.validateString
}])
.then(answer => {
  const crit = [answer.firstName, answer.lastName];
  const roleSql = `SELECT role.id, role.title FROM role`;
  db.promise().query(roleSql, (error, data) => {
    if (error) throw error;
    const roles = data.map(({id, title}) => ({name: title, value: id}));
    inquirer.prompt([{
      type: 'list',
      name: 'role',
      message: "Please select the employee's role.",
      choices: roles
    }])
    .then(roleChoice => {
      const role = roleChoice.role;
      crit.push(role);
      const managerSql = `SELECT * FROM employee`;
      db.promise().query(managerSql, (error, data) => {
        if (error) throw error;
        const managers = data.map(({id, first_name, last_name}) => ({name: first_name + '' + last_name, value: id}));
        inquirer.prompt ([{
          type: 'list',
          name: 'manager',
          message: "Please enter the employee's manager.",
          choices: managers
        }])
        .then(managerChoice => {
          const manager = managerChoice.manager;
          crit.push(manager);
          const sql = `INSERT INTO employee (first_name, last_name, role_id, manager_id)
                      VALUES (?, ?, ?, ?);`
          db.query(sql, crit (error) => {
            if (error) throw error;
            console.log('Employee added successfully!');
            viewAllEmployees();
          });
        });
      });
    });
  });
});
};

// update

// remove

// default response for any other request (not found)
app.use((req, res) => {
  res.status(404).end();
});

// app listens on designated port
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
