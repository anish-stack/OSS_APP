import axios from 'axios';
import React, { useEffect, useState } from 'react';

const HeaderUpper = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const [data, setData] = useState(null)
  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const response = await axios.get("http://localhost:7000/api/v1/dashboard");
        setData(response.data.data);

      } catch (error) {
        console.log(error)
      }
    };

    fetchDashboardData();
  }, []);
  const toggleMenu = () => setMenuOpen((prev) => !prev);

  return (
    <div className="relative hide w-[80%] pt-4 px-4 top-0 right-[-20%] bg-white shadow-md">
      <div className="flex items-center justify-between">
        {/* Search Section */}
        <div className="search-side mb-5 w-full max-w-sm min-w-[200px]">
          <div className="relative">
            <input
              className="w-full bg-transparent placeholder:text-slate-400 text-slate-700 text-sm border border-slate-200 rounded-md pl-3 pr-12 py-2 transition duration-300 ease focus:outline-none focus:border-slate-400 hover:border-slate-300 shadow-sm focus:shadow"
              placeholder="Search for UI Kits, Dashboards..."
            />
            <button
              className="absolute top-1 right-1 flex items-center rounded bg-slate-800 py-1 px-3 border border-transparent text-sm text-white transition-all shadow-sm hover:bg-slate-700 focus:bg-slate-700"
              type="button"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="currentColor"
                className="w-4 h-4 mr-2"
              >
                <path
                  fillRule="evenodd"
                  d="M10.5 3.75a6.75 6.75 0 1 0 0 13.5 6.75 6.75 0 0 0 0-13.5ZM2.25 10.5a8.25 8.25 0 1 1 14.59 5.28l4.69 4.69a.75.75 0 1 1-1.06 1.06l-4.69-4.69A8.25 8.25 0 0 1 2.25 10.5Z"
                  clipRule="evenodd"
                />
              </svg>
              Search
            </button>
          </div>
        </div>

        {/* Profile Avatar Section */}
        <div className="flex items-center space-x-4">
          <ul className="flex space-x-4">
            <li className="flex items-center space-x-2 p-2 px-4 cursor-pointer bg-white hover:bg-gray-100 rounded-lg shadow-md">
              <a onClick={() => window.location.reload()} href="#" className="flex items-center space-x-2">
                <i className="fa-solid fa-arrows-rotate"></i>
              </a>
            </li>

            <li onClick={() => window.location.href='/Withdraw-result'} className="flex items-center space-x-2 p-2 bg-white hover:bg-gray-100 rounded-lg shadow-md">
              <a href="/Withdraw-result" className="flex items-center space-x-2 text-gray-700 hover:text-gray-900">
                <i className="fa-solid fa-bell text-blue-600"></i> {/* Icon Color */}
                <span className="font-semibold">{data?.pendingWithdrawals}</span> {/* Text */}
              </a>
            </li>

          </ul>

          {/* Profile Avatar with Dropdown */}
          <div className="relative">
            <div
              className="cursor-pointer"
              onClick={toggleMenu}
            >
              <img
                src="https://cdn-icons-png.flaticon.com/512/3135/3135715.png"
                alt="Profile Avatar"
                className="w-10 h-10 rounded-full border border-gray-200 shadow-sm"
              />
            </div>

            {/* Dropdown Menu */}
            {menuOpen && (
              <div className="absolute right-0 mt-2 w-48 rounded-md bg-white shadow-lg ring-1 ring-black/5">
                <div className="py-1">
                  <a
                    href="#"
                    className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                  >
                    Change Password
                  </a>
                  <a
                    href="#"
                    className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                  >
                    Sign Out
                  </a>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default HeaderUpper;
