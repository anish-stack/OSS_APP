import React, { useEffect, useState } from 'react';
import axios from 'axios';

const ManageWithdraw = () => {
    const [withdrawals, setWithdrawals] = useState([]);
    const [loading, setLoading] = useState(true);
    const [pagination, setPagination] = useState({ page: 1, totalPages: 1, itemsPerPage: 5 });

    const userId = new URLSearchParams(window.location.search).get('id'); // Get the userId from the URL

    useEffect(() => {
        // Fetch withdrawal data when the component mounts
        const fetchWithdrawals = async () => {
            setLoading(true);
            try {
                const response = await axios.get('http://localhost:7000/api/v1/get-withdrawal', {
                    params: {
                        id: userId,  // Pass the userId as query parameter to fetch data for the specific user
                    }
                });

                const data = response.data.data;
                setWithdrawals(data);

                // Set pagination based on the fetched data
                setPagination(prevState => ({
                    ...prevState,
                    totalPages: Math.ceil(data.length / pagination.itemsPerPage),
                }));
            } catch (error) {
                console.error("Error fetching withdrawals:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchWithdrawals();
    }, [userId, pagination.itemsPerPage]);

    const handleCheckUser = (createdAt) => {
        const requestTime = new Date(createdAt);
        alert(`Request received on: ${requestTime.toLocaleString()}`);
    };

    const handleDeleteRequest = async (id, userId) => {
        try {
            const response = await axios.delete(`http://localhost:7000/api/v1/DeleteWithdrawal/${id}/${userId}`);

            if (response.status === 200) {
                alert('Withdrawal request deleted successfully!');
                setWithdrawals(prevWithdrawals =>
                    prevWithdrawals.filter(withdrawal => withdrawal._id !== id)
                );
            }
        } catch (error) {
            console.error('Error deleting withdrawal request:', error);
            alert('Failed to delete withdrawal request. Please try again!');
        }
    };


    const handlePageChange = (newPage) => {
        if (newPage >= 1 && newPage <= pagination.totalPages) {
            setPagination(prevState => ({ ...prevState, page: newPage }));
        }
    };

    const formatTimeAgo = (timestamp) => {
        const now = Date.now();
        const diffInSeconds = Math.floor((now - new Date(timestamp).getTime()) / 1000);
        const diffInMinutes = Math.floor(diffInSeconds / 60);
        const diffInHours = Math.floor(diffInSeconds / 3600);
        const diffInDays = Math.floor(diffInSeconds / 86400);

        if (diffInMinutes < 60) {
            return `${diffInMinutes} minute${diffInMinutes !== 1 ? 's' : ''} ago`;
        } else if (diffInHours < 24) {
            return `${diffInHours} hour${diffInHours !== 1 ? 's' : ''} ago`;
        } else if (diffInDays < 7) {
            return `${diffInDays} day${diffInDays !== 1 ? 's' : ''} ago`;
        } else {
            return new Date(timestamp).toLocaleString();
        }
    };

    return (
        <div className="container mx-auto">
            <h2 className="text-2xl font-bold mb-6">Manage Withdrawals</h2>

            {/* Withdrawal Table */}
            {loading ? (
                <div className="text-center">Loading...</div>
            ) : (
                <div className="overflow-x-auto shadow-md sm:rounded-lg">
                    <table className="min-w-full text-start table-auto">
                        <thead>
                            <tr className="bg-gray-200 text-gray-700">
                                <th className="px-4 py-2 text-sm truncate">Amount</th>
                                <th className="px-4 py-2 text-sm truncate">Received Mode</th>
                                <th className="px-4 py-2 text-sm truncate">Payment Method</th>
                                <th className="px-4 py-2 text-sm truncate">Status</th>
                                <th className="px-4 py-2 text-sm truncate">Transaction ID</th>
                                <th className="px-4 py-2 text-sm truncate">Request Time</th>
                                <th className="px-4 py-2 text-sm truncate">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {withdrawals.slice((pagination.page - 1) * pagination.itemsPerPage, pagination.page * pagination.itemsPerPage).map((withdrawal) => (
                                <tr key={withdrawal._id} className="bg-white border-b hover:bg-gray-50">
                                    <td className="px-4 text-sm truncate py-2">{withdrawal.amount}</td>
                                    <td className="px-4 text-sm truncate py-2">{withdrawal.receivedMethod}</td>

                                    <td className="px-4 py-4 text-sm space-y-2">
                                        {withdrawal.receivedMethod === 'Upi' ? (
                                            <div className="space-y-1">
                                                <p className="font-semibold text-gray-700">UPI ID: <span className="font-normal text-violet-500">{withdrawal.paymentDetails.upi.id}</span></p>
                                                <p className="font-semibold text-gray-700">Name: <span className="font-normal text-violet-500">{withdrawal.paymentDetails.upi.name}</span></p>
                                            </div>
                                        ) : (
                                            <div className="space-y-1">
                                                <p className="font-semibold text-gray-700">Bank Name: <span className="font-normal text-violet-500">{withdrawal.paymentDetails.bank.name}</span></p>
                                                <p className="font-semibold text-gray-700">Account Number: <span className="font-normal text-violet-500">{withdrawal.paymentDetails.bank.accountNumber}</span></p>
                                                <p className="font-semibold text-gray-700">IFSC Code: <span className="font-normal text-violet-500">{withdrawal.paymentDetails.bank.ifscCode}</span></p>
                                            </div>
                                        )}
                                    </td>

                                    <td className="px-4 text-sm truncate py-2">
    <span 
        className={`px-2 py-1 text-sm font-semibold rounded-full text-white 
            ${withdrawal.status === 'completed' ? 'bg-green-500' 
            : withdrawal.status === 'pending' ? 'bg-yellow-500' 
            : 'bg-red-500'}`}>
        {withdrawal.status}
    </span>
</td>
                                    <td className="px-4 text-sm truncate py-2">{withdrawal.transactionId || "Not Initiated"}</td>
                                    <td className="px-4 text-sm truncate py-2">{formatTimeAgo(withdrawal.createdAt)}</td>
                                    <td className="px-4 text-sm truncate py-2">
                                        {withdrawal.userId && (
                                            <div className='flex items-center justify-between space-x-2'>
                                                <button
                                                    className="px-2 py-1 text-sm text-white bg-blue-500 rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-400"
                                                    onClick={() => window.location.href = (`/Users?id=${withdrawal.userId}`)}
                                                >
                                                    Check User
                                                </button>
                                                <button
                                                    className="px-2 py-1 text-sm text-white bg-red-500 rounded-md hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-red-400"
                                                    onClick={() => handleDeleteRequest(withdrawal._id, withdrawal.userId)} // Assuming you have a delete function
                                                >
                                                    Delete
                                                </button>
                                                <button
                                                    className="px-2 py-1 text-sm text-white bg-green-500 rounded-md hover:bg-green-600 focus:outline-none focus:ring-2 focus:ring-green-400"
                                                    onClick={() => window.location.href = (`/transfer-amount?id=${withdrawal.userId}&withdrawal=${withdrawal._id}`)}
                                                >
                                                    Transfer
                                                </button>
                                            </div>
                                        )}
                                    </td>


                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}

            {/* Pagination Controls */}
            <div className="mt-4 flex justify-between">
                <button
                    onClick={() => handlePageChange(pagination.page - 1)}
                    disabled={pagination.page <= 1}
                    className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 disabled:bg-gray-300"
                >
                    Previous
                </button>
                <span className="flex items-center">
                    Page {pagination.page} of {pagination.totalPages}
                </span>
                <button
                    onClick={() => handlePageChange(pagination.page + 1)}
                    disabled={pagination.page >= pagination.totalPages}
                    className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 disabled:bg-gray-300"
                >
                    Next
                </button>
            </div>
        </div>
    );
};

export default ManageWithdraw;
