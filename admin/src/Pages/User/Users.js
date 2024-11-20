import React, { useEffect, useState } from "react";
import axios from "axios";
import { Link, useLocation } from "react-router-dom";
import toast from "react-hot-toast";

const Users = () => {
    const [users, setUsers] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [totalPages, setTotalPages] = useState(1);
    const [selectedUser, setSelectedUser] = useState(null);
    const pageSize = 8; // Number of users per page
    const location = useLocation();


    const fetchUsers = async (searchId) => {
        try {
            setLoading(true);
            let url = "http://localhost:7000/api/v1/AllUser";
            if (searchId) {
                url += `?id=${searchId}`;
            }

            const response = await axios.get(url);
            const { data, msg, success } = response.data;

            if (success) {
                setUsers(data); // Set all fetched users
                setTotalPages(Math.ceil(data.length / pageSize)); // Calculate total pages
                setError("");
            } else {
                setError(msg || "Error fetching users");
            }
        } catch (err) {
            setError(err.message || "Something went wrong");
        } finally {
            setLoading(false);
        }
    };

    const toggleDeactiveStatus = async (userId) => {
        try {
            const response = await axios.put(`http://localhost:7000/api/v1/users/deactivate/${userId}`);
            console.log(response.data.message);
            toast.success(response.data.message || "User deactivated successfully");
            fetchUsers() // Re-fetch users after deactivating
        } catch (error) {
            console.error('Error toggling deactive status', error);
        }
    };

    useEffect(() => {
        // Get search query parameter 'id' from the URL
        const searchParams = new URLSearchParams(location.search);
        const searchId = searchParams.get("id");
        fetchUsers(searchId); // Pass the searchId to the fetch function
    }, [location.search]);

    // Handle Pagination
    const handlePageChange = (newPage) => {
        if (newPage > 0 && newPage <= totalPages) {
            setCurrentPage(newPage);
        }
    };

    // Open Modal with User Details
    const handleViewUser = (user) => {
        setSelectedUser(user);
    };

    // Close Modal
    const closeModal = () => {
        setSelectedUser(null);
    };

    return (
        <div className="p-4">
            <h2 className="text-xl font-semibold text-gray-700 mb-4">Users</h2>
            {loading ? (
                <p className="text-center text-blue-500">Loading...</p>
            ) : error ? (
                <p className="text-center text-red-500">{error}</p>
            ) : (
                <div className="overflow-x-auto">
                    <table className="table-auto border-collapse border border-gray-300 w-full">
                        <thead>
                            <tr className="bg-gray-100">
                                <th className="border text-sm truncate border-gray-300 px-4 py-2">#</th>
                                <th className="border text-sm truncate border-gray-300 px-4 py-2">Full Name</th>
                                <th className="border text-sm truncate border-gray-300 px-4 py-2">Email</th>
                                <th className="border text-sm truncate border-gray-300 px-4 py-2">Contact Number</th>
                                <th className="border text-sm truncate border-gray-300 px-4 py-2">Referral Code</th>
                                <th className="border text-sm truncate border-gray-300 px-4 py-2">Bonus Earn</th>
                                <th className="border text-sm truncate border-gray-300 px-4 py-2">Done Referrals</th>
                                <th className="border text-sm truncate border-gray-300 px-4 py-2">Withdrawal</th>




                                <th className="border text-sm truncate border-gray-300 px-4 py-2">Role</th>
                                <th className="border text-sm truncate border-gray-300 px-4 py-2">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {users.slice((currentPage - 1) * pageSize, currentPage * pageSize).map((user, index) => (
                                <tr key={user._id} className="hover:bg-gray-50">
                                    <td className="border text-sm truncate border-gray-300 px-4 py-2">{index + 1 + (currentPage - 1) * pageSize}</td>
                                    <td className="border text-sm truncate border-gray-300 px-4 py-2">{user.FullName}</td>
                                    <td className="border text-sm truncate border-gray-300 px-4 py-2">{user.Email}</td>
                                    <td className="border text-sm truncate border-gray-300 px-4 py-2">{user.ContactNumber}</td>
                                    <td className="border text-sm truncate border-gray-300 px-4 py-2">{user.referralCode}</td>
                                    <td className="border text-sm truncate border-gray-300 px-4 py-2">{user.referralCodeBonus}</td>
                                    <td className="border text-sm truncate border-gray-300 px-4 py-2">{user.RefrealUserIds.length || 0}</td>
                                    <td className="border text-sm truncate border-gray-300 px-4 py-2">
                                        <Link
                                            to={`/Withdraw-result?id=${user._id}&type=user`}
                                            className="inline-block bg-violet-500 text-white py-1 px-4 rounded-md hover:bg-violet-600 focus:outline-none focus:ring-2 focus:ring-blue-400"
                                        >
                                            {user.WithdrawalRequestIds.length > 0 ? 'Check Request' : 'No Request'}
                                        </Link>
                                    </td>
                                    <td className="border text-sm truncate border-gray-300 px-4 py-2">{user.Role}</td>
                                    <td className="border text-sm truncate border-gray-300 px-4 py-2 flex space-x-2">
                                        {/* View Button */}
                                        <button
                                            className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 focus:outline-none transition ease-in-out duration-300"
                                            onClick={() => handleViewUser(user)}
                                        >
                                            View
                                        </button>

                                        {/* Activate/Deactivate Button */}
                                        <button
                                            onClick={() => toggleDeactiveStatus(user._id)}
                                            className={`px-4 py-2 rounded-lg text-white focus:outline-none transition ease-in-out duration-300 ${user.isDeactive ? 'bg-yellow-500 hover:bg-yellow-600' : 'bg-green-500 hover:bg-green-600'
                                                }`}
                                        >
                                            {user.isDeactive ? 'Activate' : 'Deactivate'}
                                        </button>
                                    </td>

                                </tr>
                            ))}
                        </tbody>
                    </table>
                    {/* Pagination */}
                    <div className="flex justify-center items-center mt-4 space-x-2">
                        <button
                            onClick={() => handlePageChange(currentPage - 1)}
                            disabled={currentPage === 1}
                            className="bg-gray-200 text-gray-600 px-3 py-1 rounded-lg hover:bg-gray-300 disabled:bg-gray-100 disabled:text-gray-400"
                        >
                            Previous
                        </button>
                        <span className="text-gray-700 font-medium">{currentPage} / {totalPages}</span>
                        <button
                            onClick={() => handlePageChange(currentPage + 1)}
                            disabled={currentPage === totalPages}
                            className="bg-gray-200 text-gray-600 px-3 py-1 rounded-lg hover:bg-gray-300 disabled:bg-gray-100 disabled:text-gray-400"
                        >
                            Next
                        </button>
                    </div>
                </div>
            )}

            {/* User Details Modal */}
            {selectedUser && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
                    <div className="bg-white rounded-lg shadow-lg p-6 w-11/12 md:w-1/2">
                        <h3 className="text-xl font-semibold mb-4">User Details</h3>
                        <ul className="space-y-2">
                            <li><strong>Full Name:</strong> {selectedUser.FullName}</li>
                            <li><strong>Email:</strong> {selectedUser.Email}</li>
                            <li><strong>Contact Number:</strong> {selectedUser.ContactNumber}</li>
                            <li><strong>Role:</strong> {selectedUser.Role}</li>
                            <li><strong>Referral Code:</strong> {selectedUser.referralCode}</li>
                            <li><strong>Verified:</strong> {selectedUser.isVerified ? "Yes" : "No"}</li>
                            <li><strong>Referral Bonus:</strong> {selectedUser.referralCodeBonus}</li>
                            <li><strong>Referred User IDs:</strong> {selectedUser.RefrealUserIds.join(", ") || "None"}</li>
                            <li><strong>Referral Status:</strong></li>
                            <ul className="ml-4">
                                {selectedUser.referralStatus.map((ref) => (
                                    <li key={ref._id}>
                                        - {ref.MobileNumber}: {ref.status}
                                    </li>
                                ))}
                            </ul>
                            <li><strong>Created At:</strong> {new Date(selectedUser.createdAt).toLocaleString()}</li>
                            <li><strong>Updated At:</strong> {new Date(selectedUser.updatedAt).toLocaleString()}</li>
                        </ul>
                        <div className="flex justify-end mt-4">
                            <button
                                className="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600 transition"
                                onClick={closeModal}
                            >
                                Close
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Users;
