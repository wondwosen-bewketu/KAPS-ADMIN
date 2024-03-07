import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import {
  fetchItemsApi,
  fetchAdminItemsApi,
  updateItemApi,
  addItemApi,
} from "../../api/api.jsx";

export const fetchItems = createAsyncThunk(
  "items/fetchItems",
  async ({ page, pageSize }) => {
    return fetchItemsApi(page, pageSize);
  }
);

export const updateItem = createAsyncThunk(
  "adminitem/updateitem",
  async (updatedItem) => {
    return updateItemApi(updatedItem);
  }
);

export const fetchAdminItems = createAsyncThunk(
  "adminitem/getallItems",
  async () => {
    return fetchAdminItemsApi();
  }
);

export const addItem = createAsyncThunk("items/addItem", async (itemData) => {
  return addItemApi(itemData);
});

const itemSlice = createSlice({
  name: "items",
  initialState: { items: [], totalPage: 1 }, // Initialize with an object containing an empty array and totalPages
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchItems.fulfilled, (state, action) => {
        state.items = action.payload.data; // Update only the items property
        state.totalPage = action.payload.totalPage; // Update totalPages
      })
      .addCase(fetchItems.rejected, (state, action) => {
        console.error("Error fetching items:", action.error.message);
      })
      .addCase(updateItem.fulfilled, (state, action) => {
        // Find the index of the updated item in the state and replace it
        const updatedItemIndex = state.items.findIndex(
          (item) => item.id === action.payload.id
        );
        if (updatedItemIndex !== -1) {
          state.items[updatedItemIndex] = action.payload;
        }
      })
      .addCase(updateItem.rejected, (state, action) => {
        console.error("Error updating item:", action.error.message);
      })
      .addCase(fetchAdminItems.fulfilled, (state, action) => {
        state.items = action.payload; // Update only the items property
      })
      .addCase(fetchAdminItems.rejected, (state, action) => {
        console.error("Error fetching items:", action.error.message);
      })
      .addCase(addItem.fulfilled, (state, action) => {
        state.items.push(action.payload); // Push the new item to the items array
      })
      .addCase(addItem.rejected, (state, action) => {
        console.error("Error adding item:", action.error.message);
      });
  },
});

export const { actions } = itemSlice;

export const selectItems = (state) => state.items.items; // Access items property

export const selectTotalPages = (state) => state.items.totalPages; // Access totalPages property

export default itemSlice.reducer;
