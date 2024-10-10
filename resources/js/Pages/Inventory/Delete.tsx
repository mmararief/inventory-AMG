import { useState } from "react";
import { Trash2 } from "lucide-react";

import { Button } from "@/Components/ui/button";

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
import { Inventory } from "@/types/types";

const DeleteInventory = ({
    item,
    inventory,
    setInventory,
}: {
    item: Inventory;
    setInventory: React.Dispatch<React.SetStateAction<Inventory[]>>;
    inventory: Inventory[];
}) => {
    const [itemToDelete, setItemToDelete] = useState<Inventory | null>(null);
    const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
    const handleDeleteItem = () => {
        if (itemToDelete) {
            router.delete(`/inventory/${itemToDelete.id}`);
            setInventory(
                inventory.filter((item) => item.id !== itemToDelete.id)
            );
            setItemToDelete(null);
            setIsDeleteDialogOpen(false);
        }
    };

    return (
        <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
            <DialogTrigger asChild>
                <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => setItemToDelete(item)}
                >
                    <Trash2 className="h-4 w-4" />
                    <span className="sr-only">Delete {item.product.name}</span>
                </Button>
            </DialogTrigger>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Delete Inventory Item</DialogTitle>
                    <DialogDescription>
                        Are you sure you want to delete this inventory item?
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
                    <Button variant="destructive" onClick={handleDeleteItem}>
                        Delete
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
};

export default DeleteInventory;
