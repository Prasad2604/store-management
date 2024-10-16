const db = require("../db");

// Create the Employee table
const createEmployeeTable = `
CREATE TABLE IF NOT EXISTS Employee (
    employee_id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    role VARCHAR(100),
    phone VARCHAR(20),
    date_of_joining DATETIME DEFAULT CURRENT_TIMESTAMP,
    salary DECIMAL(10, 2) NOT NULL
);`;

db.query(createEmployeeTable, (err, result) => {
  if (err) throw err;
  console.log("Employee table created");
});
