import React, { useState } from 'react';
import { Link } from 'react-router-dom'
const Header = () => {
  const [productsDropdownOpen, setProductsDropdownOpen] = useState(false);
  const [policiesDropdownOpen, setPoliciesDropdownOpen] = useState(false);

  const [withdrawalDropdownOpen, setWithdrawalDropdownOpen] = useState(false);

  const toggleDropdown = (dropdown) => {
    switch (dropdown) {
      case 'products':
        setProductsDropdownOpen((prev) => !prev);
        break;
      case 'policies':
        setPoliciesDropdownOpen((prev) => !prev);
        break;
      case 'withdrawal':
        setWithdrawalDropdownOpen((prev) => !prev);
        break;

      default:
        break;
    }
  };

  return (
    <div className="w-[20%] hide fixed left-0 h-screen bg-[#1C2434] text-gray-200 shadow-lg">
      <div className="h-full flex flex-col justify-between py-6 px-4">
        {/* Logo Section */}
        <div className="flex items-center space-x-3">
          <div className="text-3xl">💊</div>
          <div className="text-xl font-semibold">Oss Admin</div>
        </div>

        {/* Navigation Menu */}
        <div className="mt-8 px-7 space-y-4">
          {/* Dashboard */}
          <div className="flex items-center space-x-3 text-gray-400 hover:text-white  cursor-pointer transition-colors">
            <i className="fa fa-tachometer-alt text-xl"></i>
            <span><Link to={'/'}>Dashboard</Link></span>
          </div>

          {/* Products Dropdown */}
          <div className="relative">
            <div
              className="flex items-center space-x-3 text-gray-400 hover:text-white cursor-pointer transition-colors"
              onClick={() => toggleDropdown('products')}
            >
              <i className="fa fa-box text-xl"></i>
              <span>Products</span>
              <i
                className={`fa fa-chevron-down text-sm ${productsDropdownOpen ? 'rotate-180' : ''}`}
              ></i>
            </div>
            <div
              className={`absolute z-50 left-0 top-full mt-2 bg-[#2A3542] w-40 rounded-lg shadow-lg overflow-hidden transition-all duration-300 ease-in-out ${productsDropdownOpen ? 'max-h-40' : 'max-h-0'
                }`}
            >
              <div className="px-4 py-2 text-gray-300 hover:bg-[#3C4B63] cursor-pointer"><Link to={'/Create-Product'} >Create Product</Link></div>
              <div className="px-4 py-2 text-gray-300 hover:bg-[#3C4B63] cursor-pointer"><Link to={'/Manage-Products'} >Manage Product</Link></div>
            </div>
          </div>

          {/* Policies Dropdown */}
          <div className="relative">
            <div
              className="flex items-center space-x-3 text-gray-400 hover:text-white cursor-pointer transition-colors"
              onClick={() => toggleDropdown('policies')}
            >
              <i className="fa fa-file-alt text-xl"></i>
              <span>Policies</span>
              <i
                className={`fa fa-chevron-down text-sm ${policiesDropdownOpen ? 'rotate-180' : ''}`}
              ></i>
            </div>
            <div
              className={`absolute z-50 left-0 top-full mt-2 bg-[#2A3542] w-40 rounded-lg shadow-lg overflow-hidden transition-all duration-300 ease-in-out ${policiesDropdownOpen ? 'max-h-40' : 'max-h-0'
                }`}
            >
              <div className="px-4 py-2 text-gray-300 hover:bg-[#3C4B63] cursor-pointer"><Link to={'/Manage-Policy'}>Manage Policy</Link></div>
              <div className="px-4 py-2 text-gray-300 hover:bg-[#3C4B63] cursor-pointer"><Link to={'/Create-Policy'}>Create Policy</Link></div>
            </div>
          </div>

          {/* Additional Dropdowns */}
          <div className="flex items-center space-x-3 text-gray-400 hover:text-white cursor-pointer transition-colors">
            <i className="fa fa-users text-xl"></i>
            <span><Link to={'/Users'}>Users</Link></span>
          </div>
          <div className="flex items-center space-x-3 text-gray-400 hover:text-white cursor-pointer transition-colors">
            <i className="fa-brands fa-youtube text-xl"></i>
            <span><Link to={'/Video-manage'}>Video</Link></span>
          </div>
          <div className="flex items-center space-x-3 text-gray-400 hover:text-white cursor-pointer transition-colors">
            <i className="fa fa-check text-xl"></i>
            <span><Link to={'/Orders'}>Orders</Link></span>
          </div>

          <div className="flex items-center space-x-3 text-gray-400 hover:text-white cursor-pointer transition-colors">
            <i className="fa fa-user-plus text-xl"></i>
            <span>Onboarding</span>
          </div>

          <div className="relative">
            <div
              className="flex items-center space-x-3 text-gray-400 hover:text-white cursor-pointer transition-colors"
              onClick={() => toggleDropdown('withdrawal')}
            >
              <i className="fa fa-credit-card text-xl"></i>
              <span>Withdrawals</span>
              <i
                className={`fa fa-chevron-down text-sm ${withdrawalDropdownOpen ? 'rotate-180' : ''}`}
              ></i>
            </div>
            <div
              className={`absolute z-50 left-0 top-full mt-2 bg-[#2A3542] w-40 rounded-lg shadow-lg overflow-hidden transition-all duration-300 ease-in-out ${withdrawalDropdownOpen ? 'max-h-40' : 'max-h-0'
                }`}
            >
              <div className="px-4 py-2 truncate text-gray-300 hover:bg-[#3C4B63] cursor-pointer"><Link to={'/Withdraw-result'}>Withdraw Requests</Link></div>
              <div className="px-4 py-2 truncate text-gray-300 hover:bg-[#3C4B63] cursor-pointer"><Link to={'/Transaction-History'}>Transaction History</Link></div>
            </div>
          </div>




          <div className="flex items-center space-x-3 text-gray-400 hover:text-white cursor-pointer transition-colors">
            <i className="fa fa-question-circle text-xl"></i>
            <span><Link to={'/Support'}>Support</Link></span>
          </div>

          {/* <div className="flex items-center space-x-3 text-gray-400 hover:text-white cursor-pointer transition-colors">
            <i className="fa fa-user text-xl"></i>
            <span>Profile</span>
          </div>

          <div className="flex items-center space-x-3 text-gray-400 hover:text-white cursor-pointer transition-colors">
            <i className="fa fa-user-plus text-xl"></i>
            <span>Register User</span>
          </div> */}
        </div>

        {/* Footer */}
        <div className="mt-auto text-center text-xs text-gray-500">
          <p>&copy; 2024 Oss Admin. All Rights Reserved.</p>
        </div>
      </div>
    </div>
  );
};

export default Header;
