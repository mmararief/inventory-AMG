import { useState } from "react";
import {
    Plus,
    Pencil,
    Trash2,
    Search,
    MapPin,
    Eye,
    EyeOff,
} from "lucide-react";
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { Button } from "@/Components/ui/button";
import { Input } from "@/Components/ui/input";
import { router } from "@inertiajs/react";
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
import { useToast } from "@/hooks/use-toast";

interface Retail {
    id: number;
    retail_name: string;
    email: string;
    handphone: string;
    created_at: string;
    address: string;
    kecamatan: string;
    kelurahan: string;
    city: string;
    province: string;
    country: string;
    postal_code: string;
    google_maps_link: string | null;
    users: User;
}

interface User {
    password: string;
}

interface props {
    initialRetails: Retail[];
    initialRetail: Retail;
}

export default function RetailManagementAccount({
    initialRetails,
    initialRetail,
}: props) {
    console.log("initialRetail", initialRetail);
    console.log("initialRetails", initialRetails);
    const { toast } = useToast();
    const [retails, setRetails] = useState<Retail[]>(initialRetails);
    const [newAccount, setNewAccount] = useState<
        Omit<Retail, "id" | "created" | "users"> & { users: User }
    >({
        retail_name: "",
        address: "",
        created_at: "",
        kecamatan: "",
        kelurahan: "",
        city: "",
        province: "",
        country: "",
        postal_code: "",
        handphone: "",
        google_maps_link: null,
        email: "",
        users: {
            password: "",
        },
    });
    const [editingAccount, setEditingAccount] = useState<Retail | null>(null);
    const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
    const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
    const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
    const [accountToDelete, setAccountToDelete] = useState<Retail | null>(null);
    const [searchTerm, setSearchTerm] = useState("");
    const [showPassword, setShowPassword] = useState(false);

    const handleAddAccount = () => {
        if (
            newAccount.email &&
            newAccount.retail_name &&
            newAccount.users.password
        ) {
            const newId =
                Math.max(...retails.map((account) => account.id), 0) + 1;
            const createdAccount: Retail = {
                ...newAccount,
                id: newId,
                created_at: new Date().toISOString(),
                users: {
                    password: newAccount.users.password,
                },
            };
            setRetails([...retails, createdAccount]);
            router.post("/retails", {
                email: newAccount.email,
                password: newAccount.users.password,
                retail_name: newAccount.retail_name,
                address: newAccount.address,
                kecamatan: newAccount.kecamatan,
                kelurahan: newAccount.kelurahan,
                city: newAccount.city,
                province: newAccount.province,
                country: newAccount.country,
                postal_code: newAccount.postal_code,
                handphone: newAccount.handphone,
                google_maps_link: newAccount.google_maps_link,
            });
            setNewAccount({
                email: "",
                retail_name: "",
                address: "",
                created_at: "",
                kecamatan: "",
                kelurahan: "",
                city: "",
                province: "",
                country: "",
                postal_code: "",
                handphone: "",
                google_maps_link: null,
                users: {
                    password: "",
                },
            });
            setIsAddDialogOpen(false);
            toast({
                title: "Account Added",
                description: "New retail account has been added successfully.",
            });
        }
    };

    const handleEditAccount = () => {
        if (
            editingAccount &&
            editingAccount.email &&
            editingAccount.retail_name &&
            editingAccount.users.password
        ) {
            setRetails(
                retails.map((account) =>
                    account.id === editingAccount.id ? editingAccount : account
                )
            );
            setEditingAccount(null);
            setIsEditDialogOpen(false);
            toast({
                title: "Account Updated",
                description: "Retail account has been updated successfully.",
            });
        }
    };

    const handleDeleteAccount = () => {
        if (accountToDelete) {
            setRetails(
                retails.filter((account) => account.id !== accountToDelete.id)
            );
            router.delete(`/retails/${accountToDelete.id}`);
            setAccountToDelete(null);
            setIsDeleteDialogOpen(false);
            toast({
                title: "Account Deleted",
                description: "Retail account has been deleted successfully.",
                variant: "destructive",
            });
        }
    };

    const filteredRetails = retails.filter(
        (account) =>
            account.retail_name
                .toLowerCase()
                .includes(searchTerm.toLowerCase()) ||
            account.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
            account.city.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <AuthenticatedLayout>
            <Head title="Retail Management Accounts" />
            <div className="container mx-auto p-6">
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between">
                        <CardTitle className="text-2xl font-bold">
                            Retail Management Accounts
                        </CardTitle>
                        <div className="flex items-center space-x-2">
                            <div className="relative">
                                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500" />
                                <Input
                                    type="search"
                                    placeholder="Search accounts..."
                                    className="pl-8 w-64"
                                    value={searchTerm}
                                    onChange={(e) =>
                                        setSearchTerm(e.target.value)
                                    }
                                />
                            </div>
                            <Dialog
                                open={isAddDialogOpen}
                                onOpenChange={setIsAddDialogOpen}
                            >
                                <DialogTrigger asChild>
                                    <Button>
                                        <Plus className="mr-2 h-4 w-4" />
                                        Add Account
                                    </Button>
                                </DialogTrigger>
                                <DialogContent className="sm:max-w-[425px]">
                                    <DialogHeader>
                                        <DialogTitle>
                                            Add New Retail Account
                                        </DialogTitle>
                                        <DialogDescription>
                                            Enter the details for the new retail
                                            account.
                                        </DialogDescription>
                                    </DialogHeader>
                                    <div className="grid gap-4 py-4">
                                        <div className="grid grid-cols-4 items-center gap-4">
                                            <Label
                                                htmlFor="email"
                                                className="text-right"
                                            >
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
                                            <Label
                                                htmlFor="password"
                                                className="text-right"
                                            >
                                                Password
                                            </Label>
                                            <div className="col-span-3 flex">
                                                <Input
                                                    id="password"
                                                    type={
                                                        showPassword
                                                            ? "text"
                                                            : "password"
                                                    }
                                                    value={
                                                        newAccount.users
                                                            .password
                                                    }
                                                    onChange={(e) =>
                                                        setNewAccount({
                                                            ...newAccount,
                                                            users: {
                                                                ...newAccount.users,
                                                                password:
                                                                    e.target
                                                                        .value,
                                                            },
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
                                                        setShowPassword(
                                                            !showPassword
                                                        )
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
                                            <Label
                                                htmlFor="retail_name"
                                                className="text-right"
                                            >
                                                Retail Name
                                            </Label>
                                            <Input
                                                id="retail_name"
                                                value={newAccount.retail_name}
                                                onChange={(e) =>
                                                    setNewAccount({
                                                        ...newAccount,
                                                        retail_name:
                                                            e.target.value,
                                                    })
                                                }
                                                className="col-span-3"
                                            />
                                        </div>
                                        <div className="grid grid-cols-4 items-center gap-4">
                                            <Label
                                                htmlFor="address"
                                                className="text-right"
                                            >
                                                Address
                                            </Label>
                                            <Input
                                                id="address"
                                                value={newAccount.address}
                                                onChange={(e) =>
                                                    setNewAccount({
                                                        ...newAccount,
                                                        address: e.target.value,
                                                    })
                                                }
                                                className="col-span-3"
                                            />
                                        </div>
                                        <div className="grid grid-cols-4 items-center gap-4">
                                            <Label
                                                htmlFor="kecamatan"
                                                className="text-right"
                                            >
                                                Kecamatan
                                            </Label>
                                            <Input
                                                id="kecamatan"
                                                value={newAccount.kecamatan}
                                                onChange={(e) =>
                                                    setNewAccount({
                                                        ...newAccount,
                                                        kecamatan:
                                                            e.target.value,
                                                    })
                                                }
                                                className="col-span-3"
                                            />
                                        </div>
                                        <div className="grid grid-cols-4 items-center gap-4">
                                            <Label
                                                htmlFor="kelurahan"
                                                className="text-right"
                                            >
                                                Kelurahan
                                            </Label>
                                            <Input
                                                id="kelurahan"
                                                value={newAccount.kelurahan}
                                                onChange={(e) =>
                                                    setNewAccount({
                                                        ...newAccount,
                                                        kelurahan:
                                                            e.target.value,
                                                    })
                                                }
                                                className="col-span-3"
                                            />
                                        </div>
                                        <div className="grid grid-cols-4 items-center gap-4">
                                            <Label
                                                htmlFor="city"
                                                className="text-right"
                                            >
                                                City
                                            </Label>
                                            <Input
                                                id="city"
                                                value={newAccount.city}
                                                onChange={(e) =>
                                                    setNewAccount({
                                                        ...newAccount,
                                                        city: e.target.value,
                                                    })
                                                }
                                                className="col-span-3"
                                            />
                                        </div>
                                        <div className="grid grid-cols-4 items-center gap-4">
                                            <Label
                                                htmlFor="province"
                                                className="text-right"
                                            >
                                                Province
                                            </Label>
                                            <Input
                                                id="province"
                                                value={newAccount.province}
                                                onChange={(e) =>
                                                    setNewAccount({
                                                        ...newAccount,
                                                        province:
                                                            e.target.value,
                                                    })
                                                }
                                                className="col-span-3"
                                            />
                                        </div>
                                        <div className="grid grid-cols-4 items-center gap-4">
                                            <Label
                                                htmlFor="country"
                                                className="text-right"
                                            >
                                                Country
                                            </Label>
                                            <Input
                                                id="country"
                                                value={newAccount.country}
                                                onChange={(e) =>
                                                    setNewAccount({
                                                        ...newAccount,
                                                        country: e.target.value,
                                                    })
                                                }
                                                className="col-span-3"
                                            />
                                        </div>
                                        <div className="grid grid-cols-4 items-center gap-4">
                                            <Label
                                                htmlFor="postal_code"
                                                className="text-right"
                                            >
                                                Postal Code
                                            </Label>
                                            <Input
                                                id="postal_code"
                                                value={newAccount.postal_code}
                                                onChange={(e) =>
                                                    setNewAccount({
                                                        ...newAccount,
                                                        postal_code:
                                                            e.target.value,
                                                    })
                                                }
                                                className="col-span-3"
                                            />
                                        </div>
                                        <div className="grid grid-cols-4 items-center gap-4">
                                            <Label
                                                htmlFor="handphone"
                                                className="text-right"
                                            >
                                                Handphone
                                            </Label>
                                            <Input
                                                id="handphone"
                                                value={newAccount.handphone}
                                                onChange={(e) =>
                                                    setNewAccount({
                                                        ...newAccount,
                                                        handphone:
                                                            e.target.value,
                                                    })
                                                }
                                                className="col-span-3"
                                            />
                                        </div>
                                        <div className="grid grid-cols-4 items-center gap-4">
                                            <Label
                                                htmlFor="google_maps_link"
                                                className="text-right"
                                            >
                                                Google Maps
                                            </Label>
                                            <Input
                                                id="google_maps_link"
                                                value={
                                                    newAccount.google_maps_link ||
                                                    ""
                                                }
                                                onChange={(e) =>
                                                    setNewAccount({
                                                        ...newAccount,
                                                        google_maps_link:
                                                            e.target.value ||
                                                            null,
                                                    })
                                                }
                                                className="col-span-3"
                                            />
                                        </div>
                                    </div>
                                    <DialogFooter>
                                        <Button onClick={handleAddAccount}>
                                            Add Account
                                        </Button>
                                    </DialogFooter>
                                </DialogContent>
                            </Dialog>
                        </div>
                    </CardHeader>
                    <CardContent>
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>ID</TableHead>
                                    <TableHead>Retail Name</TableHead>
                                    <TableHead>Email</TableHead>
                                    <TableHead>City</TableHead>
                                    <TableHead>Handphone</TableHead>
                                    <TableHead>Created</TableHead>
                                    <TableHead className="text-right">
                                        Actions
                                    </TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {filteredRetails.map((account) => (
                                    <TableRow key={account.id}>
                                        <TableCell>{account.id}</TableCell>
                                        <TableCell className="font-medium">
                                            {account.retail_name}
                                        </TableCell>
                                        <TableCell>{account.email}</TableCell>
                                        <TableCell>{account.city}</TableCell>
                                        <TableCell>
                                            {account.handphone}
                                        </TableCell>
                                        <TableCell>
                                            {new Date(
                                                account.created_at
                                            ).toLocaleDateString()}
                                        </TableCell>
                                        <TableCell className="text-right">
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
                                                            setAccountToDelete(
                                                                account
                                                            )
                                                        }
                                                    >
                                                        <Trash2 className="h-4 w-4" />
                                                        <span className="sr-only">
                                                            Delete{" "}
                                                            {
                                                                account.retail_name
                                                            }
                                                        </span>
                                                    </Button>
                                                </DialogTrigger>
                                                <DialogContent>
                                                    <DialogHeader>
                                                        <DialogTitle>
                                                            Delete Retail
                                                            Account
                                                        </DialogTitle>
                                                        <DialogDescription>
                                                            Are you sure you
                                                            want to delete this
                                                            retail account? This
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
                                                                handleDeleteAccount
                                                            }
                                                        >
                                                            Delete
                                                        </Button>
                                                    </DialogFooter>
                                                </DialogContent>
                                            </Dialog>
                                            {account.google_maps_link && (
                                                <Button
                                                    variant="ghost"
                                                    size="icon"
                                                    asChild
                                                >
                                                    <a
                                                        href={
                                                            account.google_maps_link
                                                        }
                                                        target="_blank"
                                                        rel="noopener noreferrer"
                                                    >
                                                        <MapPin className="h-4 w-4" />
                                                        <span className="sr-only">
                                                            View on Google Maps
                                                        </span>
                                                    </a>
                                                </Button>
                                            )}
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </CardContent>
                </Card>
            </div>
        </AuthenticatedLayout>
    );
}
