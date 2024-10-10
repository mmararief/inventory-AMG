"use client";

import { useState } from "react";
import {
    Users,
    Search,
    Eye,
    EyeOff,
    Edit,
    Trash2,
    UserPlus,
    ArrowUpDown,
    ChevronDown,
} from "lucide-react";
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
}

const initialRetailAccounts: RetailAccount[] = [
    {
        id: 1,
        email: "toko1@example.com",
        password: "password123",
        retail_name: "Toko Sejahtera",
        address: "Jl. Raya No. 123",
        kecamatan: "Menteng",
        kelurahan: "Menteng",
        city: "Jakarta Pusat",
        province: "DKI Jakarta",
        country: "Indonesia",
        postal_code: "10310",
        handphone: "081234567890",
        google_maps_link: "https://goo.gl/maps/example1",
        created: "2023-06-01T12:00:00Z",
        status: "active",
    },
    {
        id: 2,
        email: "warung2@example.com",
        password: "securepass456",
        retail_name: "Warung Bahagia",
        address: "Jl. Merdeka No. 45",
        kecamatan: "Sawah Besar",
        kelurahan: "Pasar Baru",
        city: "Jakarta Pusat",
        province: "DKI Jakarta",
        country: "Indonesia",
        postal_code: "10710",
        handphone: "087654321098",
        google_maps_link: null,
        created: "2023-06-02T14:30:00Z",
        status: "inactive",
    },
];

export default function AdminDashboard() {
    const { toast } = useToast();
    const [retailAccounts, setRetailAccounts] = useState<RetailAccount[]>(
        initialRetailAccounts
    );
    const [searchTerm, setSearchTerm] = useState("");
    const [sortColumn, setSortColumn] = useState<keyof RetailAccount>("id");
    const [sortDirection, setSortDirection] = useState<"asc" | "desc">("asc");
    const [showPassword, setShowPassword] = useState(false);
    const [selectedAccount, setSelectedAccount] =
        useState<RetailAccount | null>(null);
    const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
    const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
    const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
    const [newAccount, setNewAccount] = useState<
        Omit<RetailAccount, "id" | "created">
    >({
        email: "",
        password: "",
        retail_name: "",
        address: "",
        kecamatan: "",
        kelurahan: "",
        city: "",
        province: "",
        country: "",
        postal_code: "",
        handphone: "",
        google_maps_link: null,
        status: "active",
    });

    const handleSort = (column: keyof RetailAccount) => {
        if (column === sortColumn) {
            setSortDirection(sortDirection === "asc" ? "desc" : "asc");
        } else {
            setSortColumn(column);
            setSortDirection("asc");
        }
    };
    const sortedAccounts = [...retailAccounts].sort((a, b) => {
        const aValue = a[sortColumn];
        const bValue = b[sortColumn];

        if (aValue === null || bValue === null) {
            return 0; // Handle null values
        }

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

    const handleAddAccount = () => {
        if (newAccount.email && newAccount.password && newAccount.retail_name) {
            const newId =
                Math.max(...retailAccounts.map((account) => account.id), 0) + 1;
            const createdAccount: RetailAccount = {
                ...newAccount,
                id: newId,
                created: new Date().toISOString(),
            };
            setRetailAccounts([...retailAccounts, createdAccount]);
            setNewAccount({
                email: "",
                password: "",
                retail_name: "",
                address: "",
                kecamatan: "",
                kelurahan: "",
                city: "",
                province: "",
                country: "",
                postal_code: "",
                handphone: "",
                google_maps_link: null,
                status: "active",
            });
            setIsAddDialogOpen(false);
            toast({
                title: "Account Added",
                description: "New retail account has been added successfully.",
            });
        }
    };

    const handleEditAccount = () => {
        if (selectedAccount) {
            setRetailAccounts(
                retailAccounts.map((account) =>
                    account.id === selectedAccount.id
                        ? selectedAccount
                        : account
                )
            );
            setSelectedAccount(null);
            setIsEditDialogOpen(false);
            toast({
                title: "Account Updated",
                description: "Retail account has been updated successfully.",
            });
        }
    };

    const handleDeleteAccount = () => {
        if (selectedAccount) {
            setRetailAccounts(
                retailAccounts.filter(
                    (account) => account.id !== selectedAccount.id
                )
            );
            setSelectedAccount(null);
            setIsDeleteDialogOpen(false);
            toast({
                title: "Account Deleted",
                description: "Retail account has been deleted successfully.",
                variant: "destructive",
            });
        }
    };

    return (
        <div className="container mx-auto p-6">
            <Card className="mb-6">
                <CardHeader>
                    <CardTitle className="text-2xl font-bold">
                        Admin Dashboard - Retail Account Management
                    </CardTitle>
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
                                onChange={(e) => setSearchTerm(e.target.value)}
                            />
                        </div>
                        <Button onClick={() => setIsAddDialogOpen(true)}>
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
                            {filteredAccounts.map((account) => (
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
                                                        setSelectedAccount(
                                                            account
                                                        );
                                                        setIsEditDialogOpen(
                                                            true
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
                                            </DropdownMenuContent>
                                        </DropdownMenu>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </CardContent>
            </Card>

            <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
                <DialogContent className="sm:max-w-[425px]">
                    <DialogHeader>
                        <DialogTitle>Add New Retail Account</DialogTitle>
                        <DialogDescription>
                            Enter the details for the new retail account.
                        </DialogDescription>
                    </DialogHeader>
                    <div className="grid gap-4 py-4">
                        <div className="grid grid-cols-4 items-center gap-4">
                            <Label htmlFor="email" className="text-right">
                                Email
                            </Label>
                            <Input
                                id="email"
                                value={newAccount.email}
                                onChange={(e) =>
                                    setNewAccount({
                                        ...newAccount,
                                        email: e.target.value,
                                    })
                                }
                                className="col-span-3"
                            />
                        </div>
                        <div className="grid grid-cols-4 items-center gap-4">
                            <Label htmlFor="password" className="text-right">
                                Password
                            </Label>
                            <div className="col-span-3 flex">
                                <Input
                                    id="password"
                                    type={showPassword ? "text" : "password"}
                                    value={newAccount.password}
                                    onChange={(e) =>
                                        setNewAccount({
                                            ...newAccount,
                                            password: e.target.value,
                                        })
                                    }
                                    className="flex-grow"
                                />
                                <Button
                                    type="button"
                                    variant="ghost"
                                    size="icon"
                                    className="ml-2"
                                    onClick={() =>
                                        setShowPassword(!showPassword)
                                    }
                                >
                                    {showPassword ? (
                                        <EyeOff className="h-4 w-4" />
                                    ) : (
                                        <Eye className="h-4 w-4" />
                                    )}
                                </Button>
                            </div>
                        </div>
                        <div className="grid grid-cols-4 items-center gap-4">
                            <Label htmlFor="retail_name" className="text-right">
                                Retail Name
                            </Label>
                            <Input
                                id="retail_name"
                                value={newAccount.retail_name}
                                onChange={(e) =>
                                    setNewAccount({
                                        ...newAccount,
                                        retail_name: e.target.value,
                                    })
                                }
                                className="col-span-3"
                            />
                        </div>
                        {/* Add more fields as needed */}
                    </div>
                    <DialogFooter>
                        <Button onClick={handleAddAccount}>Add Account</Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

            <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
                <DialogContent className="sm:max-w-[425px]">
                    <DialogHeader>
                        <DialogTitle>Edit Retail Account</DialogTitle>
                        <DialogDescription>
                            Make changes to the retail account details.
                        </DialogDescription>
                    </DialogHeader>
                    {selectedAccount && (
                        <div className="grid gap-4 py-4">
                            <div className="grid grid-cols-4 items-center gap-4">
                                <Label
                                    htmlFor="edit_email"
                                    className="text-right"
                                >
                                    Email
                                </Label>
                                <Input
                                    id="edit_email"
                                    value={selectedAccount.email}
                                    onChange={(e) =>
                                        setSelectedAccount({
                                            ...selectedAccount,
                                            email: e.target.value,
                                        })
                                    }
                                    className="col-span-3"
                                />
                            </div>
                            <div className="grid grid-cols-4 items-center gap-4">
                                <Label
                                    htmlFor="edit_retail_name"
                                    className="text-right"
                                >
                                    Retail Name
                                </Label>
                                <Input
                                    id="edit_retail_name"
                                    value={selectedAccount.retail_name}
                                    onChange={(e) =>
                                        setSelectedAccount({
                                            ...selectedAccount,
                                            retail_name: e.target.value,
                                        })
                                    }
                                    className="col-span-3"
                                />
                            </div>
                            {/* Add more fields as needed */}
                        </div>
                    )}
                    <DialogFooter>
                        <Button onClick={handleEditAccount}>
                            Save Changes
                        </Button>
                    </DialogFooter>
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
                            Are you sure you want to delete this retail account?
                            This action cannot be undone.
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
    );
}
