import React from "react";
import { useState } from "react";
import { ArrowUpCircle } from "lucide-react";
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

export const StockInInventory = ({
    item,
    locations,
    setInventory,
}: {
    item: Inventory;
    locations: Location[];
    setInventory: React.Dispatch<React.SetStateAction<Inventory[]>>;
}) => {
    const [stockInItem, setStockInItem] = useState<Inventory | null>(null);
    const [isStockInDialogOpen, setIsStockInDialogOpen] = useState(false);

    const handleStockInItem = () => {
        if (stockInItem) {
            setInventory((prevInventory) =>
                prevInventory.map((item) =>
                    item.id === stockInItem.id
                        ? {
                              ...item,
                              quantity: item.quantity + stockInItem.quantity,
                          }
                        : item
                )
            );
            router.put(`/inventory/stock-in/${stockInItem.id}`, {
                quantity: stockInItem.quantity,
                location_id: stockInItem.location.id,
            });
            setStockInItem(null);
            setIsStockInDialogOpen(false);
        }
    };
    return (
        <Dialog
            open={isStockInDialogOpen}
            onOpenChange={setIsStockInDialogOpen}
        >
            <DialogTrigger asChild>
                <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => setStockInItem(item)}
                >
                    <ArrowUpCircle className="h-4 w-4" />
                    <span className="sr-only">
                        Stock In {item.product.name}
                    </span>
                </Button>
            </DialogTrigger>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Stock In</DialogTitle>
                    <DialogDescription>
                        Enter the details for the inventory action.
                    </DialogDescription>
                </DialogHeader>
                {stockInItem && (
                    <div className="grid gap-4 py-4">
                        <div className="grid grid-cols-4 items-center gap-4">
                            <Label htmlFor="edit-name" className="text-right">
                                Name
                            </Label>
                            <Input
                                disabled
                                id="edit-name"
                                value={stockInItem.product.name}
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
                            <Select
                                disabled
                                value={stockInItem.location.id.toString()}
                                onValueChange={(value) => {
                                    const selectedLocation = locations.find(
                                        (loc) => loc.id.toString() === value
                                    );
                                    if (selectedLocation) {
                                        setStockInItem({
                                            ...stockInItem,
                                            location: {
                                                id: selectedLocation.id,
                                                name: selectedLocation.name,
                                                volume: selectedLocation.volume,
                                                remaining_volume:
                                                    selectedLocation.remaining_volume,
                                            },
                                        });
                                    }
                                }}
                            >
                                <SelectTrigger className="col-span-3">
                                    <SelectValue placeholder="Select a location" />
                                </SelectTrigger>
                                <SelectContent>
                                    {locations.map((location) => (
                                        <SelectItem
                                            key={location.id}
                                            value={location.id.toString()}
                                        >
                                            {location.name}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>

                        <div className="grid grid-cols-4 items-center gap-4">
                            <Label
                                htmlFor="stock-in-quantity"
                                className="text-right"
                            >
                                Quantity
                            </Label>
                            <Input
                                id="stock-in-quantity"
                                type="number"
                                onChange={(e) =>
                                    setStockInItem({
                                        ...stockInItem,
                                        quantity: parseInt(e.target.value),
                                    })
                                }
                                className="col-span-3"
                            />
                        </div>
                    </div>
                )}
                <DialogFooter>
                    <Button onClick={handleStockInItem}>Save Changes</Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
};
