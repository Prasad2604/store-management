const db = require("../db");

// Create the Product table without supplier related info
const createProductTable = `
CREATE TABLE IF NOT EXISTS Product (
    product_id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    category VARCHAR(100),
    description TEXT,
    price DECIMAL(10, 2) NOT NULL,
    quantity_in_stock INT NOT NULL,
    expiry_date DATE
);`;

db.query(createProductTable, (err, result) => {
  if (err) throw err;
  console.log("Product table created");
});
