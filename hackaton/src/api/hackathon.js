// src/api/hackathon.js
import { authHeader } from './auth';
const API_BASE = import.meta.env.VITE_API_URL || "http://localhost:5000/api";

// Hackathon endpoints
export const getHackathons = async () => {
  const res = await fetch(`${API_BASE}/hackathons`, {
    headers: authHeader(),
  });
  return res.json();
};

export const getHackathonById = async (id) => {
  const res = await fetch(`${API_BASE}/hackathons/${id}`, {
    headers: authHeader(),
  });
  return res.json();
};

export const createHackathon = async (hackathonData) => {
  try {
    const response = await fetch(`${API_BASE}/hackathons`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        ...authHeader(),
      },
      body: JSON.stringify(hackathonData),
    });
    return await response.json();
  } catch (error) {
    return { error: error.message };
  }
};

export const deleteHackathon = async (hackathonId) => {
  try {
    const response = await fetch(`${API_BASE}/hackathons/${hackathonId}`, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    });
    return await response.json();
  } catch (error) {
    return { error: error.message };
  }
};

export const registerHackathon = async (id, token) => {
  try {
    const res = await fetch(`${API_BASE}/hackathons/${id}/register`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    });
    return await res.json();
  } catch (error) {
    return { error: error.message };
  }
};

