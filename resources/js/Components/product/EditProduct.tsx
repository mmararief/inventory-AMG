import { useState, useEffect } from "react";
import { Combobox } from "../ui/Combobox";
import { Category, Brand, Type, Product } from "@/types/types";
import { Textarea } from "@/Components/ui/textarea";
import { router } from "@inertiajs/react";
import { formatToIDR } from "@/lib/rupiahFormat";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/Components/ui/dialog";
import { Label } from "@/Components/ui/label";

import { useToast } from "@/hooks/use-toast";
import { Button } from "@/Components/ui/button";
import { Pencil } from "lucide-react";
import { Input } from "@/Components/ui/input";

interface Props {
    initialCategories: Category[];
    initialBrands: Brand[];
    initialTypes: Type[];
    product: Product;
    setProducts: React.Dispatch<React.SetStateAction<Product[]>>;
}

const EditProductModal = ({
    initialCategories,
    initialBrands,
    initialTypes,
    product,
    setProducts,
}: Props) => {
    const { toast } = useToast();
    const [editingProduct, setEditingProduct] = useState<Product | null>(
        product
    );
    const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
    const [editDisplayPrice, setEditDisplayPrice] = useState("");
    const [selectedCategoryId, setSelectedCategoryId] = useState<number | null>(
        product.category_id
    );

    useEffect(() => {
        if (editingProduct && editingProduct.price) {
            setEditDisplayPrice(formatToIDR(editingProduct.price));
        }
    }, [editingProduct?.price]);

    const handleEditPriceChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value.replace(/[^0-9]/g, "");
        const numericValue = parseInt(value, 10);
        if (!isNaN(numericValue)) {
            setEditingProduct((prevProduct) => ({
                ...prevProduct!,
                price: numericValue,
            }));
        } else {
            setEditingProduct((prevProduct) => ({
                ...prevProduct!,
                price: 0,
            }));
        }
    };

    const handleEditProduct = () => {
        if (editingProduct) {
            // Validate required fields
            setProducts((prevProducts) =>
                prevProducts.map((prod) =>
                    prod.id === editingProduct.id ? editingProduct : prod
                )
            );

            console.log(editingProduct.type.id);

            // Send FormData using router.put
            router.put(
                `/products/${editingProduct.id}`,
                {
                    product_code: editingProduct.product_code,
                    name: editingProduct.name,
                    description: editingProduct.description,
                    type_id: editingProduct.type_id,
                    price: editingProduct.price,
                    category_id: editingProduct.category_id,
                    brand_id: editingProduct.brand_id,
                },
                {
                    onSuccess: () => {
                        setEditingProduct(null);
                        setIsEditDialogOpen(false);
                        router.reload({ only: ["products"] });
                        toast({
                            title: "Product updated",
                            description:
                                "Product has been updated successfully.",
                        });
                    },
                    onError: (errors) => {
                        toast({
                            title: "Error",
                            description: "Failed to update product.",
                        });
                    },
                }
            );
        }
    };

    const filteredTypes = initialTypes.filter(
        (type) => type.category_id === selectedCategoryId
    );

    return (
        <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
            <DialogTrigger asChild>
                <Button
                    variant="ghost"
                    size="icon"
                    onClick={() =>
                        setEditingProduct({
                            ...product,
                            product_code: product.product_code,
                            price: product.price || 0,
                            type_id: product.type.id || 0,
                            category_id: product.category?.id || 0,
                            brand_id: product.brand?.id || 0,
                        })
                    }
                >
                    <Pencil className="h-4 w-4" />
                    <span className="sr-only">Edit {product.name}</span>
                </Button>
            </DialogTrigger>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Edit Product</DialogTitle>
                    <DialogDescription>
                        Make changes to the product details.
                    </DialogDescription>
                </DialogHeader>
                {editingProduct && (
                    <div className="grid gap-4 py-4">
                        {/* Product Code */}
                        <div className="grid grid-cols-4 items-center gap-4">
                            <Label
                                htmlFor="edit-product_code"
                                className="text-right"
                            >
                                Product Code
                            </Label>
                            <Input
                                id="edit-product_code"
                                value={editingProduct.product_code}
                                onChange={(e) =>
                                    setEditingProduct({
                                        ...editingProduct,
                                        product_code: e.target.value,
                                    })
                                }
                                className="col-span-3"
                                required
                            />
                        </div>
                        {/* Name */}
                        <div className="grid grid-cols-4 items-center gap-4">
                            <Label htmlFor="edit-name" className="text-right">
                                Name
                            </Label>
                            <Input
                                id="edit-name"
                                value={editingProduct.name}
                                onChange={(e) =>
                                    setEditingProduct({
                                        ...editingProduct,
                                        name: e.target.value,
                                    })
                                }
                                className="col-span-3"
                                required
                            />
                        </div>

                        {/* Description */}
                        <div className="grid grid-cols-4 items-center gap-4">
                            <Label
                                htmlFor="edit-description"
                                className="text-right"
                            >
                                Description
                            </Label>
                            <Textarea
                                id="edit-description"
                                value={editingProduct.description || ""}
                                onChange={(e) =>
                                    setEditingProduct({
                                        ...editingProduct,
                                        description: e.target.value,
                                    })
                                }
                                className="col-span-3"
                            />
                        </div>

                        {/* Category */}
                        <div className="grid grid-cols-4 items-center gap-4">
                            <Label
                                htmlFor="edit-category"
                                className="text-right"
                            >
                                Category
                            </Label>
                            <div className="col-span-3">
                                <Combobox
                                    className="w-full"
                                    items={initialCategories.map(
                                        (category) => ({
                                            value: category.id.toString(),
                                            label: category.name,
                                        })
                                    )}
                                    placeholder="Select a category"
                                    onSelect={(value) =>
                                        setSelectedCategoryId(parseInt(value))
                                    }
                                />
                            </div>
                        </div>

                        {/* Type */}
                        <div className="grid grid-cols-4 items-center gap-4">
                            <Label htmlFor="edit-type" className="text-right">
                                Type
                            </Label>
                            <div className="col-span-3">
                                <Combobox
                                    className="w-full"
                                    items={filteredTypes.map((type) => ({
                                        value: type.id.toString(),
                                        label: type.name,
                                    }))}
                                    placeholder="Select a type"
                                    onSelect={(value) =>
                                        setEditingProduct({
                                            ...editingProduct,
                                            type_id: parseInt(value),
                                        })
                                    }
                                />
                            </div>
                        </div>

                        {/* Brand */}
                        <div className="grid grid-cols-4 items-center gap-4">
                            <Label htmlFor="edit-brand" className="text-right">
                                Brand
                            </Label>
                            <div className="col-span-3">
                                <Combobox
                                    className="w-full"
                                    items={initialBrands.map((brand) => ({
                                        value: brand.id.toString(),
                                        label: brand.name,
                                    }))}
                                    placeholder="Select a brand"
                                    onSelect={(value) =>
                                        setEditingProduct({
                                            ...editingProduct,
                                            brand_id: parseInt(value),
                                        })
                                    }
                                />
                            </div>
                        </div>

                        {/* Price */}
                        <div className="grid grid-cols-4 items-center gap-4">
                            <Label htmlFor="edit-price" className="text-right">
                                Price
                            </Label>
                            <Input
                                id="edit-price"
                                type="text"
                                value={editDisplayPrice}
                                onChange={handleEditPriceChange}
                                onFocus={() =>
                                    setEditDisplayPrice(
                                        editingProduct.price?.toString() || ""
                                    )
                                }
                                onBlur={() =>
                                    setEditDisplayPrice(
                                        formatToIDR(editingProduct.price || 0)
                                    )
                                }
                                className="col-span-3"
                                required
                            />
                        </div>
                    </div>
                )}
                <DialogFooter>
                    <Button onClick={handleEditProduct}>Save Changes</Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
};

export default EditProductModal;
