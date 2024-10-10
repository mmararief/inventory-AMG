import { useState, useEffect } from "react";
import {
    Search,
    ArrowUpCircle,
    ArrowDownCircle,
    ArrowLeftRight,
    CalendarIcon,
} from "lucide-react";
import { Head } from "@inertiajs/react";
import { Input } from "@/Components/ui/input";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/Components/ui/table";
import { Card, CardContent, CardHeader, CardTitle } from "@/Components/ui/card";
import { Badge } from "@/Components/ui/badge";
import { Button } from "@/Components/ui/button";
import { Calendar } from "@/Components/ui/calendar";
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/Components/ui/popover";
import { DateRange } from "react-day-picker";
import { format } from "date-fns";
import { router } from "@inertiajs/react";

interface StockMovement {
    id: number;
    productId: number;
    fromLocationId: number;
    toLocationId: number;
    quantity: number;
    type: "in" | "out" | "move";
    created_at: string;
    product: Product;
    to_location: Location;
    from_location: Location;
}

interface PaginationData<T> {
    data: T[];
    current_page: number;
    last_page: number;
    total: number;
    per_page: number;
}

import SubscriptionPage from "@/Pages/SubscriptionPage";

interface Props {
    initialStockMovements: PaginationData<StockMovement>;
    filters: {
        start_date: string | null;
        end_date: string | null;
    };
    userStatus: string;
}

interface Product {
    id: number;
    name: string;
}
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";

interface Location {
    id: number;
    name: string;
}

import {
    Pagination,
    PaginationContent,
    PaginationItem,
    PaginationLink,
    PaginationNext,
    PaginationPrevious,
} from "@/Components/ui/pagination";

export default function StockMovements({
    initialStockMovements,
    filters,
    userStatus,
}: Props) {
    const [currentPage, setCurrentPage] = useState(
        initialStockMovements.current_page
    );
    const [totalPages, setTotalPages] = useState(
        initialStockMovements.last_page
    );
    const [currentItems, setCurrentItems] = useState<StockMovement[]>(
        initialStockMovements.data
    );

    const [dateRange, setDateRange] = useState<DateRange | undefined>(() => {
        if (filters.start_date && filters.end_date) {
            return {
                from: new Date(filters.start_date),
                to: new Date(filters.end_date),
            };
        }
        return undefined;
    });

    useEffect(() => {
        setCurrentItems(initialStockMovements.data);
        setCurrentPage(initialStockMovements.current_page);
        setTotalPages(initialStockMovements.last_page);
    }, [initialStockMovements]);

    const handlePageChange = (page: number) => {
        const formattedStartDate = dateRange?.from
            ? format(dateRange.from, "yyyy-MM-dd")
            : "";
        const formattedEndDate = dateRange?.to
            ? format(dateRange.to, "yyyy-MM-dd")
            : "";
        router.get(
            `/stock-movements?page=${page} ${
                formattedStartDate && formattedEndDate
                    ? `&start_date=${formattedStartDate}&end_date=${formattedEndDate}`
                    : ""
            }`,
            {},
            {
                preserveState: true,
                preserveScroll: true,
            }
        );
    };

    const handleDateRangeChange = (newDateRange: DateRange | undefined) => {
        setDateRange(newDateRange);
        if (newDateRange?.from && newDateRange?.to) {
            const formattedStartDate = format(newDateRange.from, "yyyy-MM-dd");
            const formattedEndDate = format(newDateRange.to, "yyyy-MM-dd");
            router.get(
                `/stock-movements?start_date=${formattedStartDate}&end_date=${formattedEndDate}`,
                {},
                {
                    preserveState: true,
                    preserveScroll: true,
                }
            );
        }
    };

    return (
        <AuthenticatedLayout>
            <Head title="Stock Movements" />
            {userStatus === "inactive" ? (
                <SubscriptionPage />
            ) : (
                <div className="container mx-auto p-6">
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between">
                            <CardTitle className="text-2xl font-bold">
                                Stock Movements
                            </CardTitle>
                            <div className="flex items-center space-x-2">
                                <Popover>
                                    <PopoverTrigger asChild>
                                        <Button
                                            variant="outline"
                                            className="w-[240px] justify-start text-left font-normal"
                                        >
                                            <CalendarIcon className="mr-2 h-4 w-4" />
                                            {dateRange?.from ? (
                                                dateRange?.to ? (
                                                    <>
                                                        {format(
                                                            dateRange.from,
                                                            "LLL dd, y"
                                                        )}{" "}
                                                        -{" "}
                                                        {format(
                                                            dateRange.to,
                                                            "LLL dd, y"
                                                        )}
                                                    </>
                                                ) : (
                                                    format(
                                                        dateRange.from,
                                                        "LLL dd, y"
                                                    )
                                                )
                                            ) : (
                                                <span>Pick a date range</span>
                                            )}
                                        </Button>
                                    </PopoverTrigger>
                                    <PopoverContent
                                        className="w-auto p-0"
                                        align="start"
                                    >
                                        <Calendar
                                            initialFocus
                                            mode="range"
                                            defaultMonth={dateRange?.from}
                                            selected={dateRange}
                                            onSelect={handleDateRangeChange}
                                            numberOfMonths={1}
                                        />
                                    </PopoverContent>
                                </Popover>
                            </div>
                        </CardHeader>
                        <CardContent>
                            <Table>
                                <TableHeader>
                                    <TableRow>
                                        <TableHead>Date</TableHead>
                                        <TableHead>Product</TableHead>
                                        <TableHead>From</TableHead>
                                        <TableHead>To</TableHead>
                                        <TableHead>Quantity</TableHead>
                                        <TableHead>Type</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {currentItems.map((movement) => (
                                        <TableRow key={movement.id}>
                                            <TableCell>
                                                {new Date(
                                                    movement.created_at
                                                ).toLocaleString("en-US", {
                                                    year: "numeric",
                                                    month: "2-digit",
                                                    day: "2-digit",
                                                    hour: "2-digit",
                                                    minute: "2-digit",
                                                    hour12: true,
                                                })}
                                            </TableCell>
                                            <TableCell className="font-medium">
                                                {movement.product.name}
                                            </TableCell>
                                            <TableCell>
                                                {movement.from_location?.name ||
                                                    "-"}
                                            </TableCell>
                                            <TableCell>
                                                {movement.to_location?.name ||
                                                    "-"}
                                            </TableCell>
                                            <TableCell>
                                                {movement.quantity}
                                            </TableCell>
                                            <TableCell>
                                                <Badge
                                                    variant={
                                                        movement.type === "in"
                                                            ? "default"
                                                            : movement.type ===
                                                              "out"
                                                            ? "secondary"
                                                            : "outline"
                                                    }
                                                >
                                                    {movement.type === "in" && (
                                                        <ArrowUpCircle className="mr-1 h-4 w-4" />
                                                    )}
                                                    {movement.type ===
                                                        "out" && (
                                                        <ArrowDownCircle className="mr-1 h-4 w-4" />
                                                    )}
                                                    {movement.type ===
                                                        "move" && (
                                                        <ArrowLeftRight className="mr-1 h-4 w-4" />
                                                    )}
                                                    {movement.type.toUpperCase()}
                                                </Badge>
                                            </TableCell>
                                            <TableCell className="text-right">
                                                {/* Delete dialog code removed as per previous instructions */}
                                            </TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                            <div className="mt-4">
                                <Pagination>
                                    <PaginationContent>
                                        <PaginationItem>
                                            {currentPage !== 1 && (
                                                <PaginationPrevious
                                                    onClick={() =>
                                                        handlePageChange(
                                                            currentPage - 1
                                                        )
                                                    }
                                                />
                                            )}
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
                                            {currentPage !== totalPages && (
                                                <PaginationNext
                                                    onClick={() =>
                                                        handlePageChange(
                                                            currentPage + 1
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
