import axios from "axios";
import React, { useState, useEffect, useRef } from "react";
import { useSearchParams } from "react-router-dom";

const PrintBill = () => {
    const [searchParams] = useSearchParams();
    const id = searchParams.get('id');
    const [order, setOrder] = useState(null);

    const invoiceRef = useRef(null); // Reference to the invoice container

    // Fetch the order data based on the order ID
    const foundOrder = async () => {
        try {
            const res = await axios.get(`http://localhost:7000/api/v1/get-all-order`);
            const data = res.data.data;
            const found = data.find(item => item._id === id);
            setOrder(found);
        } catch (error) {
            console.error("Error fetching order data:", error);
        }
    };

    useEffect(() => {
        if (id) {
            foundOrder(); // Fetch the order when the component mounts or id changes
        }
    }, [id]);

    if (!order) {
        return <div>Loading...</div>; // Show loading until the order data is fetched
    }

    // Function to handle printing of the invoice
    const handlePrint = () => {
        window.print()
    };

    return (
        <div className="max-w-4xl mx-auto p-6 bg-gray-100 border border-gray-300 rounded-lg">
            {/* Header */}
            <div className="text-center mt-4">
                <button
                    onClick={()=>handlePrint()}
                    className="px-6 hide py-2 bg-blue-600 text-white rounded-lg"
                >
                    Print this
                </button>
            </div>
            <div className="text-center">
                <h1 className="text-2xl font-bold uppercase">Invoice</h1>
                <p className="text-sm">Om Sri Sale Solutions Pvt. Ltd</p>
                <p className="text-sm">379-B Badarpur, New Delhi, 110044</p>
                <p className="text-sm">Email: info@omsrisalesolutions.com</p>
                <p className="text-sm">Contact: +91 82520 74655</p>
            </div>

            {/* Print Button */}
   

            {/* Invoice Details */}
            <div ref={invoiceRef} className="mt-6 border-t border-gray-300 pt-4">
                <div className="flex justify-between">
                    <div>
                        <h2 className="font-semibold">Bill To:</h2>
                        <p>{order.userId?.FullName}</p>
                        <p>Contact: {order.userId?.ContactNumber}</p>
                        <p>Email: {order.userId?.Email}</p>
                        <p>
                            Address: {order.HouseNo}, {order.Street}, {order.City} - {order.PinCode}
                        </p>
                        <p>Landmark: {order.NearByLandMark}</p>
                    </div>
                    <div className="text-right">
                        <p className="font-semibold">Invoice No: #{order._id}</p>
                        <p>Date: {new Date(order.createdAt).toLocaleDateString()}</p>
                        <p>Order Status: {order.OrderStatus}</p>
                    </div>
                </div>

                {/* Items Section */}
                <div className="mt-6 border-t border-gray-300 pt-4">
                    <table className="w-full table-auto text-sm">
                        <thead>
                            <tr className="text-left border-b border-gray-300">
                                <th className="py-2">Item</th>
                                <th className="py-2">Quantity</th>
                                <th className="py-2">Price</th>
                                <th className="py-2">Amount</th>
                            </tr>
                        </thead>
                        <tbody>
                            {order.items?.map((item, index) => (
                                <tr key={index} className="border-b">
                                    <td className="py-2">{item.name || `Item ${index + 1}`}</td>
                                    <td className="py-2">{item.quantity}</td>
                                    <td className="py-2">₹{item.price?.toFixed(2)}</td>
                                    <td className="py-2">₹{(item.quantity * item.price).toFixed(2)}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                {/* Totals Section */}
                <div className="flex justify-between mt-6">
                    <div className="text-sm">
                        <p className="font-semibold">Notes:</p>
                        <p>Thank you for shopping with us!</p>
                    </div>
                    <div className="text-right">
                        <p className="font-semibold">Subtotal: ₹{order.finalMainPrice.toFixed(2)}</p>
                        <p>Tax (0%): ₹0.00</p>
                        <p className="font-bold">Total: ₹{order.finalMainPrice.toFixed(2)}</p>
                    </div>
                </div>

                {/* Footer */}
                <div className="mt-8 text-center text-xs text-gray-500">
                    <p>
                        This invoice was generated by Om Sri Sale Solutions Pvt. Ltd. For
                        inquiries, contact info@omsrisalesolutions.com
                    </p>
                </div>
            </div>
        </div>
    );
};

export default PrintBill;
