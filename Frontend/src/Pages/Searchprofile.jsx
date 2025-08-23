import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import Slider from '../component/Slider.jsx';
import Alternate from '../component/Alternate.jsx';
import '../App.css';

function UserProfile() {
  const [profile, setProfile] = useState(null);
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const { userId } = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        const res = await fetch(`http://localhost:3000/api/v1/auth/user-profile/${userId}`, {
          method: "GET",
          credentials: "include",
        });

        if (!res.ok) throw new Error('Failed to fetch profile');
        
        const data = await res.json();
        console.log('fetched data:', data);
        setProfile(data);
        setPosts(data.posts || []);
      } catch (err) {
        console.error('Error fetching profile:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchUserProfile();
  }, [userId]);

  const handleMessage = () => {
    navigate(`/messages/${userId}`);
  };

  const handleFollow = () => {
    // Just a placeholder - you can implement the actual follow functionality later
    alert('Follow functionality will be implemented here');
  };

  const handleDelete = async (postId) => {
    if (!window.confirm('Are you sure you want to delete this post?')) return;

    try {
      const res = await fetch(`http://localhost:5173/api/v1/post/delete-post/${postId}`, {
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
      alert('Post deleted successfully!');
    } catch (err) {
      console.error("Delete error:", err);
      alert(`Delete failed: ${err.message}`);
    }
  };

  if (loading) return <div className="flex items-center justify-center h-screen text-white">Loading...</div>;
  if (!profile) return <div className="flex items-center justify-center h-screen text-white">User not found</div>;

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
            src={profile.profilePicture || "https://www.freeiconspng.com/thumbs/profile-icon-png/account-profile-user-icon--icon-search-engine-10.png"}
            alt="Profile"
            className='w-24 h-24 rounded-full border-2 border-gray-500 mx-auto sm:mx-0'
          />
          <div className='text-center sm:text-left flex-1'>
            <h1 className='text-2xl font-bold'>{profile.fullname || "No name"}</h1>
            <p className='text-gray-400 break-all'>@{profile.username || "username"}</p>
            <div className='flex flex-wrap justify-center sm:justify-start gap-4 mt-4'>
              <button
                className='px-4 py-2 bg-blue-600 rounded hover:bg-blue-700 transition'
                onClick={handleMessage}
              >
                Message
              </button>
              <button
                className='px-4 py-2 bg-blue-600 rounded hover:bg-blue-700 transition'
                onClick={handleFollow}
              >
                Follow
              </button>
              
            </div>
          </div>
        </div>

        {/* Bio */}
        <div className='p-4 md:p-6 bg-black'>
          <h2 className='font-bold text-xl'>Bio</h2>
          <p className='text-gray-400 text-md'>{profile.bio || "No bio available."}</p>
        </div>

        {/* Stats */}
        <div className='flex justify-around text-center mb-4 px-4 md:px-6 flex-wrap gap-y-4 bg-black'>
          <div>
            <h2 className='text-xl font-bold'>{posts.length}</h2>
            <p className='text-gray-400'>Posts</p>
          </div>
          <div>
            <h2 className='text-xl font-bold'>{profile.followers?.length || 0}</h2>
            <p className='text-gray-400'>Followers</p>
          </div>
          <div>
            <h2 className='text-xl font-bold'>{profile.following?.length || 0}</h2>
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
                  className="w-full h-64 object-cover rounded-lg border border-gray-500 transition duration-300 "
                />
                {/* Only show delete button if it's the current user's profile */}
                {profile.isCurrentUser && (
                  <button
                    onClick={() => handleDelete(post._id)}
                    className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 transition duration-300 z-10"
                  >
                    <div className="bg-black bg-opacity-60 p-4 rounded-full hover:bg-opacity-80">
                      <i className="fa-solid fa-trash text-2xl text-white"></i>
                    </div>
                  </button>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export default UserProfile;