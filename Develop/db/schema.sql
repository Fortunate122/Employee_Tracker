DROP DATABASE IF EXISTS tracker_db;
CREATE DATABASE tracker_db;

\c tracker_db;

CREATE TABLE department (
  id SERIAL PRIMARY KEY,
  name VARCHAR(50) UNIQUE NOT NULL
);

CREATE TABLE role (
  id SERIAL PRIMARY KEY,
  title VARCHAR(50) UNIQUE NOT NULL,
  salary DECIMAL(10,2) NOT NULL,
  department_id INT NOT NULL REFERENCES department(id) ON DELETE CASCADE
);

CREATE TABLE employee (
  id SERIAL PRIMARY KEY,
  first_name VARCHAR(50) NOT NULL,
  last_name VARCHAR(50) NOT NULL,
  role_id INT NOT NULL REFERENCES role(id) ON DELETE CASCADE,
  manager_id INT REFERENCES employee(id) ON DELETE SET NULL
);

