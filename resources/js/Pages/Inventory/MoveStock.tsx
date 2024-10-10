import React, { useState } from "react";
import { Inventory, Location } from "@/types/types";
import { ArrowLeftRight } from "lucide-react";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/Components/ui/dialog";
import { Card, CardContent, CardHeader, CardTitle } from "@/Components/ui/card";
import { Button } from "@/Components/ui/button";
import { Label } from "@/Components/ui/label";
import { Input } from "@/Components/ui/input";
import { Product } from "@/types/types";
import { useToast } from "@/hooks/use-toast";
import { router } from "@inertiajs/react";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/Components/ui/select";

interface MoveStockItem extends Inventory {
    destinationLocation?: Location;
    quantityToMove: number;
}

interface LocationWithVolume extends Location {
    remaining_volume: number;
}

export const MoveStockInventory = ({
    item,
    locations,
    setInventory,
}: {
    item: Inventory;
    locations: LocationWithVolume[];
    setInventory: React.Dispatch<React.SetStateAction<Inventory[]>>;
}) => {
    console.log(locations);
    const { toast } = useToast();
    const [isMoveStockDialogOpen, setIsMoveStockDialogOpen] = useState(false);
    const [itemToMoveStock, setItemToMoveStock] =
        useState<MoveStockItem | null>(null);

    const handleMoveStockItem = () => {
        if (
            itemToMoveStock &&
            itemToMoveStock.destinationLocation &&
            itemToMoveStock.quantityToMove > 0
        ) {
            setInventory((prevInventory) =>
                prevInventory.map((item) =>
                    item.id === itemToMoveStock.id
                        ? {
                              ...item,
                              location:
                                  itemToMoveStock.destinationLocation ||
                                  item.location,
                          }
                        : item
                )
            );
            router.put(`/inventory/move-stock/${item.id}`, {
                location_id: itemToMoveStock.destinationLocation.id,
                quantity: itemToMoveStock.quantityToMove,
            });
            toast({
                title: "Stock moved",
                description: "Stock moved successfully",
            });
            setItemToMoveStock(null);
            setIsMoveStockDialogOpen(false);
        }
    };

    return (
        <Dialog
            open={isMoveStockDialogOpen}
            onOpenChange={setIsMoveStockDialogOpen}
        >
            <DialogTrigger asChild>
                <Button
                    variant="ghost"
                    size="icon"
                    onClick={() =>
                        setItemToMoveStock({ ...item, quantityToMove: 0 })
                    }
                >
                    <ArrowLeftRight className="h-4 w-4" />
                    <span className="sr-only">
                        Move Stock {item.product.name}
                    </span>
                </Button>
            </DialogTrigger>

            <DialogContent>
                <form onSubmit={handleMoveStockItem}>
                    <DialogHeader>
                        <DialogTitle>Move Stock</DialogTitle>
                        <DialogDescription>
                            Are you sure you want to move this inventory item?
                        </DialogDescription>
                    </DialogHeader>
                    <div className="grid gap-4 py-4">
                        <div className="grid grid-cols-4 items-center gap-4">
                            <Label htmlFor="edit-name" className="text-right">
                                Name
                            </Label>
                            <Input
                                disabled
                                id="edit-name"
                                value={itemToMoveStock?.product.name}
                                className="col-span-3"
                            />
                        </div>
                        <div className="grid grid-cols-4 items-center gap-4">
                            <Label
                                htmlFor="edit-location"
                                className="text-right"
                            >
                                From
                            </Label>
                            <Input
                                disabled
                                id="edit-location"
                                value={itemToMoveStock?.location.name}
                                className="col-span-3"
                            />
                            <Label
                                htmlFor="edit-location"
                                className="text-right"
                            >
                                To
                            </Label>
                            <Select
                                value={
                                    itemToMoveStock?.destinationLocation?.id.toString() ||
                                    ""
                                }
                                onValueChange={(value) => {
                                    const selectedLocation = locations.find(
                                        (loc) => loc.id.toString() === value
                                    );
                                    if (selectedLocation) {
                                        setItemToMoveStock((prev) => ({
                                            ...prev!,
                                            destinationLocation:
                                                selectedLocation,
                                        }));
                                    }
                                }}
                            >
                                <SelectTrigger className="col-span-3">
                                    <SelectValue placeholder="Select destination" />
                                </SelectTrigger>
                                <SelectContent>
                                    {locations.map((location) => (
                                        <SelectItem
                                            key={location.id}
                                            value={location.id.toString()}
                                        >
                                            {location.name} (Remaining:{" "}
                                            {location.remaining_volume})
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>
                        <div className="grid grid-cols-4 items-center gap-4">
                            <Label
                                htmlFor="edit-quantity"
                                className="text-right"
                            >
                                Quantity to Move
                            </Label>
                            <Input
                                id="edit-quantity"
                                type="number"
                                min="1"
                                max={itemToMoveStock?.quantity || 0}
                                value={itemToMoveStock?.quantityToMove || 0}
                                onChange={(e) => {
                                    const value = parseInt(e.target.value);
                                    setItemToMoveStock((prev) => ({
                                        ...prev!,
                                        quantityToMove: isNaN(value)
                                            ? 0
                                            : value,
                                    }));
                                }}
                                className="col-span-3"
                            />
                        </div>
                        <Card className="p-4">
                            <CardHeader>
                                <CardTitle>Remaining Volumes</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="grid grid-cols-4 items-center gap-4">
                                    <Label className="text-right">Source</Label>
                                    <div className="col-span-3">
                                        {(itemToMoveStock?.quantity ?? 0) -
                                            (itemToMoveStock?.quantityToMove ??
                                                0)}
                                    </div>
                                </div>
                                <div className="grid grid-cols-4 items-center gap-4 mt-2">
                                    <Label className="text-right">
                                        Destination
                                    </Label>
                                    <div className="col-span-3">
                                        {((
                                            itemToMoveStock?.destinationLocation as LocationWithVolume
                                        )?.remaining_volume ?? 0) -
                                            (itemToMoveStock?.quantityToMove ??
                                                0)}
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    </div>
                    <DialogFooter>
                        <Button
                            variant="outline"
                            onClick={() => setItemToMoveStock(null)}
                        >
                            Cancel
                        </Button>
                        <Button
                            variant="destructive"
                            type="submit"
                            disabled={
                                !itemToMoveStock?.destinationLocation ||
                                itemToMoveStock.quantityToMove <= 0 ||
                                itemToMoveStock.quantityToMove >
                                    itemToMoveStock.quantity
                            }
                        >
                            Move
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
};
