const db = require("../lib/db"); // Adjust the path if necessary

const Product = {
  updateStock: async (productId, stock) => {
    const query =
      "UPDATE product SET quantity_in_stock = quantity_in_stock+? WHERE product_id = ?";
    return new Promise((resolve, reject) => {
      db.query(query, [stock, productId], (error, results) => {
        if (error) {
          reject(error);
        }
        resolve(results);
      });
    });
  },
};

module.exports = Product;
