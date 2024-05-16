import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { loginUser, postUser, postAgent } from "../../api/api";

const userSlice = createSlice({
  name: "user",
  initialState: {
    user: null,
    token: null,
    error: null,
  },
  reducers: {
    setUser: (state, action) => {
      state.user = action.payload.user;
      state.token = action.payload.token;
      localStorage.setItem("user", JSON.stringify(action.payload.user));
      localStorage.setItem("token", action.payload.token);
    },
    setError: (state, action) => {
      state.error = action.payload;
    },
    clearError: (state) => {
      state.error = null;
    },
    logout: (state) => {
      state.user = null;
      state.token = null;
      localStorage.removeItem("user");
      localStorage.removeItem("token");
    },
  },
});

export const { setUser, setError, clearError, logout } = userSlice.actions;

// Add the selectUser selector
export const selectUser = (state) => state.user.user;

export const loginUserAsync = (credentials) => async (dispatch) => {
  try {
    const user = await loginUser(credentials);
    localStorage.setItem("user", JSON.stringify(user));
    dispatch(setUser(user));
    dispatch(clearError());
    console.log("User data after login:", user);
  } catch (error) {
    dispatch(setError(error.message));
    throw error;
  }
};

export const postUserAsync = createAsyncThunk(
  "user/postUser",
  async (userData) => {
    const response = await postUser(userData);
    return response;
  }
);

export const postAgentAsync = createAsyncThunk(
  "post_data",
  async (formData, { rejectWithValue }) => {
    try {
      const response = await postAgent(formData);
      return response;
    } catch (error) {
      if (error.response) {
        // Server responded with an error
        console.error("Error posting agent:", error.response.data);
        return rejectWithValue(error.response.data);
      } else if (error.request) {
        // The request was made but no response was received
        console.error("Error posting agent: No response received");
        throw new Error("Failed to post agent: No response received");
      } else {
        // Something happened in setting up the request that triggered an error
        console.error("Error posting agent:", error.message);
        throw new Error("Failed to post agent");
      }
    }
  }
);

export default userSlice.reducer;
