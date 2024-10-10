import { Head, Link, useForm } from "@inertiajs/react";

import { useState } from "react";
import GuestLayout from "@/Layouts/GuestLayout";
import { Eye, EyeOff, Box } from "lucide-react";
import { Button } from "@/Components/ui/button";
import { Input } from "@/Components/ui/input";
import { Label } from "@/Components/ui/label";
import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/Components/ui/card";
import { useEffect } from "react";
import { usePage } from "@inertiajs/react";
import { useToast } from "@/hooks/use-toast";

export default function Login({
    status,
    canResetPassword,
}: {
    status?: string;
    canResetPassword: boolean;
}) {
    console.log(status);
    const { toast } = useToast();
    const [showPassword, setShowPassword] = useState(false);
    const { data, setData, post, processing, errors, reset } = useForm({
        email: "",
        password: "",
        remember: false,
    });

    useEffect(() => {
        if (errors.email) {
            console.log(errors.email);
            toast({
                title: "Login Failed",
                description: errors.email,
                variant: "destructive",
            });
        }
    }, [errors]);

    const submit = (e: React.FormEvent) => {
        e.preventDefault();

        post(route("login"), {
            onError: (errors) => {
                if (errors.email) {
                    toast({
                        title: "Login Failed",
                        description: errors.email,
                        variant: "destructive",
                    });
                }
            },
            onFinish: () => reset("password"),
        });
    };

    return (
        <>
            <GuestLayout>
                <Head title="Log in" />
                <form onSubmit={submit}>
                    <CardHeader className="space-y-1">
                        <CardTitle className="text-2xl font-bold text-center">
                            Welcome Back
                        </CardTitle>
                        <CardDescription className="text-center">
                            Log in to your inventory management account
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="space-y-2">
                            <Label htmlFor="email">Email</Label>
                            <Input
                                id="email"
                                type="email"
                                name="email"
                                value={data.email}
                                className="mt-1 block w-full"
                                autoComplete="username"
                                onChange={(e) =>
                                    setData("email", e.target.value)
                                }
                                placeholder="john@example.com"
                            />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="password">Password</Label>
                            <div className="relative">
                                <Input
                                    id="password"
                                    type={showPassword ? "text" : "password"}
                                    name="password"
                                    value={data.password}
                                    className="mt-1 block w-full"
                                    autoComplete="current-password"
                                    onChange={(e) =>
                                        setData("password", e.target.value)
                                    }
                                    placeholder="••••••••"
                                />
                                <Button
                                    type="button"
                                    variant="ghost"
                                    size="icon"
                                    className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                                    onClick={() =>
                                        setShowPassword(!showPassword)
                                    }
                                >
                                    {showPassword ? (
                                        <EyeOff className="h-4 w-4 text-gray-500" />
                                    ) : (
                                        <Eye className="h-4 w-4 text-gray-500" />
                                    )}
                                    <span className="sr-only">
                                        {showPassword
                                            ? "Hide password"
                                            : "Show password"}
                                    </span>
                                </Button>
                            </div>
                        </div>
                    </CardContent>
                    <CardFooter className="flex flex-col space-y-4">
                        <Button className="w-full" disabled={processing}>
                            Log In
                        </Button>
                        {/* Login dan register */}
                        {/* <div className="flex items-center justify-between w-full text-sm">
                            {canResetPassword && (
                                <Link
                                    href={route("password.request")}
                                    className="text-blue-500 hover:text-blue-700 transition-colors"
                                >
                                    Forgot password?
                                </Link>
                            )}
                            <Link
                                href={route("register")}
                                className="text-blue-500 hover:text-blue-700 transition-colors"
                            >
                                Create an account
                            </Link>
                        </div> */}
                    </CardFooter>
                </form>
            </GuestLayout>
        </>
    );
}
