import inquirer from "inquirer";
import { QueryResult } from "pg";
import { pool, connectToDb } from "./connection";

const startServer = async () => {
  await connectToDb();
  mainMenu();
};

startServer();

const PORT = process.env.PORT || 3001;

// const pool = new Pool({
//   // Your database connection configuration
// });

// Database Queries
const getAllDepartments = async () => {
  try {
    const result = await pool.query("SELECT * FROM department ORDER BY id ASC");
    return result.rows;
  } catch (err) {
    console.error("❌ Error fetching departments:", err);
  }
};

const getAllRoles = async () => {
  try {
    const result = await pool.query(`
      SELECT role.id, role.title, role.salary, department.name AS department
      FROM role
      JOIN department ON role.department_id = department.id
      ORDER BY role.id ASC
    `);
    return result.rows;
  } catch (err) {
    console.error("❌ Error fetching roles:", err);
  }
};

const getAllEmployees = async () => {
  try {
    const result = await pool.query(`
      SELECT 
        e1.id, 
        e1.first_name, 
        e1.last_name, 
        role.title AS job_title, 
        department.name AS department, 
        role.salary, 
        CONCAT(e2.first_name, ' ', e2.last_name) AS manager
      FROM employee e1
      JOIN role ON e1.role_id = role.id
      JOIN department ON role.department_id = department.id
      LEFT JOIN employee e2 ON e1.manager_id = e2.id
      ORDER BY e1.id ASC
    `);
    return result.rows;
  } catch (err) {
    console.error("❌ Error fetching employees:", err);
  }
};

const addDepartment = async (name: string) => {
  try {
    await pool.query("INSERT INTO department (name) VALUES ($1)", [name]);
    console.log(`✅ Department '${name}' added successfully.`);
  } catch (err) {
    console.error("❌ Error adding department:", err);
  }
};

const addRole = async (title: string, salary: number, department_id: number) => {
  try {
    await pool.query(
      "INSERT INTO role (title, salary, department_id) VALUES ($1, $2, $3)",
      [title, salary, department_id]
    );
    console.log(`✅ Role '${title}' added successfully.`);
  } catch (err) {
    console.error("❌ Error adding role:", err);
  }
};

const addEmployee = async (first_name: string, last_name: string, role_id: number, manager_id: number | null) => {
  try {
    await pool.query(
      "INSERT INTO employee (first_name, last_name, role_id, manager_id) VALUES ($1, $2, $3, $4)",
      [first_name, last_name, role_id, manager_id]
    );
    console.log(`✅ Employee '${first_name} ${last_name}' added successfully.`);
  } catch (err) {
    console.error("❌ Error adding employee:", err);
  }
};

const updateEmployeeRole = async (employee_id: number, new_role_id: number) => {
  try {
    await pool.query(
      "UPDATE employee SET role_id = $1 WHERE id = $2",
      [new_role_id, employee_id]
    );
    console.log(`✅ Employee ID ${employee_id} role updated successfully.`);
  } catch (err) {
    console.error("❌ Error updating employee role:", err);
  }
};

// Start the database connection
connectToDb();

// Main CLI menu
const mainMenu = async () => {
  const choices = [
    "View all departments",
    "View all roles",
    "View all employees",
    "Add a department",
    "Add a role",
    "Add an employee",
    "Update an employee role",
    "Exit",
  ];

  while (true) {
    const { action } = await inquirer.prompt([
      {
        type: "list",
        name: "action",
        message: "What would you like to do?",
        choices,
      },
    ]);

    switch (action) {
      case "View all departments":
        console.table(await getAllDepartments());
        break;

      case "View all roles":
        console.table(await getAllRoles());
        break;

      case "View all employees":
        console.table(await getAllEmployees());
        break;

      case "Add a department":
        const { deptName } = await inquirer.prompt([
          {
            type: "input",
            name: "deptName",
            message: "Enter the name of the new department:",
            validate: (input) => input ? true : "Department name cannot be empty.",
          },
        ]);
        await addDepartment(deptName);
        break;

      case "Add a role":
        const { roleName, roleSalary, roleDeptId } = await inquirer.prompt([
          {
            type: "input",
            name: "roleName",
            message: "Enter the name of the new role:",
            validate: (input) => input ? true : "Role name cannot be empty.",
          },
          {
            type: "input",
            name: "roleSalary",
            message: "Enter the salary for this role:",
            validate: (input) => isNaN(parseFloat(input)) ? "Enter a valid salary." : true,
          },
          {
            type: "input",
            name: "roleDeptId",
            message: "Enter the department ID for this role:",
            validate: (input) => isNaN(parseInt(input)) ? "Enter a valid department ID." : true,
          },
        ]);
        await addRole(roleName, parseFloat(roleSalary), parseInt(roleDeptId));
        break;

      case "Add an employee":
        const { firstName, lastName, employeeRoleId, employeeManagerId } = await inquirer.prompt([
          {
            type: "input",
            name: "firstName",
            message: "Enter the employee's first name:",
            validate: (input) => input ? true : "First name cannot be empty.",
          },
          {
            type: "input",
            name: "lastName",
            message: "Enter the employee's last name:",
            validate: (input) => input ? true : "Last name cannot be empty.",
          },
          {
            type: "input",
            name: "employeeRoleId",
            message: "Enter the role ID for this employee:",
            validate: (input) => isNaN(parseInt(input)) ? "Enter a valid role ID." : true,
          },
          {
            type: "input",
            name: "employeeManagerId",
            message: "Enter the manager ID (or press Enter for none):",
          },
        ]);
        await addEmployee(firstName, lastName, parseInt(employeeRoleId), employeeManagerId ? parseInt(employeeManagerId) : null);
        break;

      case "Update an employee role":
        const { employeeId, newRoleId } = await inquirer.prompt([
          { type: "input", name: "employeeId", message: "Enter the employee ID:", validate: (input) => !isNaN(parseInt(input)) },
          { type: "input", name: "newRoleId", message: "Enter the new role ID:", validate: (input) => !isNaN(parseInt(input)) },
        ]);
        await updateEmployeeRole(parseInt(employeeId), parseInt(newRoleId));
        break;

      case "Exit":
        console.log("Exiting the Employee Tracker. Goodbye!");
        process.exit(0);
    }
  }
};
