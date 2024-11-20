import React from 'react';
import Header from '../../components/Header/Header';
import HeaderUpper from '../../components/Headerupper/HeaderUpper';
import { Routes, Route } from 'react-router-dom';
import Dashboard from '../Dashboard/Dashboard';
import ManageProducts from '../Products/ManageProducts';
import CreateProducts from '../Products/CreateProducts';
import Update from '../Products/Update';
import Orders from '../Orders/Orders';
import Users from '../User/Users';
import Support from '../Support/Support';
import CreatePolicy from '../Policy/CreatePolicy';
import ManagePolicy from '../Policy/ManagePolicy';
import ManageVideo from '../Video/ManageVideo';
import ManageWithdraw from '../Withdrawl/ManageWithdraw';
import TransferAmount from '../Orders/TransferAmount';
import Transaction from '../Withdrawl/Transaction';
import PrintBill from '../Orders/PrintBill';

const Home = () => {
  return (
    <div className="flex flex-col min-h-screen">
      {/* Header Component */}
      <div className="headerUp ">
        <Header />
      </div>
      
      {/* Content Section */}
      <div className="flex-1 ">
        <HeaderUpper />

        {/* Main Content */}
        <div className="w-[80%] bg-gradient-to-b from-blue-100 to-white  right-[-20%] relative overflow-auto p-6">
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/Manage-Products" element={<ManageProducts />} />
            <Route path="/Create-Product" element={<CreateProducts />} />
            <Route path="/update-product/:id" element={<Update />} />

            <Route path="/Orders" element={<Orders />} />
            <Route path="/Users" element={<Users />} />
            <Route path="/Support" element={<Support />} />

            <Route path="/Create-Policy" element={<CreatePolicy />} />
            <Route path="/Manage-Policy" element={<ManagePolicy />} />


            <Route path="/Video-manage" element={<ManageVideo />} />



            <Route path="/Withdraw-result" element={<ManageWithdraw />} />
            <Route path="/transfer-amount" element={<TransferAmount />} />
            <Route path="/Transaction-History" element={<Transaction />} />
            <Route path="/Print" element={<PrintBill />} />




            






          </Routes>
        </div>
      </div>
    </div>
  );
};

export default Home;
