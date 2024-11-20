import React, { useState, useEffect } from "react";
import axios from "axios";

const Dashboard = () => {
  // Define state variables
  const [data, setData] = useState(null);  // Store fetched data
  const [loading, setLoading] = useState(true);  // Loading state
  const [error, setError] = useState(null);  // Error state

  // Fetch dashboard data on component mount
  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const response = await axios.get("http://localhost:7000/api/v1/dashboard");
        setData(response.data.data);  // Set the fetched data
        setLoading(false);  // Set loading to false once data is fetched
      } catch (error) {
        setError("Error fetching dashboard data!");  // Handle error
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);  // Empty dependency array means this will run once after component mounts

  // Loading state
  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen ">
        {/* Spinner */}
        <div className="flex items-center space-x-4">
          <div className="w-16 h-16 border-4 border-t-4 border-blue-600 rounded-full animate-spin"></div>
          <span className="text-xl font-semibold text-gray-600">Loading...</span>
        </div>
      </div>
    );
  }


  // Error state
  if (error) {
    return <div>{error}</div>;
  }

  // Data rendering if successful
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 p-6">
      {/* Card for Total Order Amount */}
      <div className="bg-white p-6 border rounded-lg shadow-xl">
        <div className="flex items-center justify-between">
          <i className="fa fa-credit-card text-4xl text-purple-600"></i>
          <div>
            <h2 className="text-base text-nowrap font-semibold">Total Order Amount</h2>
            <p className="text-3xl font-bold">₹{data.totalOrderAmount.toFixed(2)}</p>
          </div>
        </div>
      </div>

      {/* Card for User Count */}
      <div className="bg-white p-6 border rounded-lg shadow-xl">
        <div className="flex items-center justify-between">
          <i className="fa fa-user text-4xl text-blue-600"></i>
          <div>
            <h2 className="text-base text-nowrap font-semibold">Users</h2>
            <p className="text-3xl font-bold">{data.userCount}</p>
          </div>
        </div>
      </div>

      {/* Card for Product Count */}
      <div className="bg-white p-6 border rounded-lg shadow-xl">
        <div className="flex items-center justify-between">
          <i className="fa-brands fa-product-hunt text-4xl text-green-600"></i>
          <div>
            <h2 className="text-base text-nowrap font-semibold">Products</h2>
            <p className="text-3xl font-bold">{data.productCount}</p>
          </div>
        </div>
      </div>

      {/* Card for Video Count */}
      <div className="bg-white p-6 border rounded-lg shadow-xl">
        <div className="flex items-center justify-between">
          <i className="fa fa-video text-4xl text-red-600"></i>
          <div>
            <h2 className="text-base text-nowrap font-semibold">Videos</h2>
            <p className="text-3xl font-bold">{data.videoCount}</p>
          </div>
        </div>
      </div>

      {/* Card for Pending Withdrawals */}
      <div className="bg-white p-6 border rounded-lg shadow-xl">
        <div className="flex items-center justify-between">
          <i className="fa fa-credit-card text-4xl text-yellow-600"></i>
          <div>
            <h2 className="text-base text-nowrap font-semibold">Pending Withdrawals</h2>
            <p className="text-3xl font-bold">{data.pendingWithdrawals}</p>
          </div>
        </div>
      </div>

      {/* Card for Completed Withdrawals */}
      <div className="bg-white p-6 border rounded-lg shadow-xl">
        <div className="flex items-center justify-between">
          <i className="fa fa-check-circle text-4xl text-teal-600"></i>
          <div>
            <h2 className="text-base text-nowrap font-semibold">Completed Withdrawals</h2>
            <p className="text-3xl font-bold">{data.completedWithdrawals}</p>
          </div>
        </div>
      </div>

      {/* Card for Total Transferred Amount */}
      <div className="bg-white p-6 border rounded-lg shadow-xl">
        <div className="flex items-center justify-between">
          <i className="fa-solid fa-coins text-4xl text-teal-600"></i>
          <div>
            <h2 className="text-base text-nowrap font-semibold">Total Transferred</h2>
            <p className="text-3xl font-bold">₹{data.totalTransferredAmount.toFixed(2)}</p>
          </div>
        </div>
      </div>

      {/* Card for Accepted Orders */}
      <div className="bg-white p-6 border rounded-lg shadow-xl">
        <div className="flex items-center justify-between">
          <i className="fa fa-check-circle text-4xl text-green-500"></i>
          <div>
            <h2 className="text-base text-nowrap font-semibold">Accepted Orders</h2>
            <p className="text-3xl font-bold">{data.orderCounts.accepted}</p>
          </div>
        </div>
      </div>

      {/* Card for Pending Orders */}
      <div className="bg-white p-6 border rounded-lg shadow-xl">
        <div className="flex items-center justify-between">
          <i className="fa fa-clock text-4xl text-orange-500"></i>
          <div>
            <h2 className="text-base text-nowrap font-semibold">Pending Orders</h2>
            <p className="text-3xl font-bold">{data.orderCounts.pending}</p>
          </div>
        </div>
      </div>

      {/* Card for Delivered Orders */}
      <div className="bg-white p-6 border rounded-lg shadow-xl">
        <div className="flex items-center justify-between">
          <i className="fa fa-truck text-4xl text-blue-500"></i>
          <div>
            <h2 className="text-base text-nowrap font-semibold">Delivered Orders</h2>
            <p className="text-3xl font-bold">{data.orderCounts.delivered}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
