import inquirer from "inquirer";
import {
  getAllDepartments,
  getAllRoles,
  getAllEmployees,
  addDepartment,
  addRole,
  addEmployee,
  updateEmployeeRole,
} from "./queries";
import { connectToDb } from "./connection";

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
        const departments = await getAllDepartments();
        console.table(departments);
        break;

      case "View all roles":
        const roles = await getAllRoles();
        console.table(roles);
        break;

      case "View all employees":
        const employees = await getAllEmployees();
        console.table(employees);
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
            message: "Enter the manager ID for this employee (or press Enter for none):",
            validate: (input) => input === "" || !isNaN(parseInt(input)) ? true : "Enter a valid manager ID or leave empty.",
          },
        ]);
        await addEmployee(
          firstName,
          lastName,
          parseInt(employeeRoleId),
          employeeManagerId ? parseInt(employeeManagerId) : null
        );
        break;

      case "Update an employee role":
        const { employeeId, newRoleId } = await inquirer.prompt([
          {
            type: "input",
            name: "employeeId",
            message: "Enter the employee ID you want to update:",
            validate: (input) => isNaN(parseInt(input)) ? "Enter a valid employee ID." : true,
          },
          {
            type: "input",
            name: "newRoleId",
            message: "Enter the new role ID for this employee:",
            validate: (input) => isNaN(parseInt(input)) ? "Enter a valid role ID." : true,
          },
        ]);
        await updateEmployeeRole(parseInt(employeeId), parseInt(newRoleId));
        break;

      case "Exit":
        console.log("Exiting the Employee Tracker. Goodbye!");
        process.exit(0);
    }
  }
};

// Start the application
mainMenu();
