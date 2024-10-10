import { useState } from "react";
import { CalendarIcon } from "lucide-react";
import { format } from "date-fns";
import { cn } from "@/lib/utils";
import { Button } from "@/Components/ui/button";
import { Calendar } from "@/Components/ui/calendar";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/Components/ui/dialog";
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/Components/ui/popover";
import { useToast } from "@/hooks/use-toast";

interface SubscriptionExtensionModalProps {
    isOpen: boolean;
    onClose: () => void;
    currentEndDate: Date;
    accountId: string;
    accountName: string;
}

export function SubscriptionExtensionModal({
    isOpen,
    onClose,
    currentEndDate,
    accountId,
    accountName,
}: SubscriptionExtensionModalProps) {
    console.log(currentEndDate);
    const { toast } = useToast();
    const [newEndDate, setNewEndDate] = useState<Date | undefined>(
        new Date(currentEndDate)
    );
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleSubmit = async () => {
        if (!newEndDate) {
            toast({
                title: "Error",
                description:
                    "Please select a new end date for the subscription.",
                variant: "destructive",
            });
            return;
        }

        setIsSubmitting(true);

        // Here you would typically send the data to your backend
        // This is a simulated API call
        try {
            await new Promise((resolve) => setTimeout(resolve, 1500)); // Simulating API delay

            toast({
                title: "Subscription Extended",
                description: `The subscription for ${accountName} has been extended to ${format(
                    newEndDate,
                    "PPP"
                )}.`,
            });
            onClose();
        } catch (error) {
            toast({
                title: "Error",
                description:
                    "Failed to extend the subscription. Please try again.",
                variant: "destructive",
            });
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                    <DialogTitle>Extend Subscription</DialogTitle>
                    <DialogDescription>
                        Extend the subscription for {accountName}. Current end
                        date is {format(currentEndDate, "PPP")}.
                    </DialogDescription>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                    <div className="grid grid-cols-4 items-center gap-4">
                        <label htmlFor="name" className="text-right">
                            New End Date
                        </label>
                        <Popover>
                            <PopoverTrigger asChild>
                                <Button
                                    id="date"
                                    variant={"outline"}
                                    className={cn(
                                        "w-[280px] justify-start text-left font-normal",
                                        !newEndDate && "text-muted-foreground"
                                    )}
                                >
                                    <CalendarIcon className="mr-2 h-4 w-4" />
                                    {newEndDate ? (
                                        format(newEndDate, "PPP")
                                    ) : (
                                        <span>Pick a date</span>
                                    )}
                                </Button>
                            </PopoverTrigger>
                            <PopoverContent className="w-auto p-0">
                                <Calendar
                                    mode="single"
                                    selected={newEndDate}
                                    onSelect={setNewEndDate}
                                    initialFocus
                                    disabled={(date) =>
                                        date <= new Date() ||
                                        date <= currentEndDate
                                    }
                                />
                            </PopoverContent>
                        </Popover>
                    </div>
                </div>
                <DialogFooter>
                    <Button type="button" variant="secondary" onClick={onClose}>
                        Cancel
                    </Button>
                    <Button
                        type="submit"
                        onClick={handleSubmit}
                        disabled={isSubmitting}
                    >
                        {isSubmitting ? "Extending..." : "Extend Subscription"}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
