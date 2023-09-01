import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const SignIn = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const navigate = useNavigate();

  const handleSignIn = (e) => {
    e.preventDefault();

    if (email === '' || password === '') {
      setError('Please enter your email and password.');
      setSuccess(false);
    } else {
      const userData = localStorage.getItem('userData');

      if (userData) {
        const { email: storedEmail, password: storedPassword } = JSON.parse(userData);

        if (email === storedEmail && password === storedPassword) {
          setError(''); // Clear any previous error
          setSuccess(true);
          setTimeout(() => {
            setSuccess(false);
            navigate('/app');
          }, 2000);
        } else {
          setError('Invalid email or password.');
          setSuccess(false);
        }
      } else {
        setError('No user data found.');
        setSuccess(false);
      }
    }
  };

  return (
    <div className="container mt-4">
      <h2 className="mb-4">Sign In</h2>
      <form onSubmit={handleSignIn}>
        <div className="form-group">
          <label>Email:</label>
          <input
            type="email"
            className="form-control"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>
        <div className="form-group">
          <label>Password:</label>
          <input
            type="password"
            className="form-control"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>
        {error && <div className="alert alert-danger">{error}</div>}
        {success && (
          <div className="alert alert-success">Sign-in successful! Redirecting to dashboard...</div>
        )}
        <button type="submit" className="btn btn-primary">
          Sign In
        </button>
      </form>
    </div>
  );
};

export default SignIn;
