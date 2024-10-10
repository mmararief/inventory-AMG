import React from "react";
import { useState } from "react";
import { ArrowDownCircle } from "lucide-react";
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

export const StockOutInventory = ({
    item,
    locations,
    setInventory,
}: {
    item: Inventory;
    locations: Location[];
    setInventory: React.Dispatch<React.SetStateAction<Inventory[]>>;
}) => {
    const [stockOutItem, setStockOutItem] = useState<Inventory | null>(null);
    const [stockOutQuantity, setStockOutQuantity] = useState<number>(0);
    const [isStockOutDialogOpen, setIsStockOutDialogOpen] = useState(false);

    const handleStockOutItem = () => {
        if (
            stockOutItem &&
            stockOutQuantity > 0 &&
            stockOutQuantity <= stockOutItem.quantity
        ) {
            setInventory((prevInventory) =>
                prevInventory.map((item) =>
                    item.id === stockOutItem.id
                        ? {
                              ...item,
                              quantity: item.quantity - stockOutQuantity,
                          }
                        : item
                )
            );
            router.put(`/inventory/stock-out/${stockOutItem.id}`, {
                quantity: stockOutQuantity,
                location_id: stockOutItem.location.id,
            });
            setStockOutItem(null);
            setStockOutQuantity(0);
            setIsStockOutDialogOpen(false);
        }
    };

    return (
        <Dialog
            open={isStockOutDialogOpen}
            onOpenChange={setIsStockOutDialogOpen}
        >
            <DialogTrigger asChild>
                <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => {
                        setStockOutItem(item);
                        setStockOutQuantity(0);
                    }}
                >
                    <ArrowDownCircle className="h-4 w-4" />
                    <span className="sr-only">
                        Stock Out {item.product.name}
                    </span>
                </Button>
            </DialogTrigger>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Stock Out</DialogTitle>
                    <DialogDescription>
                        Enter the details for the inventory action.
                    </DialogDescription>
                </DialogHeader>
                {stockOutItem && (
                    <div className="grid gap-4 py-4">
                        <div className="grid grid-cols-4 items-center gap-4">
                            <Label htmlFor="edit-name" className="text-right">
                                Name
                            </Label>
                            <Input
                                disabled
                                id="edit-name"
                                value={stockOutItem.product.name}
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
                                value={stockOutItem.location.id.toString()}
                                onValueChange={(value) => {
                                    const selectedLocation = locations.find(
                                        (loc) => loc.id.toString() === value
                                    );
                                    if (selectedLocation) {
                                        setStockOutItem({
                                            ...stockOutItem,
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
                                htmlFor="available-quantity"
                                className="text-right"
                            >
                                Available Quantity
                            </Label>
                            <Input
                                id="available-quantity"
                                value={stockOutItem.quantity}
                                disabled
                                className="col-span-3"
                            />
                        </div>

                        <div className="grid grid-cols-4 items-center gap-4">
                            <Label
                                htmlFor="stock-out-quantity"
                                className="text-right"
                            >
                                Quantity to Stock Out
                            </Label>
                            <Input
                                id="stock-out-quantity"
                                type="number"
                                min="1"
                                max={stockOutItem.quantity}
                                value={stockOutQuantity}
                                onChange={(e) =>
                                    setStockOutQuantity(
                                        Math.min(
                                            parseInt(e.target.value) || 0,
                                            stockOutItem.quantity
                                        )
                                    )
                                }
                                className="col-span-3"
                            />
                        </div>
                    </div>
                )}
                <DialogFooter>
                    <Button onClick={handleStockOutItem}>Save Changes</Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
};
