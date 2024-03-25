import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { fetchAgentInfo, updateAgentInfo } from "../../api/agentApi";

export const fetchAgentInfoAsync = createAsyncThunk(
  "agent/fetchAgentInfo",
  async (phone) => {
    const data = await fetchAgentInfo(phone);
    return data;
  }
);

export const updateAgentInfoAsync = createAsyncThunk(
  "agent/updateAgentInfo",
  async ({ phone, formData }) => {
    const data = await updateAgentInfo(phone, formData);
    return data; // Returning the updated agent info
  }
);

const initialState = {
  agentInfo: null,
  status: "idle",
  error: null,
};

export const agentSlice = createSlice({
  name: "agent",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchAgentInfoAsync.pending, (state) => {
        state.status = "loading";
      })
      .addCase(fetchAgentInfoAsync.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.agentInfo = action.payload;
      })
      .addCase(fetchAgentInfoAsync.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message;
      })
      .addCase(updateAgentInfoAsync.pending, (state) => {
        state.status = "loading";
      })
      .addCase(updateAgentInfoAsync.fulfilled, (state, action) => {
        state.status = "succeeded";
        // Update the agentInfo with the new data returned from the update
        state.agentInfo = action.payload;
      })
      .addCase(updateAgentInfoAsync.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message;
      });
  },
});

export const selectAgentInfo = (state) => state.agent.agentInfo;

export default agentSlice.reducer;
