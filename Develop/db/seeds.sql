-- Insert departments
INSERT INTO department (name) VALUES 
('Engineering'),
('Human Resources'),
('Finance');

-- Insert roles
INSERT INTO role (title, salary, department_id) VALUES 
('Software Engineer', 90000, 1),
('HR Manager', 70000, 2),
('Accountant', 80000, 3),
('Senior Engineer', 120000, 1),
('Junior Engineer', 70000, 1);

-- Insert employees (some with managers)
INSERT INTO employee (first_name, last_name, role_id, manager_id) VALUES 
-- Managers (they have no manager themselves, so manager_id is NULL)
('Alice', 'Johnson', 4, NULL),  -- Senior Engineer, Manager
('Bob', 'Smith', 2, NULL),  -- HR Manager, Manager
('Eve', 'Anderson', 3, NULL),  -- Accountant, Manager

-- Employees reporting to managers
('Charlie', 'Brown', 1, 1),  -- Software Engineer, reports to Alice
('Dana', 'White', 5, 1),  -- Junior Engineer, reports to Alice
('Frank', 'Miller', 1, 1),  -- Software Engineer, reports to Alice
('Grace', 'Lee', 3, 3),  -- Accountant, reports to Eve
('Hank', 'Davis', 5, 1); -- Junior Engineer, reports to Alice
