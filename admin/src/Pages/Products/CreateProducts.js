import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { toast } from "react-hot-toast";

const CreateProducts = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: "",
    mainPrice: "",
    catchLine: "",
    doge: "",
    numberOfCapsule: "",
    discountPercent: "",
    afterDiscountPrice: "",
    description: "",
    howToUse: "",
    quantity: "",
    priceChange: "",
    previewImage: "",
    image: null,
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");


  // Handle input changes
  const handleChange = (e) => {
    const { name, value } = e.target;
  
    // Update the formData state
    setFormData((prev) => ({ ...prev, [name]: value }));
  
    // Log the updated value from the input field directly
    if (name === 'discountPercent') {
      console.log("Updated discountPercent:", value);
    }
  };
  

  // Handle image upload
  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    setFormData((prev) => ({
      ...prev,
      image: file,
      previewImage: URL.createObjectURL(file),
    }));
  };

  // Prepare form data
  const makeFormData = () => {
    const data = new FormData();
    for (const key in formData) {
      if (key === "image" && formData[key]) {
        data.append("images", formData[key]);
      } else if (key !== "previewImage") {
        data.append(key, formData[key]);
      }
    }
    return data;
  };

  // Handle update
  const handleUpdate = async () => {
    setLoading(true);
    try {
      const formData = makeFormData();
      const response = await axios.post(
        `http://localhost:7000/api/v1/create-product`,
        formData,
        { headers: { "Content-Type": "multipart/form-data" } }
      );
      if (response.data.success) {
        toast.success("Product Created successfully!");
        navigate("/Manage-Products"); 
      } else {
        toast.error("Failed to Created product.");
      }
    } catch (err) {
        console.log(err)
      toast.error("An error occurred while updating the product.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className=" max-w-5xl mx-auto">
    <h1 className="text-4xl font-bold mb-8 text-center text-gray-800">Create Product</h1>
    {loading && <div className="text-red-500 text-center font-medium">Loading...</div>}
    {error && <div className="text-red-500 text-center font-medium">{error}</div>}
    <div className="bg-white shadow-xl rounded-lg p-8">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            Product Name
          </label>
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            placeholder="Enter product name"
            className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-red-400 focus:outline-none"
          />
        </div>
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            Main Price
          </label>
          <input
            type="number"
            name="mainPrice"
            value={formData.mainPrice}
            onChange={handleChange}
            placeholder="Enter main price"
            className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-red-400 focus:outline-none"
          />
        </div>
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            Catch Line
          </label>
          <input
            type="text"
            name="catchLine"
            value={formData.catchLine}
            onChange={handleChange}
            placeholder="Enter catch line"
            className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-red-400 focus:outline-none"
          />
        </div>
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">
           Price changes After (days)
          </label>
          <input
            type="text"
            name="priceChange"
            value={formData.priceChange}
            onChange={handleChange}
            placeholder="Enter price Change"
            className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-red-400 focus:outline-none"
          />
        </div>
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            Doge
          </label>
          <input
            type="text"
            name="doge"
            value={formData.doge}
            onChange={handleChange}
            placeholder="Enter doge"
            className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-red-400 focus:outline-none"
          />
        </div>
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            Number of Capsules
          </label>
          <input
            type="number"
            name="numberOfCapsule"
            value={formData.numberOfCapsule}
            onChange={handleChange}
            placeholder="Enter number of capsules"
            className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-red-400 focus:outline-none"
          />
        </div>
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            Discount Percent
          </label>
          <input
            type="number"
            name="discountPercent"
            value={formData.discountPercent}
            onChange={handleChange}
            placeholder="Enter discount percent"
            className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-red-400 focus:outline-none"
          />
        </div>
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            Price After Discount
          </label>
          <input
            type="number"
            name="afterDiscountPrice"
            value={formData.afterDiscountPrice}
            onChange={handleChange}
            placeholder="Enter price after discount"
            className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-red-400 focus:outline-none"
          />
        </div>
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            Quantity
          </label>
          <input
            type="number"
            name="quantity"
            value={formData.quantity}
            onChange={handleChange}
            placeholder="Enter quantity"
            className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-red-400 focus:outline-none"
          />
        </div>
        <div className="md:col-span-2">
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            Description
          </label>
          <textarea
            name="description"
            value={formData.description}
            onChange={handleChange}
            placeholder="Enter description"
            rows="8"
            className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-red-400 focus:outline-none"
          ></textarea>
        </div>
        <div className="md:col-span-2">
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            How to Use
          </label>
          <textarea
            name="howToUse"
            value={formData.howToUse}
            onChange={handleChange}
            placeholder="Enter usage instructions"
            rows="8"
            className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-red-400 focus:outline-none"
          ></textarea>
        </div>
        <div className="md:col-span-2">
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            Upload Image
          </label>
          <input
            type="file"
            name="images"
            onChange={handleImageUpload}
            className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-red-400 focus:outline-none"
          />
        </div>
        {formData.previewImage && (
          <div className="md:col-span-2 flex justify-center mt-4">
            <img
              src={formData.previewImage}
              alt="Preview"
              className="w-48 h-48 object-cover border rounded-lg"
            />
          </div>
        )}
      </div>
      <button
        onClick={handleUpdate}
        className="w-full bg-red-600 text-white py-3 rounded-lg hover:bg-red-700 mt-6 transition duration-200"
      >
        {loading ? "Creating..." : "Create Product"}
      </button>
    </div>
  </div>
  
  );
};

export default CreateProducts;
