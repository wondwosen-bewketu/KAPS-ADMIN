// productSlice.js
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import {
  fetchLocationReportsApi,
  fetchLocationSummaryApi,
  postProduct,
  fetchItemReportsApi, // Import item-based API function
  fetchItemSummaryApi, // Import item-based API function
} from "../../api/api";

// Async thunk for fetching item reports
export const fetchItemReportsAsync = createAsyncThunk(
  "products/fetchItemReports",
  async ({ item, selectedReport }, { rejectWithValue }) => {
    try {
      const response = await fetchItemReportsApi(item, selectedReport);
      return { data: response, reportType: selectedReport }; // Include reportType in the payload
    } catch (error) {
      return rejectWithValue(error);
    }
  }
);

// Async thunk for fetching item summary
export const fetchItemSummaryAsync = createAsyncThunk(
  "products/fetchItemSummary",
  async ({ item, selectedReport }, { rejectWithValue }) => {
    try {
      const response = await fetchItemSummaryApi(item, selectedReport);
      return response;
    } catch (error) {
      return rejectWithValue(error);
    }
  }
);
// Async thunk for fetching location reports
export const fetchLocationReportsAsync = createAsyncThunk(
  "products/fetchLocationReports",
  async ({ location, selectedReport }, { rejectWithValue }) => {
    try {
      const response = await fetchLocationReportsApi(location, selectedReport);
      return { data: response, reportType: selectedReport }; // Include reportType in the payload
    } catch (error) {
      return rejectWithValue(error);
    }
  }
);

// Async thunk for fetching location summary
export const fetchLocationSummaryAsync = createAsyncThunk(
  "products/fetchLocationSummary",
  async ({ location, selectedReport }, { rejectWithValue }) => {
    try {
      const response = await fetchLocationSummaryApi(location, selectedReport);
      return response;
    } catch (error) {
      return rejectWithValue(error);
    }
  }
);

// Async thunk for posting a new product
export const postItemAsync = createAsyncThunk(
  "products/postitem",
  async (productData, { rejectWithValue }) => {
    try {
      const response = await postProduct(productData);
      return response;
    } catch (error) {
      return rejectWithValue(error);
    }
  }
);

const productSlice = createSlice({
  name: "products",
  initialState: {
    status: "idle", // "idle", "loading", "succeeded", "failed"
    error: null,
    selectedReport: "daily",
    reportData: [],
    summeryData: {
      location: "",
      interval: "",
      totalItems: 0,
      mostSuppliedItem: {
        _id: "",
        totalQuantity: 0,
      },
    },
  },
  reducers: {},

  extraReducers: (builder) => {
    // Handling fetchItemReportsAsync
    builder
      .addCase(fetchItemReportsAsync.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(fetchItemReportsAsync.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.error = null;
        state.reportData =
          action.payload.data[`${action.payload.reportType}Reports`] || [];
      })
      .addCase(fetchItemReportsAsync.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload;
      });

    // Handling fetchItemSummaryAsync
    builder
      .addCase(fetchItemSummaryAsync.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(fetchItemSummaryAsync.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.error = null;
        state.summeryData = action.payload || {};
      })
      .addCase(fetchItemSummaryAsync.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload;
      });

    // Handling fetchLocationReportsAsync
    builder
      .addCase(fetchLocationReportsAsync.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(fetchLocationReportsAsync.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.error = null;
        state.reportData =
          action.payload.data[`${action.payload.reportType}Reports`] || [];
      })
      .addCase(fetchLocationReportsAsync.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload;
      });

    // Handling fetchLocationSummaryAsync
    builder
      .addCase(fetchLocationSummaryAsync.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(fetchLocationSummaryAsync.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.error = null;
        state.summeryData = action.payload || {};
      })
      .addCase(fetchLocationSummaryAsync.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload;
      });

    // Handling postItemAsync
    builder
      .addCase(postItemAsync.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(postItemAsync.fulfilled, (state) => {
        state.status = "succeeded";
        state.error = null;
      })
      .addCase(postItemAsync.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload;
      });
  },
});

export default productSlice.reducer;
