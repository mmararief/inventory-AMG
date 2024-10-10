import React from "react";
import { useState } from "react";
import { Plus, Pencil, Trash2, Search, Filter } from "lucide-react";
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { Combobox } from "@/Components/ui/Combobox";
import { Button } from "@/Components/ui/button";
import { Input } from "@/Components/ui/input";

import { Label } from "@/Components/ui/label";
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
import { Inventory, Category, Location } from "@/types/types";

import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/Components/ui/select";

export const UpdateInventory = ({
    item,
    locations,
    setInventory,
}: {
    item: Inventory;
    locations: Location[];
    setInventory: React.Dispatch<React.SetStateAction<Inventory[]>>;
}) => {
    const [editingItem, setEditingItem] = useState<Inventory | null>(null);
    const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);

    const handleEditItem = () => {
        if (editingItem) {
            setInventory((prevInventory) =>
                prevInventory.map((item) =>
                    item.id === editingItem.id ? editingItem : item
                )
            );
            router.put(`/inventory/${editingItem.id}`, {
                quantity: editingItem.quantity,
                location_id: editingItem.location.id,
            });
            setEditingItem(null);
            setIsEditDialogOpen(false);
        }
    };
    return (
        <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
            <DialogTrigger asChild>
                <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => setEditingItem(item)}
                >
                    <Pencil className="h-4 w-4" />
                    <span className="sr-only">Edit {item.product.name}</span>
                </Button>
            </DialogTrigger>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Edit Inventory Item</DialogTitle>
                    <DialogDescription>
                        Make changes to the inventory item details.
                    </DialogDescription>
                </DialogHeader>
                {editingItem && (
                    <div className="grid gap-4 py-4">
                        <div className="grid grid-cols-4 items-center gap-4">
                            <Label htmlFor="edit-name" className="text-right">
                                Name
                            </Label>
                            <Input
                                disabled
                                id="edit-name"
                                value={editingItem.product.name}
                                className="col-span-3"
                            />
                        </div>

                        <div className="grid grid-cols-4 items-center gap-4">
                            <Label
                                htmlFor="edit-quantity"
                                className="text-right"
                            >
                                Quantity
                            </Label>
                            <Input
                                id="edit-quantity"
                                type="number"
                                value={editingItem.quantity}
                                onChange={(e) =>
                                    setEditingItem({
                                        ...editingItem,
                                        quantity: parseInt(e.target.value),
                                    })
                                }
                                className="col-span-3"
                            />
                        </div>

                        <div className="grid grid-cols-4 items-center gap-4">
                            <Label
                                htmlFor="edit-location"
                                className="text-right"
                            >
                                Location
                            </Label>
                            <Combobox
                                items={locations.map((location) => ({
                                    value: location.id.toString(),
                                    label: location.name,
                                }))}
                                placeholder="Select a location"
                                onSelect={(value) =>
                                    setEditingItem({
                                        ...editingItem,
                                        location: locations.find(
                                            (location) =>
                                                location.id === parseInt(value)
                                        )!, // Add non-null assertion operator
                                    })
                                }
                            />
                        </div>
                    </div>
                )}
                <DialogFooter>
                    <Button onClick={handleEditItem}>Save Changes</Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
};
