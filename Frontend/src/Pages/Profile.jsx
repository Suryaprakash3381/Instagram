import React, { useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';
import Slider from '../component/Slider.jsx';
import Alternate from '../component/Alternate.jsx';
import '../App.css';

function Profile() {
  const [profile, setProfile] = useState(null);
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        setLoading(true);
        const res = await fetch(`http://localhost:3000/api/v1/auth/profile`, {
          method: "GET",
          credentials: "include",
          headers: {
            'Content-Type': 'application/json',
          },
        });

        if (!res.ok) {
          throw new Error('Failed to fetch profile');
        }

        const data = await res.json();
        console.log('Profile data:', data);
        console.log('Image URLs:', data.posts?.map(post => post.imageUrl));

        setProfile(data);
        setPosts(data.posts || []);
      } catch (err) {
        console.error('Profile fetch error:', err);
        toast.error(err.message || 'Could not load profile');
        if (err.message.includes('Unauthorized')) {
          navigate('/login');
        }
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, [navigate]);

  const handleEditProfile = () => navigate('/update');
  const handleCreatePost = () => navigate('/createpost');

  const handleLogout = async () => {
    try {
      const res = await fetch(`/api/v1/auth/logout`, {
        method: "POST",
        credentials: "include",
      });

      if (!res.ok) throw new Error('Logout failed');
      
      toast.success('Logged out successfully');
      navigate('/login');
    } catch (err) {
      console.error('Logout error:', err);
      toast.error(err.message || 'Logout failed');
    }
  };

  const handleDelete = async (postId) => {
    if (!window.confirm('Are you sure you want to delete this post?')) return;

    try {
      const res = await fetch(
        `http://localhost:3000/api/v1/post/delete-post/${postId}`,
        {
          method: "DELETE",
          credentials: "include",
        }
      );

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.message || "Delete failed");
      }

      setPosts(prev => prev.filter(post => post._id !== postId));
      toast.success('Post deleted successfully!');
    } catch (err) {
      console.error("Delete error:", err);
      toast.error(err.message || 'Delete failed');
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen bg-black">
        <div className="text-white text-2xl">Loading profile...</div>
      </div>
    );
  }

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
      <div className='flex flex-col text-white w-full h-full overflow-y-auto'>
        {/* Header */}
        <div className='flex flex-col sm:flex-row sm:items-center gap-6 p-4 md:p-6 bg-black'>
          <img
            src="https://www.freeiconspng.com/thumbs/profile-icon-png/account-profile-user-icon--icon-search-engine-10.png"
            alt="Profile"
            className='w-24 h-24 rounded-full border-2 border-gray-500 mx-auto sm:mx-0'
          />
          <div className='text-center sm:text-left flex-1'>
            <h1 className='text-2xl font-bold'>{profile?.fullname || "User"}</h1>
            <p className='text-gray-400 break-all'>@{profile?.username || "username"}</p>
            <p className='text-gray-400'>{profile?.email || ""}</p>
            <div className='flex flex-wrap justify-center sm:justify-start gap-4 mt-4'>
              <button
                className='px-4 py-2 bg-blue-600 rounded hover:bg-blue-700 transition'
                onClick={handleEditProfile}
              >
                Edit Profile
              </button>
              <button
                className='px-4 py-2 bg-blue-600 rounded hover:bg-blue-700 transition'
                onClick={handleCreatePost}
              >
                <i className="fas fa-plus mr-2"></i> New Post
              </button>
              <button
                className='px-4 py-2 bg-red-600 rounded hover:bg-red-700 transition block md:hidden'
                onClick={handleLogout}
              >
                <i className="fas fa-right-from-bracket mr-2"></i> Logout
              </button>
            </div>
          </div>
        </div>

        {/* Bio */}
        <div className='p-4 md:p-6 bg-black border-b border-gray-800'>
          <h2 className='font-bold text-xl mb-2'>Bio</h2>
          <p className='text-gray-400 text-md'>
            {profile?.bio || "No bio yet. Click 'Edit Profile' to add one."}
          </p>
        </div>

        {/* Stats */}
        <div className='flex justify-around text-center py-4 px-4 md:px-6 bg-black border-b border-gray-800'>
          <div className='px-4'>
            <h2 className='text-xl font-bold'>{posts.length}</h2>
            <p className='text-gray-400'>Posts</p>
          </div>
          <div className='px-4'>
            <h2 className='text-xl font-bold'>{profile?.followers?.length || 0}</h2>
            <p className='text-gray-400'>Followers</p>
          </div>
          <div className='px-4'>
            <h2 className='text-xl font-bold'>{profile?.following?.length || 0}</h2>
            <p className='text-gray-400'>Following</p>
          </div>
        </div>

        {/* Posts Grid */}
        <div className='flex-1 p-4 md:p-6 pb-24 md:pb-6'>
          {posts.length === 0 ? (
            <div className='flex flex-col items-center justify-center h-64'>
              <p className='text-gray-400 text-lg mb-4'>No posts yet</p>
              <button
                className='px-4 py-2 bg-blue-600 rounded hover:bg-blue-700 transition'
                onClick={handleCreatePost}
              >
                <i className="fas fa-plus mr-2"></i> Create Your First Post
              </button>
            </div>
          ) : (
            <div className='grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4'>
              {posts.map((post) => (
                <div key={post._id} className="relative group w-full aspect-square">
                  <img
                    src={`http://localhost:3000${post.imageUrl}`}
                    alt={`Post by ${profile?.username}`}
                    className="w-full h-full object-cover rounded-lg border border-gray-700 transition duration-300 group-hover:opacity-50"
                    onError={(e) => {
                      e.target.onerror = null;
                      e.target.src = 'https://via.placeholder.com/300?text=Image+Not+Found';
                    }}
                  />
                  <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition duration-300">
                    <button
                      onClick={() => handleDelete(post._id)}
                      className="bg-black bg-opacity-70 p-3 rounded-full hover:bg-opacity-90"
                      title="Delete post"
                    >
                      <i className="fa-solid fa-trash text-red-500 text-xl"></i>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default Profile;