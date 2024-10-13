import { useState, useEffect } from "react";
import { Button } from "@/Components/ui/button";
import { Input } from "@/Components/ui/input";
import { Label } from "@/Components/ui/label";
import { formatToIDR } from "@/lib/rupiahFormat";
import {
    Card,
    CardHeader,
    CardTitle,
    CardDescription,
    CardContent,
    CardFooter,
} from "@/Components/ui/card";

import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { Head, router } from "@inertiajs/react";
import { Combobox } from "@/Components/ui/Combobox";

export default function AddProduct({
    initialCategories,
    initialBrands,
    initialTypes,
}: {
    initialCategories: any[];
    initialBrands: any[];
    initialTypes: any[];
}) {
    const [productCode, setProductCode] = useState("");
    const [name, setName] = useState("");
    const [description, setDescription] = useState("");
    const [categoryId, setCategoryId] = useState(0);
    const [brandId, setBrandId] = useState(0);
    const [typeId, setTypeId] = useState(0);
    const [categories, setCategories] = useState(initialCategories);
    const [brands, setBrands] = useState(initialBrands);
    const [types, setTypes] = useState(initialTypes);
    const [price, setPrice] = useState(0);
    const [filteredTypes, setFilteredTypes] = useState(initialTypes);
    const [displayPrice, setDisplayPrice] = useState("0");
    const handlePriceChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value.replace(/[^0-9]/g, "");
        const numericValue = parseInt(value, 10);

        if (!isNaN(numericValue)) {
            setPrice(numericValue);
        } else {
            setPrice(0);
        }
    };

    useEffect(() => {
        if (price) {
            setDisplayPrice(formatToIDR(price));
        }
    }, [price]);

    useEffect(() => {
        if (categoryId) {
            const filtered = initialTypes.filter(
                (type) => String(type.category_id) === String(categoryId)
            );
            setFilteredTypes(filtered);
        } else {
            setFilteredTypes(initialTypes);
        }
    }, [categoryId, initialTypes]);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        // Implementasi logika untuk menyimpan data supplier
        router.post("/products", {
            product_code: productCode,
            name: name,
            description: description,
            category_id: categoryId,
            brand_id: brandId,
            type_id: typeId,
            price: price,
        });
        console.log("Product added:", {
            productCode,
            name,
            categoryId,
            brandId,
            typeId,
            price,
        });

        // Reset form
        setName("");
        setCategoryId(0);
    };

    return (
        <AuthenticatedLayout>
            <Head title="Add Product" />
            <Card className="w-full max-w-4xl mx-auto mt-10">
                <CardHeader>
                    <CardTitle>Add Product</CardTitle>
                    <CardDescription>
                        Enter the information of the new product below.
                    </CardDescription>
                </CardHeader>
                <form onSubmit={handleSubmit}>
                    <CardContent className="space-y-4">
                        <div className="space-y-2">
                            <Label htmlFor="product_code">Product Code</Label>
                            <Input
                                id="product_code"
                                placeholder="Enter product code"
                                value={productCode}
                                onChange={(e) => setProductCode(e.target.value)}
                                required
                            />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="name">Product Name</Label>
                            <Input
                                id="name"
                                placeholder="Enter type name"
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                required
                                disabled={!productCode}
                            />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="description">Description</Label>
                            <Input
                                id="description"
                                placeholder="Enter description"
                                value={description}
                                onChange={(e) => setDescription(e.target.value)}
                                required
                                disabled={!productCode}
                            />
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="category">Category</Label>
                            <div className="col-span-3">
                                <Combobox
                                    className="w-full"
                                    disabled={!productCode}
                                    items={categories.map((category) => ({
                                        value: category.id.toString(),
                                        label: category.name,
                                    }))}
                                    placeholder="Select a category"
                                    onSelect={(value) => {
                                        setCategoryId(parseInt(value));
                                        setTypeId(0); // Reset type when category changes
                                    }}
                                />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="type">Type</Label>
                            <div className="col-span-3">
                                <Combobox
                                    className="w-full"
                                    items={filteredTypes.map((type) => ({
                                        value: type.id.toString(),
                                        label: type.name,
                                    }))}
                                    placeholder="Select a type"
                                    onSelect={(value) =>
                                        setTypeId(parseInt(value))
                                    }
                                    disabled={!categoryId || !productCode}
                                />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="brand">Brand</Label>
                            <div className="col-span-3">
                                <Combobox
                                    className="w-full"
                                    items={brands.map((brand) => ({
                                        value: brand.id.toString(),
                                        label: brand.name,
                                    }))}
                                    placeholder="Select a brand"
                                    onSelect={(value) =>
                                        setBrandId(parseInt(value))
                                    }
                                    disabled={!productCode}
                                />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="price">Price</Label>
                            <div className="col-span-3">
                                <Input
                                    className="w-full"
                                    value={displayPrice}
                                    onChange={handlePriceChange}
                                    placeholder="Enter price"
                                    disabled={!productCode}
                                />
                            </div>
                        </div>
                    </CardContent>
                    <CardFooter>
                        <Button type="submit" className="w-full">
                            Add Product
                        </Button>
                    </CardFooter>
                </form>
            </Card>
        </AuthenticatedLayout>
    );
}
