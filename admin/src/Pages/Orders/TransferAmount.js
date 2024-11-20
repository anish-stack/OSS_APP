import React, { useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import axios from 'axios';
import { toast } from 'react-hot-toast';

const TransferAmount = () => {
  const [searchParams] = useSearchParams();
  const userId = searchParams.get('id');
  const withdrawalId = searchParams.get('withdrawal');
  const [formData, setFormData] = useState({
    transactionId: '',
    paymentProof: null,
  });
  const [isLoading, setIsLoading] = useState(false);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleFileChange = (e) => {
    setFormData({ ...formData, paymentProof: e.target.files[0] });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.transactionId || !formData.paymentProof) {
      toast.error('Please fill out all fields and upload proof.');
      return;
    }

    setIsLoading(true);

    const data = new FormData();
    data.append('transactionId', formData.transactionId);
    data.append('paymentProof', formData.paymentProof);
    data.append('userId', userId);

    try {
      const response = await axios.post(
        `http://localhost:7000/api/v1/Transfer-Amount/${withdrawalId}`,
        data
      );

      if (response.status === 200) {
        toast.success('Transfer successful!');
        setFormData({ transactionId: '', paymentProof: null });
      }
      window.location.href="/Withdraw-result"
    } catch (error) {
      console.error('Transfer error:', error);
      toast.error(error?.response?.data?.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="bg-white shadow-lg rounded-lg p-6 max-w-md w-full">
        <h1 className="text-2xl font-bold text-center text-gray-800 mb-4">
          Transfer Amount
        </h1>
        <p className="text-gray-600 text-sm text-center mb-6">
          Please fill out the form below to transfer the amount for the withdrawal request.
        </p>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-gray-700 font-medium mb-2" htmlFor="transactionId">
              Transaction ID
            </label>
            <input
              type="text"
              name="transactionId"
              id="transactionId"
              value={formData.transactionId}
              onChange={handleInputChange}
              placeholder="Enter transaction ID"
              className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>
          <div>
            <label className="block text-gray-700 font-medium mb-2" htmlFor="paymentProof">
              Upload Payment Proof
            </label>
            <input
              type="file"
              name="paymentProof"
              id="paymentProof"
              accept="image/*"
              onChange={handleFileChange}
              className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>
          <button
            type="submit"
            disabled={isLoading}
            className={`w-full py-2 px-4 text-white rounded-lg font-semibold ${
              isLoading ? 'bg-gray-400 cursor-not-allowed' : 'bg-blue-500 hover:bg-blue-600'
            }`}
          >
            {isLoading ? 'Processing...' : 'Transfer Amount'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default TransferAmount;
