// Header.js
import React from 'react';
import { Link } from 'react-router-dom'; // Import Link component from react-router-dom
import './Header.css'; // Import CSS for styling

function Header() {
  return (
    <header className="header">
      <div className="logo">
        <img src="D:\project_APT\project_apt\public\logo192.png" alt="Logo" className="logo-img" />
      </div>
      <nav className="nav">
        <ul className="nav-list">
          <li className="nav-item">
            <Link to="/login" className="nav-link">Login</Link> {/* Use Link instead of button */}
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
