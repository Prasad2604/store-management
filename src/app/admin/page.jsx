"use client";

import { useState, useEffect } from "react";
import {
  Bell,
  ChevronDown,
  DollarSign,
  Package,
  ShoppingCart,
  Users,
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

// API Endpoints
const EMPLOYEES_API = "/api/employees";
const PRODUCTS_API = "/api/products";
const INVENTORY_API = "/api/inventoryLogs";

export default function Admin() {
  const [activeTab, setActiveTab] = useState("overview");
  const [employees, setEmployees] = useState([]);
  const [products, setProducts] = useState([]);
  const [inventory, setInventory] = useState([]);
  const [showEmployeeModal, setShowEmployeeModal] = useState(false); // Employee modal state
  const [showProductModal, setShowProductModal] = useState(false);
  const [newEmployee, setNewEmployee] = useState({
    name: "",
    role: "",
    phone: "",
    salary: "",
  });

  const [newProduct, setNewProduct] = useState({
    name: "",
    category: "",
    description: "",
    price: "",
    quantity_in_stock: "",
    expiry_date: "",
  });

  const handleAddProduct = () => {
    fetch(PRODUCTS_API, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(newProduct),
    })
      .then((res) => res.json())
      .then((data) => {
        setProducts([...products, data]);
        setShowProductModal(false); // Close the modal
        setNewProduct({
          name: "",
          category: "",
          description: "",
          price: "",
          quantity_in_stock: "",
          expiry_date: "",
        }); // Reset form
      })
      .catch((error) => console.error("Error adding product:", error));
  };

  // Fetch Employees Data
  useEffect(() => {
    if (activeTab === "employees") {
      fetch(EMPLOYEES_API)
        .then((res) => res.json())
        .then((data) => setEmployees(data))
        .catch((error) => console.error("Error fetching employees:", error));
    }
  }, [activeTab]);

  // Fetch Products Data
  useEffect(() => {
    if (activeTab === "products") {
      fetch(PRODUCTS_API)
        .then((res) => res.json())
        .then((data) => setProducts(data))
        .catch((error) => console.error("Error fetching products:", error));
    }
  }, [activeTab]);

  // Fetch Inventory Data
  useEffect(() => {
    if (activeTab === "inventory") {
      fetch(INVENTORY_API)
        .then((res) => res.json())
        .then((data) => setInventory(data))
        .catch((error) => console.error("Error fetching inventory:", error));
    }
  }, [activeTab]);

  // Handle Add New Employee Submission
  const handleAddEmployee = () => {
    fetch(EMPLOYEES_API, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(newEmployee),
    })
      .then((res) => res.json())
      .then((data) => {
        setEmployees([...employees, data]); // Add the new employee to the list
        setShowEmployeeModal(false); // Close the modal
        setNewEmployee({ name: "", role: "", status: "" }); // Reset form
      })
      .catch((error) => console.error("Error adding employee:", error));
  };

  return (
    <div className="flex h-screen bg-gray-100">
      {/* Sidebar */}
      <aside className="w-64 bg-white shadow-md">
        <div className="p-4">
          <h1 className="text-2xl font-bold">Store Admin</h1>
        </div>
        <nav className="mt-4">
          <a
            className={`flex items-center px-4 py-2 text-gray-700 ${
              activeTab === "overview" ? "bg-gray-200" : ""
            }`}
            href="#"
            onClick={() => setActiveTab("overview")}
          >
            <DollarSign className="mr-2 h-4 w-4" />
            Overview
          </a>
          <a
            className={`flex items-center px-4 py-2 text-gray-700 ${
              activeTab === "employees" ? "bg-gray-200" : ""
            }`}
            href="#"
            onClick={() => setActiveTab("employees")}
          >
            <Users className="mr-2 h-4 w-4" />
            Employees
          </a>
          <a
            className={`flex items-center px-4 py-2 text-gray-700 ${
              activeTab === "products" ? "bg-gray-200" : ""
            }`}
            href="#"
            onClick={() => setActiveTab("products")}
          >
            <Package className="mr-2 h-4 w-4" />
            Products
          </a>
          <a
            className={`flex items-center px-4 py-2 text-gray-700 ${
              activeTab === "inventory" ? "bg-gray-200" : ""
            }`}
            href="#"
            onClick={() => setActiveTab("inventory")}
          >
            <ShoppingCart className="mr-2 h-4 w-4" />
            Inventory
          </a>
        </nav>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-8">
        <div className="flex justify-between items-center mb-8">
          <h2 className="text-3xl font-bold">Dashboard</h2>
          <div className="flex items-center">
            <Button variant="outline" size="icon" className="mr-2">
              <Bell className="h-4 w-4" />
            </Button>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline">
                  Admin User <ChevronDown className="ml-2 h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent>
                <DropdownMenuLabel>My Account</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem>Profile</DropdownMenuItem>
                <DropdownMenuItem>Settings</DropdownMenuItem>
                <DropdownMenuItem>Logout</DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList>
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="employees">Employees</TabsTrigger>
            <TabsTrigger value="products">Products</TabsTrigger>
            <TabsTrigger value="inventory">Inventory</TabsTrigger>
          </TabsList>

          <TabsContent value="overview">
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">
                    Total Revenue
                  </CardTitle>
                  <DollarSign className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">$45,231.89</div>
                  <p className="text-xs text-muted-foreground">
                    +20.1% from last month
                  </p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Sales</CardTitle>
                  <ShoppingCart className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">+2350</div>
                  <p className="text-xs text-muted-foreground">
                    +180.1% from last month
                  </p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">
                    Active Products
                  </CardTitle>
                  <Package className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">+{products.length}</div>
                  <p className="text-xs text-muted-foreground">
                    +19% from last month
                  </p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">
                    Active Employees
                  </CardTitle>
                  <Users className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">+{employees.length}</div>
                  <p className="text-xs text-muted-foreground">
                    since last month
                  </p>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Employees Tab */}
          <TabsContent value="employees">
            <Card>
              <CardHeader>
                <CardTitle>Employee Management</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex justify-between">
                    <Input
                      className="w-1/3"
                      placeholder="Search employees..."
                    />
                    <Button onClick={() => setShowEmployeeModal(true)}>
                      Add New Employee
                    </Button>
                  </div>
                  <table className="w-full">
                    <thead>
                      <tr>
                        <th className="text-left">Name</th>
                        <th className="text-left">Role</th>
                        <th className="text-left">Status</th>
                        <th className="text-left">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {employees.map((employee) => (
                        <tr key={employee.id}>
                          <td>{employee.name}</td>
                          <td>{employee.role}</td>
                          <td>Active</td>
                          <td>
                            <Button variant="outline" size="sm">
                              Edit
                            </Button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Employee Modal */}
          {showEmployeeModal && (
            <div className="fixed inset-0 bg-gray-500 bg-opacity-75 flex items-center justify-center">
              <div className="bg-white p-6 rounded-lg">
                <h2 className="text-xl font-bold mb-4">Add New Employee</h2>
                <Input
                  className="mb-2"
                  placeholder="Employee Name"
                  value={newEmployee.name}
                  onChange={(e) =>
                    setNewEmployee({ ...newEmployee, name: e.target.value })
                  }
                />
                <Input
                  className="mb-2"
                  placeholder="Role"
                  value={newEmployee.role}
                  onChange={(e) =>
                    setNewEmployee({ ...newEmployee, role: e.target.value })
                  }
                />
                <Input
                  className="mb-2"
                  placeholder="Status"
                  value={newEmployee.status}
                  onChange={(e) =>
                    setNewEmployee({ ...newEmployee, status: e.target.value })
                  }
                />
                <Input
                  type="number"
                  placeholder="Salary"
                  value={newEmployee.salary}
                  onChange={(e) =>
                    setNewEmployee({
                      ...newEmployee,
                      salary: parseFloat(e.target.value),
                    })
                  }
                />
                <div className="flex justify-end">
                  <Button
                    variant="outline"
                    className="mr-2"
                    onClick={() => setShowEmployeeModal(false)}
                  >
                    Cancel
                  </Button>
                  <Button onClick={handleAddEmployee}>Add Employee</Button>
                </div>
              </div>
            </div>
          )}

          {/* Products Tab */}
          <TabsContent value="products">
            <Card>
              <CardHeader>
                <CardTitle>Product Management</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex justify-between">
                    <Input className="w-1/3" placeholder="Search products..." />
                    <Button onClick={() => setShowProductModal(true)}>
                      Add New Product
                    </Button>
                  </div>
                  <table className="w-full">
                    <thead>
                      <tr>
                        <th className="text-left">Name</th>
                        <th className="text-left">Price</th>
                        <th className="text-left">Stock</th>
                        <th className="text-left">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {products.map((product) => (
                        <tr key={product.id}>
                          <td>{product.name}</td>
                          <td>{product.price}</td>
                          <td>{product.quantity_in_stock}</td>
                          <td>
                            <Button variant="outline" size="sm">
                              Edit
                            </Button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          {/* Product Modal */}

          {showProductModal && (
            <div className="fixed inset-0 bg-gray-500 bg-opacity-75 flex items-center justify-center">
              <div className="bg-white p-6 rounded-lg">
                <h2 className="text-xl font-bold mb-4">Add New Product</h2>
                <Input
                  className="mb-2"
                  placeholder="Product Name"
                  value={newProduct.name}
                  onChange={(e) =>
                    setNewProduct({ ...newProduct, name: e.target.value })
                  }
                />
                <Input
                  className="mb-2"
                  placeholder="Category"
                  value={newProduct.category}
                  onChange={(e) =>
                    setNewProduct({ ...newProduct, category: e.target.value })
                  }
                />
                <Input
                  className="mb-2"
                  placeholder="Description"
                  value={newProduct.description}
                  onChange={(e) =>
                    setNewProduct({
                      ...newProduct,
                      description: e.target.value,
                    })
                  }
                />
                <Input
                  className="mb-2"
                  type="number"
                  placeholder="Price"
                  value={newProduct.price}
                  onChange={(e) =>
                    setNewProduct({ ...newProduct, price: e.target.value })
                  }
                />
                <Input
                  className="mb-2"
                  type="number"
                  placeholder="Stock"
                  value={newProduct.quantity_in_stock}
                  onChange={(e) =>
                    setNewProduct({
                      ...newProduct,
                      quantity_in_stock: e.target.value,
                    })
                  }
                />
                <Input
                  className="mb-2"
                  type="date"
                  placeholder="Expiry Date"
                  value={newProduct.expiry_date}
                  onChange={(e) =>
                    setNewProduct({
                      ...newProduct,
                      expiry_date: e.target.value,
                    })
                  }
                />
                <div className="flex justify-end">
                  <Button
                    variant="outline"
                    className="mr-2"
                    onClick={() => setShowProductModal(false)}
                  >
                    Cancel
                  </Button>
                  <Button onClick={handleAddProduct}>Add Product</Button>
                </div>
              </div>
            </div>
          )}

          {/* Inventory Tab */}
          <TabsContent value="inventory">
            <Card>
              <CardHeader>
                <CardTitle>Inventory Management</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <table className="w-full">
                    <thead>
                      <tr>
                        <th className="text-left">ProductID</th>
                        <th className="text-left">Quantity</th>
                        <th className="text-left">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {inventory.map((item) => (
                        <tr key={item.id}>
                          <td>{item.product_id}</td>
                          <td>{item.quantity_added}</td>
                          <td>
                            <Button variant="outline" size="sm">
                              Edit
                            </Button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
}
