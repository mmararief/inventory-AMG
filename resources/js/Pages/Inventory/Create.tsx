import { useState } from "react";
import { Plus } from "lucide-react";
import { Button } from "@/Components/ui/button";
import { Input } from "@/Components/ui/input";
import { Label } from "@/Components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/Components/ui/card";
import { router } from "@inertiajs/react";
import { Combobox } from "@/Components/ui/Combobox";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/Components/ui/select";
import { Head } from "@inertiajs/react";
interface Product {
    id: string;
    name: string;
    description: string;
    price: number;
    type: string;
    category_id: number;
    brand_id: number;
    category: Category;
    brand: Brand;
}

interface Category {
    id: number;
    name: string;
    description: string;
}

interface Brand {
    id: number;
    name: string;
    description: string;
}
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";

interface Location {
    id: number;
    name: string;
    volume: number;
    remaining_volume: number;
}

import { useToast } from "@/hooks/use-toast";

interface Supplier {
    id: number;
    name: string;
}

interface Props {
    products: Product[];
    locations: Location[];
    suppliers: Supplier[];
}

export default function AddProductToInventory({
    products,
    locations,
    suppliers,
}: Props) {
    const { toast } = useToast();
    const [productId, setProductId] = useState("");
    const [locationId, setLocationId] = useState("");
    const [quantity, setQuantity] = useState("");
    const [supplierId, setSupplierId] = useState("");

    // Add this new state to store the selected location's volume
    const [selectedLocationVolume, setSelectedLocationVolume] = useState<
        number | null
    >(null);

    // Add a new state for error message
    const [quantityError, setQuantityError] = useState<string | null>(null);

    // Modify the location selection handler
    const handleLocationChange = (value: string) => {
        setLocationId(value);
        const selectedLocation = locations.find(
            (location) => location.id === Number(value)
        );
        setSelectedLocationVolume(
            selectedLocation ? selectedLocation.remaining_volume : null
        );
        // Reset quantity and error when location changes
        setQuantity("");
        setQuantityError(null);
    };

    const handleQuantityChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const newQuantity = e.target.value;
        setQuantity(newQuantity);

        if (selectedLocationVolume !== null) {
            const numQuantity = Number(newQuantity);
            if (numQuantity > selectedLocationVolume) {
                setQuantityError(
                    `Quantity cannot exceed available volume (${selectedLocationVolume})`
                );
            } else {
                setQuantityError(null);
            }
        }
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        if (
            selectedLocationVolume !== null &&
            Number(quantity) > selectedLocationVolume
        ) {
            toast({
                variant: "destructive",
                title: "Quantity exceeds remaining volume",
                description:
                    "Please enter a quantity that does not exceed the remaining volume in the selected location.",
            });
            return;
        }

        // Validate form

        router.post("/inventory/create", {
            product_id: productId,
            location_id: locationId,
            quantity: quantity,
            supplier_id: supplierId,
        });

        // Reset form
        setProductId("");
        setLocationId("");
        setQuantity("");
        setSupplierId("");
    };

    return (
        <AuthenticatedLayout>
            <Head title="Add Product to Inventory" />
            <div className="container mx-auto p-6">
                <Card>
                    <CardHeader>
                        <CardTitle className="text-2xl font-bold">
                            Add Product to Inventory
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div className="space-y-2">
                                <Label htmlFor="product">Product</Label>
                                <Combobox
                                    items={products.map((product) => ({
                                        value: product.id.toString(),
                                        label: product.name,
                                    }))}
                                    placeholder="Select a product"
                                    onSelect={(value) => setProductId(value)}
                                />
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="location">Location</Label>
                                <Combobox
                                    items={locations.map((location) => ({
                                        value: location.id.toString(),
                                        label: location.name,
                                    }))}
                                    placeholder="Select a location"
                                    onSelect={(value) =>
                                        handleLocationChange(value)
                                    }
                                />
                                {selectedLocationVolume !== null && (
                                    <p className="text-sm text-gray-600 mt-1">
                                        Remaining volume:{" "}
                                        {selectedLocationVolume}
                                    </p>
                                )}
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="quantity">Quantity</Label>
                                <div className="flex items-center space-x-2">
                                    <Input
                                        type="number"
                                        id="quantity"
                                        value={quantity}
                                        onChange={handleQuantityChange}
                                        className={
                                            quantityError
                                                ? "border-red-500"
                                                : ""
                                        }
                                        placeholder="Enter quantity"
                                    />
                                    {selectedLocationVolume !== null && (
                                        <span className="text-sm text-gray-600">
                                            / {selectedLocationVolume} available
                                        </span>
                                    )}
                                </div>
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="supplier">Supplier</Label>
                                <Combobox
                                    items={suppliers.map((supplier) => ({
                                        value: supplier.id.toString(),
                                        label: supplier.name,
                                    }))}
                                    placeholder="Select a supplier"
                                    onSelect={(value) => setSupplierId(value)}
                                />
                            </div>

                            <Button type="submit" className="w-full">
                                <Plus className="mr-2 h-4 w-4" />
                                Add to Inventory
                            </Button>
                        </form>
                    </CardContent>
                </Card>
            </div>
        </AuthenticatedLayout>
    );
}
