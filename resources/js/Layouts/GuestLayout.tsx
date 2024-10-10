import { Eye, EyeOff, Box } from "lucide-react";
import { Link } from "@inertiajs/react";
import { PropsWithChildren } from "react";
import { Toaster } from "@/Components/ui/toaster";

const ApplicationLogo = () => <Box className="w-16 h-16 text-primary" />;
export default function Guest({ children }: PropsWithChildren) {
    return (
        <div className="min-h-screen flex flex-col sm:justify-center items-center pt-6 sm:pt-0 bg-gray-100">
            <div className="w-full sm:max-w-md mt-6 px-6 py-4 bg-white shadow-md overflow-hidden sm:rounded-lg">
                <div className="flex justify-center ">
                    <Link href="/">
                        <ApplicationLogo />
                    </Link>
                </div>
                {children}
            </div>
            <Toaster />
        </div>
    );
}
