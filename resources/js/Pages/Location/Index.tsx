import { useState, useMemo } from "react";
import { Plus, Pencil, Trash2, Eye } from "lucide-react";
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
import { Link } from "@inertiajs/react";
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
import { router } from "@inertiajs/react";
import {
    Pagination,
    PaginationContent,
    PaginationEllipsis,
    PaginationItem,
    PaginationLink,
    PaginationNext,
    PaginationPrevious,
} from "@/Components/ui/pagination";

import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import SubscriptionPage from "../SubscriptionPage";
interface Location {
    id: number;
    name: string;
    description: string;
    volume: number;
    remaining_volume: number;
    used_volume: number;
}

interface Props {
    initialLocations: Location[];
    userStatus: string;
}

export default function StorageLocationManagement({
    initialLocations,
    userStatus,
}: Props) {
    console.log(initialLocations);
    const [locations, setLocations] = useState<Location[]>(initialLocations);

    const [newLocation, setNewLocation] = useState<Omit<Location, "id">>({
        name: "",
        description: "",
        volume: 0,
        remaining_volume: 0,
        used_volume: 0,
    });
    const [editingLocation, setEditingLocation] = useState<Location | null>(
        null
    );
    const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
    const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
    const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
    const [locationToDelete, setLocationToDelete] = useState<Location | null>(
        null
    );
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 10; // Adjust this value as needed

    const paginatedLocations = useMemo(() => {
        const startIndex = (currentPage - 1) * itemsPerPage;
        const endIndex = startIndex + itemsPerPage;
        return locations.slice(startIndex, endIndex);
    }, [locations, currentPage]);

    const totalPages = Math.ceil(locations.length / itemsPerPage);

    const handlePageChange = (page: number) => {
        setCurrentPage(page);
    };

    const handleEditLocation = () => {
        if (editingLocation && editingLocation.name && editingLocation.volume) {
            setLocations(
                locations.map((loc) =>
                    loc.id === editingLocation.id ? editingLocation : loc
                )
            );
            router.put(
                `/locations/${editingLocation.id}`,
                {
                    name: editingLocation.name,
                    description: editingLocation.description,
                    volume: editingLocation.volume,
                },
                {
                    onSuccess: () => {
                        setEditingLocation(null);
                        setIsEditDialogOpen(false);
                    },
                }
            );
            setEditingLocation(null);
            setIsEditDialogOpen(false);
        }
    };

    const handleDeleteLocation = () => {
        if (locationToDelete) {
            setLocations(
                locations.filter((loc) => loc.id !== locationToDelete.id)
            );
            router.delete(`/locations/${locationToDelete.id}`, {
                onSuccess: () => {
                    setLocationToDelete(null);
                    setIsDeleteDialogOpen(false);
                },
            });
        }
    };

    return (
        <AuthenticatedLayout
            header={
                <h2 className="font-semibold text-xl text-gray-800 leading-tight">
                    Storage Location Management
                </h2>
            }
        >
            <Head title="Storage Location Management" />
            {userStatus === "inactive" ? (
                <SubscriptionPage />
            ) : (
                <div className="container mx-auto p-6">
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between">
                            <CardTitle className="text-2xl font-bold">
                                Storage Location Management
                            </CardTitle>
                            <Button
                                onClick={() => router.get("/locations/create")}
                            >
                                <Plus className="mr-2 h-4 w-4" />
                                Add Location
                            </Button>
                        </CardHeader>
                        <CardContent>
                            <Table>
                                <TableHeader>
                                    <TableRow>
                                        <TableHead>Name</TableHead>
                                        <TableHead>Description</TableHead>
                                        <TableHead>Volume</TableHead>
                                        <TableHead className="text-right">
                                            Actions
                                        </TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {paginatedLocations.map((location) => (
                                        <TableRow key={location.id}>
                                            <TableCell className="font-medium">
                                                {location.name}
                                            </TableCell>
                                            <TableCell>
                                                {location.description}
                                            </TableCell>
                                            <TableCell>
                                                {location.used_volume}/
                                                {location.volume}
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
                                                                setEditingLocation(
                                                                    location
                                                                )
                                                            }
                                                        >
                                                            <Pencil className="h-4 w-4" />
                                                            <span className="sr-only">
                                                                Edit{" "}
                                                                {location.name}
                                                            </span>
                                                        </Button>
                                                    </DialogTrigger>
                                                    <DialogContent>
                                                        <DialogHeader>
                                                            <DialogTitle>
                                                                Edit Storage
                                                                Location
                                                            </DialogTitle>
                                                            <DialogDescription>
                                                                Make changes to
                                                                the storage
                                                                location
                                                                details.
                                                            </DialogDescription>
                                                        </DialogHeader>
                                                        {editingLocation && (
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
                                                                            editingLocation.name
                                                                        }
                                                                        onChange={(
                                                                            e
                                                                        ) =>
                                                                            setEditingLocation(
                                                                                {
                                                                                    ...editingLocation,
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
                                                                        htmlFor="edit-name"
                                                                        className="text-right"
                                                                    >
                                                                        Description
                                                                    </Label>
                                                                    <Input
                                                                        id="edit-name"
                                                                        value={
                                                                            editingLocation.description
                                                                        }
                                                                        onChange={(
                                                                            e
                                                                        ) =>
                                                                            setEditingLocation(
                                                                                {
                                                                                    ...editingLocation,
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
                                                                <div className="grid grid-cols-4 items-center gap-4">
                                                                    <Label
                                                                        htmlFor="edit-volume"
                                                                        className="text-right"
                                                                    >
                                                                        Volume
                                                                    </Label>
                                                                    <Input
                                                                        id="edit-volume"
                                                                        value={
                                                                            editingLocation.volume
                                                                        }
                                                                        type="number"
                                                                        onChange={(
                                                                            e
                                                                        ) =>
                                                                            setEditingLocation(
                                                                                {
                                                                                    ...editingLocation,
                                                                                    volume: parseInt(
                                                                                        e
                                                                                            .target
                                                                                            .value
                                                                                    ),
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
                                                                    handleEditLocation
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
                                                                setLocationToDelete(
                                                                    location
                                                                )
                                                            }
                                                        >
                                                            <Trash2 className="h-4 w-4" />
                                                            <span className="sr-only">
                                                                Delete{" "}
                                                                {location.name}
                                                            </span>
                                                        </Button>
                                                    </DialogTrigger>
                                                    <DialogContent>
                                                        <DialogHeader>
                                                            <DialogTitle>
                                                                Delete Storage
                                                                Location
                                                            </DialogTitle>
                                                            <DialogDescription>
                                                                Are you sure you
                                                                want to delete
                                                                this storage
                                                                location? This
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
                                                                    handleDeleteLocation
                                                                }
                                                            >
                                                                Delete
                                                            </Button>
                                                        </DialogFooter>
                                                    </DialogContent>
                                                </Dialog>
                                                <Button
                                                    asChild
                                                    variant="ghost"
                                                    size="icon"
                                                >
                                                    <Link
                                                        href={`/locations/${location.id}`}
                                                    >
                                                        <Eye className="h-4 w-4" />
                                                        <span className="sr-only">
                                                            View {location.name}
                                                        </span>
                                                    </Link>
                                                </Button>
                                            </TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                            <div className="mt-4">
                                <Pagination>
                                    <PaginationContent>
                                        <PaginationItem>
                                            <PaginationPrevious
                                                onClick={() =>
                                                    handlePageChange(
                                                        Math.max(
                                                            1,
                                                            currentPage - 1
                                                        )
                                                    )
                                                }
                                                className={
                                                    currentPage === 1
                                                        ? "pointer-events-none opacity-50"
                                                        : ""
                                                }
                                            />
                                        </PaginationItem>
                                        {Array.from(
                                            { length: totalPages },
                                            (_, i) => i + 1
                                        ).map((page) => (
                                            <PaginationItem key={page}>
                                                <PaginationLink
                                                    onClick={() =>
                                                        handlePageChange(page)
                                                    }
                                                    isActive={
                                                        currentPage === page
                                                    }
                                                >
                                                    {page}
                                                </PaginationLink>
                                            </PaginationItem>
                                        ))}
                                        <PaginationItem>
                                            <PaginationNext
                                                onClick={() =>
                                                    handlePageChange(
                                                        Math.min(
                                                            totalPages,
                                                            currentPage + 1
                                                        )
                                                    )
                                                }
                                                className={
                                                    currentPage === totalPages
                                                        ? "pointer-events-none opacity-50"
                                                        : ""
                                                }
                                            />
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
