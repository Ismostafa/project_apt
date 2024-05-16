import React, { useState } from 'react';
import axios from 'axios';
import './SignupPage.css'; // Import CSS file for styling
import { useNavigate } from "react-router";
import PropTypes from "prop-types";
import Cookies from "js-cookie";
const SignupPage = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');
  const base_url = 'http://localhost:8080';
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
        console.log("usernameeeee=",username);
        console.log("paassss=",password);
        console.log("email=",email);

        const response = await axios.post(`${base_url}/api/auth/sign-up`, {
        username,
        password,
        email
      });
      const token = response.data.token;
      console.log("tokenn yaba===",token);
      console.log('Signin successful:', response.data);

      Cookies.set("token", token, { expires: 7 });
      axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;
      localStorage.setItem("username", response.data.username);
      localStorage.setItem("userid", response.data.id);

      console.log('usernameeeeeee:', response.data.username);
      navigate("/textediter");

    } catch (error) {
      console.error('Signup error:', error);
      setError('An error occurred. Please try again.');
    }
  };

  return (
    <div className="signup-container">
      <h2>Sign Up</h2>
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
        <div className="form-group">
          <label htmlFor="email">Email:</label>
          <input
            type="email"
            id="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>
        {error && <div className="error">{error}</div>}
        <button type="submit" className="submit-btn">Sign Up</button>
      </form>
    </div>
  );
};

export default SignupPage;
