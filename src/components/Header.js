// Header.js
import React from 'react';
import { Link } from 'react-router-dom'; // Import Link component from react-router-dom
import './Header.css'; // Import CSS for styling
import logo from "./logo192.png";

function Header() {
  return (
    <header className="header">
      <div className="logo">
      <img src={logo} alt="Logo" className="logo-img" /> {/* Use imported logo */}
      </div>
      <nav className="nav">
        <ul className="nav-list">
          <li className="nav-item">
            <Link to="/login" className="nav-link">Logout</Link> {/* Use Link instead of button */}
          </li>
          <li className="nav-item">
            <Link to="/signup" className="nav-link">Signup</Link> {/* Use Link instead of button */}
          </li>
          <li className="nav-item">
            <Link to="/textediter" className="nav-link">Text Editor</Link> {/* Use Link instead of button */}
          </li>
        </ul>
      </nav>
    </header>
  );
}

export default Header;
