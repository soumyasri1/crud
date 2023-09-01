import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const SignUp = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [gender, setGender] = useState(''); // Add gender state
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const navigate = useNavigate();

  const handleSignUp = (e) => {
    e.preventDefault();

    if (name === '' || email === '' || password === '' || gender === '') {
      setError('Please fill in all fields.');
      setSuccess(false);
    } else {
      // Store user data in local storage
      localStorage.setItem('userData', JSON.stringify({ name, email, password, gender }));

      setError(''); // Clear any previous error
      setSuccess(true);
      setTimeout(() => {
        setSuccess(false);
        navigate('/signin');
      }, 2000);
    }
  };

  return (
    <div className="container mt-4">
      <h2>Sign Up</h2>
      <form onSubmit={handleSignUp}>
        <div className="form-group mb-3">
          <label>Name:</label>
          <input
            type="text"
            className="form-control"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
        </div>
        <div className="form-group mb-3">
          <label>Email:</label>
          <input
            type="email"
            className="form-control"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>
        <div className="form-group mb-3">
          <label>Password:</label>
          <input
            type="password"
            className="form-control"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>
        <div className="form-group mb-3">
          <label>Gender:</label>
          <select
            className="form-control"
            value={gender}
            onChange={(e) => setGender(e.target.value)}
          >
            <option value="">Select</option>
            <option value="male">Male</option>
            <option value="female">Female</option>
            <option value="other">Other</option>
          </select>
        </div>
        {error && <div className="text-danger">{error}</div>}
        {success && (
          <div className="text-success">Sign-up successful! Redirecting to sign-in page...</div>
        )}
        <button type="submit" className="btn btn-primary">
          Sign Up
        </button>
      </form>
    </div>
  );
};

export default SignUp;
