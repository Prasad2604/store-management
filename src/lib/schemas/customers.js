const db = require("../db");

// Create the Customer table
const createCustomerTable = `
CREATE TABLE IF NOT EXISTS Customer (
    customer_id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255),
    phone VARCHAR(20),
    address TEXT,
    date_of_registration TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);`;

db.query(createCustomerTable, (err, result) => {
  if (err) throw err;
  console.log("Customer table created");
});
