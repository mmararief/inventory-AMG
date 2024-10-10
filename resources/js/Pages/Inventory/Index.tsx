import { useState } from "react";
import { Head } from "@inertiajs/react";
import { Plus, Pencil, Trash2, Search, Filter } from "lucide-react";
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { Button } from "@/Components/ui/button";
import { Input } from "@/Components/ui/input";
import DeleteInventory from "./Delete";
import { StockInInventory } from "./StockIn";
import { StockOutInventory } from "./StockOut";
import { MoveStockInventory } from "./MoveStock";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/Components/ui/table";
import { Card, CardContent, CardHeader, CardTitle } from "@/Components/ui/card";

import { Inventory, Category, Location } from "@/types/types";
import { formatToIDR } from "@/lib/rupiahFormat";

import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/Components/ui/select";
import { UpdateInventory } from "./Update";
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/Components/ui/popover";

import { Link } from "@inertiajs/react";
import SubscriptionPage from "../SubscriptionPage";

// Add these new imports
import {
    Pagination,
    PaginationContent,
    PaginationEllipsis,
    PaginationItem,
    PaginationLink,
    PaginationNext,
    PaginationPrevious,
} from "@/Components/ui/pagination";
import { router } from "@inertiajs/react";
// Update the props type
interface Props {
    inventories: {
        data: Inventory[];
        current_page: number;
        last_page: number;
        per_page: number;
        total: number;
    };
    categories: Category[];
    locations: Location[];
    userStatus: string;
    filters: {
        search?: string;
        category?: string;
        location?: string;
    };
}

export default function InventoryManagement({
    inventories,
    categories,
    locations,
    userStatus,
    filters,
}: Props) {
    const [inventory, setInventory] = useState<Inventory[]>([]);
    const [searchTerm, setSearchTerm] = useState(filters.search || "");
    const [categoryFilter, setCategoryFilter] = useState(
        filters.category || "all"
    );
    const [locationFilter, setLocationFilter] = useState(
        filters.location || "all"
    );

    const handleSearch = (value: string) => {
        setSearchTerm(value);
        applyFilters({ search: value });
    };

    const handleCategoryFilter = (value: string) => {
        setCategoryFilter(value);
        applyFilters({ category: value });
    };

    const handleLocationFilter = (value: string) => {
        setLocationFilter(value);
        applyFilters({ location: value });
    };

    const applyFilters = (newFilters: Partial<typeof filters>) => {
        const updatedFilters = { ...filters, ...newFilters };
        if (updatedFilters.search === "") {
            delete updatedFilters.search;
        }
        router.visit("/inventory", {
            data: updatedFilters,
            preserveState: true,
        });
    };

    const handlePageChange = (page: number) => {
        router.get(route("inventory.index"), {
            ...filters,
            page,
            preserveState: true,
        });
    };

    return (
        <AuthenticatedLayout>
            <Head title="Inventory Management" />
            {userStatus === "inactive" ? (
                <SubscriptionPage />
            ) : (
                <div className="container mx-auto p-6">
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between">
                            <CardTitle className="text-2xl font-bold">
                                Inventory Management
                            </CardTitle>
                            <div className="flex items-center space-x-2">
                                <div className="relative">
                                    <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500" />
                                    <Input
                                        type="search"
                                        placeholder="Search inventory..."
                                        className="pl-8 w-64"
                                        value={searchTerm}
                                        onChange={(e) =>
                                            handleSearch(e.target.value)
                                        }
                                    />
                                </div>
                                <Popover>
                                    <PopoverTrigger asChild>
                                        <Button variant="outline">
                                            <Filter className="mr-2 h-4 w-4" />
                                            Filters
                                        </Button>
                                    </PopoverTrigger>
                                    <PopoverContent className="w-80">
                                        <div className="grid gap-4">
                                            <div className="space-y-2">
                                                <h4 className="font-medium leading-none">
                                                    Category
                                                </h4>
                                                <Select
                                                    value={categoryFilter}
                                                    onValueChange={
                                                        handleCategoryFilter
                                                    }
                                                >
                                                    <SelectTrigger>
                                                        <SelectValue placeholder="Select a category" />
                                                    </SelectTrigger>
                                                    <SelectContent>
                                                        <SelectItem value="all">
                                                            All Categories
                                                        </SelectItem>
                                                        {categories.map(
                                                            (category) => (
                                                                <SelectItem
                                                                    key={
                                                                        category.id
                                                                    }
                                                                    value={
                                                                        category.name
                                                                    }
                                                                >
                                                                    {
                                                                        category.name
                                                                    }
                                                                </SelectItem>
                                                            )
                                                        )}
                                                    </SelectContent>
                                                </Select>
                                            </div>
                                            <div className="space-y-2">
                                                <h4 className="font-medium leading-none">
                                                    Location
                                                </h4>
                                                <Select
                                                    value={locationFilter}
                                                    onValueChange={
                                                        handleLocationFilter
                                                    }
                                                >
                                                    <SelectTrigger>
                                                        <SelectValue placeholder="Select a location" />
                                                    </SelectTrigger>
                                                    <SelectContent>
                                                        <SelectItem value="all">
                                                            All Locations
                                                        </SelectItem>
                                                        {locations.map(
                                                            (location) => (
                                                                <SelectItem
                                                                    key={
                                                                        location.id
                                                                    }
                                                                    value={
                                                                        location.name
                                                                    }
                                                                >
                                                                    {
                                                                        location.name
                                                                    }
                                                                </SelectItem>
                                                            )
                                                        )}
                                                    </SelectContent>
                                                </Select>
                                            </div>
                                        </div>
                                    </PopoverContent>
                                </Popover>
                                <Button asChild>
                                    <Link href="/inventory/create">
                                        <Plus className="mr-2 h-4 w-4" />
                                        Add Inventory
                                    </Link>
                                </Button>
                            </div>
                        </CardHeader>
                        <CardContent>
                            <Table>
                                <TableHeader>
                                    <TableRow>
                                        <TableHead>Product Code</TableHead>
                                        <TableHead>Name</TableHead>
                                        <TableHead>Type</TableHead>
                                        <TableHead>Brand</TableHead>
                                        <TableHead>Location</TableHead>
                                        <TableHead>Quantity</TableHead>
                                        <TableHead>Price</TableHead>

                                        <TableHead className="text-right">
                                            Actions
                                        </TableHead>
                                    </TableRow>
                                </TableHeader>

                                <TableBody>
                                    {inventories.data.map((item) => (
                                        <TableRow key={item.id}>
                                            <TableCell>
                                                {item.product.product_code}
                                            </TableCell>
                                            <TableCell className="font-medium">
                                                {item.product.name}
                                            </TableCell>
                                            <TableCell>
                                                {item.product.type.name}
                                            </TableCell>
                                            <TableCell>
                                                {item.product.brand.name}
                                            </TableCell>
                                            <TableCell>
                                                {item.location.name}
                                            </TableCell>
                                            <TableCell>
                                                {item.quantity}
                                            </TableCell>
                                            <TableCell>
                                                {formatToIDR(
                                                    item.product.price
                                                )}
                                            </TableCell>

                                            <TableCell className="text-right">
                                                <UpdateInventory
                                                    item={item}
                                                    locations={locations}
                                                    setInventory={setInventory}
                                                />
                                                {/* Delete Dialog */}
                                                <DeleteInventory
                                                    item={item}
                                                    setInventory={setInventory}
                                                    inventory={inventory}
                                                />
                                                <StockInInventory
                                                    item={item}
                                                    locations={locations}
                                                    setInventory={setInventory}
                                                />
                                                <StockOutInventory
                                                    item={item}
                                                    locations={locations}
                                                    setInventory={setInventory}
                                                />
                                                <MoveStockInventory
                                                    item={item}
                                                    locations={locations}
                                                    setInventory={setInventory}
                                                />
                                            </TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                            {/* Update pagination component */}
                            <div className="mt-4">
                                <Pagination>
                                    <PaginationContent>
                                        <PaginationItem>
                                            {inventories.current_page > 1 && (
                                                <PaginationPrevious
                                                    onClick={() =>
                                                        handlePageChange(
                                                            inventories.current_page -
                                                                1
                                                        )
                                                    }
                                                />
                                            )}
                                        </PaginationItem>
                                        {[...Array(inventories.last_page)].map(
                                            (_, index) => (
                                                <PaginationItem key={index}>
                                                    <PaginationLink
                                                        onClick={() =>
                                                            handlePageChange(
                                                                index + 1
                                                            )
                                                        }
                                                        isActive={
                                                            inventories.current_page ===
                                                            index + 1
                                                        }
                                                    >
                                                        {index + 1}
                                                    </PaginationLink>
                                                </PaginationItem>
                                            )
                                        )}
                                        <PaginationItem>
                                            {inventories.current_page <
                                                inventories.last_page && (
                                                <PaginationNext
                                                    onClick={() =>
                                                        handlePageChange(
                                                            inventories.current_page +
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
