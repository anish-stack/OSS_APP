import React, { useState, useEffect } from "react";
import axios from "axios";
import toast from "react-hot-toast";

const ManageProducts = () => {
    const [data, setData] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage] = useState(5);
    const [searchTerm, setSearchTerm] = useState("");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    const fetchData = async () => {
        setLoading(true);
        setError("");
        try {
            const response = await axios.get(
                "http://localhost:7000/api/v1/get-all-product"
            );
            if (response.data.success) {
                setData(response.data.products);
            } else {
                setError("Failed to fetch products.");
            }
        } catch (err) {
            setError("An error occurred while fetching products.");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
    }, []);

    // Pagination logic
    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const currentItems = data
        .filter((item) =>
            item.name.toLowerCase().includes(searchTerm.toLowerCase())
        )
        .slice(indexOfFirstItem, indexOfLastItem);

    const totalPages = Math.ceil(
        data.filter((item) =>
            item.name.toLowerCase().includes(searchTerm.toLowerCase())
        ).length / itemsPerPage
    );

    const handleDelete = async (id) => {
        try {
            const res = await axios.delete(`http://localhost:7000/api/v1/delete-product/${id}`);
            if (res.status === 200) {
                toast.success('Product deleted successfully');
                setData((prevData) => prevData.filter((product) => product._id !== id));
            }
        } catch (error) {
            toast.error('Error in Deleting Product');
        }
    };




    return (
        <div className="">
            <h1 className="text-xl font-bold mb-4">Manage Products</h1>
            <input
                type="text"
                placeholder="Search by product name..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="mb-3 p-1 border border-gray-300 rounded w-full sm:w-1/3 text-sm"
            />

            {/* Table */}
            <div className="overflow-x-auto">
                <table className="min-w-full bg-white border border-gray-200 text-sm">
                    <thead className="bg-gray-100">
                        <tr>
                            <th className="px-2 py-1 border">Image</th>
                            <th className="px-2 py-1 border">Name</th>
                            <th className="px-2 py-1 border">Price</th>
                            <th className="px-2 py-1 border">Discount (%)</th>
                            <th className="px-2 py-1 border">Final Price</th>
                            <th className="px-2 py-1 border">Quantity</th>
                            <th className="px-2 py-1 border">Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {loading ? (
                            <tr>
                                <td colSpan="7" className="text-center py-2">
                                    Loading...
                                </td>
                            </tr>
                        ) : error ? (
                            <tr>
                                <td colSpan="7" className="text-center py-2 text-red-500">
                                    {error}
                                </td>
                            </tr>
                        ) : currentItems.length > 0 ? (
                            currentItems.map((product) => (
                                <tr key={product._id} className="hover:bg-gray-50">
                                    <td className="px-2 py-1 border text-center">
                                        <img
                                            src={product.images.url}
                                            alt={product.name}
                                            className="h-12 w-12 object-cover mx-auto"
                                        />
                                    </td>
                                    <td className="px-2 py-1 border">{product.name}</td>
                                    <td className="px-2 py-1 border">₹{product.mainPrice}</td>
                                    <td className="px-2 py-1 border">{product.discountPercent}%</td>
                                    <td className="px-2 py-1 border">
                                        ₹{product.afterDiscountPrice}
                                    </td>
                                    <td className="px-2 py-1 border">{product.quantity}</td>
                                    <td className="px-2 py-1 border text-center">
                                        <button
                                            onClick={() => window.location.href = `/update-product/${product._id}`}
                                            className="px-2 py-1 bg-blue-500 text-white rounded text-xs mr-2 hover:bg-blue-600"
                                        >
                                            Update
                                        </button>
                                        <button
                                            onClick={() => handleDelete(product._id)}
                                            className="px-2 py-1 bg-red-500 text-white rounded text-xs hover:bg-red-600"
                                        >
                                            Delete
                                        </button>
                                    </td>
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan="7" className="text-center py-2">
                                    No products found.
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>

            {/* Pagination */}
            <div className="flex justify-between items-center mt-4 text-sm">
                <button
                    onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                    disabled={currentPage === 1}
                    className="px-3 py-1 bg-gray-200 rounded disabled:opacity-50"
                >
                    Previous
                </button>
                <p>
                    Page {currentPage} of {totalPages}
                </p>
                <button
                    onClick={() =>
                        setCurrentPage((prev) => Math.min(prev + 1, totalPages))
                    }
                    disabled={currentPage === totalPages}
                    className="px-3 py-1 bg-gray-200 rounded disabled:opacity-50"
                >
                    Next
                </button>
            </div>
        </div>
    );
};

export default ManageProducts;
