import { useEffect, useState } from "react";
import { Category, Brand, Type, Product } from "@/types/types";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/Components/ui/dialog";
import { Button } from "@/Components/ui/button";
import { Input } from "@/Components/ui/input";
import { Label } from "@/Components/ui/label";
import { Textarea } from "@/Components/ui/textarea";
import { router } from "@inertiajs/react";
import { Combobox } from "@/Components/ui/Combobox";
import { Plus, Check, ChevronsUpDown } from "lucide-react";
import { formatToIDR } from "@/lib/rupiahFormat";

interface Props {
    initialCategories: Category[];
    initialBrands: Brand[];
    initialTypes: Type[];
}

const AddProductModal = ({
    initialCategories,
    initialBrands,
    initialTypes,
}: Props) => {
    const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
    const [displayPrice, setDisplayPrice] = useState("");
    const [newProduct, setNewProduct] = useState<Product>({
        id: 0,
        product_code: "",
        name: "",
        description: "",
        type_id: 0,
        type: {
            id: 0,
            name: "",
            category_id: 0,
        },
        price: 0,
        category_id: 0,
        brand_id: 0,
        category: {
            id: 0,
            name: "",
            description: "",
        },
        brand: {
            id: 0,
            name: "",
            description: "",
        },
    });

    const [filteredTypes, setFilteredTypes] = useState<Type[]>([]);

    // Add this debugging log
    useEffect(() => {
        console.log("Initial data:", {
            categories: initialCategories,
            brands: initialBrands,
            types: initialTypes,
        });
    }, [initialCategories, initialBrands, initialTypes]);

    useEffect(() => {
        if (newProduct.price) {
            setDisplayPrice(formatToIDR(newProduct.price));
        }
    }, [newProduct.price]);

    const handlePriceChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value.replace(/[^0-9]/g, "");
        const numericValue = parseInt(value, 10);

        if (!isNaN(numericValue)) {
            setNewProduct({
                ...newProduct,
                price: numericValue,
            });
        } else {
            setNewProduct({
                ...newProduct,
                price: 0,
            });
        }
    };

    useEffect(() => {
        if (newProduct.category_id) {
            const filtered = initialTypes.filter(
                (type) =>
                    String(type.category_id) === String(newProduct.category_id)
            );
            console.log("Category selected:", newProduct.category_id);
            console.log("All types:", initialTypes);
            console.log("Filtered types:", filtered);
            setFilteredTypes(filtered);
        } else {
            setFilteredTypes(initialTypes);
        }
    }, [newProduct.category_id, initialTypes]);

    const handleAddProduct = () => {
        if (newProduct.name && newProduct.type && newProduct.price > 0) {
            // Send FormData using router.post
            router.post(
                "/products",
                {
                    product_code: newProduct.product_code,
                    name: newProduct.name,
                    description: newProduct.description,
                    type_id: newProduct.type_id,
                    price: newProduct.price,
                    category_id: newProduct.category_id,
                    brand_id: newProduct.brand_id,
                },
                {
                    onSuccess: (response) => {
                        console.log(response);

                        setNewProduct({
                            id: 0,
                            product_code: "",
                            name: "",
                            description: "",
                            type_id: 0,
                            type: {
                                id: 0,
                                name: "",
                                category_id: 0,
                            },
                            price: 0,
                            category_id: 0,
                            brand_id: 0,
                            category: {
                                id: 0,
                                name: "",
                                description: "",
                            },
                            brand: {
                                id: 0,
                                name: "",
                                description: "",
                            },
                        });
                        setIsAddDialogOpen(false);

                        router.reload({ only: ["initialProducts"] });
                    },
                    onError: (errors) => {
                        console.error("Error adding product: ", errors);
                    },
                }
            );
        }
    };

    return (
        <div>
            <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
                <DialogTrigger asChild>
                    <Button>
                        <Plus className="mr-2 h-4 w-4" />
                        Add Product
                    </Button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-[425px]">
                    <form onSubmit={handleAddProduct}>
                        <DialogHeader>
                            <DialogTitle>Add New Product</DialogTitle>
                            <DialogDescription>
                                Enter the details for the new product.
                            </DialogDescription>
                        </DialogHeader>
                        <div className="grid gap-4 py-4">
                            <div className="grid grid-cols-4 items-center gap-4">
                                <Label
                                    htmlFor="product_code"
                                    className="text-right"
                                >
                                    Product Code
                                </Label>
                                <Input
                                    id="product_code"
                                    value={newProduct.product_code}
                                    onChange={(e) =>
                                        setNewProduct({
                                            ...newProduct,
                                            product_code: e.target.value,
                                        })
                                    }
                                    className="col-span-3"
                                    required
                                />
                            </div>
                            <div className="grid grid-cols-4 items-center gap-4">
                                <Label htmlFor="name" className="text-right">
                                    Name
                                </Label>
                                <Input
                                    id="name"
                                    value={newProduct.name}
                                    onChange={(e) =>
                                        setNewProduct({
                                            ...newProduct,
                                            name: e.target.value,
                                        })
                                    }
                                    className="col-span-3"
                                    required
                                />
                            </div>
                            <div className="grid grid-cols-4 items-center gap-4">
                                <Label
                                    htmlFor="description"
                                    className="text-right"
                                >
                                    Description
                                </Label>
                                <Textarea
                                    id="description"
                                    value={newProduct.description}
                                    onChange={(e) =>
                                        setNewProduct({
                                            ...newProduct,
                                            description: e.target.value,
                                        })
                                    }
                                    className="col-span-3"
                                />
                            </div>
                            <div className="grid grid-cols-4 items-center gap-4">
                                <Label
                                    htmlFor="category"
                                    className="text-right"
                                >
                                    Category
                                </Label>
                                <div className="col-span-3 w-full">
                                    <Combobox
                                        items={initialCategories.map(
                                            (category) => ({
                                                value: category.id.toString(),
                                                label: category.name,
                                            })
                                        )}
                                        placeholder="Select Category"
                                        onSelect={(value) => {
                                            const categoryId = parseInt(value);
                                            console.log(
                                                "Selected category ID:",
                                                categoryId
                                            );
                                            setNewProduct({
                                                ...newProduct,
                                                category_id: categoryId,
                                            });
                                        }}
                                    />
                                </div>
                            </div>
                            <div className="grid grid-cols-4 items-center gap-4">
                                <Label htmlFor="type" className="text-right">
                                    Type
                                </Label>
                                <div className="col-span-3 w-full">
                                    <Combobox
                                        items={filteredTypes.map((type) => ({
                                            value: type.id.toString(),
                                            label: type.name,
                                        }))}
                                        placeholder="Select Type"
                                        disabled={!newProduct.category_id}
                                        onSelect={(value) =>
                                            setNewProduct({
                                                ...newProduct,
                                                type_id: parseInt(value),
                                            })
                                        }
                                    />
                                </div>
                            </div>

                            <div className="grid grid-cols-4 items-center gap-4">
                                <Label htmlFor="brand" className="text-right">
                                    Brand
                                </Label>
                                <div className="col-span-3 w-full">
                                    <Combobox
                                        items={initialBrands.map((brand) => ({
                                            value: brand.id.toString(),
                                            label: brand.name,
                                        }))}
                                        placeholder="Select Brand"
                                        onSelect={(value) =>
                                            setNewProduct({
                                                ...newProduct,
                                                brand_id: parseInt(value),
                                            })
                                        }
                                    />
                                </div>
                            </div>
                            <div className="grid grid-cols-4 items-center gap-4">
                                <Label htmlFor="price" className="text-right">
                                    Price
                                </Label>
                                <Input
                                    id="price"
                                    type="text"
                                    value={displayPrice}
                                    onChange={handlePriceChange}
                                    onFocus={() =>
                                        setDisplayPrice(
                                            newProduct.price.toString()
                                        )
                                    }
                                    onBlur={() =>
                                        setDisplayPrice(
                                            formatToIDR(newProduct.price)
                                        )
                                    }
                                    className="col-span-3"
                                    required
                                />
                            </div>
                        </div>
                        <DialogFooter>
                            <Button type="submit">Add Product</Button>
                        </DialogFooter>
                    </form>
                </DialogContent>
            </Dialog>
        </div>
    );
};

export default AddProductModal;
