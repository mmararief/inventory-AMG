import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import DeleteUserForm from "./Partials/DeleteUserForm";
import UpdatePasswordForm from "./Partials/UpdatePasswordForm";
import UpdateProfileInformationForm from "./Partials/UpdateProfileInformationForm";
import { Head, usePage } from "@inertiajs/react";
import { PageProps } from "@/types";
import { Card, CardHeader, CardTitle, CardContent } from "@/Components/ui/card";

export default function Edit({
    mustVerifyEmail,
    status,
    subscriptionStatus,
    subscriptionEndDate,
}: PageProps<{
    mustVerifyEmail: boolean;
    status?: string;
    subscriptionStatus: string;
    subscriptionEndDate: string | null;
}>) {
    const user = usePage().props.auth.user;
    return (
        <AuthenticatedLayout
            header={
                <h2 className="font-semibold text-xl text-gray-800 leading-tight">
                    Profile
                </h2>
            }
        >
            <Head title="Profile" />

            <div className="py-12">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8 space-y-6">
                    {user.role === "user" && (
                        <div className="flex flex-col sm:flex-row sm:space-x-6 sm:space-y-0 space-y-6">
                            <Card
                                className={`shadow sm:rounded-lg flex-1 ${
                                    subscriptionStatus === "Active" ||
                                    subscriptionStatus === "active"
                                        ? "bg-green-100"
                                        : "bg-red-100"
                                }`}
                            >
                                <CardHeader>
                                    <CardTitle className="text-lg font-medium text-gray-900">
                                        Account Status
                                    </CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <p
                                        className={`text-sm ${
                                            subscriptionStatus === "Active" ||
                                            subscriptionStatus === "active"
                                                ? "text-green-600"
                                                : "text-red-600"
                                        }`}
                                    >
                                        Status: {subscriptionStatus}
                                    </p>
                                </CardContent>
                            </Card>

                            <Card
                                className={`shadow sm:rounded-lg flex-1 ${
                                    subscriptionStatus === "Active" ||
                                    subscriptionStatus === "active"
                                        ? "bg-green-100"
                                        : "bg-red-100"
                                }`}
                            >
                                <CardHeader>
                                    <CardTitle className="text-lg font-medium text-gray-900">
                                        Subscription Status
                                    </CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <p
                                        className={`text-sm ${
                                            subscriptionStatus === "Active" ||
                                            subscriptionStatus === "active"
                                                ? "text-green-600"
                                                : "text-red-600"
                                        }`}
                                    >
                                        Subscription: {subscriptionEndDate}
                                    </p>
                                </CardContent>
                            </Card>
                        </div>
                    )}
                    <div className="p-4 sm:p-8 bg-white shadow sm:rounded-lg">
                        <UpdateProfileInformationForm
                            mustVerifyEmail={mustVerifyEmail}
                            status={status}
                            className="max-w-xl"
                        />
                    </div>

                    <div className="p-4 sm:p-8 bg-white shadow sm:rounded-lg">
                        <UpdatePasswordForm className="max-w-xl" />
                    </div>

                    <div className="p-4 sm:p-8 bg-white shadow sm:rounded-lg">
                        <DeleteUserForm className="max-w-xl" />
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
