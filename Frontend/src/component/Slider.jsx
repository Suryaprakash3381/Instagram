import React from 'react';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

function Slider() {
  const navigate = useNavigate();

  const handleLogout = async (e) => {
    e.preventDefault();
    try {
      await axios.post(`${import.meta.env.VITE_API_URL}/api/v1/auth/logout`, {}, {
        withCredentials: true
      });
      toast.success('Logged out successfully');
    } catch (error) {
      console.error('Logout failed:', error);
    } finally {
      navigate('/login'); // Always redirect
    }
  };

  return (
    <div className='flex flex-col bg-black h-screen w-[20%] border-white border-solid text-white justify-between gap-5 pb-10'>
      <div className='flex flex-col h-3/4 ml-8'>
        <h1 className='text-2xl font-semibold mb-6'>
          <a href="#"><i className="fa-regular fa-house"></i> Home</a>
        </h1>
        <h1 className='text-2xl font-semibold mb-6'>
          <a href="/search-user"><i className="fas fa-search"></i> Search</a>
        </h1>
        <h1 className='text-2xl font-semibold mb-6'>
          <a href="#"><i className="fa-regular fa-compass"></i> Explore</a>
        </h1>
        <h1 className='text-2xl font-semibold mb-6'>
          <a href="#"><i className="fa-regular fa-comments"></i> Message</a>
        </h1>
        <h1 className='text-2xl font-semibold mb-6'>
          <a href="#"><i className="fa-regular fa-heart"></i> Notification</a>
        </h1>
        <h1 className='text-2xl font-semibold mb-6'>
          <a href="/profile"><i className="fa-regular fa-user"></i> Profile</a>
        </h1>
      </div>

      <div className='flex flex-col h-1/4 ml-8'>
        <h1 className='text-2xl font-semibold mb-6'>
          <a href="" onClick={handleLogout}>
            <i className="fas fa-right-from-bracket text-red-600 text-xl"></i> Logout
          </a>
        </h1>
        <h1 className='text-2xl font-semibold mb-6'>
          <a href="#"><i className="fas fa-bars text-2xl"></i> More</a>
        </h1>
      </div>
    </div>
  );
}

export default Slider;
