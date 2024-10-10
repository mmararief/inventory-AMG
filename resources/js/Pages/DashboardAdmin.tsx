import { useState, useEffect } from "react";
import {
    Users,
    Search,
    Eye,
    EyeOff,
    Edit,
    Trash2,
    Calendar,
    UserPlus,
    ArrowUpDown,
    ChevronDown,
    Store,
    MapPin,
    UserCheck,
    UserX,
} from "lucide-react";
import { Head, Link, router } from "@inertiajs/react";
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { Button } from "@/Components/ui/button";
import { Input } from "@/Components/ui/input";
import { format } from "date-fns";
import { cn } from "@/lib/utils";
import { Calendar as CalendarComponent } from "@/Components/ui/calendar";

import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/Components/ui/popover";

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
import { useToast } from "@/hooks/use-toast";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/Components/ui/dropdown-menu";
import {
    Pagination,
    PaginationContent,
    PaginationEllipsis,
    PaginationItem,
    PaginationLink,
    PaginationNext,
    PaginationPrevious,
} from "@/Components/ui/pagination";

interface RetailAccount {
    id: number;
    email: string;
    password: string;
    retail_name: string;
    address: string;
    kecamatan: string;
    kelurahan: string;
    city: string;
    province: string;
    country: string;
    postal_code: string;
    handphone: string;
    google_maps_link: string | null;
    created: string;
    status: "active" | "inactive";
    subscription: Subscription;
}

interface Subscription {
    end_date: Date;
}
export default function EnhancedAdminDashboard({
    initialRetailAccounts,
}: {
    initialRetailAccounts: RetailAccount[];
}) {
    const { toast } = useToast();
    const [retailAccounts, setRetailAccounts] = useState<RetailAccount[]>(
        initialRetailAccounts
    );
    const [searchTerm, setSearchTerm] = useState("");
    const [sortColumn, setSortColumn] = useState<keyof RetailAccount>("id");
    const [sortDirection, setSortDirection] = useState<"asc" | "desc">("asc");
    const [selectedAccount, setSelectedAccount] =
        useState<RetailAccount | null>(null);

    const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
    const [isExtendSubscriptionOpen, setIsExtendSubscriptionOpen] =
        useState(false);
    const [newEndDate, setNewEndDate] = useState<Date | undefined>(undefined);
    const [isSubmitting, setIsSubmitting] = useState(false);

    const [totalRetail, setTotalRetail] = useState(0);
    const [activeRetail, setActiveRetail] = useState(0);
    const [inactiveRetail, setInactiveRetail] = useState(0);
    const [totalCities, setTotalCities] = useState(0);
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 10; // You can adjust this number as needed

    useEffect(() => {
        setTotalRetail(retailAccounts.length);
        setActiveRetail(
            retailAccounts.filter((account) => account.status === "active")
                .length
        );
        setInactiveRetail(
            retailAccounts.filter((account) => account.status === "inactive")
                .length
        );
        setTotalCities(
            new Set(retailAccounts.map((account) => account.city)).size
        );
    }, [retailAccounts]);

    const handleSort = (column: keyof RetailAccount) => {
        if (column === sortColumn) {
            setSortDirection(sortDirection === "asc" ? "desc" : "asc");
        } else {
            setSortColumn(column);
            setSortDirection("asc");
        }
    };

    const sortedAccounts = [...retailAccounts].sort((a, b) => {
        const aValue = a[sortColumn] ?? "";
        const bValue = b[sortColumn] ?? "";
        if (aValue < bValue) return sortDirection === "asc" ? -1 : 1;
        if (aValue > bValue) return sortDirection === "asc" ? 1 : -1;
        return 0;
    });

    const filteredAccounts = sortedAccounts.filter(
        (account) =>
            account.retail_name
                .toLowerCase()
                .includes(searchTerm.toLowerCase()) ||
            account.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
            account.city.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const paginatedAccounts = filteredAccounts.slice(
        (currentPage - 1) * itemsPerPage,
        currentPage * itemsPerPage
    );

    const totalPages = Math.ceil(filteredAccounts.length / itemsPerPage);

    const handleDeleteAccount = () => {
        if (selectedAccount) {
            router.delete(route("retail.destroy", selectedAccount.id), {
                preserveState: true,
                preserveScroll: true,
                onSuccess: () => {
                    setRetailAccounts((prevAccounts) =>
                        prevAccounts.filter(
                            (account) => account.id !== selectedAccount.id
                        )
                    );
                    setSelectedAccount(null);
                    setIsDeleteDialogOpen(false);
                    toast({
                        title: "Account Deleted",
                        description:
                            "Retail account has been deleted successfully.",
                        variant: "destructive",
                    });
                },
                onError: () => {
                    toast({
                        title: "Error",
                        description:
                            "Failed to delete the account. Please try again.",
                        variant: "destructive",
                    });
                },
            });
        }
    };

    const handleExtendSubscription = (account: RetailAccount) => {
        setSelectedAccount(account);
        setIsExtendSubscriptionOpen(true);
    };

    const handleSubmit = async () => {
        if (!selectedAccount || !newEndDate) return;

        setIsSubmitting(true);

        router.post(route("retail.extend", selectedAccount.id), {
            end_date: newEndDate,
        });

        console.log(newEndDate);
        console.log(selectedAccount.id);
        setIsSubmitting(false);
        setIsExtendSubscriptionOpen(false);
        setSelectedAccount(null);
        setNewEndDate(undefined);
        // Optionally, update the account in the state or refetch data
    };

    console.log(initialRetailAccounts);

    return (
        <AuthenticatedLayout>
            <Head title="Dashboard Admin" />

            <div className="container mx-auto p-6">
                <h1 className="text-3xl font-bold mb-6">
                    Admin Dashboard - Retail Account Management
                </h1>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">
                                Total Retail Accounts
                            </CardTitle>
                            <Store className="h-4 w-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">
                                {totalRetail || 0}
                            </div>
                        </CardContent>
                    </Card>
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">
                                Active Accounts
                            </CardTitle>
                            <UserCheck className="h-4 w-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">
                                {activeRetail || 0}
                            </div>
                        </CardContent>
                    </Card>
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">
                                Inactive Accounts
                            </CardTitle>
                            <UserX className="h-4 w-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">
                                {inactiveRetail || 0}
                            </div>
                        </CardContent>
                    </Card>
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">
                                Total Cities
                            </CardTitle>
                            <MapPin className="h-4 w-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">
                                {totalCities || 0}
                            </div>
                        </CardContent>
                    </Card>
                </div>

                <Card>
                    <CardHeader>
                        <CardTitle>Retail Accounts</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="flex justify-between items-center mb-4">
                            <div className="flex items-center space-x-2">
                                <Search className="h-5 w-5 text-gray-500" />
                                <Input
                                    type="search"
                                    placeholder="Search accounts..."
                                    className="w-64"
                                    value={searchTerm}
                                    onChange={(e) =>
                                        setSearchTerm(e.target.value)
                                    }
                                />
                            </div>
                            <Button
                                onClick={() =>
                                    (window.location.href =
                                        route("retail.create"))
                                }
                            >
                                <UserPlus className="mr-2 h-4 w-4" />
                                Add New Account
                            </Button>
                        </div>
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead className="w-[100px]">
                                        <Button
                                            variant="ghost"
                                            onClick={() => handleSort("id")}
                                        >
                                            ID
                                            <ArrowUpDown className="ml-2 h-4 w-4" />
                                        </Button>
                                    </TableHead>
                                    <TableHead>
                                        <Button
                                            variant="ghost"
                                            onClick={() =>
                                                handleSort("retail_name")
                                            }
                                        >
                                            Retail Name
                                            <ArrowUpDown className="ml-2 h-4 w-4" />
                                        </Button>
                                    </TableHead>
                                    <TableHead>
                                        <Button
                                            variant="ghost"
                                            onClick={() => handleSort("email")}
                                        >
                                            Email
                                            <ArrowUpDown className="ml-2 h-4 w-4" />
                                        </Button>
                                    </TableHead>
                                    <TableHead>
                                        <Button
                                            variant="ghost"
                                            onClick={() => handleSort("city")}
                                        >
                                            City
                                            <ArrowUpDown className="ml-2 h-4 w-4" />
                                        </Button>
                                    </TableHead>
                                    <TableHead>
                                        <Button
                                            variant="ghost"
                                            onClick={() => handleSort("status")}
                                        >
                                            Status
                                            <ArrowUpDown className="ml-2 h-4 w-4" />
                                        </Button>
                                    </TableHead>
                                    <TableHead>Actions</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {paginatedAccounts.map((account) => (
                                    <TableRow key={account.id}>
                                        <TableCell>{account.id}</TableCell>
                                        <TableCell className="font-medium">
                                            {account.retail_name}
                                        </TableCell>
                                        <TableCell>{account.email}</TableCell>
                                        <TableCell>{account.city}</TableCell>
                                        <TableCell>
                                            <span
                                                className={`px-2 py-1 rounded-full text-xs font-semibold ${
                                                    account.status === "active"
                                                        ? "bg-green-100 text-green-800"
                                                        : "bg-red-100 text-red-800"
                                                }`}
                                            >
                                                {account.status
                                                    .charAt(0)
                                                    .toUpperCase() +
                                                    account.status.slice(1)}
                                            </span>
                                        </TableCell>
                                        <TableCell>
                                            <DropdownMenu>
                                                <DropdownMenuTrigger asChild>
                                                    <Button
                                                        variant="ghost"
                                                        className="h-8 w-8 p-0"
                                                    >
                                                        <span className="sr-only">
                                                            Open menu
                                                        </span>
                                                        <ChevronDown className="h-4 w-4" />
                                                    </Button>
                                                </DropdownMenuTrigger>
                                                <DropdownMenuContent align="end">
                                                    <DropdownMenuLabel>
                                                        Actions
                                                    </DropdownMenuLabel>
                                                    <DropdownMenuItem
                                                        onClick={() => {
                                                            router.visit(
                                                                route(
                                                                    "retails.show",
                                                                    account.id
                                                                )
                                                            );
                                                        }}
                                                    >
                                                        <Edit className="mr-2 h-4 w-4" />
                                                        Edit
                                                    </DropdownMenuItem>
                                                    <DropdownMenuItem
                                                        onClick={() => {
                                                            setSelectedAccount(
                                                                account
                                                            );
                                                            setIsDeleteDialogOpen(
                                                                true
                                                            );
                                                        }}
                                                    >
                                                        <Trash2 className="mr-2 h-4 w-4" />
                                                        Delete
                                                    </DropdownMenuItem>
                                                    <DropdownMenuSeparator />
                                                    <DropdownMenuItem
                                                        onClick={() => {
                                                            setRetailAccounts(
                                                                retailAccounts.map(
                                                                    (a) =>
                                                                        a.id ===
                                                                        account.id
                                                                            ? {
                                                                                  ...a,
                                                                                  status:
                                                                                      a.status ===
                                                                                      "active"
                                                                                          ? "inactive"
                                                                                          : "active",
                                                                              }
                                                                            : a
                                                                )
                                                            );
                                                            toast({
                                                                title: "Status Updated",
                                                                description: `Account status changed to ${
                                                                    account.status ===
                                                                    "active"
                                                                        ? "inactive"
                                                                        : "active"
                                                                }.`,
                                                            });
                                                        }}
                                                    >
                                                        <Users className="mr-2 h-4 w-4" />
                                                        Toggle Status
                                                    </DropdownMenuItem>
                                                    <DropdownMenuSeparator />
                                                    <DropdownMenuItem
                                                        onClick={() => {
                                                            handleExtendSubscription(
                                                                account
                                                            );
                                                        }}
                                                    >
                                                        <Calendar className="mr-2 h-4 w-4" />
                                                        Extend Subscription
                                                    </DropdownMenuItem>
                                                </DropdownMenuContent>
                                            </DropdownMenu>
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
                                                        Math.max(prev - 1, 1)
                                                    )
                                                }
                                            />
                                        )}
                                    </PaginationItem>
                                    {[...Array(totalPages)].map((_, index) => (
                                        <PaginationItem key={index}>
                                            <PaginationLink
                                                onClick={() =>
                                                    setCurrentPage(index + 1)
                                                }
                                                isActive={
                                                    currentPage === index + 1
                                                }
                                            >
                                                {index + 1}
                                            </PaginationLink>
                                        </PaginationItem>
                                    ))}
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

                <Dialog
                    open={isExtendSubscriptionOpen}
                    onOpenChange={setIsExtendSubscriptionOpen}
                >
                    <DialogContent className="sm:max-w-[425px]">
                        <form onSubmit={handleSubmit}>
                            <DialogHeader>
                                <DialogTitle>Extend Subscription</DialogTitle>
                                <DialogDescription>
                                    Extend the subscription for{" "}
                                    {selectedAccount?.retail_name}. Current end
                                    date is{" "}
                                    {selectedAccount?.subscription?.end_date &&
                                        format(
                                            new Date(
                                                selectedAccount.subscription.end_date
                                            ),
                                            "PPP"
                                        )}
                                    .
                                </DialogDescription>
                            </DialogHeader>
                            <div className="grid gap-4 py-4">
                                <div className="grid grid-cols-4 items-center gap-4">
                                    <label
                                        htmlFor="name"
                                        className="text-right"
                                    >
                                        New End Date
                                    </label>
                                    <Popover>
                                        <PopoverTrigger asChild>
                                            <Button
                                                id="date"
                                                variant={"outline"}
                                                className={cn(
                                                    "w-[280px] justify-start text-left font-normal",
                                                    !newEndDate &&
                                                        "text-muted-foreground"
                                                )}
                                            >
                                                <Calendar className="mr-2 h-4 w-4" />
                                                {newEndDate ? (
                                                    format(newEndDate, "PPP")
                                                ) : (
                                                    <span>Pick a date</span>
                                                )}
                                            </Button>
                                        </PopoverTrigger>
                                        <PopoverContent className="w-auto p-0">
                                            <CalendarComponent
                                                mode="single"
                                                selected={newEndDate}
                                                onSelect={setNewEndDate}
                                                initialFocus
                                                disabled={(date) =>
                                                    date <= new Date() ||
                                                    (selectedAccount
                                                        ?.subscription?.end_date
                                                        ? date <=
                                                          new Date(
                                                              selectedAccount.subscription.end_date
                                                          )
                                                        : false)
                                                }
                                            />
                                        </PopoverContent>
                                    </Popover>
                                </div>
                            </div>
                            <DialogFooter>
                                <Button
                                    type="button"
                                    variant="secondary"
                                    onClick={() =>
                                        setIsExtendSubscriptionOpen(false)
                                    }
                                >
                                    Cancel
                                </Button>
                                <Button
                                    type="submit"
                                    disabled={isSubmitting || !newEndDate}
                                >
                                    {isSubmitting
                                        ? "Extending..."
                                        : "Extend Subscription"}
                                </Button>
                            </DialogFooter>
                        </form>
                    </DialogContent>
                </Dialog>

                <Dialog
                    open={isDeleteDialogOpen}
                    onOpenChange={setIsDeleteDialogOpen}
                >
                    <DialogContent>
                        <DialogHeader>
                            <DialogTitle>Delete Retail Account</DialogTitle>
                            <DialogDescription>
                                Are you sure you want to delete this retail
                                account? This action cannot be undone.
                            </DialogDescription>
                        </DialogHeader>
                        <DialogFooter>
                            <Button
                                variant="outline"
                                onClick={() => setIsDeleteDialogOpen(false)}
                            >
                                Cancel
                            </Button>
                            <Button
                                variant="destructive"
                                onClick={handleDeleteAccount}
                            >
                                Delete
                            </Button>
                        </DialogFooter>
                    </DialogContent>
                </Dialog>
            </div>
        </AuthenticatedLayout>
    );
}
