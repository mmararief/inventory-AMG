import { useState } from "react";
import { Box, Package } from "lucide-react";
import { Head } from "@inertiajs/react";
import { Button } from "@/Components/ui/button";
import { Input } from "@/Components/ui/input";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/Components/ui/table";
import { Card, CardContent, CardHeader, CardTitle } from "@/Components/ui/card";
import { Progress } from "@/Components/ui/progress";
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
interface InventoryItem {
    id: number;
    name: string;
    quantity: number;
    volume: number;
    product_id: number;
    supplier_id: number;
    created_at: string;
    product: Product;
    supplier: Supplier;
}
import { ArrowLeft } from "lucide-react";
interface Product {
    id: number;
    name: string;
}
import { Link } from "@inertiajs/react";
interface Location {
    id: number;
    name: string;
    totalVolume: number;
    volume: number;
    used_volume: number;
    remaining_volume: number;
    inventories: InventoryItem[];
}
interface Supplier {
    id: number;
    name: string;
}

interface Props {
    location: Location;
}

export default function DetailLocation({ location }: Props) {
    console.log(location);
    const [searchTerm, setSearchTerm] = useState("");

    // We'll need to fetch product details separately or modify the backend to include product information
    const usedVolume = location.used_volume; // This needs to be calculated once we have product volume information
    const remainingVolume = location.remaining_volume;
    const volumeUsagePercentage = (usedVolume / location.volume) * 100;

    const filteredInventory = location.inventories.filter((item) =>
        // This filter needs to be updated once we have product information
        item.product.name.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <AuthenticatedLayout>
            <Head title="Location Details" />
            <div className="container mx-auto p-6">
                <Button className="mb-6" asChild>
                    <Link href="/locations">
                        <ArrowLeft />
                        Back
                    </Link>
                </Button>
                <Card className="mb-6">
                    <CardHeader>
                        <CardTitle className="text-2xl font-bold flex items-center">
                            <Box className="mr-2" />
                            {location.name}
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                            <div>
                                <p className="text-sm font-medium">
                                    Total Volume
                                </p>
                                <p className="text-2xl font-bold">
                                    {location.volume}
                                </p>
                            </div>
                            <div>
                                <p className="text-sm font-medium">
                                    Used Volume
                                </p>
                                <p className="text-2xl font-bold">
                                    {usedVolume}
                                </p>
                            </div>
                            <div>
                                <p className="text-sm font-medium">
                                    Remaining Volume
                                </p>
                                <p className="text-2xl font-bold">
                                    {remainingVolume}
                                </p>
                            </div>
                        </div>
                        <Progress
                            value={volumeUsagePercentage}
                            className="w-full h-4"
                        />
                        <p className="text-sm text-center mt-2">
                            {volumeUsagePercentage.toFixed(2)}% of total volume
                            used
                        </p>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader>
                        <CardTitle className="text-2xl font-bold flex items-center justify-between">
                            <span className="flex items-center">
                                <Package className="mr-2" />
                                Inventory Items
                            </span>
                            <Input
                                type="search"
                                placeholder="Search items..."
                                className="max-w-sm"
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                            />
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>Product ID</TableHead>
                                    <TableHead>Quantity</TableHead>
                                    <TableHead>Supplier ID</TableHead>
                                    <TableHead>Created At</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {filteredInventory.map((item) => (
                                    <TableRow key={item.id}>
                                        <TableCell className="font-medium">
                                            {item.product.name}
                                        </TableCell>
                                        <TableCell>{item.quantity}</TableCell>
                                        <TableCell>
                                            {item.supplier.name}
                                        </TableCell>
                                        <TableCell>
                                            {new Date(
                                                item.created_at
                                            ).toLocaleDateString()}
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </CardContent>
                </Card>
            </div>
        </AuthenticatedLayout>
    );
}
