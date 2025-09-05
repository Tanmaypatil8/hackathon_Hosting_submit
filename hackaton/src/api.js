const API_BASE = import.meta.env.VITE_API_URL || "http://localhost:5000/api";

export const setToken = (token) => {
  localStorage.setItem("token", token);
};

export const getToken = () => {
  return localStorage.getItem("token");
};

const authHeader = () => ({
  Authorization: `Bearer ${getToken()}`,
});

// Auth
export const register = async (data) => {
  const res = await fetch(`${API_BASE}/auth/register`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  return res.json();
};

export const login = async (credentials) => {
  try {
    const res = await fetch(`${API_BASE}/auth/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(credentials)
    });

    const data = await res.json();

    if (!res.ok) {
      throw new Error(data.message || 'Login failed');
    }

    if (data.token) {
      localStorage.setItem('token', data.token);
      return data;
    } else {
      throw new Error('No token received');
    }
  } catch (error) {
    console.error('Login error:', error);
    throw new Error(error.message || 'Server error during login');
  }
};

export const getMe = async () => {
  try {
    const token = localStorage.getItem('token');
    if (!token) {
      throw new Error('No authentication token found');
    }

    const res = await fetch(`${API_BASE}/auth/me`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`
      }
    });

    if (!res.ok) {
      const error = await res.json();
      throw new Error(error.message || 'Failed to fetch user data');
    }

    return await res.json();
  } catch (error) {
    console.error('getMe error:', {
      message: error.message,
      stack: error.stack
    });
    throw error;
  }
};

// Hackathons
export const getHackathons = async () => {
  try {
    const res = await fetch(`${API_BASE}/hackathons`, {
      headers: {
        'Content-Type': 'application/json'
      }
    });

    if (!res.ok) {
      const error = await res.json();
      throw new Error(error.message || 'Failed to fetch hackathons');
    }

    const data = await res.json();
    if (!Array.isArray(data)) {
      console.error('Invalid hackathons data:', data);
      return [];
    }

    return data;
  } catch (error) {
    console.error('Fetch hackathons error:', error);
    return [];
  }
};

export const getHackathonById = async (id) => {
  try {
    const res = await fetch(`${API_BASE}/hackathons/${id}`);
    
    if (!res.ok) {
      const errorData = await res.json();
      throw new Error(errorData.message || 'Failed to fetch hackathon');
    }

    const data = await res.json();
    return data;
  } catch (error) {
    console.error('Error fetching hackathon:', error);
    throw new Error('Failed to fetch hackathon');
  }
};

// Delete Hackathon
export const deleteHackathon = async (hackathonId) => {
  try {
    const token = getToken();
    if (!token) {
      throw new Error('No authentication token found');
    }

    console.log('Attempting to delete hackathon:', {
      hackathonId,
      url: `${API_BASE}/hackathons/${hackathonId}`,
      token: token.substring(0, 10) + '...'  // Log part of token for debugging
    });

    const res = await fetch(`${API_BASE}/hackathons/${hackathonId}`, {
      method: "DELETE",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`
      },
    });

    const data = await res.json();
    console.log('Delete response:', { status: res.status, data });
    
    if (!res.ok) {
      throw new Error(data.message || `Server error: ${res.status}`);
    }

    return data;
  } catch (error) {
    console.error('Delete hackathon error:', {
      message: error.message,
      hackathonId,
      stack: error.stack
    });
    return { error: error.message || 'Failed to delete hackathon' };
  }
};

// Registrations
export const registerForHackathon = async (hackathonId, registrationData) => {
  try {
    const res = await fetch(`${API_BASE}/registrations`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${localStorage.getItem('token')}`
      },
      body: JSON.stringify({
        hackathonId: parseInt(hackathonId),
        ...registrationData
      })
    });

    if (!res.ok) {
      const errorData = await res.json();
      throw new Error(errorData.message || 'Failed to register');
    }

    return await res.json();
  } catch (error) {
    console.error('Registration error:', error);
    throw new Error(error.message || 'Failed to register for hackathon');
  }
};

// Registration Process
export const submitHackathonRegistration = async (hackathonId, registrationData) => {
  try {
    const res = await fetch(`${API_BASE}/hackathons/${hackathonId}/register`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...authHeader()
      },
      body: JSON.stringify(registrationData)
    });
    return await res.json();
  } catch (error) {
    return { error: error.message };
  }
};

// Host APIs
export const updateHostProfile = async (formData) => {
  try {
    const res = await fetch(`${API_BASE}/host/profile`, {
      method: 'PUT',
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('token')}`
      },
      body: formData
    });

    if (!res.ok) {
      const error = await res.json();
      throw new Error(error.message || 'Failed to update host profile');
    }

    const data = await res.json();
    if (data.profilePicUrl) {
      data.profilePicUrl = `${API_BASE}${data.profilePicUrl}`;
    }
    return data;
  } catch (error) {
    console.error('Update host profile error:', error);
    throw error;
  }
};

export const getHostProfile = async () => {
  try {
    const res = await fetch(`${API_BASE}/host/profile`, {
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('token')}`
      }
    });

    if (!res.ok) {
      throw new Error('Failed to fetch host profile');
    }

    const data = await res.json();
    if (data.hostProfile?.profilePicUrl) {
      data.hostProfile.profilePicUrl = `${API_BASE}${data.hostProfile.profilePicUrl}`;
    }
    return data;
  } catch (error) {
    console.error('Get host profile error:', error);
    throw error;
  }
};

// User Profile APIs
export const getUserProfile = async () => {
  try {
    const token = localStorage.getItem('token');
    if (!token) {
      throw new Error('No authentication token found');
    }

    const res = await fetch(`${API_BASE}/users/profile`, {
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`
      }
    });

    if (!res.ok) {
      const errorData = await res.json();
      throw new Error(errorData.message || 'Failed to fetch profile');
    }

    const data = await res.json();
    return data;
  } catch (error) {
    console.error('Get profile error:', error);
    throw new Error('Failed to fetch profile');
  }
};

export const updateUserProfile = async (formData) => {
  try {
    // Get the data from FormData
    const dataJson = formData.get('data');
    let data = JSON.parse(dataJson);

    // Convert arrays to proper format before sending
    if (Array.isArray(data.skills)) {
      data.skills = data.skills.join(',');
    }
    if (Array.isArray(data.achievements)) {
      data.achievements = data.achievements.join('\n');
    }

    // Update the FormData with the modified data
    formData.set('data', JSON.stringify(data));

    const res = await fetch(`${API_BASE}/users/profile`, {
      method: 'PUT',
      headers: {
        Authorization: `Bearer ${localStorage.getItem('token')}`
      },
      body: formData
    });

    if (!res.ok) {
      const errorData = await res.json();
      throw new Error(errorData.message || 'Failed to update profile');
    }

    return await res.json();
  } catch (error) {
    console.error('Update profile error:', error);
    throw error;
  }
};

// Create Hackathon
export const createHackathon = async (hackathonData) => {
  try {
    // Ensure hackathonData includes the mode field (online/offline)
    const res = await fetch(`${API_BASE}/hackathons`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...authHeader()
      },
      body: JSON.stringify({
        ...hackathonData,
        mode: hackathonData.mode || 'online' // Default to online if not specified
      })
    });
    return await res.json();
  } catch (error) {
    return { error: error.message };
  }
};

// Admin APIs
export const getAdminStats = async () => {
  try {
    const res = await fetch(`${API_BASE}/admin/stats`, {
      headers: authHeader()
    });
    return await res.json();
  } catch (error) {
    return { error: error.message };
  }
};

export const getUsers = async () => {
  try {
    const res = await fetch(`${API_BASE}/admin/users`, {
      headers: authHeader()
    });
    return await res.json();
  } catch (error) {
    return { error: error.message };
  }
};

export const updateUserStatus = async (userId, status) => {
  try {
    const res = await fetch(`${API_BASE}/admin/users/${userId}`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        ...authHeader()
      },
      body: JSON.stringify({ status })
    });
    return await res.json();
  } catch (error) {
    return { error: error.message };
  }
};

export const getPendingHackathons = async () => {
  try {
    const res = await fetch(`${API_BASE}/admin/hackathons/pending`, {
      headers: authHeader()
    });
    return await res.json();
  } catch (error) {
    return { error: error.message };
  }
};

export const approveHackathon = async (hackathonId) => {
  try {
    const res = await fetch(`${API_BASE}/admin/hackathons/${hackathonId}/approve`, {
      method: 'POST',
      headers: authHeader()
    });
    return await res.json();
  } catch (error) {
    return { error: error.message };
  }
};

export const getDisputes = async () => {
  try {
    const res = await fetch(`${API_BASE}/admin/disputes`, {
      headers: authHeader()
    });
    return await res.json();
  } catch (error) {
    return { error: error.message };
  }
};

export const resolveDispute = async (disputeId, resolution) => {
  try {
    const res = await fetch(`${API_BASE}/admin/disputes/${disputeId}`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        ...authHeader()
      },
      body: JSON.stringify({ resolution })
    });
    return await res.json();
  } catch (error) {
    return { error: error.message };
  }
};

export const unregisterFromHackathon = async (hackathonId) => {
  try {
    const res = await fetch(`${API_BASE}/registrations/${hackathonId}`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${localStorage.getItem('token')}`
      }
    });

    if (!res.ok) {
      const error = await res.json();
      throw new Error(error.message || 'Failed to unregister');
    }

    return await res.json();
  } catch (error) {
    console.error('Unregister error:', error);
    throw error;
  }
};