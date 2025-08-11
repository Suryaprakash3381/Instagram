import { useState } from "react";
import { useNavigate } from 'react-router-dom';

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [username, setUsername] = useState("");
  const [fullname, setFullname] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();
 

  const handleRegister = async (e) => {
    e.preventDefault();

    if (!email || !password || !username || !fullname) {
      setError("Please fill out all fields.");
      return;
    }
    try {
      console.log('Sending registration request:', { email, password, username, fullname }); // Debug log
      const res = await fetch('http://localhost:3000/api/v1/auth/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ email, password, username, fullname }),
        credentials: 'include'
      });

      const data = await res.json();
      console.log('Response received:', data); // Debug log

      if (res.ok) {
        alert('User registered successfully');
        navigate('/login'); // Redirect to login page
      } else {
        alert(data.message || 'Registration failed');
      }
    } catch (err) {
      console.error('Registration error:', err); // Debug log
      alert('Something went wrong');
    }
      
    
  };

  return (
    <div className="flex  flex-col justify-center items-center h-screen bg-black text-white">
      <form
        onSubmit={handleRegister}
        className="bg-transeparent p-6 rounded-xl shadow-md w-full max-w-sm border border-white "
      >
        <h2 className="text-3xl font-bold mb-4 text-center">REGISTER</h2>

        {error && (
          <div className="bg-red-100 text-red-600 p-2 rounded mb-4 text-sm">
            {error}
          </div>
        )}

        <div className="mb-4">
          <label className="block text-gray-700 mb-1">Fullname</label>
          <input
            type="text"
            className="bg-transparent border border-white text-white placeholder-white px-3 py-2 rounded w-full"
            value={fullname}
            onChange={(e) => setFullname(e.target.value)}
            placeholder="Enter your fullname"
          />
        </div>
        <div className="mb-4">
          <label className="block text-gray-700 mb-1">Username</label>
          <input
            type="text"
            className="bg-transparent border border-white text-white placeholder-white px-3 py-2 rounded w-full"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            placeholder="Enter your username"
          />
        </div>
         <div className="mb-4">
          <label className="block text-gray-700 mb-1">Email</label>
          <input
            type="email"
             className="bg-transparent border border-white text-white placeholder-white px-3 py-2 rounded w-full"            
             value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Enter your email"
          />
        </div>

        <div className="mb-6">
          <label className="block text-gray-700 mb-1">Password</label>
          <input
            type="password"
           className="bg-transparent border border-white text-white placeholder-white px-3 py-2 rounded w-full"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Enter your password"
          />
        </div>

        <button
          type="submit"
          className="w-full bg-blue-500 text-white py-2 rounded hover:bg-blue-600 transition"
        >
         Register
        </button>
      </form>
        <div className="mt-4 text-center">
            <p className="text-sm text-gray-400">
            Already  have an account?{" "}
            <a href="/login" className="text-blue-500 hover:underline">
                Register
            </a>
            </p>
            </div>

      
    </div>
  );
}


