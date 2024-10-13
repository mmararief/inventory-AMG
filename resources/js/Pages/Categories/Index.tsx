import { useState } from "react";
import { Plus, Pencil, Trash2, X } from "lucide-react";
import { Link, useForm } from "@inertiajs/react";
import { useToast } from "@/hooks/use-toast";
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
import { Head } from "@inertiajs/react";
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
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
    Pagination,
    PaginationContent,
    PaginationEllipsis,
    PaginationItem,
    PaginationLink,
    PaginationNext,
    PaginationPrevious,
} from "@/Components/ui/pagination";

import { Label } from "@/Components/ui/label";
import { router } from "@inertiajs/react";
import SubscriptionPage from "../SubscriptionPage";

interface Category {
    id: number;
    name: string;
    description: string;
}

interface Props {
    initialCategories: {
        data: Category[];
        current_page: number;
        last_page: number;
        per_page: number;
        total: number;
    };
    userStatus: string;
}

export default function CategoryManagement({
    initialCategories,
    userStatus,
}: Props) {
    const { toast } = useToast();
    const [categories, setCategories] = useState<Category[]>(
        initialCategories.data
    );
    const { data, setData } = useForm({
        name: "",
        description: "",
    });
    const [editingCategory, setEditingCategory] = useState<Category | null>(
        null
    );
    const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
    const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
    const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
    const [categoryToDelete, setCategoryToDelete] = useState<Category | null>(
        null
    );

    const handleEditCategory = () => {
        if (editingCategory && editingCategory.name) {
            setCategories(
                categories.map((cat) =>
                    cat.id === editingCategory.id ? editingCategory : cat
                )
            );
            router.put(
                `/categories/${editingCategory.id}`,
                {
                    name: editingCategory.name,
                    description: editingCategory.description,
                },
                {
                    onSuccess: () => {
                        setEditingCategory(null);
                        setIsEditDialogOpen(false);
                        toast({
                            title: "Category updated successfully",
                            variant: "default",
                        });
                    },
                    onError: (errors) => {
                        console.error("Error editing category: ", errors);
                        toast({
                            title: "Error editing category",
                            variant: "destructive",
                        });
                    },
                }
            );
        }
    };

    const handleDeleteCategory = () => {
        if (categoryToDelete) {
            setCategories(
                categories.filter((cat) => cat.id !== categoryToDelete.id)
            );
            router.delete(`/categories/${categoryToDelete.id}`, {
                onSuccess: () => {
                    setCategoryToDelete(null);
                    setIsDeleteDialogOpen(false);
                    toast({
                        title: "Category deleted successfully",
                        variant: "default",
                    });
                },
                onError: (errors) => {
                    console.error("Error deleting category: ", errors);
                    toast({
                        title: "Error deleting category",
                        variant: "destructive",
                    });
                },
            });
        }
    };

    return (
        <AuthenticatedLayout
            header={
                <h2 className="font-semibold text-xl text-gray-800 leading-tight">
                    Category Management
                </h2>
            }
        >
            <Head title="Category Management" />
            {userStatus === "inactive" ? (
                <SubscriptionPage />
            ) : (
                <div className="container mx-auto p-6">
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between">
                            <CardTitle className="text-2xl font-bold">
                                Category Management
                            </CardTitle>
                            <Dialog
                                open={isAddDialogOpen}
                                onOpenChange={setIsAddDialogOpen}
                            >
                                <Button
                                    onClick={() =>
                                        router.visit("/categories/create")
                                    }
                                >
                                    <Plus className="h-4 w-4" />
                                    Add Category
                                </Button>
                            </Dialog>
                        </CardHeader>
                        <CardContent>
                            <Table>
                                <TableHeader>
                                    <TableRow>
                                        <TableHead>Name</TableHead>
                                        <TableHead>Description</TableHead>
                                        <TableHead className="text-right">
                                            Actions
                                        </TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {categories.map((category) => (
                                        <TableRow key={category.id}>
                                            <TableCell className="font-medium">
                                                {category.name}
                                            </TableCell>
                                            <TableCell>
                                                {category.description}
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
                                                                setEditingCategory(
                                                                    category
                                                                )
                                                            }
                                                        >
                                                            <Pencil className="h-4 w-4" />
                                                            <span className="sr-only">
                                                                Edit{" "}
                                                                {category.name}
                                                            </span>
                                                        </Button>
                                                    </DialogTrigger>
                                                    <DialogContent>
                                                        <DialogHeader>
                                                            <DialogTitle>
                                                                Edit Category
                                                            </DialogTitle>
                                                            <DialogDescription>
                                                                Make changes to
                                                                the category
                                                                details.
                                                            </DialogDescription>
                                                        </DialogHeader>
                                                        {editingCategory && (
                                                            <div className="grid gap-4 py-4">
                                                                <div className="grid grid-cols-4 items-center gap-4">
                                                                    <Label
                                                                        htmlFor="edit-name"
                                                                        className="text-right"
                                                                    >
                                                                        Name
                                                                    </Label>
                                                                    <Input
                                                                        id="edit-name"
                                                                        value={
                                                                            editingCategory.name
                                                                        }
                                                                        onChange={(
                                                                            e
                                                                        ) =>
                                                                            setEditingCategory(
                                                                                {
                                                                                    ...editingCategory,
                                                                                    name: e
                                                                                        .target
                                                                                        .value,
                                                                                }
                                                                            )
                                                                        }
                                                                        className="col-span-3"
                                                                    />
                                                                </div>
                                                                <div className="grid grid-cols-4 items-center gap-4">
                                                                    <Label
                                                                        htmlFor="edit-description"
                                                                        className="text-right"
                                                                    >
                                                                        Description
                                                                    </Label>
                                                                    <Input
                                                                        id="edit-description"
                                                                        value={
                                                                            editingCategory.description
                                                                        }
                                                                        onChange={(
                                                                            e
                                                                        ) =>
                                                                            setEditingCategory(
                                                                                {
                                                                                    ...editingCategory,
                                                                                    description:
                                                                                        e
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
                                                                    handleEditCategory
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
                                                                setCategoryToDelete(
                                                                    category
                                                                )
                                                            }
                                                        >
                                                            <Trash2 className="h-4 w-4" />
                                                            <span className="sr-only">
                                                                Delete{" "}
                                                                {category.name}
                                                            </span>
                                                        </Button>
                                                    </DialogTrigger>
                                                    <DialogContent>
                                                        <DialogHeader>
                                                            <DialogTitle>
                                                                Delete Category
                                                            </DialogTitle>
                                                            <DialogDescription>
                                                                Are you sure you
                                                                want to delete
                                                                this category?
                                                                This action
                                                                cannot be
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
                                                                    handleDeleteCategory
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
                                        {initialCategories.current_page > 1 && (
                                            <PaginationItem>
                                                <PaginationPrevious
                                                    href={`/categories?page=${
                                                        initialCategories.current_page -
                                                        1
                                                    }`}
                                                />
                                            </PaginationItem>
                                        )}
                                        {Array.from(
                                            {
                                                length: initialCategories.last_page,
                                            },
                                            (_, i) => i + 1
                                        ).map((page) => (
                                            <PaginationItem key={page}>
                                                <PaginationLink
                                                    href={`/categories?page=${page}`}
                                                    isActive={
                                                        page ===
                                                        initialCategories.current_page
                                                    }
                                                >
                                                    {page}
                                                </PaginationLink>
                                            </PaginationItem>
                                        ))}
                                        {initialCategories.current_page <
                                            initialCategories.last_page && (
                                            <PaginationItem>
                                                <PaginationNext
                                                    href={`/categories?page=${
                                                        initialCategories.current_page +
                                                        1
                                                    }`}
                                                />
                                            </PaginationItem>
                                        )}
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
