// src/api/auth.js
const API_BASE = import.meta.env.VITE_API_URL || "http://localhost:5000/api";

export const setToken = (token) => {
  localStorage.setItem("token", token);
};

export const getToken = () => {
  return localStorage.getItem("token");
};

export const authHeader = () => ({
  Authorization: `Bearer ${getToken()}`,
});

// Auth endpoints
export const register = async (data) => {
  const res = await fetch(`${API_BASE}/auth/register`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  return res.json();
};

export const login = async (data) => {
  const res = await fetch(`${API_BASE}/auth/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  return res.json();
};

export const getMe = async () => {
  const res = await fetch(`${API_BASE}/auth/me`, {
    headers: authHeader(),
  });
  return res.json();
};
