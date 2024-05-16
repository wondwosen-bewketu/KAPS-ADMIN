import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { fetchInventoryProducts } from "../../api/inventoryApi";

export const fetchInventoryProductsAsync = createAsyncThunk(
  "inventory/fetchInventoryProducts",
  async () => {
    return await fetchInventoryProducts();
  }
);

const inventorySlice = createSlice({
  name: "inventory",
  initialState: {
    products: [],
    status: "idle",
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchInventoryProductsAsync.pending, (state) => {
        state.status = "loading";
      })
      .addCase(fetchInventoryProductsAsync.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.products = action.payload;
      })
      .addCase(fetchInventoryProductsAsync.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message;
      });
  },
});

export default inventorySlice.reducer;
