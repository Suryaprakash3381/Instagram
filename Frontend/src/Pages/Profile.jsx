import React, { useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';
import Slider from '../component/Slider.jsx';
import Alternate from '../component/Alternate.jsx';
import '../App.css';

function Profile() {
  const [profile, setProfile] = useState(null);
  const [posts, setPosts] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    fetch("http://localhost:3000/api/v1/auth/profile", {
      method: "GET",
      credentials: "include",
    })
      .then((res) => {
        if (!res.ok) throw new Error('Failed to fetch profile');
        return res.json();
      })
      .then((data) => {
        console.log('Profile data received:', data);
        setProfile(data);
        setPosts(data.posts || []);
      })
      .catch((err) => {
        console.error('Error fetching profile:', err);
        toast.error('Could not load profile');
      });
  }, []);

  const handleEditProfile = () => {
    navigate('/update');
  };

  const handleLogout = () => {
    fetch("http://localhost:3000/api/v1/auth/logout", {
      method: "POST",
      credentials: "include",
    })
      .then((res) => {
        if (!res.ok) throw new Error('Logout failed');
        return res.json();
      })
      .then(() => {
        toast.success('Logged out successfully');
        navigate('/login');
      })
      .catch((err) => {
        console.error('Logout error:', err);
        toast.error('Logout failed. Please try again.');
      });
  };

  const handleDelete = async (postId) => {
    if (!window.confirm('Are you sure you want to delete this post?')) return;

    try {
      const res = await fetch(`http://localhost:3000/api/v1/post/delete-post/${postId}`, {
        method: "DELETE",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || "Failed to delete post");
      }

      setPosts(prev => prev.filter(post => post._id !== postId));
      toast.success('Post deleted successfully!');
    } catch (err) {
      console.error("Delete error:", err);
      toast.error(`Delete failed: ${err.message}`);
    }
  };

  return (
    <div className='flex md:flex-row bg-black h-screen w-full overflow-hidden'>
      {/* Sidebar / Slider */}
      <div className='hidden md:block md:w-1/4 h-full sticky top-0 overflow-hidden'>
        <Slider />
      </div>

      {/* Alternate for Mobile */}
      <div className='block md:hidden fixed bottom-0 w-full z-10 bg-black border-t border-gray-800'>
        <Alternate />
      </div>

      {/* Main Content */}
      <div className='flex flex-col text-white w-full h-full overflow-hidden'>
        {/* Header */}
        <div className='flex flex-col sm:flex-row sm:items-center gap-6 p-4 md:p-6 bg-black z-20'>
          <img
            src="https://www.freeiconspng.com/thumbs/profile-icon-png/account-profile-user-icon--icon-search-engine-10.png"
            alt="Profile"
            className='w-24 h-24 rounded-full border-2 border-gray-500 mx-auto sm:mx-0'
          />
          <div className='text-center sm:text-left flex-1'>
            <h1 className='text-2xl font-bold'>{profile?.fullname || "Loading..."}</h1>
            <p className='text-gray-400 break-all'>@{profile?.username || "Username"}</p>
            <div className='flex flex-wrap justify-center sm:justify-start gap-4 mt-4'>
              <button
                className='px-4 py-2 bg-blue-600 rounded hover:bg-blue-700 transition'
                onClick={handleEditProfile}
              >
                Edit Profile
              </button>
              <button
                className='px-4 py-2 bg-blue-600 rounded hover:bg-blue-700 transition'
                onClick={() => navigate('/createpost')}
              >
                <i className="fas fa-plus mr-2"></i> New Posts
              </button>
              <div className='block md:hidden'>
                <h1 className='text-2xl font-semibold mb-6'>
                  <a href="/login" onClick={(e) => { e.preventDefault(); handleLogout(); }}>
                    <i className="fas fa-right-from-bracket text-red-600 text-xl"></i> Logout
                  </a>
                </h1>
              </div>
            </div>
          </div>
        </div>

        {/* Bio */}
        <div className='p-4 md:p-6 bg-black'>
          <h2 className='font-bold text-xl'>Bio</h2>
          <p className='text-gray-400 text-md'>{profile?.bio || "This is a sample bio for the user."}</p>
        </div>

        {/* Stats */}
        <div className='flex justify-around text-center mb-4 px-4 md:px-6 flex-wrap gap-y-4 bg-black'>
          <div>
            <h2 className='text-xl font-bold'>{posts.length}</h2>
            <p className='text-gray-400'>Posts</p>
          </div>
          <div>
            <h2 className='text-xl font-bold'>{profile?.followers?.length || 0}</h2>
            <p className='text-gray-400'>Followers</p>
          </div>
          <div>
            <h2 className='text-xl font-bold'>{profile?.following?.length || 0}</h2>
            <p className='text-gray-400'>Following</p>
          </div>
        </div>

        {/* Posts Grid */}
        <div className='flex-1 overflow-y-auto px-4 md:px-6 pb-24 hide-scrollbar'>
          <div className='grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4'>
            {posts.map((post) => (
              <div key={post._id} className="relative group w-full h-64">
                <img
                  src={`http://localhost:3000${post.imageUrl}`}
                  alt={`Post ${post._id}`}
                  className="w-full h-64 object-cover rounded-lg border border-gray-500 transition duration-300 group-hover:blur-sm"
                />
                <button
                  onClick={() => handleDelete(post._id)}
                  className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 transition duration-300 z-10"
                >
                  <div className="bg-black bg-opacity-60 p-4 rounded-full hover:bg-opacity-80">
                    <i className="fa-solid fa-trash text-2xl text-white"></i>
                  </div>
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export default Profile;
