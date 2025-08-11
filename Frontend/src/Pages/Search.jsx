import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

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
        'http://localhost:3000/api/v1/auth/search-user',
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
    <div className='flex flex-col justify-center items-center bg-black h-screen text-white'>
      <h1 className='text-2xl font-bold mb-4'>Search Your Friends</h1>

      <div className='bg-gray-900 p-6 rounded-lg w-full max-w-md flex flex-col gap-4'>
        <input
          type='text'
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          className='bg-transparent border border-white text-white placeholder-white px-3 py-2 rounded w-full'
          placeholder='Enter username'
          onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
        />

        <button
          className='bg-green-500 rounded px-4 py-2 hover:bg-green-600 transition'
          onClick={handleSearch}
        >
          Search
        </button>

        {error && <p className='text-red-500'>{error}</p>}

        {user && (
          <div className='bg-gray-800 p-4 rounded mt-4'>
            <h2 
              className='font-bold text-lg cursor-pointer hover:text-blue-400'
              onClick={() => handleProfileClick(user._id)}
            >
              {user.username}
            </h2>
            <p>Email: {user.email}</p>
            {user.profilePicture && (
              <img
                src={`http://localhost:3000${user.profilePicture}`}
                alt='Profile'
                className='w-24 h-24 rounded-full mt-2'
              />
            )}
          </div>
        )}
      </div>
    </div>
  );
}

export default Search;