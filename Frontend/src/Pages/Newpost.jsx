import React, { useState  } from 'react';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';


function AddPost() {
  const [caption, setCaption] = useState('');
  const [image, setImage] = useState(null);
  const [preview, setPreview] = useState(null);
  const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    setImage(file);
    setPreview(URL.createObjectURL(file));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!image || !caption) return alert('Image and caption are required');

    const formData = new FormData();
    formData.append('image', image);
    formData.append('caption', caption);
    formData.append('userId', 'replace_with_loggedIn_user_id'); // 💡 Replace with actual ID from context/token
    // Replace the placeholder with the actual user ID from the token or context

    try {
      setLoading(true);
      const res =await fetch(`${import.meta.env.VITE_API_URL}/api/v1/post/create-post`, {
       method: 'POST',
       body: formData,
      credentials: 'include' // 👈 VERY IMPORTANT: sends the cookie
     })


      const data = await res.json();
      if (res.ok) {
         toast.success('Post created successfully!');
        navigate('/profile'); // Redirect to profile or posts page
        setCaption('');
        setImage(null);
        setPreview(null);
      } else {
        console.error(data);
        toast.error(data.message || 'Failed to create post');
      }
    } catch (err) {
      console.error('Error:', err);
      toast.error('Something went wrong!');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-black text-white px-4">
      <form
        className="bg-gray-900 p-6 rounded-lg w-full max-w-md flex flex-col gap-4"
        onSubmit={handleSubmit}
      >
        <h2 className="text-2xl font-bold text-center">📤 Add New Post</h2>

        {preview && (
          <img
            src={preview}
            alt="Preview"
            className="w-full h-64 object-cover rounded"
          />
        )}

        <input
          type="file"
          accept="image/*"
          onChange={handleImageChange}
          className="bg-gray-800 p-2 rounded"
        />

        <textarea
          value={caption}
          onChange={(e) => setCaption(e.target.value)}
          placeholder="Write a caption..."
          className="bg-gray-800 p-2 rounded resize-none h-24"
        ></textarea>

        <button
          type="submit"
          className="bg-blue-600 hover:bg-blue-700 transition py-2 rounded font-semibold"
          disabled={loading}
        >
          {loading ? 'Uploading...' : 'Post'}
        </button>
      </form>
    </div>
  );
}

export default AddPost;
