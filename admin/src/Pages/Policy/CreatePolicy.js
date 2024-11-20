import React, { useState, useEffect } from 'react';
import ReactQuill from 'react-quill'; // Rich text editor
import 'react-quill/dist/quill.snow.css'; // Import Quill styles
import axios from 'axios'; // Axios for API requests
import { useNavigate, useSearchParams } from 'react-router-dom'; // React Router for navigation
import toast from 'react-hot-toast'; // For toast notifications

const CreatePolicy = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [formData, setFormData] = useState({
    typeOfPolicy: '',
    Heading: '',
    WrittienBy: '',
    HtmlContent: '',
  });

  const [isEditMode, setIsEditMode] = useState(false);

  // Fetch existing policy data for edit mode
  const fetchPolicyData = async (id) => {
    try {
      const response = await axios.get(`http://localhost:7000/api/v1/policies/${id}`);
      if (response.data.success) {
        setFormData(response.data.data); // Assuming 'policy' contains the necessary data
      } else {
        toast.error('Failed to fetch policy data.');
      }
    } catch (error) {
      toast.error('An error occurred while fetching policy data.');
      console.error(error);
    }
  };

  // Handle form input change
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  // Handle rich text content change
  const handleEditorChange = (value) => {
    setFormData((prevData) => ({
      ...prevData,
      HtmlContent: value,
    }));
  };

  // Handle form submission (create or update based on mode)
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      let response;
      if (isEditMode) {
        // Update policy
        const policyId = searchParams.get('id');
        response = await axios.put(`http://localhost:7000/api/v1/policies/update/${policyId}`, formData);
      } else {
        // Create new policy
        response = await axios.post('http://localhost:7000/api/v1/policies/create', formData);
      }

      if (response.data.success) {
        toast.success(isEditMode ? 'Policy updated successfully!' : 'Policy created successfully!');
        navigate('/Manage-Policy');
      } else {
        toast.error('Failed to save policy.');
      }
    } catch (error) {
      toast.error('An error occurred. Please try again.');
      console.error(error);
    }
  };

  useEffect(() => {
    const type = searchParams.get('type');
    if (type === 'edit') {
      setIsEditMode(true);
      const id = searchParams.get('id');
      if (id) {
        fetchPolicyData(id);
      }
    }
  }, [searchParams]);

  return (
    <div className="p-6 max-w-2xl mx-auto bg-white shadow-lg rounded-lg">
      <h2 className="text-2xl font-semibold text-gray-700 mb-4">
        {isEditMode ? 'Edit Policy' : 'Create Policy'}
      </h2>
      <form onSubmit={handleSubmit}>
        {/* Type of Policy */}
        <div className="mb-4">
          <label htmlFor="typeOfPolicy" className="block text-sm font-medium text-gray-600">
            Type of Policy
          </label>
          <input
            type="text"
            id="typeOfPolicy"
            name="typeOfPolicy"
            value={formData.typeOfPolicy}
            onChange={handleChange}
            className="w-full px-4 py-2 mt-2 border border-gray-300 rounded-lg"
            required
          />
        </div>

        {/* Heading */}
        <div className="mb-4">
          <label htmlFor="Heading" className="block text-sm font-medium text-gray-600">
            Heading
          </label>
          <input
            type="text"
            id="Heading"
            name="Heading"
            value={formData.Heading}
            onChange={handleChange}
            className="w-full px-4 py-2 mt-2 border border-gray-300 rounded-lg"
            required
          />
        </div>

        {/* Written By */}
        <div className="mb-4">
          <label htmlFor="WrittienBy" className="block text-sm font-medium text-gray-600">
            Written By
          </label>
          <input
            type="text"
            id="WrittienBy"
            name="WrittienBy"
            value={formData.WrittienBy}
            onChange={handleChange}
            className="w-full px-4 py-2 mt-2 border border-gray-300 rounded-lg"
            required
          />
        </div>

        {/* Rich Text Editor for HtmlContent */}
        <div className="mb-4">
          <label htmlFor="HtmlContent" className="block text-sm font-medium text-gray-600">
            Policy Content (HTML)
          </label>
          <ReactQuill
            value={formData.HtmlContent}
            onChange={handleEditorChange}
            theme="snow"
            className="mt-2"
            required
          />
        </div>

        {/* Submit Button */}
        <div className="mb-4">
          <button
            type="submit"
            className="w-full px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition duration-300"
          >
            {isEditMode ? 'Update Policy' : 'Create Policy'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default CreatePolicy;
