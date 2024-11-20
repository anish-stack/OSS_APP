import React, { useState, useEffect } from "react";
import axios from "axios";
import { toast } from "react-hot-toast";
import { Link } from "react-router-dom";
import PrintBill from "./PrintBill";

const Orders = () => {
    const [orders, setOrders] = useState([]);
    const [filteredOrders, setFilteredOrders] = useState([]);
    const [search, setSearch] = useState("");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [currentPage, setCurrentPage] = useState(1);
    const [selectedOrder, setSelectedOrder] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const itemsPerPage = 5;

    useEffect(() => {
        const fetchOrders = async () => {
            setLoading(true);
            try {
                const response = await axios.get("http://localhost:7000/api/v1/get-all-order");
                if (response.data.success) {
                    setOrders(response.data.data);
                    setFilteredOrders(response.data.data);
                } else {
                    setError("Failed to fetch orders.");
                }
            } catch (err) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };
        fetchOrders();
    }, []);

    const handleSearch = (e) => {
        const value = e.target.value.toLowerCase();
        setSearch(value);
        const filtered = orders.filter((order) =>
            order.City.toLowerCase().includes(value) ||
            order.PinCode.includes(value) ||
            order.OrderStatus.toLowerCase().includes(value)
        );
        setFilteredOrders(filtered);
    };

    const handleRowClick = (order) => {
        setSelectedOrder(order);
        setIsModalOpen(true);
    };

    const handleMarkOrderDelivered = async (id) => {
        const order = orders.find((order) => order._id === id);
        if (order.OrderStatus === "pending") {
            toast.error("Cannot mark a pending order as delivered.");
            return;
        }

        try {
            const response = await axios.post(`http://localhost:7000/api/v1/mark-order-delivered`, {
                orderId: id
            });
            if (response.data.success) {
                toast.success("Order marked as delivered!");
                // Update orders list after marking as delivered
                setOrders(orders.map(order => order._id === id ? { ...order, OrderStatus: "Delivered" } : order));
                setFilteredOrders(filteredOrders.map(order => order._id === id ? { ...order, OrderStatus: "Delivered" } : order));
            } else {
                toast.error("Failed to mark order as delivered.");
            }
        } catch (err) {
            console.log(err)
            toast.error("Error marking order as delivered.");
        }
    };

    const handleAcceptOrder = async (id) => {
        try {
            const response = await axios.put(`http://localhost:7000/api/v1/update-orders-status/${id}`, {
                OrderStatus: "Accepted"
            });
            if (response.data.success) {
                toast.success("Order accepted!");
                // Update orders list after accepting the order
                setOrders(orders.map(order => order._id === id ? { ...order, OrderStatus: "Accepted" } : order));
                setFilteredOrders(filteredOrders.map(order => order._id === id ? { ...order, OrderStatus: "Accepted" } : order));
            } else {
                toast.error("Failed to accept the order.");
            }
        } catch (err) {
            toast.error("Error accepting the order.");
        }
    };

    const closeModal = () => {
        setSelectedOrder(null);
        setIsModalOpen(false);
    };

    const totalPages = Math.ceil(filteredOrders.length / itemsPerPage);
    const currentOrders = filteredOrders.slice(
        (currentPage - 1) * itemsPerPage,
        currentPage * itemsPerPage
    );

    return (
        <div className="p-4">
            <h1 className="text-2xl font-semibold mb-4">Orders</h1>
            {loading ? (
                <div className="flex justify-center items-center">
                    <div className="spinner-border text-blue-500" role="status"></div>
                </div>
            ) : error ? (
                <div className="text-red-500 text-center">{error}</div>
            ) : (
                <>
                    <div className="mb-4">
                        <input
                            type="text"
                            value={search}
                            onChange={handleSearch}
                            placeholder="Search by City, PinCode, or Status"
                            className="border rounded w-full p-2"
                        />
                    </div>
                    <table className="table-auto w-full border-collapse border border-gray-300">
                        <thead>
                            <tr className="bg-gray-200">
                                <th className="border text-nowrap border-gray-300 px-4 py-2">Product</th>
                                <th className="border text-nowrap border-gray-300 px-4 py-2">User</th>
                                <th className="border text-nowrap border-gray-300 px-4 py-2">City</th>
                                <th className="border text-nowrap border-gray-300 px-4 py-2">Referral Applied</th>
                                <th className="border text-nowrap border-gray-300 px-4 py-2">Referral Code</th>
                                <th className="border text-nowrap border-gray-300 px-4 py-2">PinCode</th>
                                <th className="border text-nowrap border-gray-300 px-4 py-2">Order Status</th>
                                <th className="border text-nowrap border-gray-300 px-4 py-2">Final Price</th>
                                <th className="border text-nowrap border-gray-300 px-4 py-2">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {currentOrders.map((order) => (
                                <tr
                                    key={order._id}
                                    className="cursor-pointer hover:bg-gray-100"
                                    onClick={() => handleRowClick(order)}
                                >
                                    <td className="border truncate border-gray-300 px-4 py-2 text-sm">
                                        {order.items.map((product, index) => {
                                            const ordinalWords = ["One", "Two", "Three", "Four", "Five", "Six", "Seven", "Eight", "Nine", "Ten"];
                                            const productLabel = ordinalWords[index] || `#${index + 1}`; // Fallback for larger numbers
                                            return (
                                                <span key={product._id} className="block">
                                                    <Link
                                                        to={`/update-product/${product.productId?._id}?type=product-information`}
                                                        className="text-blue-600 hover:text-blue-800 font-semibold rounded-lg px-2 py-1 inline-block transition-colors duration-300 bg-blue-100 hover:bg-blue-200"
                                                    >
                                                        Product {productLabel}
                                                    </Link>
                                                </span>
                                            );
                                        })}
                                    </td>
                                    <td className="border truncate border-gray-300 px-4 py-2 text-sm">
                                        {order.userId?._id ? (
                                            <Link
                                                to={`/Users?id=${order.userId._id}`}
                                                className="bg-green-500 text-white py-1 px-3 rounded-lg text-sm font-medium shadow-md hover:bg-green-600 transition duration-300"
                                            >
                                                Check User
                                            </Link>
                                        ) : (
                                            <span className="text-gray-500 italic">No User</span>
                                        )}
                                    </td>
                                    <td className="border truncate border-gray-300 px-4 py-2 text-sm">{order.City}</td>
                                    <td className="border truncate border-gray-300 px-4 py-2 text-sm">{order.isReferralCodeApplied ? 'Yes' : 'No'}</td>
                                    <td className="border truncate border-gray-300 px-4 py-2 text-sm">{order.appliedCode || 'No-Code'}</td>
                                    <td className="border truncate border-gray-300 px-4 py-2 text-sm">{order.PinCode}</td>
                                    <td className="border truncate border-gray-300 px-4 py-2 text-sm">{order.OrderStatus}</td>
                                    <td className="border truncate border-gray-300 px-4 py-2 text-sm">{order.finalMainPrice}</td>
                                    <td className="border truncate border-gray-300 px-4 py-2">
                                        <button
                                            className="bg-red-500 text-white px-2 py-1 rounded mr-2"
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                // Handle delete action
                                            }}
                                        >
                                            Delete
                                        </button>
                                        {order.OrderStatus === 'Accepted' && (

                                        <button
                                            className="bg-violet-500 text-white px-2 py-1 rounded mr-2"
                                            onClick={()=> window.location.href=`/Print?id=${order._id}`}
                                        >
                                            Print
                                        </button>
                                        )}
                                        <button
                                            className={`bg-green-500 text-white px-2 py-1 rounded `}
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                if (order.OrderStatus === "pending") {
                                                    handleAcceptOrder(order._id);
                                                } else {
                                                    handleMarkOrderDelivered(order._id);
                                                }
                                            }}

                                        >
                                            {order.OrderStatus === "pending" ? "Accept Order" : "Mark Delivered"}
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                    <div className="mt-4 flex justify-between items-center">
                        <div>
                            Showing Page {currentPage} of {totalPages}
                        </div>
                        <div>
                            <button
                                onClick={() => setCurrentPage(currentPage - 1)}
                                disabled={currentPage === 1}
                                className="bg-blue-500 text-white px-3 py-1 rounded disabled:opacity-50"
                            >
                                Previous
                            </button>
                            <button
                                onClick={() => setCurrentPage(currentPage + 1)}
                                disabled={currentPage === totalPages}
                                className="bg-blue-500 text-white px-3 py-1 rounded disabled:opacity-50"
                            >
                                Next
                            </button>
                        </div>
                    </div>
                </>
            )}


        </div>
    );
};

export default Orders;
