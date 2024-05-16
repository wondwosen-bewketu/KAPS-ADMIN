import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { fetchStores } from "../../api/storeApi.jsx";

export const fetchStoresAsync = createAsyncThunk(
  "stores/fetchStores",
  async () => {
    const data = await fetchStores();
    return data;
  }
);

export const storeSlice = createSlice({
  name: "stores",
  initialState: { stores: [], status: "idle", error: null }, // Initialize with status and error properties
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchStoresAsync.fulfilled, (state, action) => {
        // Check the structure of the returned data
        state.stores = action.payload; // Assuming payload contains the fetched data directly
        state.status = "succeeded"; // Update status
      })
      .addCase(fetchStoresAsync.rejected, (state, action) => {
        console.error("Error fetching stores:", action.error.message);
        state.status = "failed"; // Update status
        state.error = action.error.message; // Update error
      })
      .addCase(fetchStoresAsync.pending, (state) => {
        state.status = "loading";
        state.error = null;
      });
  },
});

export const { actions } = storeSlice;

export const selectStores = (state) => state.stores.stores;

export default storeSlice.reducer;
