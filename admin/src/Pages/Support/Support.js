import React, { useState, useEffect } from 'react';
import axios from 'axios';

const Support = () => {
  const [requests, setRequests] = useState([]);  // Store all requests
  const [filteredRequests, setFilteredRequests] = useState([]); // Store filtered requests for search
  const [searchQuery, setSearchQuery] = useState('');  // Store search query
  const [currentPage, setCurrentPage] = useState(1);  // Store current page
  const [itemsPerPage] = useState(5);  // Number of items per page
  const [totalPages, setTotalPages] = useState(1); // Total pages for pagination

  // Fetch all requests from the API
  const fetchRequests = async () => {
    try {
      const response = await axios.get('http://localhost:7000/api/v1/get-all-request');
      setRequests(response.data.data);
      setFilteredRequests(response.data.data);
      setTotalPages(Math.ceil(response.data.data.length / itemsPerPage)); // Calculate total pages
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };

  // Handle search functionality
  const handleSearch = (e) => {
    const query = e.target.value;
    setSearchQuery(query);
    
    // Filter requests based on search query
    const filteredData = requests.filter(request =>
      request.Name.toLowerCase().includes(query.toLowerCase()) ||
      request.Email.toLowerCase().includes(query.toLowerCase()) ||
      request.contactNumber.includes(query)
    );

    setFilteredRequests(filteredData);
    setCurrentPage(1); // Reset to first page when searching
    setTotalPages(Math.ceil(filteredData.length / itemsPerPage)); // Recalculate total pages after filter
  };

  // Handle delete functionality
  const handleDelete = async (id) => {
    try {
      const response = await axios.delete(`http://localhost:7000/api/v1/delete-request/${id}`);
      if (response.data.success) {
        fetchRequests();
        alert('Request deleted successfully');
      }
    } catch (error) {
      console.error('Error deleting request:', error);
      alert('Failed to delete request');
    }
  };

  // Handle page change for pagination
  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  // Slice the filtered requests array to display the correct items per page
  const indexOfLastRequest = currentPage * itemsPerPage;
  const indexOfFirstRequest = indexOfLastRequest - itemsPerPage;
  const currentRequests = filteredRequests.slice(indexOfFirstRequest, indexOfLastRequest);

  useEffect(() => {
    fetchRequests(); // Fetch initial data on component mount
  }, []);

  return (
    <div className="support-container">
      <h1>Support Requests</h1>

      {/* Search Bar */}
      <input
        type="text"
        value={searchQuery}
        onChange={handleSearch}
        placeholder="Search by name, email, or contact number"
        className="search-input p-2 border border-gray-300 rounded mt-4"
      />

      {/* Table to display requests */}
      <table className="table-auto w-full mt-4 border-collapse border">
        <thead>
          <tr>
            <th className="border p-2">Name</th>
            <th className="border p-2">Email</th>
            <th className="border p-2">Contact Number</th>
            <th className="border p-2">Message</th>
            <th className="border p-2">Actions</th>
          </tr>
        </thead>
        <tbody>
          {currentRequests.map((request) => (
            <tr key={request._id}>
              <td className="border p-2">{request.Name}</td>
              <td className="border p-2">{request.Email}</td>
              <td className="border p-2">{request.contactNumber}</td>
              <td className="border p-2">{request.Message}</td>
              <td className="border p-2">
                <button
                  onClick={() => handleDelete(request._id)}
                  className="bg-red-500 text-white p-2 rounded"
                >
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Pagination */}
      <div className="pagination mt-4">
        <button
          onClick={() => handlePageChange(currentPage - 1)}
          disabled={currentPage === 1}
          className="p-2 border border-gray-300 rounded"
        >
          Previous
        </button>
        <span className="mx-2">{currentPage}</span>
        <button
          onClick={() => handlePageChange(currentPage + 1)}
          disabled={currentPage === totalPages}
          className="p-2 border border-gray-300 rounded"
        >
          Next
        </button>
      </div>
    </div>
  );
};

export default Support;
