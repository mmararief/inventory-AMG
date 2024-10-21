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
import { ReactNode } from "react";
import { Dispatch, SetStateAction } from "react";

interface MoveStockItem extends Inventory {
    destinationLocation?: Location;
    quantityToMove: number;
}

interface LocationWithVolume extends Location {
    remaining_volume: number;
}

interface MoveStockInventoryProps {
    item: Inventory;
    locations: Location[];
    setInventory: Dispatch<SetStateAction<Inventory[]>>;
    children: ReactNode;
}

export const MoveStockInventory: React.FC<MoveStockInventoryProps> = ({
    item,
    locations,
    setInventory,
    children,
}) => {
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
        <Button
            onClick={handleMoveStockItem}
            className="w-full"
            variant="ghost"
        >
            <ArrowLeftRight className="h-6 w-6 mr-2" />
            {children}
        </Button>
    );
};
