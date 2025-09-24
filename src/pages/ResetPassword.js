import React, { useState, useEffect } from 'react';
import { useParams, useNavigate,Link } from 'react-router-dom';
import axios from 'axios';
import ForgotPasswordSidebar from '../components/ForgotPasswordSidebar';
import '../App.css';
import { Alert, Stack } from '@mui/material';

const ResetPassword = () => {
  const { token } = useParams();
  const navigate = useNavigate();
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState(''); // eslint-disable-next-line
  const [alert, setAlert] = useState({ message: '', severity: '' });
  const [loading, setLoading] = useState(false);
  const [tokenChecked, setTokenChecked] = useState(false);

  useEffect(() => {
    if (!token) {
      setAlert({
        message: 'Reset token is missing. Please use the correct link from your email.',
        severity: 'error',
      });
    }
    setTokenChecked(true);
  }, [token]);

  const validatePassword = (pwd) => {
    const regex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@#!%^])[A-Za-z\d@#!%^]{8,16}$/;
    if (!pwd.trim()) return 'Password is required';
    if (!regex.test(pwd)) {
      return 'Password must be 8–16 characters with uppercase, lowercase, number & special character.';
    }
    return '';
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setAlert({ message: '', severity: '' });

    if (!token) {
      setAlert({
        message: 'Missing reset token. Please use the correct link.',
        severity: 'error',
      });
      return;
    }

    const pwdError = validatePassword(password);
    if (pwdError) {
      setAlert({ message: pwdError, severity: 'error' });
      return;
    }

    if (password !== confirmPassword) {
      setAlert({
        message: 'Passwords do not match.',
        severity: 'error',
      });
      return;
    }

    setLoading(true);
    try {
      const response = await axios.post(`http://localhost:4000/api/user/resetpassword/${token}`, {
        newPassword: password,
        confirmNewPassword: confirmPassword,
      });

      setAlert({
        message: response.data.message || 'Password reset successfully!',
        severity: 'success',
      });
      setPassword('');
      setConfirmPassword('');
      setTimeout(() => {
        navigate('/login');
      }, 1500);
    } catch (err) {
      const msg = err.response?.data?.message || 'Something went wrong. Please try again.';
      setAlert({ message: msg, severity: 'error' });
    } finally {
      setLoading(false);
    }
  };

  if (!tokenChecked) {
    return (
      <div className="container">
        <p className="loading">Checking token...</p>
      </div>
    );
  }

  return (
    <div className="container">
      <ForgotPasswordSidebar />

      <div className="form-container">
        <h2>Set New Password</h2>
        <p>Enter your new password below.</p>

        {alert.message && (
          <Stack sx={{ width: '100%', mb: 2 }}>
            <Alert severity={alert.severity || 'info'} sx={{ fontWeight: 'bold' }}>
              {alert.message}
            </Alert>
          </Stack>
        )}

        <form onSubmit={handleSubmit}>
          <label>New Password</label>
          <input
            type="password"
            name="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Enter new password"
            className={alert.message.includes('Password') ? 'error-input' : ''}
          />

          <label>Confirm Password</label>
          <input
            type="password"
            name="confirmPassword"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            placeholder="Confirm new password"
            className={alert.message.includes('match') ? 'error-input' : ''}
          />

          <button type="submit" disabled={loading}>
            {loading ? 'Resetting...' : 'Reset Password'}
          </button>
        </form>
        <p className="auth-footer">
          Oops! The reset link is no longer valid. <Link to="/login">Return to Login</Link> and try again.
        </p>
      </div>
    </div>
  );
};

export default ResetPassword;
