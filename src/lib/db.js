const mysql = require("mysql2");

// Create a connection to the MySQL database
const db = mysql.createConnection({
  host: "localhost", // Your MySQL server's host
  user: "root", // Your MySQL username
  password: "Prasad@1234567890", // Your MySQL password
  database: "store_management", // Database name
  port: 3306, // Default MySQL port
});

// Connect to the database
db.connect((err) => {
  if (err) {
    console.error("Error connecting to MySQL:", err.message);
  } else {
    console.log("Connected to MySQL Database");
  }
});

module.exports = db;
