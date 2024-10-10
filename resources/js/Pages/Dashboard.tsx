import { Card, CardContent, CardHeader, CardTitle } from "@/Components/ui/card";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/Components/ui/table";
import { useState } from "react";
import {
    ChartConfig,
    ChartContainer,
    ChartTooltip,
    ChartTooltipContent,
} from "@/Components/ui/chart";
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { ArrowLeftRight } from "lucide-react";

import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/Components/ui/select";
import { CardDescription, CardFooter } from "@/Components/ui/card";
import { TrendingUp } from "lucide-react";
import {
    AreaChart,
    Area,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    LineChart,
    BarChart,
    Bar,
    ResponsiveContainer,
} from "recharts";
import { Head, usePage } from "@inertiajs/react";
import {
    Package,
    ShoppingCart,
    Users,
    ArrowUpCircle,
    ArrowDownCircle,
} from "lucide-react";

import { Badge } from "@/Components/ui/badge";
import { useEffect } from "react";
import SubscriptionPage from "./SubscriptionPage";
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

const chartConfig = {
    stockIn: {
        label: "Stock In",
        color: "hsl(var(--chart-1))",
    },
    stockOut: {
        label: "Stock Out",
        color: "hsl(var(--chart-2))",
    },
} satisfies ChartConfig;

export default function Dashboard({
    totalInventory,
    lowInventory,
    outOfStock,
    recentMovements,
    stockData,
    userStatus,
}: {
    totalInventory: number;
    lowInventory: number;
    outOfStock: number;
    recentMovements: Movement[];
    stockData: StockData[];
    userStatus: string;
}) {
    const user = usePage().props.auth.user;
    const [timeRange, setTimeRange] = useState("6m");
    const [chartData, setChartData] = useState<StockData[]>([]);
    useEffect(() => {
        const monthsToShow = timeRange === "3m" ? 3 : 6;
        setChartData(stockData.slice(-monthsToShow));
    }, [timeRange, stockData]);

    return (
        <AuthenticatedLayout
            header={
                <h2 className="font-semibold text-xl text-gray-800 leading-tight"></h2>
            }
        >
            <Head title="Dashboard" />
            {/* Dashboard Content */}
            {userStatus === "inactive" ? (
                <SubscriptionPage />
            ) : (
                <main className="flex-1 overflow-x-hidden overflow-y-auto bg-gray-100">
                    <div className="container mx-auto px-6 py-8">
                        <h1 className="text-2xl font-semibold mb-6">
                            Inventory Dashboard
                        </h1>

                        <div className="w-full mb-8 flex flex-col lg:flex-row gap-6">
                            <Card className="w-full lg:w-2/4">
                                <CardHeader className="pb-4">
                                    <div className="flex justify-between items-center">
                                        <div>
                                            <CardTitle className="text-lg">
                                                Stock Movement Comparison
                                            </CardTitle>
                                            <CardDescription className="text-sm">
                                                Stock in vs Stock out data
                                            </CardDescription>
                                        </div>
                                        <Select
                                            value={timeRange}
                                            onValueChange={setTimeRange}
                                        >
                                            <SelectTrigger className="w-[140px]">
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
                                <CardContent className="pb-2">
                                    <ChartContainer config={chartConfig}>
                                        <ResponsiveContainer
                                            width="100%"
                                            height={300}
                                        >
                                            <BarChart
                                                data={chartData}
                                                margin={{
                                                    top: 5,
                                                    right: 20,
                                                    left: 0,
                                                    bottom: 0,
                                                }}
                                            >
                                                <CartesianGrid
                                                    strokeDasharray="3 3"
                                                    vertical={false}
                                                />
                                                <XAxis
                                                    dataKey="month"
                                                    tickLine={false}
                                                    axisLine={false}
                                                    tickMargin={5}
                                                    tickFormatter={(value) =>
                                                        value.slice(0, 3)
                                                    }
                                                    fontSize={12}
                                                />
                                                <ChartTooltip
                                                    cursor={false}
                                                    content={
                                                        <ChartTooltipContent />
                                                    }
                                                />
                                                <Bar
                                                    dataKey="stockIn"
                                                    fill="var(--color-stockIn)"
                                                    radius={[3, 3, 0, 0]}
                                                />
                                                <Bar
                                                    dataKey="stockOut"
                                                    fill="var(--color-stockOut)"
                                                    radius={[3, 3, 0, 0]}
                                                />
                                            </BarChart>
                                        </ResponsiveContainer>
                                    </ChartContainer>
                                </CardContent>
                                <CardFooter className="pt-2">
                                    <div className="flex w-full items-start gap-2 text-xs">
                                        <div className="grid gap-1">
                                            <div className="flex items-center gap-1 font-medium leading-none">
                                                Stock Movement Comparison{" "}
                                                <TrendingUp className="h-3 w-3" />
                                            </div>
                                            <div className="flex items-center gap-1 leading-none text-muted-foreground">
                                                Comparing stock in and out for
                                                last{" "}
                                                {timeRange === "3m" ? "3" : "6"}{" "}
                                                months
                                            </div>
                                        </div>
                                    </div>
                                </CardFooter>
                            </Card>

                            <div className="w-full lg:w-2/4 grid grid-cols-2 gap-6">
                                {[
                                    {
                                        title: "Total Items",
                                        value: totalInventory,
                                        icon: Package,
                                        description:
                                            "Total products in inventory",
                                        color: "bg-blue-100 text-blue-600",
                                    },
                                    {
                                        title: "Low Stock Items",
                                        value: lowInventory,
                                        icon: ShoppingCart,
                                        description:
                                            "Products with stock below 5",
                                        color: "bg-yellow-100 text-yellow-600",
                                    },
                                    {
                                        title: "Out of Stock",
                                        value: outOfStock || 0,
                                        icon: Package,
                                        description: "Urgent restock needed",
                                        color: "bg-red-100 text-red-600",
                                    },
                                    {
                                        title: "In Stock Items",
                                        value:
                                            totalInventory -
                                            (lowInventory + outOfStock),
                                        icon: Users,
                                        description:
                                            "Products with stock above 5",
                                        color: "bg-green-100 text-green-600",
                                    },
                                ].map((item, index) => (
                                    <Card
                                        key={index}
                                        className={`${item.color} border-none shadow-md`}
                                    >
                                        <CardHeader className="pb-2">
                                            <div className="flex justify-between items-center">
                                                <CardTitle className="text-lg font-semibold">
                                                    {item.title}
                                                </CardTitle>
                                                <item.icon className="h-6 w-6" />
                                            </div>
                                        </CardHeader>
                                        <CardContent>
                                            <div className="text-4xl font-bold mb-1">
                                                {item.value}
                                            </div>
                                            <p className="text-sm opacity-80">
                                                {item.description}
                                            </p>
                                        </CardContent>
                                    </Card>
                                ))}
                            </div>
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
                                        {recentMovements.map(
                                            (movement: Movement) => (
                                                <TableRow key={movement.id}>
                                                    <TableCell>
                                                        {new Date(
                                                            movement.created_at
                                                        ).toLocaleString(
                                                            "en-US",
                                                            {
                                                                year: "numeric",
                                                                month: "2-digit",
                                                                day: "2-digit",
                                                            }
                                                        )}
                                                    </TableCell>
                                                    <TableCell>
                                                        {movement.product.name}
                                                    </TableCell>
                                                    <TableCell>
                                                        {movement.from_location
                                                            ?.name || "-"}
                                                    </TableCell>
                                                    <TableCell>
                                                        {movement.to_location
                                                            ?.name || "-"}
                                                    </TableCell>
                                                    <TableCell>
                                                        {movement.quantity}
                                                    </TableCell>
                                                    <TableCell>
                                                        <Badge
                                                            variant={
                                                                movement.type ===
                                                                "in"
                                                                    ? "default"
                                                                    : movement.type ===
                                                                      "out"
                                                                    ? "secondary"
                                                                    : "outline"
                                                            }
                                                        >
                                                            {movement.type ===
                                                                "in" && (
                                                                <ArrowUpCircle className="mr-1 h-4 w-4" />
                                                            )}
                                                            {movement.type ===
                                                                "out" && (
                                                                <ArrowDownCircle className="mr-1 h-4 w-4" />
                                                            )}
                                                            {movement.type ===
                                                                "move" && (
                                                                <ArrowLeftRight className="mr-1 h-4 w-4" />
                                                            )}
                                                            {movement.type.toUpperCase()}
                                                        </Badge>
                                                    </TableCell>
                                                </TableRow>
                                            )
                                        )}
                                    </TableBody>
                                </Table>
                            </CardContent>
                        </Card>
                    </div>
                </main>
            )}
        </AuthenticatedLayout>
    );
}
