import { useState } from "react";
import { Button } from "@/Components/ui/button";
import { Input } from "@/Components/ui/input";
import { Label } from "@/Components/ui/label";
import {
    Card,
    CardHeader,
    CardTitle,
    CardDescription,
    CardContent,
    CardFooter,
} from "@/Components/ui/card";
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { Head, router } from "@inertiajs/react";

export default function AddSupplier() {
    const [name, setName] = useState("");
    const [contact, setContact] = useState("");

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        // Implementasi logika untuk menyimpan data supplier
        router.post("/suppliers", {
            name: name,
            contact_info: contact,
        });
        console.log("Supplier added:", { name, contact });

        // Reset form
        setName("");
        setContact("");
    };

    return (
        <AuthenticatedLayout>
            <Head title="Add Supplier" />
            <Card className="w-full max-w-4xl mx-auto mt-10">
                <CardHeader>
                    <CardTitle>Add Supplier</CardTitle>
                    <CardDescription>
                        Enter the information of the new supplier below.
                    </CardDescription>
                </CardHeader>
                <form onSubmit={handleSubmit}>
                    <CardContent className="space-y-4">
                        <div className="space-y-2">
                            <Label htmlFor="name">Supplier Name</Label>
                            <Input
                                id="name"
                                placeholder="Masukkan nama supplier"
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                required
                            />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="contact">Contact Info</Label>
                            <Input
                                id="contact"
                                placeholder="Masukkan nomor telepon atau email"
                                value={contact}
                                onChange={(e) => setContact(e.target.value)}
                                required
                            />
                        </div>
                    </CardContent>
                    <CardFooter>
                        <Button type="submit" className="w-full">
                            Add Supplier
                        </Button>
                    </CardFooter>
                </form>
            </Card>
        </AuthenticatedLayout>
    );
}
