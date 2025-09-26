import React, { createContext, useContext, useState, useEffect } from 'react';
import { useNavigate } from "react-router-dom";
import axios from 'axios';
import API_BASE from '../config/api';

const UserContext = createContext();

export const UserProvider = ({ children }) => {
  const navigate = useNavigate();

  const [user, setUser] = useState(() => {
    const storedUser = localStorage.getItem("user");
    console.log("Retrieved user from storage:", storedUser);
    return storedUser ? JSON.parse(storedUser) : null;
  });

  useEffect(() => {
    const token = localStorage.getItem("token");
    console.log("Checking for stored token:", token);

    if (token && !user) {
      console.log("Token found. Verifying user...");
      axios
        .get(`${API_BASE}/api/user/verify-user`, {
          headers: { Authorization: `Bearer ${token}` },
        })
        .then((res) => {
          console.log("User verified successfully:", res.data.user);
          setUser(res.data.user);
          localStorage.setItem("user", JSON.stringify(res.data.user));
          navigate('/users/dashboard');
        })
        .catch((err) => {
          console.error("User verification failed:", err.response || err);
          logout();
        });
    }

    const axiosInterceptor = axios.interceptors.response.use(
      (response) => response,
      (error) => {
        if (error.response?.status === 401) {
          console.warn("Unauthorized or token expired. Triggering logout.");
          logout();
        } else {
          console.error("Axios response error:", error);
        }
        return Promise.reject(error);
      }
    );

    return () => {
      axios.interceptors.response.eject(axiosInterceptor);
    };

    // eslint-disable-next-line
  }, []);

  const logout = () => {
    console.log("Logging out... current token:", localStorage.getItem("token"));
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setUser(null);
    navigate('/login');
    console.log("User logged out successfully.");
  };

  return (
    <UserContext.Provider value={{ user, setUser, logout }}>
      {children}
    </UserContext.Provider>
  );
};

export const useUser = () => {
  return useContext(UserContext);
};
