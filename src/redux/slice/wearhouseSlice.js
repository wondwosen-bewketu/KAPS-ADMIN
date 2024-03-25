import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { fetchLocations, fetchProductsByLocation } from "../../api/wearhouseApi";

export const fetchLocationsAsync = createAsyncThunk(
  "wearhouse/fetchLocationsInfo",
  async () => {
    const data = await fetchLocations();
    return data;
  }
);

export const fetchProductsAsync = createAsyncThunk(
  "wearhouse/fetchProductsInfo",
  async (location) => {
    const data = await fetchProductsByLocation(location);
    return data;
  }
);

const initialState = {
  wearhouseInfo: null,
  products: [], // Initialize products array
  status: "idle",
  error: null,
};

export const wearhouseSlice = createSlice({
  name: "wearhouse",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchLocationsAsync.pending, (state) => {
        state.status = "loading";
      })
      .addCase(fetchLocationsAsync.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.wearhouseInfo = action.payload;
      })
      .addCase(fetchLocationsAsync.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message;
      })
      .addCase(fetchProductsAsync.pending, (state) => {
        state.status = "loading";
      })
      .addCase(fetchProductsAsync.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.products = action.payload;
      })
      .addCase(fetchProductsAsync.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message;
      });
  },
});

export const selectWearhouseInfo = (state) => state.wearhouse.wearhouseInfo;
export const selectProducts = (state) => state.wearhouse.products;

export default wearhouseSlice.reducer;
