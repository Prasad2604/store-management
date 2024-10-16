"use client";

import { useState, useEffect } from "react";
import {
  Bell,
  ChevronDown,
  ShoppingCart,
  UserCircle,
  RotateCcw,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Label } from "@/components/ui/label";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

export default function CashierDashboard() {
  const [activeTab, setActiveTab] = useState("sales");
  const [cart, setCart] = useState([]);
  const [total, setTotal] = useState(0);
  const [products, setProducts] = useState([]);
  const [uniqueCustomers, setUniqueCustomers] = useState([]);
  const [showCustomerModal, setShowCustomerModal] = useState(false);
  const [transactions, setTransactions] = useState([]);
  const [customerDetails, setCustomerDetails] = useState({
    name: "",
    email: "",
    phone: "",
    address: "",
  });
  const [paymentMethod, setPaymentMethod] = useState("cash");

  // Fetch products when Sales tab is active
  useEffect(() => {
    if (activeTab === "sales") {
      fetch("/api/products")
        .then((response) => response.json())
        .then((data) => setProducts(data))
        .catch((error) => console.error("Error fetching products:", error));
    }
    if (activeTab === "customers") {
      fetch("/api/customer")
        .then((response) => response.json())
        .then((data) => setUniqueCustomers(data))
        .catch((error) => console.error("Error fetching customers:", error));
    }
    if (activeTab === "returns") {
      fetch("/api/transactions")
        .then((response) => response.json())
        .then((data) => setTransactions(data))
        .catch((error) => console.error("Error fetching transactions:", error));
    }
  }, [activeTab]);

  // Add product to cart
  const addToCart = (product) => {
    if (product.quantity_in_stock <= 0) {
      alert("Product out of stock");
      return;
    }

    const existingProductIndex = cart.findIndex(
      (item) => item.product_id === product.product_id
    );

    if (existingProductIndex > -1) {
      // If product is already in the cart, increase the quantity
      const updatedCart = [...cart];
      updatedCart[existingProductIndex].quantity += 1;
      updatedCart[existingProductIndex].quantity_in_stock -= 1;
      setCart(updatedCart);
      setTotal((prevTotal) => prevTotal + product.price);
    } else {
      // Add new product to the cart with quantity of 1
      const productWithQuantity = { ...product, quantity: 1 };
      productWithQuantity.quantity_in_stock -= 1;
      setCart((prevCart) => [...prevCart, productWithQuantity]);
      setTotal((prevTotal) => prevTotal + Number(product.price));
    }
  };

  // Update product quantity in cart
  const updateCartQuantity = (index, newQuantity) => {
    const updatedCart = [...cart];
    const product = updatedCart[index];

    if (
      newQuantity > 0 &&
      newQuantity <= product.quantity_in_stock + product.quantity
    ) {
      const quantityDifference = newQuantity - Number(product.quantity);
      updatedCart[index].quantity = newQuantity;
      updatedCart[index].quantity_in_stock -= quantityDifference;

      setCart(updatedCart);
      setTotal(
        (prevTotal) =>
          prevTotal + Number(product.price) * Number(quantityDifference)
      );
    } else {
      alert("Not enough stock available or invalid quantity");
    }
  };

  // Remove product from cart
  const removeFromCart = (index) => {
    setCart((prevCart) => {
      const newCart = [...prevCart];
      const removedItem = newCart.splice(index, 1)[0];
      setTotal(
        (prevTotal) => prevTotal - removedItem.price * removedItem.quantity
      );
      return newCart;
    });
  };

  // Process the transaction
  const processTransaction = async () => {
    if (cart.length === 0) {
      alert("Cart is empty. Please add products before checking out.");
      return;
    }

    try {
      const customerRes = await fetch("/api/customer", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(customerDetails),
      });

      const customerData = await customerRes.json();

      // Create an array for transaction items
      const transactionItems = cart.map((item) => ({
        product_id: item.product_id,
        quantity: item.quantity,
        total_cost: item.price * item.quantity,
      }));

      const transactionRes = await fetch("/api/transactions", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          customer_id: customerData.customer_id,
          items: transactionItems,
          payment_method: paymentMethod,
        }),
      });

      if (transactionRes.ok) {
        // Update product stock
        await updateProductStock(transactionItems);

        alert("Transaction processed successfully!");
        setCart([]);
        setTotal(0);
        setShowCustomerModal(false);
      } else {
        const errorData = await transactionRes.json();
        alert("Failed to process transaction: " + errorData.message);
      }
    } catch (error) {
      console.error("Error processing transaction:", error);
    }
  };

  // Function to update product stock
  const updateProductStock = async (transactionItems) => {
    try {
      await Promise.all(
        transactionItems.map((item) =>
          fetch(`/api/products/${item.product_id}/stock`, {
            method: "PATCH",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              stock: -item.quantity,
            }), // Reduce stock by quantity sold
          })
        )
      );
    } catch (error) {
      console.error("Error updating product stock:", error);
    }
  };

  return (
    <div className="flex h-screen bg-gray-100">
      {/* Sidebar */}
      <aside className="w-64 bg-white shadow-md">
        <div className="p-4">
          <h1 className="text-2xl font-bold">Cashier Dashboard</h1>
        </div>
        <nav className="mt-4">
          <a
            className={`flex items-center px-4 py-2 text-gray-700 ${
              activeTab === "sales" ? "bg-gray-200" : ""
            }`}
            href="#"
            onClick={() => setActiveTab("sales")}
          >
            <ShoppingCart className="mr-2 h-4 w-4" />
            Sales
          </a>
          <a
            className={`flex items-center px-4 py-2 text-gray-700 ${
              activeTab === "customers" ? "bg-gray-200" : ""
            }`}
            href="#"
            onClick={() => setActiveTab("customers")}
          >
            <UserCircle className="mr-2 h-4 w-4" />
            Customers
          </a>
          <a
            className={`flex items-center px-4 py-2 text-gray-700 ${
              activeTab === "returns" ? "bg-gray-200" : ""
            }`}
            href="#"
            onClick={() => setActiveTab("returns")}
          >
            <RotateCcw className="mr-2 h-4 w-4" />
            Returns
          </a>
        </nav>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-8 overflow-auto">
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList>
            <TabsTrigger value="sales">Sales</TabsTrigger>
            <TabsTrigger value="customers">Customers</TabsTrigger>
            <TabsTrigger value="returns">Returns</TabsTrigger>
          </TabsList>

          {/* Sales Tab */}
          <TabsContent value="sales">
            <Card>
              <CardHeader>
                <CardTitle>Sales Management</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <h3 className="text-lg font-semibold mb-2">Product List</h3>
                    <ScrollArea className="h-[400px] w-full rounded-md border p-4">
                      <Table>
                        <TableHeader>
                          <TableRow>
                            <TableHead>Name</TableHead>
                            <TableHead>Price</TableHead>
                            <TableHead>Stock</TableHead>
                            <TableHead>Action</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {products.map((product, index) => (
                            <TableRow key={product.product_id}>
                              <TableCell>{product.name}</TableCell>
                              <TableCell>${product.price}</TableCell>
                              <TableCell>{product.quantity_in_stock}</TableCell>
                              <TableCell>
                                <Button onClick={() => addToCart(product)}>
                                  Add to Cart
                                </Button>
                              </TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    </ScrollArea>
                  </div>

                  <div>
                    <h3 className="text-lg font-semibold mb-2">Current Cart</h3>
                    <ScrollArea className="h-[400px] w-full rounded-md border p-4">
                      <Table>
                        <TableHeader>
                          <TableRow>
                            <TableHead>Name</TableHead>
                            <TableHead>Price</TableHead>
                            <TableHead>Quantity</TableHead>
                            <TableHead>Action</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {cart.map((item, index) => (
                            <TableRow key={index}>
                              <TableCell>{item.name}</TableCell>
                              <TableCell>${item.price}</TableCell>
                              <TableCell>
                                <Button
                                  onClick={() =>
                                    updateCartQuantity(index, item.quantity + 1)
                                  }
                                >
                                  +
                                </Button>
                                <span>{item.quantity}</span>
                                <Button
                                  onClick={() =>
                                    updateCartQuantity(index, item.quantity - 1)
                                  }
                                >
                                  -
                                </Button>
                              </TableCell>
                              <TableCell>
                                <Button onClick={() => removeFromCart(index)}>
                                  Remove
                                </Button>
                              </TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    </ScrollArea>
                    <h4 className="mt-4 text-lg font-semibold">
                      Total: ${Number(total).toFixed(2)}
                    </h4>
                    <Button onClick={() => setShowCustomerModal(true)}>
                      Checkout
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Customers Tab */}
          <TabsContent value="customers">
            <Card>
              <CardHeader>
                <CardTitle>Unique Customers</CardTitle>
              </CardHeader>
              <CardContent>
                <ScrollArea className="h-[400px] w-full rounded-md border p-4">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Name</TableHead>
                        <TableHead>Email</TableHead>
                        <TableHead>Phone</TableHead>
                        <TableHead>Address</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {uniqueCustomers.map((customer, index) => (
                        <TableRow key={index}>
                          <TableCell>{customer.name}</TableCell>
                          <TableCell>{customer.email}</TableCell>
                          <TableCell>{customer.phone}</TableCell>
                          <TableCell>{customer.address}</TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </ScrollArea>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Return Tab  */}
          <TabsContent value="returns">
            <Card>
              <CardHeader>
                <CardTitle>Transaction History</CardTitle>
              </CardHeader>
              <CardContent>
                <ScrollArea className="h-[400px] w-full rounded-md border p-4">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Transaction ID</TableHead>
                        <TableHead>Customer ID</TableHead>
                        <TableHead>Payment Method</TableHead>
                        <TableHead>Date</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {transactions.map((transaction, index) => (
                        <TableRow key={index}>
                          <TableCell>{transaction.transaction_id}</TableCell>
                          <TableCell>{transaction.customer_id}</TableCell>
                          <TableCell>{transaction.payment_method}</TableCell>
                          <TableCell>
                            {new Date(
                              transaction.transaction_date
                            ).toLocaleString()}
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </ScrollArea>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </main>

      {/* Customer Modal */}
      <Dialog open={showCustomerModal} onOpenChange={setShowCustomerModal}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Customer Details</DialogTitle>
            <DialogDescription>
              Please enter the customer information for this transaction.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="name" className="text-right">
                Name
              </Label>
              <Input
                id="name"
                className="col-span-3"
                value={customerDetails.name}
                onChange={(e) =>
                  setCustomerDetails((prev) => ({
                    ...prev,
                    name: e.target.value,
                  }))
                }
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="email" className="text-right">
                Email
              </Label>
              <Input
                id="email"
                className="col-span-3"
                value={customerDetails.email}
                onChange={(e) =>
                  setCustomerDetails((prev) => ({
                    ...prev,
                    email: e.target.value,
                  }))
                }
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="phone" className="text-right">
                Phone
              </Label>
              <Input
                id="phone"
                className="col-span-3"
                value={customerDetails.phone}
                onChange={(e) =>
                  setCustomerDetails((prev) => ({
                    ...prev,
                    phone: e.target.value,
                  }))
                }
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="address" className="text-right">
                Address
              </Label>
              <Input
                id="address"
                className="col-span-3"
                value={customerDetails.address}
                onChange={(e) =>
                  setCustomerDetails((prev) => ({
                    ...prev,
                    address: e.target.value,
                  }))
                }
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="paymentMethod" className="text-right">
                Payment Method
              </Label>
              <select
                id="paymentMethod"
                className="col-span-3"
                value={paymentMethod}
                onChange={(e) => setPaymentMethod(e.target.value)}
              >
                <option value="cash">Cash</option>
                <option value="credit_card">Credit Card</option>
                <option value="upi">UPI</option>
              </select>
            </div>
          </div>
          <DialogFooter>
            <Button onClick={processTransaction}>Submit</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
