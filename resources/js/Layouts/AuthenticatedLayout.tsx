import { useState, PropsWithChildren, ReactNode } from "react";
import { Disclosure } from "@headlessui/react";
import { Avatar, AvatarImage, AvatarFallback } from "@/Components/ui/avatar";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/Components/ui/dropdown-menu";
import { Button } from "@/Components/ui/button";
import { Link, usePage } from "@inertiajs/react";
import {
    Bell,
    ChevronDown,
    Layout,
    Package,
    Users,
    Search,
    LogOut,
    User,
    Layers3,
    Container,
    Hexagon,
    Archive,
    Layers2,
    Store,
    ChevronRight,
    ArrowUpDown,
} from "lucide-react";
import { Input } from "@/Components/ui/input";
import { Toaster } from "@/Components/ui/toaster";
import SubscriptionPage from "@/Pages/SubscriptionPage"; // Add this import

export default function Authenticated({
    header,
    children,
}: PropsWithChildren<{ header?: ReactNode }>) {
    const { url } = usePage();
    const user = usePage().props.auth.user;
    const [isSidebarOpen, setSidebarOpen] = useState<boolean>(true);

    const navItems = [
        {
            name: "Inventory",
            icon: Archive,
            href: route("inventory.index"),
            current: url.startsWith("/inventory"),
        },
        {
            name: "Product",
            icon: Package,
            href: route("product.index"),
            current: url.startsWith("/products"),
        },
        {
            name: "Locations",
            icon: Container,
            href: route("locations.index"),
            current: url.startsWith("/locations"),
        },
        {
            name: "Brands",
            icon: Hexagon,
            href: route("brand.index"),
            current: url.startsWith("/brands"),
        },
        {
            name: "Product Types",
            icon: Layers3,
            href: route("type.index"),
            current: url.startsWith("/types"),
        },
        {
            name: "Categories",
            icon: Layers2,
            href: route("categories.index"),
            current: url.startsWith("/categories"),
        },

        {
            name: "Suppliers",
            icon: Users,
            href: route("supplier.index"),
            current: url.startsWith("/suppliers"),
        },
    ];

    return (
        <div className="flex min-h-screen bg-gray-100">
            {/* Sidebar */}
            <aside
                className={`bg-white w-64 min-h-screen p-4 ${
                    isSidebarOpen ? "" : "hidden"
                }`}
            >
                <div className="flex items-center mb-6">
                    <Package className="h-6 w-6 text-blue-500 mr-2" />
                    <span className="text-xl font-semibold">InvenMan </span>
                </div>
                <nav>
                    <Button
                        asChild
                        variant={url === "/" ? "default" : "ghost"}
                        className="w-full justify-start mb-2"
                    >
                        <Link href={route("dashboard")}>
                            <Layout className="mr-2 h-4 w-4" />
                            Dashboard
                        </Link>
                    </Button>
                    {user.role !== "admin" && (
                        <Button
                            asChild
                            variant={
                                url === "/stock-movements" ? "default" : "ghost"
                            }
                            className="w-full justify-start mb-2"
                        >
                            <Link href={route("stock-movements.index")}>
                                <ArrowUpDown className="mr-2 h-4 w-4" />
                                Stock Movements
                            </Link>
                        </Button>
                    )}
                    {user.role !== "admin" && (
                        <Disclosure>
                            {({ open }) => (
                                <>
                                    <Disclosure.Button className="flex w-full justify-between rounded-lg bg-blue-100 px-4 py-2 text-left text-sm font-medium text-blue-900 hover:bg-blue-200 focus:outline-none focus-visible:ring focus-visible:ring-blue-500 focus-visible:ring-opacity-75">
                                        <span>Master Data</span>
                                        <ChevronRight
                                            className={`${
                                                open
                                                    ? "rotate-90 transform"
                                                    : ""
                                            } h-5 w-5 text-blue-500`}
                                        />
                                    </Disclosure.Button>
                                    <Disclosure.Panel className="px-4 pt-4 pb-2 text-sm text-gray-500">
                                        {navItems.map((item) => (
                                            <Button
                                                key={item.name}
                                                variant={
                                                    item.current
                                                        ? "default"
                                                        : "ghost"
                                                }
                                                className="w-full justify-start mb-2"
                                                asChild
                                            >
                                                <Link href={item.href}>
                                                    <item.icon className="mr-2 h-4 w-4" />
                                                    {item.name}
                                                </Link>
                                            </Button>
                                        ))}
                                    </Disclosure.Panel>
                                </>
                            )}
                        </Disclosure>
                    )}
                    {user.role === "admin" && (
                        <Button
                            asChild
                            variant={
                                url === "/retails" || url === "/retails/create"
                                    ? "default"
                                    : "ghost"
                            }
                            className="w-full justify-start mt-2"
                        >
                            <Link href={route("retail.index")}>
                                <Store className="mr-2 h-4 w-4" />
                                Retails
                            </Link>
                        </Button>
                    )}
                </nav>
            </aside>

            {/* Main Content */}
            <div className="flex-1 flex flex-col overflow-hidden">
                {/* Header */}
                <header className="bg-white shadow-sm">
                    <div className="flex items-center justify-between p-4">
                        <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => setSidebarOpen(!isSidebarOpen)}
                        >
                            <ChevronDown
                                className={`h-6 w-6 transform ${
                                    isSidebarOpen ? "rotate-0" : "-rotate-90"
                                }`}
                            />
                            <span className="sr-only">Toggle Sidebar</span>
                        </Button>
                        <div className="flex items-center">
                            <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                    <Button
                                        variant="ghost"
                                        className="ml-2 flex items-center"
                                    >
                                        <Avatar className="h-8 w-8 mr-2">
                                            <AvatarImage alt={user.name} />
                                            <AvatarFallback>
                                                {user.name
                                                    .split(" ")
                                                    .map((n) => n[0])
                                                    .join("")}
                                            </AvatarFallback>
                                        </Avatar>
                                        {user.name}
                                        <ChevronDown className="ml-2 h-4 w-4" />
                                    </Button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent align="end">
                                    <DropdownMenuItem asChild>
                                        <Link
                                            href={route("profile.edit")}
                                            className="flex w-full items-center"
                                        >
                                            <User className="mr-2 h-4 w-4" />
                                            <span>Profile</span>
                                        </Link>
                                    </DropdownMenuItem>
                                    <DropdownMenuSeparator />
                                    <DropdownMenuItem asChild>
                                        <Link
                                            href={route("logout")}
                                            method="post"
                                            className="flex w-full items-center"
                                        >
                                            <LogOut className="mr-2 h-4 w-4" />
                                            <span>Log out</span>
                                        </Link>
                                    </DropdownMenuItem>
                                </DropdownMenuContent>
                            </DropdownMenu>
                        </div>
                    </div>
                </header>
                <main>{children}</main>
            </div>
            <Toaster />
        </div>
    );
}
