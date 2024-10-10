import { useState } from "react";
import { Plus, Pencil, Trash2, Search } from "lucide-react";
import SupplierCreate from "./create";
import { Button } from "@/Components/ui/button";
import { Input } from "@/Components/ui/input";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/Components/ui/table";
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

interface Props {
    supplier: Supplier;
    setSuppliers: React.Dispatch<React.SetStateAction<Supplier[]>>;
}
interface Supplier {
    id: number;
    name: string;
    contact_info: string;
}
import { router } from "@inertiajs/react";
const editSupplier = ({ supplier, setSuppliers }: Props) => {
    const [editingSupplier, setEditingSupplier] = useState<Supplier | null>(
        null
    );
    const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
    const handleEditSupplier = () => {
        if (editingSupplier) {
            router.put(`/suppliers/${editingSupplier.id}`, {
                name: editingSupplier.name,
                contact_info: editingSupplier.contact_info,
            });
            console.log(editingSupplier);
            setSuppliers((prevSuppliers: Supplier[]) =>
                prevSuppliers.map((supplier) =>
                    supplier.id === editingSupplier.id
                        ? editingSupplier
                        : supplier
                )
            );

            setEditingSupplier(null);
            setIsEditDialogOpen(false);
        }
    };

    return (
        <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
            <DialogTrigger asChild>
                <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => setEditingSupplier(supplier)}
                >
                    <Pencil className="h-4 w-4" />
                    <span className="sr-only">Edit {supplier.name}</span>
                </Button>
            </DialogTrigger>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Edit Supplier</DialogTitle>
                    <DialogDescription>
                        Make changes to the supplier details.
                    </DialogDescription>
                </DialogHeader>
                {editingSupplier && (
                    <div className="grid gap-4 py-4">
                        <div className="grid grid-cols-4 items-center gap-4">
                            <Label htmlFor="edit-name" className="text-right">
                                Name
                            </Label>
                            <Input
                                id="edit-name"
                                value={editingSupplier.name}
                                onChange={(e) =>
                                    setEditingSupplier({
                                        ...editingSupplier,
                                        name: e.target.value,
                                    })
                                }
                                className="col-span-3"
                            />
                        </div>
                        <div className="grid grid-cols-4 items-center gap-4">
                            <Label
                                htmlFor="edit-contact"
                                className="text-right"
                            >
                                Contact
                            </Label>
                            <Input
                                id="edit-contact"
                                value={editingSupplier.contact_info}
                                onChange={(e) =>
                                    setEditingSupplier({
                                        ...editingSupplier,
                                        contact_info: e.target.value,
                                    })
                                }
                                className="col-span-3"
                            />
                        </div>
                    </div>
                )}
                <DialogFooter>
                    <Button onClick={handleEditSupplier}>Save Changes</Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
};

export default editSupplier;
