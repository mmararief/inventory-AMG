import { useState } from "react";
import { Plus, Pencil, Trash2, Search, Filter } from "lucide-react";
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { Button } from "@/Components/ui/button";
import { Input } from "@/Components/ui/input";
import { Head, router } from "@inertiajs/react";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/Components/ui/table";
import { Combobox } from "@/Components/ui/Combobox";
import { Card, CardContent, CardHeader, CardTitle } from "@/Components/ui/card";
import SubscriptionPage from "../SubscriptionPage";
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
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/Components/ui/select";
import { useToast } from "@/hooks/use-toast";
import {
    Pagination,
    PaginationContent,
    PaginationEllipsis,
    PaginationItem,
    PaginationLink,
    PaginationNext,
    PaginationPrevious,
} from "@/Components/ui/pagination";

interface ProductType {
    id: number;
    name: string;

    category: Category;
}

interface Category {
    id: number;
    name: string;
}

export default function TypeManagement({
    initialTypes,
    userStatus,
    categories,
}: {
    initialTypes: ProductType[];
    categories: Category[];
    userStatus: string;
}) {
    const { toast } = useToast();
    const [types, setTypes] = useState<ProductType[]>(initialTypes);
    const [newType, setNewType] = useState<Omit<ProductType, "id">>({
        name: "",

        category: {
            id: 0,
            name: "",
        },
    });
    const [editingType, setEditingType] = useState<ProductType | null>(null);
    const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
    const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
    const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
    const [typeToDelete, setTypeToDelete] = useState<ProductType | null>(null);
    const [searchTerm, setSearchTerm] = useState("");
    const [categoryFilter, setCategoryFilter] = useState<number | "">("");
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 10; // You can adjust this value

    const handleAddType = () => {
        if (newType.name && newType.category.id) {
            router.post("/types", {
                name: newType.name,
                category_id: newType.category.id,
            });

            setTypes([...types, { id: Date.now(), ...newType }]);
            setNewType({
                name: "",
                category: { id: 0, name: "" },
            });
            setIsAddDialogOpen(false);
            toast({
                title: "Type Added",
                description: "New product type has been added successfully.",
            });
        }
    };

    const handleEditType = () => {
        if (editingType && editingType.name && editingType.category.id) {
            setTypes(
                types.map((type) =>
                    type.id === editingType.id ? editingType : type
                )
            );
            router.put(`/types/${editingType.id}`, {
                name: editingType.name,
                category_id: editingType.category.id,
            });
            setEditingType(null);
            setIsEditDialogOpen(false);
            toast({
                title: "Type Updated",
                description: "Product type has been updated successfully.",
            });
        }
    };

    const handleDeleteType = () => {
        if (typeToDelete) {
            router.delete(`/types/${typeToDelete.id}`);
            setTypes(types.filter((type) => type.id !== typeToDelete.id));
            setTypeToDelete(null);
            setIsDeleteDialogOpen(false);
            toast({
                title: "Type Deleted",
                description: "Product type has been deleted successfully.",
                variant: "destructive",
            });
        }
    };

    const filteredTypes = types.filter(
        (type) =>
            type.name.toLowerCase().includes(searchTerm.toLowerCase()) &&
            (categoryFilter === "" || type.category.id === categoryFilter)
    );

    const totalPages = Math.ceil(filteredTypes.length / itemsPerPage);
    const paginatedTypes = filteredTypes.slice(
        (currentPage - 1) * itemsPerPage,
        currentPage * itemsPerPage
    );

    return (
        <AuthenticatedLayout>
            <Head title="Type Management" />
            {userStatus === "inactive" ? (
                <SubscriptionPage />
            ) : (
                <div className="container mx-auto p-6">
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between">
                            <CardTitle className="text-2xl font-bold">
                                Type Management
                            </CardTitle>
                            <div className="flex items-center space-x-2">
                                <div className="relative">
                                    <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500" />
                                    <Input
                                        type="search"
                                        placeholder="Search types..."
                                        className="pl-8 w-64"
                                        value={searchTerm}
                                        onChange={(e) =>
                                            setSearchTerm(e.target.value)
                                        }
                                    />
                                </div>
                                <Select
                                    value={categoryFilter.toString()}
                                    onValueChange={(value) =>
                                        setCategoryFilter(
                                            value === "all"
                                                ? ""
                                                : parseInt(value)
                                        )
                                    }
                                >
                                    <SelectTrigger className="w-[180px]">
                                        <SelectValue placeholder="Filter by Category" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="all">
                                            All Categories
                                        </SelectItem>
                                        {categories.map((category) => (
                                            <SelectItem
                                                key={category.id}
                                                value={category.id.toString()}
                                            >
                                                {category.name}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>

                                <Button
                                    onClick={() =>
                                        router.visit("/types/create")
                                    }
                                >
                                    <Plus className="mr-2 h-4 w-4" />
                                    Add Type
                                </Button>
                            </div>
                        </CardHeader>
                        <CardContent>
                            <Table>
                                <TableHeader>
                                    <TableRow>
                                        <TableHead>Type Name</TableHead>
                                        <TableHead>Category</TableHead>
                                        <TableHead className="text-right">
                                            Actions
                                        </TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {paginatedTypes.map((type) => (
                                        <TableRow key={type.id}>
                                            <TableCell className="font-medium">
                                                {type.name}
                                            </TableCell>
                                            <TableCell>
                                                {type.category.name}
                                            </TableCell>
                                            <TableCell className="text-right">
                                                <Dialog
                                                    open={isEditDialogOpen}
                                                    onOpenChange={
                                                        setIsEditDialogOpen
                                                    }
                                                >
                                                    <DialogTrigger asChild>
                                                        <Button
                                                            variant="ghost"
                                                            size="icon"
                                                            onClick={() =>
                                                                setEditingType(
                                                                    type
                                                                )
                                                            }
                                                        >
                                                            <Pencil className="h-4 w-4" />
                                                            <span className="sr-only">
                                                                Edit {type.name}
                                                            </span>
                                                        </Button>
                                                    </DialogTrigger>
                                                    <DialogContent>
                                                        <DialogHeader>
                                                            <DialogTitle>
                                                                Edit Product
                                                                Type
                                                            </DialogTitle>
                                                            <DialogDescription>
                                                                Make changes to
                                                                the product type
                                                                details.
                                                            </DialogDescription>
                                                        </DialogHeader>
                                                        {editingType && (
                                                            <div className="grid gap-4 py-4">
                                                                <div className="grid grid-cols-4 items-center gap-4">
                                                                    <Label
                                                                        htmlFor="edit-category"
                                                                        className="text-right"
                                                                    >
                                                                        Category
                                                                    </Label>
                                                                    <div className="col-span-3 w-full">
                                                                        <Combobox
                                                                            className="w-full"
                                                                            items={categories.map(
                                                                                (
                                                                                    category
                                                                                ) => ({
                                                                                    value: category.id.toString(),
                                                                                    label: category.name,
                                                                                })
                                                                            )}
                                                                            placeholder="Select a category"
                                                                            onSelect={(
                                                                                value
                                                                            ) =>
                                                                                setEditingType(
                                                                                    {
                                                                                        ...editingType,
                                                                                        category:
                                                                                            {
                                                                                                id: parseInt(
                                                                                                    value
                                                                                                ),
                                                                                                name: "",
                                                                                            },
                                                                                    }
                                                                                )
                                                                            }
                                                                        />
                                                                    </div>
                                                                </div>
                                                                <div className="grid grid-cols-4 items-center gap-4">
                                                                    <Label
                                                                        htmlFor="edit-name"
                                                                        className="text-right"
                                                                    >
                                                                        Type
                                                                        Name
                                                                    </Label>
                                                                    <Input
                                                                        id="edit-name"
                                                                        value={
                                                                            editingType.name
                                                                        }
                                                                        onChange={(
                                                                            e
                                                                        ) =>
                                                                            setEditingType(
                                                                                {
                                                                                    ...editingType,
                                                                                    name: e
                                                                                        .target
                                                                                        .value,
                                                                                }
                                                                            )
                                                                        }
                                                                        className="col-span-3"
                                                                    />
                                                                </div>
                                                            </div>
                                                        )}
                                                        <DialogFooter>
                                                            <Button
                                                                onClick={
                                                                    handleEditType
                                                                }
                                                            >
                                                                Save Changes
                                                            </Button>
                                                        </DialogFooter>
                                                    </DialogContent>
                                                </Dialog>
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
                                                                setTypeToDelete(
                                                                    type
                                                                )
                                                            }
                                                        >
                                                            <Trash2 className="h-4 w-4" />
                                                            <span className="sr-only">
                                                                Delete{" "}
                                                                {type.name}
                                                            </span>
                                                        </Button>
                                                    </DialogTrigger>
                                                    <DialogContent>
                                                        <DialogHeader>
                                                            <DialogTitle>
                                                                Delete Product
                                                                Type
                                                            </DialogTitle>
                                                            <DialogDescription>
                                                                Are you sure you
                                                                want to delete
                                                                this product
                                                                type? This
                                                                action cannot be
                                                                undone.
                                                            </DialogDescription>
                                                        </DialogHeader>
                                                        <DialogFooter>
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
                                                            <Button
                                                                variant="destructive"
                                                                onClick={
                                                                    handleDeleteType
                                                                }
                                                            >
                                                                Delete
                                                            </Button>
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
                                            {currentPage > 1 && (
                                                <PaginationPrevious
                                                    onClick={() =>
                                                        setCurrentPage((prev) =>
                                                            Math.max(
                                                                prev - 1,
                                                                1
                                                            )
                                                        )
                                                    }
                                                />
                                            )}
                                        </PaginationItem>
                                        {[...Array(totalPages)].map(
                                            (_, index) => (
                                                <PaginationItem key={index}>
                                                    <PaginationLink
                                                        onClick={() =>
                                                            setCurrentPage(
                                                                index + 1
                                                            )
                                                        }
                                                        isActive={
                                                            currentPage ===
                                                            index + 1
                                                        }
                                                    >
                                                        {index + 1}
                                                    </PaginationLink>
                                                </PaginationItem>
                                            )
                                        )}
                                        <PaginationItem>
                                            {currentPage < totalPages && (
                                                <PaginationNext
                                                    onClick={() =>
                                                        setCurrentPage((prev) =>
                                                            Math.min(
                                                                prev + 1,
                                                                totalPages
                                                            )
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
