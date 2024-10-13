import { useEffect, useState } from "react";
import { Plus, Pencil, Trash2, Search, ChevronDown } from "lucide-react";
import AddProductModal from "@/Components/product/AddProduct";
import EditProductModal from "@/Components/product/EditProduct";
import { Button } from "@/Components/ui/button";
import { Input } from "@/Components/ui/input";
import { Head } from "@inertiajs/react";
import { Product, Category, Brand, Type } from "@/types/types";
import { cn } from "@/lib/utils";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/Components/ui/table";
import { Card, CardContent, CardHeader, CardTitle } from "@/Components/ui/card";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/Components/ui/dialog";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/Components/ui/select";
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";

import { router } from "@inertiajs/react";

import { formatToIDR } from "@/lib/rupiahFormat";
import SubscriptionPage from "../SubscriptionPage";

import {
    Pagination,
    PaginationContent,
    PaginationEllipsis,
    PaginationItem,
    PaginationLink,
    PaginationNext,
    PaginationPrevious,
} from "@/Components/ui/pagination";

interface Props {
    initialProducts: {
        data: Product[];
        current_page: number;
        last_page: number;
        per_page: number;
        total: number;
    };
    initialCategories: Category[];
    initialBrands: Brand[];
    initialTypes: Type[];
    userStatus: string;
    filters: {
        search?: string;
        category?: string;
    };
}

export default function ProductManagement({
    initialProducts,
    initialCategories,
    initialBrands,
    initialTypes,
    userStatus,
    filters,
}: Props) {
    const [products, setProducts] = useState<Product[]>([]);
    const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);

    const [productToDelete, setProductToDelete] = useState<Product | null>(
        null
    );

    const [searchTerm, setSearchTerm] = useState(filters.search || "");
    const [selectedCategory, setSelectedCategory] = useState(
        filters.category || "all"
    );

    const handleSearch = (value: string) => {
        setSearchTerm(value);
        applyFilters({ search: value });
    };

    const handleCategoryChange = (value: string) => {
        setSelectedCategory(value);
        applyFilters({ category: value });
    };

    const applyFilters = (newFilters: Partial<typeof filters>) => {
        const updatedFilters = { ...filters, ...newFilters };
        if (updatedFilters.search === "") {
            delete updatedFilters.search;
        }

        router.visit("/products", {
            data: updatedFilters,
            preserveState: true,
        });
    };

    const handlePageChange = (page: number) => {
        router.get(route("product.index"), {
            ...filters,
            page,
            preserveState: true,
        });
    };

    const handleDeleteProduct = () => {
        setIsDeleteDialogOpen(false);
        if (productToDelete) {
            router.delete(`/products/${productToDelete.id}`, {
                preserveState: true,
            });
        }
    };

    console.log(initialProducts);

    return (
        <AuthenticatedLayout>
            <Head title="Product Management" />
            {userStatus === "inactive" ? (
                <SubscriptionPage />
            ) : (
                <div className="container mx-auto p-6">
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between">
                            <CardTitle className="text-2xl font-bold">
                                Product Management
                            </CardTitle>
                            <div className="flex items-center space-x-2">
                                <Select
                                    value={selectedCategory}
                                    onValueChange={(value) =>
                                        handleCategoryChange(value)
                                    }
                                >
                                    <SelectTrigger>
                                        <SelectValue placeholder="Select a category" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="all">
                                            All Categories
                                        </SelectItem>
                                        {initialCategories.map((category) => (
                                            <SelectItem
                                                key={category.id}
                                                value={category.id.toString()}
                                            >
                                                {category.name}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                                <div className="relative">
                                    <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500" />
                                    <Input
                                        type="search"
                                        placeholder="Search products..."
                                        className="pl-8 w-64"
                                        value={searchTerm}
                                        onChange={(e) =>
                                            handleSearch(e.target.value)
                                        }
                                    />
                                </div>
                                <AddProductModal
                                    initialCategories={initialCategories}
                                    initialBrands={initialBrands}
                                    initialTypes={initialTypes}
                                />
                            </div>
                        </CardHeader>
                        <CardContent>
                            <Table>
                                <TableHeader>
                                    <TableRow>
                                        <TableHead>Product Code</TableHead>
                                        <TableHead>Name</TableHead>
                                        <TableHead>Type</TableHead>
                                        <TableHead>Category</TableHead>
                                        <TableHead>brand</TableHead>
                                        <TableHead>Price</TableHead>

                                        <TableHead className="text-right">
                                            Actions
                                        </TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {initialProducts.data.map((product) => (
                                        <TableRow key={product.id}>
                                            <TableCell className="font-medium">
                                                {product.product_code}
                                            </TableCell>
                                            <TableCell className="font-medium">
                                                {product.name}
                                            </TableCell>
                                            <TableCell className="font-medium">
                                                {product.type?.name ||
                                                    "No Type"}
                                            </TableCell>
                                            <TableCell>
                                                {product.category?.name ||
                                                    "No Category"}
                                            </TableCell>
                                            <TableCell>
                                                {product.brand?.name ||
                                                    "No brand"}
                                            </TableCell>
                                            <TableCell>
                                                {formatToIDR(product.price)}
                                            </TableCell>

                                            <TableCell className="text-right">
                                                {/* Edit Product */}
                                                <EditProductModal
                                                    initialCategories={
                                                        initialCategories
                                                    }
                                                    initialBrands={
                                                        initialBrands
                                                    }
                                                    product={product}
                                                    setProducts={setProducts}
                                                    initialTypes={initialTypes}
                                                />

                                                <Dialog
                                                    open={isDeleteDialogOpen}
                                                    onOpenChange={
                                                        setIsDeleteDialogOpen
                                                    }
                                                >
                                                    <DialogTrigger asChild>
                                                        <Button
                                                            variant="ghost"
                                                            size="icon"
                                                            onClick={() =>
                                                                setProductToDelete(
                                                                    product
                                                                )
                                                            }
                                                        >
                                                            <Trash2 className="h-4 w-4" />
                                                            <span className="sr-only">
                                                                Delete{" "}
                                                                {product.name}
                                                            </span>
                                                        </Button>
                                                    </DialogTrigger>
                                                    <DialogContent>
                                                        <DialogHeader>
                                                            <DialogTitle>
                                                                Delete Product
                                                            </DialogTitle>
                                                            <DialogDescription>
                                                                Are you sure you
                                                                want to delete
                                                                this product?
                                                                This action
                                                                cannot be
                                                                undone.
                                                            </DialogDescription>
                                                        </DialogHeader>
                                                        <DialogFooter className="flex justify-between items-center">
                                                            <Button
                                                                variant="outline"
                                                                onClick={() =>
                                                                    setIsDeleteDialogOpen(
                                                                        false
                                                                    )
                                                                }
                                                            >
                                                                Cancel
                                                            </Button>
                                                            <div className="flex space-x-2">
                                                                <Button
                                                                    variant="destructive"
                                                                    onClick={
                                                                        handleDeleteProduct
                                                                    }
                                                                >
                                                                    Delete
                                                                </Button>
                                                            </div>
                                                        </DialogFooter>
                                                    </DialogContent>
                                                </Dialog>
                                            </TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                            <div className="mt-4">
                                <Pagination>
                                    <PaginationContent>
                                        <PaginationItem>
                                            {initialProducts.current_page >
                                                1 && (
                                                <PaginationPrevious
                                                    onClick={() =>
                                                        handlePageChange(
                                                            initialProducts.current_page -
                                                                1
                                                        )
                                                    }
                                                />
                                            )}
                                        </PaginationItem>
                                        {[
                                            ...Array(initialProducts.last_page),
                                        ].map((_, index) => (
                                            <PaginationItem key={index}>
                                                <PaginationLink
                                                    onClick={() =>
                                                        handlePageChange(
                                                            index + 1
                                                        )
                                                    }
                                                    isActive={
                                                        initialProducts.current_page ===
                                                        index + 1
                                                    }
                                                >
                                                    {index + 1}
                                                </PaginationLink>
                                            </PaginationItem>
                                        ))}
                                        <PaginationItem>
                                            {initialProducts.current_page <
                                                initialProducts.last_page && (
                                                <PaginationNext
                                                    onClick={() =>
                                                        handlePageChange(
                                                            initialProducts.current_page +
                                                                1
                                                        )
                                                    }
                                                />
                                            )}
                                        </PaginationItem>
                                    </PaginationContent>
                                </Pagination>
                            </div>
                        </CardContent>
                    </Card>
                </div>
            )}
        </AuthenticatedLayout>
    );
}
