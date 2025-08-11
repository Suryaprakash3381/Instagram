import { useState } from "react";
import { useNavigate } from 'react-router-dom';

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
   const navigate = useNavigate();

  const handleLogin =  async (e) => {
    e.preventDefault();

    if (!email || !password) {
      setError("Please fill out all fields.");
      return;
    }
    try {
    const res = await fetch('http://localhost:3000/api/v1/auth/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ email, password }),
      credentials: 'include'
    });

    const data = await res.json();
    if (res.ok) {
      alert('Login successful');
      navigate('/profile'); 
    }// Redirect to profile page

      
    console.log(data); // token or error message
  } catch (err) {
    console.error('Login failed:', err);
  }

    // You can replace this with an actual API call
    console.log("Logging in with:", { email, password });
    setError("");
  };

  return (
    <div className="flex  flex-col justify-center items-center h-screen bg-black text-white">
      <form
        onSubmit={handleLogin}
        className="bg-transeparent p-6 rounded-xl shadow-md w-full max-w-sm border border-white "
      >
        <h2 className="text-3xl font-bold mb-4 text-center">Login</h2>

        {error && (
          <div className="bg-red-100 text-red-600 p-2 rounded mb-4 text-sm">
            {error}
          </div>
        )}

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
          Login
        </button>
      </form>
        <div className="mt-4 text-center">
            <p className="text-sm text-gray-400">
            Don't have an account?{" "}
            <a href="/register" className="text-blue-500 hover:underline">
                Register
            </a>
            </p>
            </div>

      
    </div>
  );
}
