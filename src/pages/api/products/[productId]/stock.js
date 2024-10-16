import Product from "../../../../models/product"; // Adjust the path as necessary

export default async function handler(req, res) {
  const {
    method,
    query: { productId },
    body,
  } = req;

  if (method === "PATCH") {
    try {
      const { stock } = body; // Expecting a { stock: newStockValue } in the request body
      const result = await Product.updateStock(productId, stock);
      return res.status(200).json(result);
    } catch (error) {
      console.error("Error updating product:", error);
      return res.status(500).json({ error: "Failed to update stock" });
    }
  } else {
    return res
      .setHeader("Allow", ["PATCH"])
      .status(405)
      .end(`Method ${method} Not Allowed`);
  }
}
