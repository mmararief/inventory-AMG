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
import { Combobox } from "@/Components/ui/Combobox";

export default function AddType({ categories }: { categories: any[] }) {
    const [name, setName] = useState("");
    const [category_id, setCategoryId] = useState(0);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        // Implementasi logika untuk menyimpan data supplier
        router.post("/types", {
            name: name,
            category_id: category_id,
        });
        console.log("Type added:", { name, category_id });

        // Reset form
        setName("");
        setCategoryId(0);
    };

    return (
        <AuthenticatedLayout>
            <Head title="Add Type" />
            <Card className="w-full max-w-4xl mx-auto mt-10">
                <CardHeader>
                    <CardTitle>Add Type</CardTitle>
                    <CardDescription>
                        Enter the information of the new type below.
                    </CardDescription>
                </CardHeader>
                <form onSubmit={handleSubmit}>
                    <CardContent className="space-y-4">
                        <div className="space-y-2">
                            <Label htmlFor="name">Type Name</Label>
                            <Input
                                id="name"
                                placeholder="Enter type name"
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                required
                            />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="category">Category</Label>
                            <div className="col-span-3">
                                <Combobox
                                    className="w-full"
                                    items={categories.map((category) => ({
                                        value: category.id.toString(),
                                        label: category.name,
                                    }))}
                                    placeholder="Select a category"
                                    onSelect={(value) =>
                                        setCategoryId(parseInt(value))
                                    }
                                />
                            </div>
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
