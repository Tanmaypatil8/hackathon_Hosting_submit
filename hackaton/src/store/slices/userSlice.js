import { createSlice } from '@reduxjs/toolkit';

const userSlice = createSlice({
  name: 'user',
  initialState: {
    token: localStorage.getItem('token'),
    userInfo: null,
    isHost: false,
    loading: false,
    error: null
  },
  reducers: {
    setLoading: (state, action) => {
      state.loading = action.payload;
    },
    setError: (state, action) => {
      state.error = action.payload;
      state.loading = false;
    },
    setCredentials: (state, action) => {
      const { token, user } = action.payload;
      state.token = token;
      state.userInfo = user;
      state.isHost = user.role === 'HOST';
      state.loading = false;
      state.error = null;
      localStorage.setItem('token', token);
    },
    logout: (state) => {
      state.token = null;
      state.userInfo = null;
      state.isHost = false;
      state.loading = false;
      state.error = null;
      localStorage.removeItem('token');
    }
  }
});

export const { setLoading, setError, setCredentials, logout } = userSlice.actions;
export default userSlice.reducer;
      localStorage.removeItem('userInfo');
    


