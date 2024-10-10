import React from "react";
import { Head } from "@inertiajs/react";

export default function SubscriptionPage() {
    return (
        <>
            <Head title="Reactivate Subscription" />
            <div className="min-h-screen flex items-center justify-center bg-gray-100">
                <div className="max-w-md w-full space-y-8 p-8 bg-white shadow rounded-lg">
                    <div className="text-center">
                        <h2 className="mt-6 text-3xl font-extrabold text-gray-900">
                            Reactivate Your Subscription
                        </h2>
                        <p className="mt-2 text-sm text-gray-600">
                            Your account is currently inactive. Please
                            resubscribe to continue using our services.
                        </p>
                    </div>
                    {/* Add subscription form or payment gateway integration here */}
                </div>
            </div>
        </>
    );
}
