import db from "../../lib/db";

export default async function handler(req, res) {
  const { method } = req;

  switch (method) {
    // Log inventory update
    case "POST":
      const { product_id, quantity_added, updated_by_employee_id } = req.body;
      try {
        const query = `INSERT INTO InventoryLog (product_id, quantity_added, updated_by_employee_id) VALUES (?, ?, ?)`;
        const values = [product_id, quantity_added, updated_by_employee_id];
        db.query(query, values, (err, result) => {
          if (err) throw err;
          res.status(201).json({
            message: "Inventory log added successfully",
            logId: result.insertId,
          });
        });
      } catch (error) {
        res.status(500).json({ error: "Failed to add inventory log" });
      }
      break;

    // Get all inventory logs
    case "GET":
      try {
        const query = `SELECT * FROM InventoryLog`;
        db.query(query, (err, result) => {
          if (err) throw err;
          res.status(200).json(result);
        });
      } catch (error) {
        res.status(500).json({ error: "Failed to fetch inventory logs" });
      }
      break;

    default:
      res.setHeader("Allow", ["GET", "POST"]);
      res.status(405).end(`Method ${method} Not Allowed`);
  }
}
