import React, { useEffect, useState } from "react";
import { QRCodeSVG } from "qrcode.react";
import { ArrowLeft, Download, Printer, Share2 } from "lucide-react";
import { Button } from "@/Components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/Components/ui/card";
import { Table, TableBody, TableCell, TableRow } from "@/Components/ui/table";
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { router } from "@inertiajs/react";
import { formatToIDR } from "@/lib/rupiahFormat";

interface Product {
    id: number;
    name: string;
    description: string;
    quantity: number;
    price: number;
    category_id: number;
    location_id: number;
    category: Category;
    location: Location;
}

interface Category {
    id: number;
    name: string;
    description: string;
}

interface Location {
    id: number;
    name: string;
    description: string;
}

interface Props {
    product: Product;
}

export default function GenerateQR({ product }: Props) {
    const [qrValue, setQrValue] = useState("");

    useEffect(() => {
        if (product) {
            setQrValue(
                JSON.stringify({
                    id: product.id,
                    name: product.name,
                    description: product.description,
                    quantity: product.quantity,
                    price: product.price,
                    category: product.category.name,
                    location: product.location.name,
                })
            );
        }
    }, [product]);

    if (!product) {
        return <div>Loading...</div>;
    }

    const downloadQRCode = () => {
        const svg = document.getElementById("qr-code");
        if (svg) {
            const svgData = new XMLSerializer().serializeToString(svg);
            const svgBlob = new Blob([svgData], {
                type: "image/svg+xml;charset=utf-8",
            });
            const link = document.createElement("a");
            link.href = URL.createObjectURL(svgBlob);
            link.download = `${product.name}_QR.svg`;
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
        }
    };

    const printQRCode = () => {
        const printWindow = window.open("", "", "width=600,height=600");
        printWindow?.document.write(
            "<html><head><title>Print QR Code</title></head><body>"
        );
        printWindow?.document.write(
            document.getElementById("qr-code")?.outerHTML || ""
        );
        printWindow?.document.write("</body></html>");
        printWindow?.document.close();
        printWindow?.print();
    };

    const shareQRCode = async () => {
        if (navigator.share) {
            try {
                await navigator.share({
                    title: `QR Code for ${product.name}`,
                    text: `Scan this QR code for details about ${product.name}`,
                    url: window.location.href,
                });
            } catch (error) {
                console.error("Error sharing:", error);
            }
        } else {
            alert("Web Share API is not supported in your browser.");
        }
    };

    return (
        <AuthenticatedLayout>
            <div className="container mx-auto p-6">
                <Button
                    onClick={() => router.visit("/inventory")}
                    variant="outline"
                    className="mb-6"
                >
                    <ArrowLeft className="mr-2 h-4 w-4" /> Back to Inventory
                </Button>
                <div className="grid md:grid-cols-2 gap-6">
                    <Card>
                        <CardHeader>
                            <CardTitle className="text-2xl font-bold">
                                Product Details
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <Table>
                                <TableBody>
                                    <TableRow>
                                        <TableCell className="font-medium">
                                            Name
                                        </TableCell>
                                        <TableCell>{product.name}</TableCell>
                                    </TableRow>
                                    <TableRow>
                                        <TableCell className="font-medium">
                                            Description
                                        </TableCell>
                                        <TableCell>
                                            {product.description}
                                        </TableCell>
                                    </TableRow>
                                    <TableRow>
                                        <TableCell className="font-medium">
                                            Quantity
                                        </TableCell>
                                        <TableCell>
                                            {product.quantity}
                                        </TableCell>
                                    </TableRow>
                                    <TableRow>
                                        <TableCell className="font-medium">
                                            Price
                                        </TableCell>
                                        <TableCell>
                                            {formatToIDR(product.price)}
                                        </TableCell>
                                    </TableRow>
                                    <TableRow>
                                        <TableCell className="font-medium">
                                            Category
                                        </TableCell>
                                        <TableCell>
                                            {product.category?.name}
                                        </TableCell>
                                    </TableRow>
                                    <TableRow>
                                        <TableCell className="font-medium">
                                            Location
                                        </TableCell>
                                        <TableCell>
                                            {product.location?.name}
                                        </TableCell>
                                    </TableRow>
                                </TableBody>
                            </Table>
                        </CardContent>
                    </Card>
                    <Card>
                        <CardHeader>
                            <CardTitle className="text-2xl font-bold">
                                QR Code
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="flex flex-col items-center">
                            <div className="bg-white p-2 rounded-lg shadow-md">
                                <QRCodeSVG
                                    id="qr-code"
                                    value={qrValue}
                                    size={256}
                                    level={"H"}
                                    includeMargin={true}
                                />
                            </div>
                            <div className="flex flex-wrap justify-center gap-4 mt-6">
                                <Button
                                    onClick={downloadQRCode}
                                    variant="outline"
                                >
                                    <Download className="mr-2 h-4 w-4" />{" "}
                                    Download
                                </Button>
                                <Button onClick={printQRCode} variant="outline">
                                    <Printer className="mr-2 h-4 w-4" /> Print
                                </Button>
                                <Button onClick={shareQRCode} variant="outline">
                                    <Share2 className="mr-2 h-4 w-4" /> Share
                                </Button>
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
