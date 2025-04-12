// src/components/NavBar.js
import React from 'react';
import { Link } from 'react-router-dom';

const Navbar = () => {
  return (
    <nav className="navbar">
      <div className="navbar-brand">
        <h1>Rocky's Climbing Log</h1>
      </div>
      <ul className="navbar-links">
        <li>
          <Link to="/" className="nav-link">Home</Link>
        </li>
        <li>
          <Link to="/create" className="nav-link">Create Log</Link>
        </li>
        <li>
          <Link to="/logs" className="nav-link">Logs</Link>
        </li>
        <li>
          <Link to="/analytics" className="nav-link">Analytics</Link>
        </li>
      </ul>
    </nav>
  );
};

export default Navbar;
