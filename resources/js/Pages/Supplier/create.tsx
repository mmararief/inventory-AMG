import { useState } from "react";
import { Plus } from "lucide-react";

import { Button } from "@/Components/ui/button";
import { Input } from "@/Components/ui/input";
import { router } from "@inertiajs/react";
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
interface Supplier {
    id: number;
    name: string;
    contact_info: string;
}
export default function SupplierCreate() {
    const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
    const [newSupplier, setNewSupplier] = useState<Omit<Supplier, "id">>({
        name: "",
        contact_info: "",
    });

    const handleAddSupplier = () => {
        if (newSupplier.name && newSupplier.contact_info) {
            router.post("/suppliers", newSupplier, {
                onSuccess: () => {
                    setNewSupplier({ name: "", contact_info: "" });
                    setIsAddDialogOpen(false);
                },
            });
        }
    };
    return (
        <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
            <DialogTrigger asChild>
                <Button>
                    <Plus className="mr-2 h-4 w-4" />
                    Add Supplier
                </Button>
            </DialogTrigger>
            <DialogContent>
                <form onSubmit={handleAddSupplier}>
                    <DialogHeader>
                        <DialogTitle>Add New Supplier</DialogTitle>
                        <DialogDescription>
                            Enter the details for the new supplier.
                        </DialogDescription>
                    </DialogHeader>
                    <div className="grid gap-4 py-4">
                        <div className="grid grid-cols-4 items-center gap-4">
                            <Label htmlFor="name" className="text-right">
                                Name
                            </Label>
                            <Input
                                required
                                id="name"
                                value={newSupplier.name}
                                onChange={(e) =>
                                    setNewSupplier({
                                        ...newSupplier,
                                        name: e.target.value,
                                    })
                                }
                                className="col-span-3"
                            />
                        </div>
                        <div className="grid grid-cols-4 items-center gap-4">
                            <Label htmlFor="contact" className="text-right">
                                Contact
                            </Label>
                            <Input
                                required
                                id="contact"
                                value={newSupplier.contact_info}
                                onChange={(e) =>
                                    setNewSupplier({
                                        ...newSupplier,
                                        contact_info: e.target.value,
                                    })
                                }
                                className="col-span-3"
                            />
                        </div>
                    </div>
                    <DialogFooter>
                        <Button type="submit">Add Supplier</Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
}
