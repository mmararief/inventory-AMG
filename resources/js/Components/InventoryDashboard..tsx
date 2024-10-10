// resources/js/Components/InventoryDashboard.tsx

import { useState } from "react";
import {
    Bell,
    ChevronDown,
    Layout,
    Package,
    Search,
    ShoppingCart,
    Users,
    Container,
} from "lucide-react";

// Define the type for your inventory items (optional, you can expand as needed)
type InventoryItem = {
    name: string;
    category: string;
    quantity: number;
    unitPrice: number;
    totalValue: number;
};

export default function InventoryDashboard() {
    const [isSidebarOpen, setSidebarOpen] = useState<boolean>(true);

    // Example inventory data (you might fetch this data via an API call)
    const inventoryData: InventoryItem[] = [
        {
            name: "Widget A",
            category: "Electronics",
            quantity: 500,
            unitPrice: 10.0,
            totalValue: 5000.0,
        },
        {
            name: "Gadget B",
            category: "Electronics",
            quantity: 250,
            unitPrice: 25.0,
            totalValue: 6250.0,
        },
        {
            name: "Tool C",
            category: "Hardware",
            quantity: 1000,
            unitPrice: 5.0,
            totalValue: 5000.0,
        },
        {
            name: "Part D",
            category: "Automotive",
            quantity: 750,
            unitPrice: 15.0,
            totalValue: 11250.0,
        },
        {
            name: "Material E",
            category: "Construction",
            quantity: 2000,
            unitPrice: 2.5,
            totalValue: 5000.0,
        },
    ];

    return (
        <div className="flex h-screen bg-gray-100">
            {/* Sidebar */}
            <aside
                className={`bg-white w-64 min-h-screen p-4 ${
                    isSidebarOpen ? "" : "hidden"
                }`}
            >
                <div className="flex items-center mb-6">
                    <Package className="h-6 w-6 text-blue-500 mr-2" />
                    <span className="text-xl font-semibold">InvenTrack</span>
                </div>
                <nav>
                    <button className="w-full flex justify-start mb-2 p-2 hover:bg-gray-100">
                        <Layout className="mr-2 h-4 w-4" />
                        Dashboard
                    </button>
                    <button className="w-full flex justify-start mb-2 p-2 hover:bg-gray-100">
                        <Package className="mr-2 h-4 w-4" />
                        Inventory
                    </button>
                    <button className="w-full flex justify-start mb-2 p-2 hover:bg-gray-100">
                        <Container className="mr-2 h-4 w-4" />
                        Locations
                    </button>
                    <button className="w-full flex justify-start mb-2 p-2 hover:bg-gray-100">
                        <ShoppingCart className="mr-2 h-4 w-4" />
                        Orders
                    </button>
                    <button className="w-full flex justify-start mb-2 p-2 hover:bg-gray-100">
                        <Users className="mr-2 h-4 w-4" />
                        Suppliers
                    </button>
                </nav>
            </aside>

            {/* Main Content */}
            <div className="flex-1 flex flex-col overflow-hidden">
                {/* Header */}
                <header className="bg-white shadow-sm">
                    <div className="flex items-center justify-between p-4">
                        <button
                            className="p-2 hover:bg-gray-100"
                            onClick={() => setSidebarOpen(!isSidebarOpen)}
                        >
                            <ChevronDown
                                className={`h-6 w-6 transform ${
                                    isSidebarOpen ? "rotate-0" : "-rotate-90"
                                }`}
                            />
                        </button>
                        <div className="flex items-center">
                            <div className="relative">
                                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500" />
                                <input
                                    type="search"
                                    placeholder="Search inventory..."
                                    className="pl-8 w-64 border rounded-md p-2"
                                />
                            </div>
                            <button className="ml-2 p-2 hover:bg-gray-100">
                                <Bell className="h-5 w-5" />
                            </button>
                        </div>
                    </div>
                </header>

                {/* Dashboard Content */}
                <main className="flex-1 overflow-x-hidden overflow-y-auto bg-gray-100 p-6">
                    <h1 className="text-2xl font-semibold mb-6">
                        Inventory Dashboard
                    </h1>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                        {/* Stats Cards */}
                        {/* Add the stats card components here */}
                    </div>

                    <div className="bg-white rounded-lg shadow-md p-4">
                        <h2 className="text-xl font-semibold mb-4">
                            Recent Inventory
                        </h2>
                        <table className="min-w-full bg-white">
                            <thead>
                                <tr>
                                    <th className="py-2">Item Name</th>
                                    <th>Category</th>
                                    <th>Quantity</th>
                                    <th>Unit Price</th>
                                    <th>Total Value</th>
                                </tr>
                            </thead>
                            <tbody>
                                {inventoryData.map((item, index) => (
                                    <tr key={index}>
                                        <td className="py-2">{item.name}</td>
                                        <td>{item.category}</td>
                                        <td>{item.quantity}</td>
                                        <td>${item.unitPrice.toFixed(2)}</td>
                                        <td>${item.totalValue.toFixed(2)}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </main>
            </div>
        </div>
    );
}
