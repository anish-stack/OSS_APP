import React, { useState, useEffect } from 'react';
import axios from 'axios';
import toast from 'react-hot-toast'; // For toast notifications

const ManageVideo = () => {
    const [videos, setVideos] = useState([]); // Default to an empty array
    const [formData, setFormData] = useState({
        url: '', // Only URL in formData
    });
    const [editMode, setEditMode] = useState(false);
    const [selectedVideoId, setSelectedVideoId] = useState(null);
    const [showForm, setShowForm] = useState(false); // State to toggle form visibility

    // Fetch all videos
    const fetchVideos = async () => {
        try {
            const response = await axios.get('http://localhost:7000/api/v1/get-all-video');
            setVideos(response.data.data || []); // Ensure videos is always an array
        } catch (error) {
            toast.error('Failed to fetch videos.');
            console.error(error);
        }
    };

    useEffect(() => {
        fetchVideos();
    }, []);

    // Handle form input change
    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prevData) => ({
            ...prevData,
            [name]: value,
        }));
    };

    // Handle create or update form submission
    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            let response;
            if (editMode && selectedVideoId) {
                // Update existing video
                response = await axios.put(`http://localhost:7000/api/v1/update-video/${selectedVideoId}`, formData);
                toast.success('Video updated successfully!');
            } else {
                // Create new video
                response = await axios.post('http://localhost:7000/api/v1/create-video', formData);
                toast.success('Video created successfully!');
            }

            if (response.data.success) {
                fetchVideos(); // Refresh the video list
                setFormData({ url: '' }); // Clear the form
                setEditMode(false); // Reset edit mode
                setShowForm(false); // Hide form after submission
            } else {
                toast.error('Failed to save video.');
            }
        } catch (error) {
            toast.error('An error occurred. Please try again.');
            console.error(error);
        }
    };

    // Handle video edit
    const handleEdit = (videoId, videoUrl) => {
        setSelectedVideoId(videoId);
        setFormData({ url: videoUrl });
        setEditMode(true);
        setShowForm(true); // Show form when editing
    };

    // Handle video deletion
    const handleDelete = async (videoId) => {
        try {
            const response = await axios.delete(`http://localhost:7000/api/v1/delete-video/${videoId}`);
            if (response.data.success) {
                toast.success('Video deleted successfully!');
                fetchVideos(); // Refresh the video list
            } else {
                toast.error('Failed to delete video.');
            }
        } catch (error) {
            toast.error('An error occurred while deleting the video.');
            console.error(error);
        }
    };

    return (
        <div className="p-6 max-w-7xl mx-auto bg-white shadow-lg rounded-lg">
            <h2 className="text-2xl font-semibold text-gray-700 mb-4">{editMode ? 'Edit Video' : 'Create Video'}</h2>

            {/* Create Video Button */}
            {!showForm && (
                <button
                    onClick={() => setShowForm(true)} // Show form when clicked
                    className="mb-6 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition duration-300"
                >
                    Create Video
                </button>
            )}

            {showForm && (
                <form onSubmit={handleSubmit}>
                    <div className="mb-4">
                        <label htmlFor="url" className="block text-sm font-medium text-gray-600">Video URL</label>
                        <input
                            type="text"
                            id="url"
                            name="url"
                            value={formData.url}
                            onChange={handleChange}
                            className="w-full px-4 py-2 mt-2 border border-gray-300 rounded-lg"
                            required
                        />
                    </div>

                    <button
                        type="submit"
                        className="w-full px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition duration-300"
                    >
                        {editMode ? 'Update Video' : 'Create Video'}
                    </button>
                </form>
            )}

            {!showForm && (
                <>
                    <h3 className="text-xl font-semibold text-gray-700 mt-8 mb-4">Videos List</h3>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                        {videos.length > 0 ? (
                            videos.map((video) => (
                                <div key={video._id} className="card bg-white shadow-md rounded-lg overflow-hidden">
                                    <div className="video-frame w-full h-32" dangerouslySetInnerHTML={{ __html: video.url }} />
                                    <div className="p-4">
                                        <div className="flex justify-between items-center">
                                            <button
                                                onClick={() => handleEdit(video._id, video.url)}
                                                className="px-4 py-2 bg-yellow-500 text-white rounded-lg hover:bg-yellow-600 transition duration-300"
                                            >
                                                Edit
                                            </button>
                                            <button
                                                onClick={() => handleDelete(video._id)}
                                                className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition duration-300"
                                            >
                                                Delete
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            ))
                        ) : (
                            <p className="text-gray-500">No videos available.</p>
                        )}
                    </div>
                </>
            )}
        </div>
    );
};

export default ManageVideo;
