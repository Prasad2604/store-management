import db from "../../lib/db";

export default async function handler(req, res) {
  const { method } = req;

  switch (method) {
    // Create new employee
    case "POST":
      const { name, role, phone, salary } = req.body;
      try {
        // const { name, role, phone, salary } = req.body;

        // Check if salary is provided
        if (salary === undefined || salary === null) {
          return res.status(400).json({ error: "Salary is required" });
        }
        const query = `INSERT INTO Employee (name, role, phone, salary) VALUES (?, ?, ?, ?)`;
        const values = [name, role, phone, salary];
        db.query(query, values, (err, result) => {
          if (err) throw err;
          res.status(201).json({
            message: "Employee added successfully",
            employeeId: result.insertId,
          });
        });
      } catch (error) {
        res.status(500).json({ error: "Failed to add employee" });
      }
      break;

    // Get all employees
    case "GET":
      try {
        const query = `SELECT * FROM Employee`;
        db.query(query, (err, result) => {
          if (err) throw err;
          res.status(200).json(result);
        });
      } catch (error) {
        res.status(500).json({ error: "Failed to fetch employees" });
      }
      break;

    default:
      res.setHeader("Allow", ["GET", "POST"]);
      res.status(405).end(`Method ${method} Not Allowed`);
  }
}

// src/pages/api/employees.js
// export default async function handler(req, res) {
//   if (req.method === "GET") {
//     // Simulated employee data (replace with actual database call)
//     const employees = [
//       { id: 1, name: "John Doe", role: "Cashier", status: "Active" },
//       { id: 2, name: "Jane Smith", role: "Manager", status: "Active" },
//     ];

//     res.status(200).json(employees);
//   } else {
//     res.setHeader("Allow", ["GET"]);
//     res.status(405).end(`Method ${req.method} Not Allowed`);
//   }
// }
