TRUNCATE employee, role, department RESTART IDENTITY CASCADE;

-- Insert Departments
INSERT INTO department (name) VALUES 
('Engineering'),
('Human Resources'),
('Marketing'),
('Finance'),
('Sales');

-- Insert Roles
INSERT INTO role (title, salary, department_id) VALUES 
('Software Engineer', 80000.00, 1),
('HR Manager', 70000.00, 2),
('Marketing Lead', 75000.00, 3),
('Financial Analyst', 72000.00, 4),
('Sales Representative', 68000.00, 5);

-- Insert Employees
INSERT INTO employee (first_name, last_name, role_id, manager_id) VALUES 
('Alice', 'Johnson', 1, NULL),  -- CEO (no manager)
('Bob', 'Smith', 2, 1),         -- HR Manager reports to Alice
('Charlie', 'Brown', 3, 1),     -- Marketing Lead reports to Alice
('Dana', 'White', 4, 2),        -- Financial Analyst reports to Bob
('Eve', 'Davis', 5, 3);         -- Sales Rep reports to Charlie
