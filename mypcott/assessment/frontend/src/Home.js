// Home.js
import React from 'react';
import { Link } from 'react-router-dom';

const Home = () => {
  return (
    <div className="container text-center mt-4">
      <h2>Welcome to Your App</h2>
      <div>
        <Link to="/signin" className="btn btn-primary mr-2">
          Sign In
        </Link>
        <Link to="/signup" className="btn btn-primary">
          Sign Up
        </Link>
      </div>
    </div>
  );
};

export default Home;
