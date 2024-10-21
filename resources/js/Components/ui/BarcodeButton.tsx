import React, { useState } from "react";
import { Barcode } from "lucide-react";
import BarcodeGenerator from "react-barcode";
import { Button } from "@/Components/ui/button";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogFooter,
} from "@/Components/ui/dialog";

interface BarcodeButtonProps {
    productCode: string;
}

const BarcodeButton: React.FC<BarcodeButtonProps> = ({ productCode }) => {
    const [isOpen, setIsOpen] = useState(false);

    const handleShowBarcode = () => {
        setIsOpen(true);
    };

    return (
        <>
            <Button variant="ghost" size="icon" onClick={handleShowBarcode}>
                <Barcode className="h-4 w-4" />

                <span className="sr-only">Show Barcode</span>
            </Button>

            <Dialog open={isOpen} onOpenChange={setIsOpen}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Product Barcode</DialogTitle>
                    </DialogHeader>
                    <div className="flex justify-center items-center p-4">
                        <BarcodeGenerator value={productCode} />
                    </div>
                    <DialogFooter>
                        <Button onClick={() => setIsOpen(false)}>Close</Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </>
    );
};

export default BarcodeButton;
