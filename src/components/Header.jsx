import React from 'react';
import { Link } from 'react-router-dom'; // Import Link from react-router-dom

const Header = () => {
  return (
    <div className="navbar bg-black shadow-sm">
      <div className="flex-1">
        <Link to="/" className="btn btn-ghost text-xl text-white">Travel Buddy</Link>
      </div>
      <div className="flex-none">
        <Link to="/about" className="btn btn-outline text-white border-white hover:bg-white hover:text-black">
          About
        </Link>
      </div>
    </div>
  );
};

export default Header;