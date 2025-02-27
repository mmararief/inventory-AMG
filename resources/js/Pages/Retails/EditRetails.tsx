"use client";

import { useEffect, useState } from "react";
import { usePage } from "@inertiajs/react";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { CalendarIcon, MapPinIcon, ArrowLeftIcon } from "lucide-react";
import { format, parseISO, isValid } from "date-fns";

import { PageProps as InertiaPageProps } from "@inertiajs/core";

interface EditRetailAccountProps {
    retail: {
        retail_name: string;
        address: string;
        kecamatan: string;
        kelurahan: string;
        city: string;
        province: string;
        country: string;
        postal_code: string;
        handphone: string;
        email: string;
        google_maps_link?: string | null;
        password: string;
        end_subscription: string;
        id: number;
    };
}

interface PageProps extends InertiaPageProps {
    errors: Record<string, string>;
    // Add other custom properties here if needed
}

import { Button } from "@/Components/ui/button";
import { Input } from "@/Components/ui/input";
import { Textarea } from "@/Components/ui/textarea";
import {
    Form,
    FormControl,
    FormDescription,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/Components/ui/form";
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/Components/ui/popover";
import { Calendar } from "@/Components/ui/calendar";
import { useToast } from "@/hooks/use-toast";
import { Card, CardHeader, CardTitle, CardContent } from "@/Components/ui/card";
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { router } from "@inertiajs/react";

const formSchema = z.object({
    retail_name: z.string().min(2, {
        message: "Retail name must be at least 2 characters.",
    }),
    address: z.string().min(5, {
        message: "Address must be at least 5 characters.",
    }),
    kecamatan: z.string().min(2, {
        message: "Kecamatan must be at least 2 characters.",
    }),
    kelurahan: z.string().min(2, {
        message: "Kelurahan must be at least 2 characters.",
    }),
    city: z.string().min(2, {
        message: "City must be at least 2 characters.",
    }),
    province: z.string().min(2, {
        message: "Province must be at least 2 characters.",
    }),
    country: z.string().min(2, {
        message: "Country must be at least 2 characters.",
    }),
    postal_code: z.string().min(5, {
        message: "Postal code must be at least 5 characters.",
    }),
    handphone: z.string().min(10, {
        message: "Handphone number must be at least 10 characters.",
    }),
    email: z.string().email({
        message: "Please enter a valid email address.",
    }),
    password: z.string().min(8, {
        message: "Password must be at least 8 characters.",
    }),
    google_maps_link: z.string().url().nullable().optional(),
    end_subscription: z.date({
        required_error: "Please select an end subscription date.",
    }),
});

type FormValues = z.infer<typeof formSchema>;

export default function EditRetailAccount({ retail }: EditRetailAccountProps) {
    const { errors } = usePage<PageProps>().props;
    const { toast } = useToast();
    const [isSubmitting, setIsSubmitting] = useState(false);

    // Parse the date safely
    const parsedDate = retail.end_subscription
        ? parseISO(retail.end_subscription)
        : null;
    const validDate = parsedDate && isValid(parsedDate) ? parsedDate : null;

    const form = useForm<FormValues>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            retail_name: retail.retail_name,
            address: retail.address,
            kecamatan: retail.kecamatan,
            kelurahan: retail.kelurahan,
            city: retail.city,
            province: retail.province,
            country: retail.country,
            postal_code: retail.postal_code,
            handphone: retail.handphone,
            email: retail.email,
            password: "",
            google_maps_link: retail.google_maps_link,
            end_subscription: validDate || new Date(),
        },
    });

    useEffect(() => {
        if (window.sessionStorage.getItem("success")) {
            toast({
                title: "Success",
                description: window.sessionStorage.getItem("success"),
            });
            window.sessionStorage.removeItem("success");
        }

        if (window.sessionStorage.getItem("error")) {
            toast({
                title: "Error",
                description: window.sessionStorage.getItem("error"),
            });
            window.sessionStorage.removeItem("error");
        }

        if (errors.error) {
            toast({
                title: "Error",
                description: errors.error,
                variant: "destructive",
            });
        }
    }, [errors]);

    function onSubmit(values: FormValues) {
        setIsSubmitting(true);
        console.log(values);
        router.put(
            route("retails.update", retail.id),
            {
                retail_name: values.retail_name,
                address: values.address,
                kecamatan: values.kecamatan,
                kelurahan: values.kelurahan,
                city: values.city,
                province: values.province,
                country: values.country,
                postal_code: values.postal_code,
                handphone: values.handphone,
                email: values.email,
                password: values.password,
                google_maps_link: values.google_maps_link,
                end_subscription: values.end_subscription,
            },
            {
                preserveState: true,
                preserveScroll: true,
                onSuccess: () => {
                    setIsSubmitting(false);
                    toast({
                        title: "Success",
                        description: "Retail account updated successfully",
                    });
                },
                onError: (errors) => {
                    setIsSubmitting(false);
                    // This will handle validation errors
                    Object.keys(errors).forEach((key) => {
                        toast({
                            title: "Error",
                            description: errors[key],
                            variant: "destructive",
                        });
                    });
                },
            }
        );
    }

    return (
        <AuthenticatedLayout>
            <div className="max-w-4xl mx-auto mt-6 mb-4">
                <Button
                    variant="outline"
                    size="sm"
                    onClick={() => router.visit(route("dashboard"))}
                >
                    <ArrowLeftIcon className="mr-2 h-4 w-4" /> Back to Dashboard
                </Button>
            </div>
            <Card className="w-full max-w-4xl mx-auto mt-10">
                <CardHeader>
                    <CardTitle className="text-2xl font-bold">
                        Edit Retail Account
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    <Form {...form}>
                        <form
                            onSubmit={form.handleSubmit(onSubmit)}
                            className="space-y-8"
                        >
                            <FormField
                                control={form.control}
                                name="retail_name"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Retail Name</FormLabel>
                                        <FormControl>
                                            <Input
                                                placeholder="Enter retail name"
                                                {...field}
                                            />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name="address"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Address</FormLabel>
                                        <FormControl>
                                            <Textarea
                                                placeholder="Enter full address"
                                                {...field}
                                            />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <div className="grid grid-cols-2 gap-4">
                                <FormField
                                    control={form.control}
                                    name="kecamatan"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Kecamatan</FormLabel>
                                            <FormControl>
                                                <Input
                                                    placeholder="Enter kecamatan"
                                                    {...field}
                                                />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                                <FormField
                                    control={form.control}
                                    name="kelurahan"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Kelurahan</FormLabel>
                                            <FormControl>
                                                <Input
                                                    placeholder="Enter kelurahan"
                                                    {...field}
                                                />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <FormField
                                    control={form.control}
                                    name="city"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>City</FormLabel>
                                            <FormControl>
                                                <Input
                                                    placeholder="Enter city"
                                                    {...field}
                                                />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                                <FormField
                                    control={form.control}
                                    name="province"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Province</FormLabel>
                                            <FormControl>
                                                <Input
                                                    placeholder="Enter province"
                                                    {...field}
                                                />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <FormField
                                    control={form.control}
                                    name="country"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Country</FormLabel>
                                            <FormControl>
                                                <Input
                                                    placeholder="Enter country"
                                                    {...field}
                                                />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                                <FormField
                                    control={form.control}
                                    name="postal_code"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Postal Code</FormLabel>
                                            <FormControl>
                                                <Input
                                                    placeholder="Enter postal code"
                                                    {...field}
                                                />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <FormField
                                    control={form.control}
                                    name="handphone"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Handphone</FormLabel>
                                            <FormControl>
                                                <Input
                                                    placeholder="Enter handphone number"
                                                    {...field}
                                                />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                                <FormField
                                    control={form.control}
                                    name="email"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Email</FormLabel>
                                            <FormControl>
                                                <Input
                                                    placeholder="Enter email address"
                                                    {...field}
                                                />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                            </div>
                            <FormField
                                control={form.control}
                                name="password"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Password</FormLabel>
                                        <FormControl>
                                            <Input
                                                type="password"
                                                placeholder="Enter password"
                                                {...field}
                                            />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name="google_maps_link"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>
                                            Google Maps Link (Optional)
                                        </FormLabel>
                                        <FormControl>
                                            <div className="flex">
                                                <MapPinIcon className="w-5 h-5 mr-2 text-gray-500" />
                                                <Input
                                                    placeholder="Enter Google Maps link"
                                                    {...field}
                                                    value={field.value || ""}
                                                    onChange={(e) =>
                                                        field.onChange(
                                                            e.target.value ||
                                                                null
                                                        )
                                                    }
                                                />
                                            </div>
                                        </FormControl>
                                        <FormDescription>
                                            Provide a Google Maps link for the
                                            retail location (if available).
                                        </FormDescription>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name="end_subscription"
                                render={({ field }) => (
                                    <FormItem className="flex flex-col">
                                        <FormLabel>
                                            End Subscription Date
                                        </FormLabel>
                                        <Popover>
                                            <PopoverTrigger asChild>
                                                <FormControl>
                                                    <Button
                                                        variant={"outline"}
                                                        className={`w-full pl-3 text-left font-normal ${
                                                            !field.value &&
                                                            "text-muted-foreground"
                                                        }`}
                                                    >
                                                        {field.value &&
                                                        isValid(field.value) ? (
                                                            format(
                                                                field.value,
                                                                "yyyy-MM-dd"
                                                            )
                                                        ) : (
                                                            <span>
                                                                Pick a date
                                                            </span>
                                                        )}
                                                        <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                                                    </Button>
                                                </FormControl>
                                            </PopoverTrigger>
                                            <PopoverContent
                                                className="w-auto p-0"
                                                align="start"
                                            >
                                                <Calendar
                                                    mode="single"
                                                    selected={
                                                        field.value &&
                                                        isValid(field.value)
                                                            ? field.value
                                                            : undefined
                                                    }
                                                    onSelect={(date) =>
                                                        field.onChange(
                                                            date || null
                                                        )
                                                    }
                                                    disabled={(date) =>
                                                        date <
                                                        new Date("1900-01-01")
                                                    }
                                                    initialFocus
                                                />
                                            </PopoverContent>
                                        </Popover>
                                        <FormDescription>
                                            Select the end date for the
                                            subscription.
                                        </FormDescription>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <Button
                                type="submit"
                                className="w-full"
                                disabled={isSubmitting}
                            >
                                {isSubmitting
                                    ? "Updating..."
                                    : "Update Retail Account"}
                            </Button>
                        </form>
                    </Form>
                </CardContent>
            </Card>
        </AuthenticatedLayout>
    );
}
