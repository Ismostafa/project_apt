import React, { useState } from 'react';
import axios from 'axios';
import './SignupPage.css'; // Import CSS file for styling
import { useNavigate } from "react-router";
import PropTypes from "prop-types";
import Cookies from "js-cookie";
const Login = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const base_url = 'http://localhost:8080';
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
        console.log("usernameeeee=",username);
        console.log("paassss=",password);

        const response = await axios.post(`${base_url}/api/auth/sign-in`, {
        username,
        password,
      });
      const token = response.data.token;
      console.log('Signin successful:', response.data);
      console.log("tokenn login===",token);


      Cookies.set("token", token, { expires: 7 });
      axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;
      localStorage.setItem("username", response.data.username);
      localStorage.setItem("userid", response.data.id);


      navigate("/textediter");

      // Redirect or show success message
    } catch (error) {
      console.error('Signin error:', error);
      setError('An error occurred. Please try again.');
    }
  };

  return (
    <div className="signup-container">
      <h2>Sign in</h2>
      <form onSubmit={handleSubmit} className="signup-form">
        <div className="form-group">
          <label htmlFor="username">Username:</label>
          <input
            type="text"
            id="username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
          />
        </div>
        <div className="form-group">
          <label htmlFor="password">Password:</label>
          <input
            type="password"
            id="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>

        {error && <div className="error">{error}</div>}
        <button type="submit" className="submit-btn">Sign in</button>
      </form>
      <div>
      Don't have an account? <a href="/signup">Sign up</a>
      </div>
    </div>
  );
};

export default Login;
