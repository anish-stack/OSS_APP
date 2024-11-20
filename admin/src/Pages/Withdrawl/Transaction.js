import React, { useState, useEffect } from "react";
import axios from "axios";

const Transaction = () => {
  const [transfers, setTransfers] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(5); // Adjust items per page as needed
  const [loading, setLoading] = useState(false);

  // Fetch data from API
  const fetchTransfers = async () => {
    try {
      setLoading(true);
      const response = await axios.get("http://localhost:7000/api/v1/get-all-transfers");
      setTransfers(response.data.data);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching transfers:", error);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTransfers();
  }, []);

  // Calculate pagination
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = transfers.slice(indexOfFirstItem, indexOfLastItem);

  // Change page
  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  return (
    <div className="container mx-auto ">
      <h1 className="text-2xl font-bold mb-4">Transaction-History</h1>
      {loading ? (
        <p className="text-center">Loading...</p>
      ) : (
        <>
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-200">
                <th className="border px-4 text-sm truncate py-2">Transaction ID</th>
                <th className="border px-4 text-sm truncate py-2">Transfer By</th>
                <th className="border px-4 text-sm truncate py-2">Transfer To</th>
                <th className="border px-4 text-sm truncate py-2">Amount</th>
                <th className="border px-4 text-sm truncate py-2">Transfer Date</th>
                <th className="border px-4 text-sm truncate py-2">Payment Proof</th>
              </tr>
            </thead>
            <tbody>
              {currentItems.map((transfer) => (
                <tr key={transfer._id} className="hover:bg-gray-100">
                  <td className="border px-4 text-sm truncate py-2">{transfer.transactionId}</td>
                  <td className="border px-4 text-sm truncate py-2">{transfer.TransferBy}</td>
                  <td className="border px-4 text-sm truncate py-2">
                    <p>{transfer.TransferTo?.FullName}</p>
                    <p>{transfer.TransferTo?.Email}</p>
                    <p>{transfer.TransferTo?.ContactNumber}</p>
                  </td>
                  <td className="border px-4 text-sm truncate py-2">{transfer.TransferAmount}</td>
                  <td className="border px-4 text-sm truncate py-2">
                    {new Date(transfer.TransferDate).toLocaleString()}
                  </td>
                  <td className="border px-4 text-sm truncate py-2">
                    {transfer.PaymentProof?.image ? (
                      <a
                        href={transfer.PaymentProof.image}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-500 underline"
                      >
                        View Proof
                      </a>
                    ) : (
                      "No Proof"
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {/* Pagination */}
          <div className="flex justify-center mt-4">
            {Array.from(
              { length: Math.ceil(transfers.length / itemsPerPage) },
              (_, index) => (
                <button
                  key={index}
                  onClick={() => paginate(index + 1)}
                  className={`px-4 py-2 mx-1 ${
                    currentPage === index + 1
                      ? "bg-blue-500 text-white"
                      : "bg-gray-200"
                  } rounded`}
                >
                  {index + 1}
                </button>
              )
            )}
          </div>
        </>
      )}
    </div>
  );
};

export default Transaction;
