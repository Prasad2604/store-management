import db from "../../lib/db";

export default async function handler(req, res) {
  const { method } = req;

  switch (method) {
    // Add new product
    case "POST":
      const {
        name,
        category,
        description,
        price,
        quantity_in_stock,
        expiry_date,
      } = req.body;
      try {
        const query = `INSERT INTO Product (name, category, description, price, quantity_in_stock, expiry_date) VALUES (?, ?, ?, ?, ?, ?)`;
        const values = [
          name,
          category,
          description,
          price,
          quantity_in_stock,
          expiry_date,
        ];
        db.query(query, values, (err, result) => {
          if (err) throw err;
          res.status(201).json({
            message: "Product added successfully",
            productId: result.insertId,
          });
        });
      } catch (error) {
        res.status(500).json({ error: "Failed to add product" });
      }
      break;

    // Get all products
    case "GET":
      try {
        const query = `SELECT * FROM Product`;
        db.query(query, (err, result) => {
          if (err) throw err;
          res.status(200).json(result);
        });
      } catch (error) {
        res.status(500).json({ error: "Failed to fetch products" });
      }
      break;

    default:
      res.setHeader("Allow", ["GET", "POST"]);
      res.status(405).end(`Method ${method} Not Allowed`);
  }
}
