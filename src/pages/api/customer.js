// pages/api/customers.js
const db = require("../../lib/db");

export default function handler(req, res) {
  if (req.method === "POST") {
    const { name, email, phone, address } = req.body;
    const query = `INSERT INTO Customer (name, email, phone, address) VALUES (?, ?, ?, ?)`;

    db.query(query, [name, email, phone, address], (err, result) => {
      if (err) {
        res.status(500).json({ error: "Failed to add customer" });
      } else {
        res
          .status(200)
          .json({ message: "Customer added", customer_id: result.insertId });
      }
    });
  } else if (req.method === "GET") {
    // Fetch unique customers by distinct email
    const query = `SELECT DISTINCT name, email, phone, address FROM Customer`;

    db.query(query, (err, results) => {
      if (err) {
        res.status(500).json({ error: "Failed to retrieve customers" });
      } else {
        res.status(200).json(results);
      }
    });
  } else {
    res.status(405).json({ message: "Method not allowed" });
  }
}
