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

export default function AddLocation() {
    const [name, setName] = useState("");
    const [description, setDescription] = useState("");
    const [volume, setVolume] = useState(0);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        router.post("/locations", {
            name: name,
            description: description,
            volume: volume,
        });
        console.log("Location added:", { name, description, volume });

        // Reset form
        setName("");
        setDescription("");
        setVolume(0);
    };

    return (
        <AuthenticatedLayout>
            <Head title="Add Supplier" />
            <Card className="w-full max-w-4xl mx-auto mt-10">
                <CardHeader>
                    <CardTitle>Add Location</CardTitle>
                    <CardDescription>
                        Enter the information of the new location below.
                    </CardDescription>
                </CardHeader>
                <form onSubmit={handleSubmit}>
                    <CardContent className="space-y-4">
                        <div className="space-y-2">
                            <Label htmlFor="name">Location Name</Label>
                            <Input
                                id="name"
                                placeholder="Enter location name"
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                required
                            />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="description">Description</Label>
                            <Input
                                id="description"
                                placeholder="Enter description"
                                value={description}
                                onChange={(e) => setDescription(e.target.value)}
                            />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="volume">Volume</Label>
                            <Input
                                id="volume"
                                type="number"
                                value={volume}
                                onChange={(e) =>
                                    setVolume(Number(e.target.value))
                                }
                                required
                            />
                        </div>
                    </CardContent>
                    <CardFooter>
                        <Button type="submit" className="w-full">
                            Add Location
                        </Button>
                    </CardFooter>
                </form>
            </Card>
        </AuthenticatedLayout>
    );
}
