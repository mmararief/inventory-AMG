import React, { useState, useEffect } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/Components/ui/card";
import {
    Package,
    ShoppingCart,
    Users,
    ArrowUpCircle,
    ArrowDownCircle,
    ArrowLeftRight,
} from "lucide-react";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/Components/ui/table";
import { Badge } from "@/Components/ui/badge";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/Components/ui/select";
import { CardDescription } from "@/Components/ui/card";
import {
    AreaChart,
    Area,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
} from "recharts";
interface Movement {
    id: number;
    created_at: string;
    product: {
        name: string;
    };
    from_location: {
        name: string;
    };
    to_location: {
        name: string;
    };

    quantity: number;
    type: string;
}
interface StockData {
    month: string;
    stockIn: number;
    stockOut: number;
}

const DashboardRetail = ({
    totalInventory,
    lowInventory,
    outOfStock,
    recentMovements,
    stockData,
}: {
    totalInventory: number;
    lowInventory: number;
    outOfStock: number;
    recentMovements: Movement[];
    stockData: StockData[];
}) => {
    const [timeRange, setTimeRange] = useState("6m");
    const [chartData, setChartData] = useState<StockData[]>([]);
    useEffect(() => {
        const monthsToShow = timeRange === "3m" ? 3 : 6;
        setChartData(stockData.slice(-monthsToShow));
    }, [timeRange, stockData]);
    return (
        <main className="flex-1 overflow-x-hidden overflow-y-auto bg-gray-100">
            <div className="container mx-auto px-6 py-8">
                <h1 className="text-2xl font-semibold mb-6">
                    Inventory Dashboard
                </h1>

                {/* Stats */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">
                                Total Items
                            </CardTitle>
                            <Package className="h-4 w-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">
                                {totalInventory}
                            </div>
                            <p className="text-xs text-muted-foreground">
                                Total products in inventory
                            </p>
                        </CardContent>
                    </Card>
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">
                                Low Stock Items
                            </CardTitle>
                            <ShoppingCart className="h-4 w-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">
                                {lowInventory}
                            </div>
                            <p className="text-xs text-muted-foreground">
                                Products with stock below 5
                            </p>
                        </CardContent>
                    </Card>
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">
                                Out of Stock
                            </CardTitle>
                            <Package className="h-4 w-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">
                                {outOfStock || 0}
                            </div>
                            <p className="text-xs text-muted-foreground">
                                Urgent restock needed
                            </p>
                        </CardContent>
                    </Card>
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">
                                In Stock Items
                            </CardTitle>
                            <Users className="h-4 w-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">
                                {totalInventory - (lowInventory + outOfStock)}
                            </div>
                            <p className="text-xs text-muted-foreground">
                                Products with stock above 5
                            </p>
                        </CardContent>
                    </Card>
                </div>

                <div className="w-full  mb-8">
                    <Card className="w-full">
                        <CardHeader>
                            <div className="flex justify-between items-center">
                                <div>
                                    <CardTitle>Stock Movement</CardTitle>
                                    <CardDescription>
                                        Recent stock in and stock out data
                                    </CardDescription>
                                </div>
                                <Select
                                    value={timeRange}
                                    onValueChange={setTimeRange}
                                >
                                    <SelectTrigger className="w-[180px]">
                                        <SelectValue placeholder="Select time range" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="3m">
                                            Last 3 months
                                        </SelectItem>
                                        <SelectItem value="6m">
                                            Last 6 months
                                        </SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                        </CardHeader>
                        <CardContent>
                            <ResponsiveContainer width="100%" height={400}>
                                <AreaChart
                                    data={chartData}
                                    margin={{
                                        top: 10,
                                        right: 30,
                                        left: 0,
                                        bottom: 0,
                                    }}
                                >
                                    <CartesianGrid strokeDasharray="3 3" />
                                    <XAxis dataKey="month" />
                                    <YAxis />
                                    <Tooltip />
                                    <Area
                                        type="monotone"
                                        dataKey="stockIn"
                                        stackId="1"
                                        stroke="#8884d8"
                                        fill="#8884d8"
                                        name="Stock In"
                                    />
                                    <Area
                                        type="monotone"
                                        dataKey="stockOut"
                                        stackId="1"
                                        stroke="#82ca9d"
                                        fill="#82ca9d"
                                        name="Stock Out"
                                    />
                                </AreaChart>
                            </ResponsiveContainer>
                        </CardContent>
                    </Card>
                </div>

                {/* Recent Inventory Table */}
                <Card>
                    <CardHeader>
                        <CardTitle>Recent Inventory</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>Date</TableHead>
                                    <TableHead>Item Name</TableHead>
                                    <TableHead>From</TableHead>
                                    <TableHead>To</TableHead>
                                    <TableHead>Quantity</TableHead>
                                    <TableHead>Type</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {recentMovements.map((movement: Movement) => (
                                    <TableRow key={movement.id}>
                                        <TableCell>
                                            {new Date(
                                                movement.created_at
                                            ).toLocaleString("en-US", {
                                                year: "numeric",
                                                month: "2-digit",
                                                day: "2-digit",
                                            })}
                                        </TableCell>
                                        <TableCell>
                                            {movement.product.name}
                                        </TableCell>
                                        <TableCell>
                                            {movement.from_location?.name ||
                                                "-"}
                                        </TableCell>
                                        <TableCell>
                                            {movement.to_location?.name || "-"}
                                        </TableCell>
                                        <TableCell>
                                            {movement.quantity}
                                        </TableCell>
                                        <TableCell>
                                            <Badge
                                                variant={
                                                    movement.type === "in"
                                                        ? "default"
                                                        : movement.type ===
                                                          "out"
                                                        ? "secondary"
                                                        : "outline"
                                                }
                                            >
                                                {movement.type === "in" && (
                                                    <ArrowUpCircle className="mr-1 h-4 w-4" />
                                                )}
                                                {movement.type === "out" && (
                                                    <ArrowDownCircle className="mr-1 h-4 w-4" />
                                                )}
                                                {movement.type === "move" && (
                                                    <ArrowLeftRight className="mr-1 h-4 w-4" />
                                                )}
                                                {movement.type.toUpperCase()}
                                            </Badge>
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </CardContent>
                </Card>
            </div>
        </main>
    );
};

export default DashboardRetail;
