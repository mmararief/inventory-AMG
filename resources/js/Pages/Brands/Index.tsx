import { useState } from "react";
import {
    Plus,
    Pencil,
    Trash2,
    Search,
    ChevronLeft,
    ChevronRight,
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/Components/ui/button";
import { Input } from "@/Components/ui/input";
import { Head } from "@inertiajs/react";
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
import { Label } from "@/Components/ui/label";
import { Textarea } from "@/Components/ui/textarea";
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { router } from "@inertiajs/react";
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

interface Brand {
    id: number;
    name: string;
    description: string;
}

interface Props {
    initialBrands: Brand[];
    userStatus: string;
}

export default function BrandManagement({ initialBrands, userStatus }: Props) {
    const { toast } = useToast();
    const [brands, setBrands] = useState<Brand[]>(initialBrands);
    const [newBrand, setNewBrand] = useState<Omit<Brand, "id">>({
        name: "",
        description: "",
    });
    const [editingBrand, setEditingBrand] = useState<Brand | null>(null);
    const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
    const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
    const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
    const [brandToDelete, setBrandToDelete] = useState<Brand | null>(null);
    const [searchTerm, setSearchTerm] = useState("");
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 10; // You can adjust this number as needed

    const handleEditBrand = () => {
        if (editingBrand && editingBrand.name && editingBrand.description) {
            setBrands(
                brands.map((brand) =>
                    brand.id === editingBrand.id ? editingBrand : brand
                )
            );
            router.put(
                `/brands/${editingBrand.id}`,
                {
                    name: editingBrand.name,
                    description: editingBrand.description,
                },
                {
                    onSuccess: () => {
                        setEditingBrand(null);
                        setIsEditDialogOpen(false);
                        toast({
                            title: "Brand updated successfully",
                            variant: "default",
                        });
                    },
                    onError: (errors) => {
                        console.error("Error editing brand: ", errors);
                        toast({
                            title: "Error editing brand",
                            variant: "destructive",
                        });
                    },
                }
            );
        }
    };

    const handleDeleteBrand = () => {
        if (brandToDelete) {
            setBrands(brands.filter((brand) => brand.id !== brandToDelete.id));
            router.delete(`/brands/${brandToDelete.id}`, {
                onSuccess: () => {
                    setBrandToDelete(null);
                    setIsDeleteDialogOpen(false);
                    toast({
                        title: "Brand deleted successfully",
                        variant: "default",
                    });
                },
                onError: (errors) => {
                    console.error("Error deleting brand: ", errors);
                    toast({
                        title: "Error deleting brand",
                        variant: "destructive",
                    });
                },
            });
        }
    };

    const handlePageChange = (page: number) => {
        setCurrentPage(page);
    };

    const filteredBrands = brands.filter(
        (brand) =>
            brand.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            brand.description.toLowerCase().includes(searchTerm.toLowerCase())
    );

    // Calculate pagination
    const totalPages = Math.ceil(filteredBrands.length / itemsPerPage);
    const paginatedBrands = filteredBrands.slice(
        (currentPage - 1) * itemsPerPage,
        currentPage * itemsPerPage
    );

    return (
        <AuthenticatedLayout
            header={
                <h2 className="font-semibold text-xl text-gray-800 leading-tight">
                    Brand Management
                </h2>
            }
        >
            <Head title="Brand Management" />
            {userStatus === "inactive" ? (
                <SubscriptionPage />
            ) : (
                <div className="container mx-auto p-6">
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between">
                            <CardTitle className="text-2xl font-bold">
                                Brand Management
                            </CardTitle>
                            <div className="flex items-center space-x-2">
                                <div className="relative">
                                    <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500" />
                                    <Input
                                        type="search"
                                        placeholder="Search brands..."
                                        className="pl-8 w-64"
                                        value={searchTerm}
                                        onChange={(e) =>
                                            setSearchTerm(e.target.value)
                                        }
                                    />
                                </div>
                                <Button
                                    onClick={() =>
                                        router.visit("/brands/create")
                                    }
                                >
                                    <Plus className="mr-2 h-4 w-4" />
                                    Add Brand
                                </Button>
                            </div>
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
                                    {paginatedBrands.map((brand) => (
                                        <TableRow key={brand.id}>
                                            <TableCell className="font-medium">
                                                {brand.name}
                                            </TableCell>
                                            <TableCell>
                                                {brand.description}
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
                                                                setEditingBrand(
                                                                    brand
                                                                )
                                                            }
                                                        >
                                                            <Pencil className="h-4 w-4" />
                                                            <span className="sr-only">
                                                                Edit{" "}
                                                                {brand.name}
                                                            </span>
                                                        </Button>
                                                    </DialogTrigger>
                                                    <DialogContent>
                                                        <DialogHeader>
                                                            <DialogTitle>
                                                                Edit Brand
                                                            </DialogTitle>
                                                            <DialogDescription>
                                                                Make changes to
                                                                the brand
                                                                details.
                                                            </DialogDescription>
                                                        </DialogHeader>
                                                        {editingBrand && (
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
                                                                            editingBrand.name
                                                                        }
                                                                        onChange={(
                                                                            e
                                                                        ) =>
                                                                            setEditingBrand(
                                                                                {
                                                                                    ...editingBrand,
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
                                                                    <Textarea
                                                                        id="edit-description"
                                                                        value={
                                                                            editingBrand.description
                                                                        }
                                                                        onChange={(
                                                                            e
                                                                        ) =>
                                                                            setEditingBrand(
                                                                                {
                                                                                    ...editingBrand,
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
                                                                    handleEditBrand
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
                                                                setBrandToDelete(
                                                                    brand
                                                                )
                                                            }
                                                        >
                                                            <Trash2 className="h-4 w-4" />
                                                            <span className="sr-only">
                                                                Delete{" "}
                                                                {brand.name}
                                                            </span>
                                                        </Button>
                                                    </DialogTrigger>
                                                    <DialogContent>
                                                        <DialogHeader>
                                                            <DialogTitle>
                                                                Delete Brand
                                                            </DialogTitle>
                                                            <DialogDescription>
                                                                Are you sure you
                                                                want to delete
                                                                this brand? This
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
                                                                    handleDeleteBrand
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
                            {/* Add pagination component */}
                            <div className="mt-4">
                                <Pagination>
                                    <PaginationContent>
                                        <PaginationItem>
                                            {currentPage > 1 && (
                                                <PaginationPrevious
                                                    onClick={() =>
                                                        handlePageChange(
                                                            Math.max(
                                                                1,
                                                                currentPage - 1
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
                                                            handlePageChange(
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
                                                        handlePageChange(
                                                            Math.min(
                                                                totalPages,
                                                                currentPage + 1
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
