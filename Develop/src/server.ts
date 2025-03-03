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

const getEmployeesByManager = async (manager_id: number) => {
  try {
    const result = await pool.query(
      "SELECT id, first_name, last_name, role_id FROM employee WHERE manager_id = $1 ORDER BY id ASC",
      [manager_id]
    );
    return result.rows;
  } catch (err) {
    console.error("❌ Error fetching employees by manager:", err);
  }
};

const getEmployeesByDepartment = async (department_id: number) => {
  try {
    const result = await pool.query(
      `SELECT employee.id, employee.first_name, employee.last_name, role.title 
       FROM employee 
       JOIN role ON employee.role_id = role.id
       WHERE role.department_id = $1
       ORDER BY employee.id ASC`,
       [department_id]
    );
    return result.rows;
  } catch (err) {
    console.error("❌ Error fetching employees by department:", err);
  }
};

const getDepartmentBudget = async (department_id: number) => {
  try {
    const result = await pool.query(
      `SELECT department.name, SUM(role.salary) 
       FROM employee 
       JOIN role ON employee.role_id = role.id
       JOIN department ON role.department_id = department.id
       WHERE department.id = $1
       GROUP BY department.name`,
      [department_id]
    );
    return result.rows[0];
  } catch (err) {
    console.error("❌ Error calculating department budget:", err);
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

const updateEmployeeManager = async (employee_id: number, manager_id: number | null) => {
  try {
    await pool.query("UPDATE employee SET manager_id = $1 WHERE id = $2", [manager_id, employee_id]);
    console.log(`✅ Employee ID ${employee_id} manager updated successfully.`);
  } catch (err) {
    console.error("❌ Error updating employee manager:", err);
  }
};

const deleteDepartment = async (department_id: number) => {
  try {
    await pool.query("DELETE FROM department WHERE id = $1", [department_id]);
    console.log(`✅ Department ID ${department_id} deleted successfully.`);
  } catch (err) {
    console.error("❌ Error deleting department:", err);
  }
};

const deleteRole = async (role_id: number) => {
  try {
    await pool.query("DELETE FROM role WHERE id = $1", [role_id]);
    console.log(`✅ Role ID ${role_id} deleted successfully.`);
  } catch (err) {
    console.error("❌ Error deleting role:", err);
  }
};

const deleteEmployee = async (employee_id: number) => {
  try {
    await pool.query("DELETE FROM employee WHERE id = $1", [employee_id]);
    console.log(`✅ Employee ID ${employee_id} deleted successfully.`);
  } catch (err) {
    console.error("❌ Error deleting employee:", err);
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
    "View employees by manager",
    "View employees by department",
    "View department budget",
    "Add a department",
    "Add a role",
    "Add an employee",
    "Update an employee role",
    "Update an employee manager",
    "Delete a department",
    "Delete a role",
    "Delete an employee",
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

      case "View employees by manager":
        const { manager_id } = await inquirer.prompt([
          { type: "input", name: "manager_id", message: "Enter the manager's ID;" },
        ]);
        console.table(await getEmployeesByManager(parseInt(manager_id)));
        break;

      case "View employees by department":
        const { department_id } = await inquirer.prompt([
          { type: "input", name: "department_id", message: "Enter the department ID:"},
        ]);
        console.table(await getEmployeesByDepartment(parseInt(department_id)));
        break;

      // case "View department budget":
      //   const { department_id: budgetDepartmentId  } = await inquirer.prompt([
      //     { type: "input", name: "departmentId", message: "Enter the department ID to view budget:" },
      //   ]);
      //   console.table(await getDepartmentBudget(parseInt(budgetDepartmentId)));
      //   break;

      case "View department budget":
        const { budgetDepartmentId } = await inquirer.prompt([
          { 
            type: "input", 
            name: "budgetDepartmentId", 
            message: "Enter the department ID to view budget:", 
            validate: (input) => !isNaN(parseInt(input)) && parseInt(input) > 0 ? true : "Please enter a valid department ID."
          },
        ]);
      
        const parsedBudgetDepartmentId = parseInt(budgetDepartmentId.trim());
      
        console.log(`🔍 Debug: Entered department ID: ${parsedBudgetDepartmentId}`); // Debugging line
      
        if (isNaN(parsedBudgetDepartmentId) || parsedBudgetDepartmentId <= 0) {
          console.log("⚠️ Invalid department ID. Please enter a valid number.");
          break;
        }
      
        const budgetData = await getDepartmentBudget(parsedBudgetDepartmentId);
      
        console.log(`🔍 Debug: Retrieved budget data:`, budgetData); // Debugging line
      
        if (budgetData) {
          console.table(budgetData);
        } else {
          console.log("⚠️ No budget data found for the given department ID.");
        }
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
          const { employeeId: updateEmployeeId, newRoleId } = await inquirer.prompt([
            { type: "input", name: "employeeId", message: "Enter the employee ID:", validate: (input) => !isNaN(parseInt(input)) },
            { type: "input", name: "newRoleId", message: "Enter the new role ID:", validate: (input) => !isNaN(parseInt(input)) },
          ]);
          await updateEmployeeRole(parseInt(updateEmployeeId), parseInt(newRoleId));
          break;
  
        case "Update an employee manager":
          const { employeeId: updateManagerEmployeeId, managerId } = await inquirer.prompt([
            { type: "input", name: "employeeId", message: "Enter the employee ID:" },
            { type: "input", name: "managerId", message: "Enter the new manager ID (or press Enter for none):" },
          ]);
          const parsedManagerId = managerId.trim() === "" ? null : parseInt(managerId);
          await updateEmployeeManager(parseInt(updateManagerEmployeeId), parsedManagerId);
          break;
  
        case "Delete a department":
          const { departmentId } = await inquirer.prompt([
            { type: "input", name: "departmentId", message: "Enter the department ID to delete:" },
          ]);
          await deleteDepartment(parseInt(departmentId));
           break;
          
        case "Delete a role":
          const { roleId } = await inquirer.prompt([
            { type: "input", name: "roleId", message: "Enter the role ID to delete:" },
          ]);
          await deleteRole(parseInt(roleId));
           break;
          
        case "Delete an employee":
          const { employeeId: deleteEmployeeId } = await inquirer.prompt([
            { type: "input", name: "employeeId", message: "Enter the employee ID to delete:" },
          ]);
          await deleteEmployee(parseInt(deleteEmployeeId));
          break;
  
        case "Exit":
          console.log("Exiting the Employee Tracker. Goodbye!");
          process.exit(0);
    }
  }
};
