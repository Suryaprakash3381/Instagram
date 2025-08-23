import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import Slider from '../component/Slider.jsx';
import Alternate from '../component/Alternate.jsx';

function Search() {
  const [username, setUsername] = useState('');
  const [user, setUser] = useState(null);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSearch = async () => {
    try {
      setError('');
      setUser(null);

      const res = await axios.post(
        `${import.meta.env.VITE_API_URL}/api/v1/auth/search-user`,
        { username },
        { withCredentials: true }
      );

      setUser(res.data.user);
    } catch (err) {
      if (err.response && err.response.data) {
        setError(err.response.data.message);
      } else {
        setError('Something went wrong');
      }
    }
  };

  const handleProfileClick = (userId) => {
    navigate(`/profile/${userId}`);
  };

  return (
    <div className="flex h-screen bg-black text-white overflow-hidden">
      {/* Sidebar */}
      <div className="hidden md:block md:w-1/4 h-full sticky top-0 border-r border-gray-800">
        <Slider />
      </div>

      {/* Mobile Nav */}
      <div className="block md:hidden fixed bottom-0 w-full z-10 bg-black border-t border-gray-800">
        <Alternate />
      </div>

      {/* Main Content */}
      <div className="flex flex-col justify-center items-center flex-1 px-4 py-8 overflow-y-auto">
        <h1 className="text-3xl font-bold mb-6 text-center">🔍 Search Your Friends</h1>

        <div className="bg-gray-900 p-6 rounded-xl shadow-lg w-full max-w-md space-y-4 border border-gray-700">
          <input
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
            placeholder="Enter username"
            className="bg-transparent border border-white text-white placeholder-white px-4 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
          />

          <button
            onClick={handleSearch}
            className="w-full bg-green-500 text-white py-2 rounded-lg hover:bg-green-600 transition font-semibold"
          >
            Search
          </button>

          {error && <p className="text-red-500 text-sm">{error}</p>}

          {user && (
            <div className="bg-gray-800 p-4 rounded-lg mt-4 border border-gray-700">
              <h2
                className="font-bold text-lg cursor-pointer hover:text-blue-400 transition"
                onClick={() => handleProfileClick(user._id)}
              >
                @{user.username}
              </h2>
              <p className="text-gray-300 text-sm">Email: {user.email}</p>
              {user.profilePicture && (
                <img
                  src={`${import.meta.env.VITE_API_URL}${user.profilePicture}`}
                  alt="Profile"
                  className="w-24 h-24 rounded-full mt-4 border border-gray-600 object-cover"
                />
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default Search;