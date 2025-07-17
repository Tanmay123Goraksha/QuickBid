import React from "react";
import "./Navbar.css"; // Import the CSS
import { Link, useNavigate } from "react-router-dom";




const Navbar = () => {
const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/login");
  };


  return (
    <nav className="navbar">
      <div className="navbar-brand">QuickBid</div>
      <ul className="navbar-links">
        <li><a href="/">Home</a></li>
        <li><a href="/login">Login</a></li>
        
        <li><a href="/profile">Profile</a></li>
       <li>
  <Link to="/my-auctions" className="text-white hover:underline">
    My Auctions
  </Link>
</li>
              <button
        onClick={handleLogout}
        className="bg-red-500 px-4 py-2 rounded hover:bg-red-600"
      >Logout</button>
      </ul>
    </nav>
  );
};

export default Navbar;
