import db from "../../lib/db"; // Import the MySQL connection pool

export default async function handler(req, res) {
  const { method } = req;

  switch (method) {
    // Add new transaction
    case "POST":
      const { customer_id, items, payment_method } = req.body; // items is now an array

      // Check if items are provided
      if (!items || items.length === 0) {
        return res
          .status(400)
          .json({ error: "No items provided for transaction" });
      }

      try {
        // Prepare the insert query and values
        const queries = items.map((item) => {
          const query = `INSERT INTO Transaction (customer_id, product_id, quantity, total_cost, payment_method) VALUES (?, ?, ?, ?, ?)`;
          const values = [
            customer_id,
            item.product_id,
            item.quantity,
            item.total_cost,
            payment_method,
          ];
          return { query, values };
        });

        // Use a promise to execute all queries in parallel
        const results = await Promise.all(
          queries.map((q) => db.promise().query(q.query, q.values))
        );

        // Extract the transaction IDs from results
        const transactionIds = results.map((result) => result[0].insertId);

        res.status(201).json({
          message: "Transactions added successfully",
          transactionIds: transactionIds, // Return all transaction IDs
        });
      } catch (error) {
        console.error("Error adding transactions:", error);
        res.status(500).json({ error: "Failed to add transactions" });
      }
      break;

    // Get all transactions
    case "GET":
      try {
        const query = `SELECT * FROM Transaction`;
        const [result] = await db.promise().query(query); // Adjusted for promise result structure
        res.status(200).json(result);
      } catch (error) {
        console.error("Error fetching transactions:", error);
        res.status(500).json({ error: "Failed to fetch transactions" });
      }
      break;

    default:
      res.setHeader("Allow", ["GET", "POST"]);
      res.status(405).end(`Method ${method} Not Allowed`);
  }
}
