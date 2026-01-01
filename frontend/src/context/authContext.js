import React, { createContext, useState, useEffect, useContext } from "react";
import axios from "axios";
import api from "../utils/axios";
import { API_URL } from "../config";


const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem("token") || "");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
  const loadUser = async () => {
    if (!token) {
      setLoading(false);
      return;
    }

    try {
      const res = await api.get("me");
      setUser(res.data);
    } catch (err) {
      logout();
    } finally {
      setLoading(false);
    }
  };

  loadUser();
}, [token]);

  const signup = async ({ name, email, password }) => {
    setLoading(true);
    try {
      await new Promise((resolve) => setTimeout(resolve, 3000));
      const res = await axios.post(`${API_URL}signup`, {
        name,
        email,
        password,
      });
      localStorage.setItem("token", res.data.token);
      setToken(res.data.token);
      setUser(res.data.user);
      setError("");
    } catch (err) {
      setError(err.response?.data?.message || "Signup Failed");
    } finally {
      setLoading(false);
    }
  };

  const login = async ({ email, password }) => {
    setLoading(true);
    try {
      await new Promise((resolve) => setTimeout(resolve, 3000));
      const res = await axios.post(`${API_URL}login`, { email, password });
      localStorage.setItem("token", res.data.token);
      setToken(res.data.token);
      setUser(res.data.user);
      setError("");
    } catch (err) {
      setError(err.response?.data?.message || "Login Failed");
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    localStorage.removeItem("token");
    setToken("");
    setUser(null);
    setError("");
    setLoading(false);
  };

  return (
    <AuthContext.Provider
      value={{ user, token, signup, login, logout, loading, error }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
