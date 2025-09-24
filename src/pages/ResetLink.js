import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import ForgotPasswordSidebar from '../components/ForgotPasswordSidebar';
import '../App.css';
import { Alert, Stack } from '@mui/material';

const ForgotPassword = () => {
  const [email, setEmail] = useState('');
  const [alert, setAlert] = useState({ message: '', severity: '' });
  const [loading, setLoading] = useState(false);

  const validateEmail = (email) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setAlert({ message: '', severity: '' });

    if (!email) {
      setAlert({ message: 'Email is required.', severity: 'error' });
      return;
    }

    if (!validateEmail(email)) {
      setAlert({ message: 'Invalid email format.', severity: 'error' });
      return;
    }

    setLoading(true);
    try {
      const response = await axios.post(
        'http://localhost:4000/api/user/admin/sendresetlink',
        { email }
      );
      setAlert({
        message: response.data.message || 'Reset link sent successfully!',
        severity: 'success',
      });
      setEmail('');
      setTimeout(() => setAlert({ message: '', severity: '' }), 4000);
    } catch (err) {
      setAlert({
        message: err.response?.data?.message || 'Something went wrong. Please try again.',
        severity: 'error',
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container">
      <ForgotPasswordSidebar />

      <div className="form-container">
        <h2>Reset Your Password</h2>
        <p>Enter your email to receive a reset link.</p>

        {alert.message && (
          <Stack sx={{ width: '100%', mb: 2 }}>
            <Alert
              severity={alert.severity}
              sx={{ fontWeight: 'bold' }}
              onClose={() => setAlert({ message: '', severity: '' })}
            >
              {alert.message}
            </Alert>
          </Stack>
        )}

        <form onSubmit={handleSubmit}>
          <label>Email address</label>
          <input
            type="email"
            name="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className={alert.severity === 'error' && alert.message.toLowerCase().includes('email') ? 'error-input' : ''}
            placeholder="Enter your email"
          />

          <button type="submit" disabled={loading}>
            {loading ? 'Sending...' : 'Send Reset Link'}
          </button>
        </form>

        <p>
          Remember your password now? <Link to="/login">Back to Login</Link>
        </p>
      </div>
    </div>
  );
};

export default ForgotPassword;
