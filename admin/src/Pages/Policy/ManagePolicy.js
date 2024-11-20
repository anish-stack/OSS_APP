import React, { useEffect, useState } from 'react';
import axios from 'axios';
import ReactPaginate from 'react-paginate';
import toast from 'react-hot-toast'; // For showing notifications
import { Modal } from 'react-responsive-modal'; // For modal
import 'react-responsive-modal/styles.css'; // Import Modal styles
import { Link } from 'react-router-dom';

const PolicyList = () => {
    const [policies, setPolicies] = useState([]); // Stores all the policies
    const [filteredPolicies, setFilteredPolicies] = useState([]); // Stores filtered policies based on search
    const [search, setSearch] = useState(''); // Search query
    const [currentPage, setCurrentPage] = useState(0); // Current page
    const [itemsPerPage, setItemsPerPage] = useState(5); // Items per page
    const [selectedPolicy, setSelectedPolicy] = useState(null); // Selected policy for viewing details
    const [showModal, setShowModal] = useState(false); // Controls modal visibility

    useEffect(() => {
        fetchPolicies();
    }, []);

    // Fetching all policies from the backend
    const fetchPolicies = async () => {
        try {
            const response = await axios.get('http://localhost:7000/api/v1/policies/all');
            if (response.data.success) {
                setPolicies(response.data.data);
                setFilteredPolicies(response.data.data); // Initially display all policies
            } else {
                toast.error('Failed to fetch policies');
            }
        } catch (error) {
            toast.error('An error occurred while fetching policies');
            console.error(error);
        }
    };

    // Handle searching
    const handleSearch = (e) => {
        const searchQuery = e.target.value;
        setSearch(searchQuery);
        filterPolicies(searchQuery);
    };

    // Filter policies based on the search query
    const filterPolicies = (query) => {
        if (!query) {
            setFilteredPolicies(policies); // If no search query, show all policies
        } else {
            const filtered = policies.filter((policy) => {
                return (
                    policy.typeOfPolicy.toLowerCase().includes(query.toLowerCase()) ||
                    policy.Heading.toLowerCase().includes(query.toLowerCase()) ||
                    policy.WrittienBy.toLowerCase().includes(query.toLowerCase())
                );
            });
            setFilteredPolicies(filtered);
        }
        setCurrentPage(0); // Reset to the first page when search query changes
    };

    // Handle pagination
    const handlePageChange = (selectedItem) => {
        setCurrentPage(selectedItem.selected);
    };

    const handleViewClick = (policy) => {
        setSelectedPolicy(policy);
        setShowModal(true);
    };



    // Delete policy
    const handleDeleteClick = async (id) => {
        try {
            const response = await axios.delete(`http://localhost:7000/api/v1/policies/${id}`);
            if (response.data.success) {
                toast.success('Policy deleted successfully');
                fetchPolicies(); // Refresh the policies list
            } else {
                toast.error('Failed to delete policy');
            }
        } catch (error) {
            toast.error('An error occurred while deleting policy');
            console.error(error);
        }
    };

    // Get paginated data
    const paginatedPolicies = filteredPolicies.slice(
        currentPage * itemsPerPage,
        (currentPage + 1) * itemsPerPage
    );

    return (
        <div className="container mx-auto p-6">
            <div className="flex justify-between mb-4">
                <input
                    type="text"
                    placeholder="Search by Policy Type, Heading or Author"
                    value={search}
                    onChange={handleSearch}
                    className="px-4 py-2 border border-gray-300 rounded-lg w-full md:w-1/3"
                />
            </div>

            <table className="min-w-full bg-white border border-gray-300">
                <thead>
                    <tr className="bg-gray-100">
                        <th className="px-4 py-2 border">Type of Policy</th>
                        <th className="px-4 py-2 border">Heading</th>
                        <th className="px-4 py-2 border">Written By</th>
                        <th className="px-4 py-2 border">Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {paginatedPolicies.map((policy) => (
                        <tr key={policy._id}>
                            <td className="px-4 py-2 border">{policy.typeOfPolicy}</td>
                            <td className="px-4 py-2 border">{policy.Heading}</td>
                            <td className="px-4 py-2 border">{policy.WrittienBy}</td>
                            <td className="px-4 py-2 border">
                                <button
                                    onClick={() => handleViewClick(policy)}
                                    className="px-4 py-2 bg-blue-500 text-white rounded-lg mr-2"
                                >
                                    View
                                </button>
                                <button
                                  
                                    className="px-4 py-2 bg-yellow-500 text-white rounded-lg mr-2"
                                >
                                    <Link to={`/Create-Policy?type=edit&id=${policy._id}`}>Edit</Link>
                                </button>
                                <button
                                    onClick={() => handleDeleteClick(policy._id)}
                                    className="px-4 py-2 bg-red-500 text-white rounded-lg"
                                >
                                    Delete
                                </button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>

            {/* Pagination */}
            <div className="mt-4">
                <ReactPaginate
                    previousLabel={"Previous"}
                    nextLabel={"Next"}
                    breakLabel={"..."}
                    pageCount={Math.ceil(filteredPolicies.length / itemsPerPage)}
                    marginPagesDisplayed={2}
                    pageRangeDisplayed={5}
                    onPageChange={handlePageChange}
                    containerClassName="flex justify-center space-x-2"
                    pageClassName="px-4 py-2 bg-blue-500 text-white rounded-lg cursor-pointer"
                    activeClassName="bg-blue-700"
                />
            </div>

            {/* View Policy Modal */}
            <Modal open={showModal} onClose={() => setShowModal(false)} center>
                {selectedPolicy && (
                    <div className="p-6 max-w-2xl">

                        <h3 className="text-xl font-medium mb-4">{selectedPolicy.Heading}</h3>
                        <div
                            className="policy-content mb-4"
                            dangerouslySetInnerHTML={{ __html: selectedPolicy.HtmlContent }}
                        />

                    </div>
                )}
            </Modal>
        </div>
    );
};

export default PolicyList;
