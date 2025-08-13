import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Login from './Pages/Login.jsx';
import Profile from './Pages/Profile.jsx';
import Register from './Pages/Register.jsx';
import Search from './Pages/Search.jsx';
import Searchprofile from './Pages/Searchprofile.jsx';
import Add from './Pages/Newpost.jsx';
import Update from './Pages/Update.jsx';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import './App.css';

function App() {
  return (
    <Router>
      {/* Toast container OUTSIDE routes */}
      <ToastContainer position="top-right" autoClose={3000} />

      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/createPost" element={<Add />} />
        <Route path="/update" element={<Update />} />
        <Route path="/search-user" element={<Search />} />
        <Route path="/profile/:userId" element={<Searchprofile />} />
      </Routes>
    </Router>
  );
}

export default App;
