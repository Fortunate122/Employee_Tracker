import { pool } from "./connection";

// Get all departments
export const getAllDepartments = async () => {
  try {
    const result = await pool.query("SELECT * FROM department ORDER BY id ASC");
    return result.rows;
  } catch (err) {
    console.error("❌ Error fetching departments:", err);
  }
};

// Get all roles with department names
export const getAllRoles = async () => {
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

// Get all employees with role and manager info
export const getAllEmployees = async () => {
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

// Add a new department
export const addDepartment = async (name: string) => {
  try {
    await pool.query("INSERT INTO department (name) VALUES ($1)", [name]);
    console.log(`✅ Department '${name}' added successfully.`);
  } catch (err) {
    console.error("❌ Error adding department:", err);
  }
};

// Add a new role
export const addRole = async (title: string, salary: number, department_id: number) => {
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

// Add a new employee
export const addEmployee = async (first_name: string, last_name: string, role_id: number, manager_id: number | null) => {
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

// Update an employee's role
export const updateEmployeeRole = async (employee_id: number, new_role_id: number) => {
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
