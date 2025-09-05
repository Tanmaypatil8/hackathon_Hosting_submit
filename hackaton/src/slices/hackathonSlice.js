import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { getHackathons, registerForHackathon } from "../api";

export const fetchHackathons = createAsyncThunk("hackathon/fetchHackathons", async () => {
  return await getHackathons();
});

export const registerHackathon = createAsyncThunk("hackathon/registerHackathon", async (hackathonId) => {
  return await registerForHackathon(hackathonId);
});

const hackathonSlice = createSlice({
  name: "hackathon",
  initialState: {
    hackathons: [],
    loading: false,
    error: null,
    registrationMessage: "",
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchHackathons.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchHackathons.fulfilled, (state, action) => {
        state.loading = false;
        state.hackathons = action.payload;
      })
      .addCase(fetchHackathons.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })
      .addCase(registerHackathon.fulfilled, (state, action) => {
        state.registrationMessage = action.payload.error || "Registered successfully!";
      });
  },
});

export default hackathonSlice.reducer;
