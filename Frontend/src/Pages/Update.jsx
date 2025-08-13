import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {toast} from 'react-toastify';

const Update = () => {
  const [formData, setFormData] = useState({
    fullname: '',
    username: '',
    bio: ''
  });
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  // Fetch current profile data when component mounts
  useEffect(() => {
    fetch(`${import.meta.env.VITE_API_URL}/api/v1/auth/profile`, {
      method: "GET",
      credentials: "include",
    })
      .then(res => res.json())
      .then(data => {
        setFormData({
          fullname: data.fullname || '',
          username: data.username || '',
          bio: data.bio || ''
        });
      });
  }, []);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL}/api/v1/auth/update-profile`, {
        method: "PUT",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData)
      });

      const data = await res.json();

      if (!res.ok) throw new Error(data.message || "Update failed");
      
      toast.success('Profile updated successfully!');
      navigate('/profile');
    } catch (err) {
      toast.error(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-black flex items-center justify-center px-4 text-white">
      <div className="w-full max-w-md">
        <h1 className="text-3xl font-bold mb-6 text-center">
          Update Your Profile
        </h1>

        <form onSubmit={handleSubmit} className="bg-gray-900 p-6 rounded-2xl shadow-lg border border-gray-800 flex flex-col gap-5">
          {/* Full Name */}
          <div>
            <label className="block text-sm text-gray-400 mb-1">Full Name</label>
            <input
              type="text"
              name="fullname"
              value={formData.fullname}
              onChange={handleChange}
              className="w-full bg-gray-800 text-white p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
              placeholder="Enter your full name"
            />
          </div>

          {/* Username */}
          <div>
            <label className="block text-sm text-gray-400 mb-1">Username</label>
            <input
              type="text"
              name="username"
              value={formData.username}
              onChange={handleChange}
              className="w-full bg-gray-800 text-white p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
              placeholder="Enter your username"
            />
          </div>

          {/* Bio */}
          <div>
            <label className="block text-sm text-gray-400 mb-1">Bio</label>
            <textarea
              name="bio"
              value={formData.bio}
              onChange={handleChange}
              className="w-full bg-gray-800 text-white p-3 rounded-lg resize-none focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
              rows="4"
              placeholder="Update your bio"
            />
          </div>

          {/* Submit */}
          <button
            type="submit"
            disabled={loading}
            className="bg-blue-600 hover:bg-blue-700 transition py-3 px-4 rounded-lg font-semibold tracking-wide disabled:opacity-50"
          >
            {loading ? 'Updating...' : 'Save Changes'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default Update;