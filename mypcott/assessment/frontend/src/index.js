// index.js or your entry point file
import React from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar/Navbar';
import SignIn from './components/Navbar/SignIn';
import SignUp from './components/Navbar/SignUp';
import App from './App';
import Home from './Home'; // Import your Home component

ReactDOM.createRoot(document.getElementById('root')).render(
  <Router>
    <>
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/signin" element={<SignIn />} />
        <Route path="/signup" element={<SignUp />} />
        <Route path="/app" element={<App />} />
      </Routes>
    </>
  </Router>,
);
