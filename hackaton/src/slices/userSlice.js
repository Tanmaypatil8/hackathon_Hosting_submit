import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { login, getMe, register, setToken, getToken } from "../api";

export const loginUser = createAsyncThunk("user/loginUser", async (data) => {
  const res = await login(data);
  if (res.token) setToken(res.token);
  return res;
});

export const fetchProfile = createAsyncThunk("user/fetchProfile", async () => {
  return await getMe();
});

export const registerUser = createAsyncThunk("user/registerUser", async (data) => {
  return await register(data);
});

const initialState = {
  user: null,
  token: getToken() || null,
  loading: false,
  error: null,
};

const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    logout(state) {
      state.user = null;
      state.token = null;
      localStorage.removeItem("token");
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(loginUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.loading = false;
        state.token = action.payload.token || null;
        state.error = action.payload.message || null;
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })
      .addCase(fetchProfile.fulfilled, (state, action) => {
        state.user = action.payload;
      })
      .addCase(registerUser.fulfilled, (state, action) => {
        state.error = action.payload.message || null;
      });
  },
});

export const { logout } = userSlice.actions;
export default userSlice.reducer;
