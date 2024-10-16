const db = require("../db");

// Create the Inventory Logs table
const createInventoryLogTable = `
CREATE TABLE IF NOT EXISTS InventoryLog (
    log_id INT AUTO_INCREMENT PRIMARY KEY,
    product_id INT,
    quantity_added INT,
    update_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_by_employee_id INT,
    FOREIGN KEY (product_id) REFERENCES Product(product_id),
    FOREIGN KEY (updated_by_employee_id) REFERENCES Employee(employee_id)
);`;

db.query(createInventoryLogTable, (err, result) => {
  if (err) throw err;
  console.log("Inventory Log table created");
});
