import { createSlice } from "@reduxjs/toolkit";
import {
  fetchOverallChartDataApi,
  fetchChartDataApi,
  fetchAllItemsApi,
  fetchFilterOptionsApi,
  fetchAllLocationsApi,
  fetchFilteredDataApi,
} from "../../api/api";

export const dashboardSlice = createSlice({
  name: "dashboard",
  initialState: {
    filterOptions: [],
    selectedFilter: "",
    selectedLocation: "",
    selectedDate: "",
    filteredData: [],
    prices: [],
    locations: [],
    isLoading: true,
    chartData: [],
    chartType: "bar",
    topItems: [],
    selectedItem: null,
    isModalOpen: false,
    error: null, // New error state
  },
  reducers: {
    setFilterOptions: (state, action) => {
      state.filterOptions = action.payload;
    },
    setSelectedFilter: (state, action) => {
      state.selectedFilter = action.payload;
    },
    setSelectedLocation: (state, action) => {
      state.selectedLocation = action.payload;
    },
    setSelectedDate: (state, action) => {
      state.selectedDate = action.payload;
    },
    setFilteredData: (state, action) => {
      state.filteredData = action.payload;
    },
    setPrices: (state, action) => {
      state.prices = action.payload;
    },
    setLocations: (state, action) => {
      state.locations = action.payload;
    },
    setIsLoading: (state, action) => {
      state.isLoading = action.payload;
    },
    setChartData: (state, action) => {
      state.chartData = action.payload;
    },
    setChartType: (state, action) => {
      state.chartType = action.payload;
    },
    setTopItems: (state, action) => {
      state.topItems = action.payload;
    },
    setSelectedItem: (state, action) => {
      state.selectedItem = action.payload;
    },
    setIsModalOpen: (state, action) => {
      state.isModalOpen = action.payload;
    },
    setError: (state, action) => {
      state.error = action.payload;
    },
    clearError: (state) => {
      state.error = null;
    },
  },
});

export const {
  setFilterOptions,
  setSelectedFilter,
  setSelectedLocation,
  setSelectedDate,
  setFilteredData,
  setPrices,
  setLocations,
  setIsLoading,
  setChartData,
  setChartType,
  setTopItems,
  setSelectedItem,
  setIsModalOpen,
  setError,
  clearError,
} = dashboardSlice.actions;

// Thunk to fetch overall chart data
export const fetchOverallChartDataAsync = () => async (dispatch) => {
  try {
    const overallChartResponse = await fetchOverallChartDataApi();
    dispatch(setChartData(overallChartResponse));
    console.log("Overall Chart Data:", overallChartResponse);
  } catch (error) {
    console.error("Failed to fetch overall chart data", error);
    dispatch(setError(error));
  }
};

// Thunk to fetch filtered chart data
export const fetchChartDataAsync = (filterParams) => async (dispatch) => {
  try {
    const chartResponse = await fetchChartDataApi(filterParams);
    dispatch(setChartData(chartResponse));
    console.log("Chart Data:", chartResponse);
  } catch (error) {
    console.error("Failed to fetch chart data", error);
    dispatch(setError(error));
  }
};

// Thunk to fetch all items and display them
export const fetchDataAndDisplayAllItemsAsync = () => async (dispatch) => {
  try {
    dispatch(setIsLoading(true));
    const allItemsResponse = await fetchAllItemsApi();
    dispatch(setFilteredData(allItemsResponse));
    dispatch(setPrices(allItemsResponse.prices || []));
  } catch (error) {
    console.error("Failed to fetch all items", error);
    dispatch(setError(error));
  } finally {
    dispatch(setIsLoading(false));
  }
};

// Thunk to fetch filter options
export const fetchFilterOptionsAsync = () => async (dispatch) => {
  try {
    const response = await fetchFilterOptionsApi();
    dispatch(setFilterOptions(response || []));
  } catch (error) {
    console.error("Failed to fetch filter options", error);
    dispatch(setError(error));
  }
};

// Thunk to fetch all locations based on the selected item
export const fetchAllLocationsAsync = (selectedItem) => async (dispatch) => {
  try {
    const response = await fetchAllLocationsApi(selectedItem);
    dispatch(setLocations(response));
  } catch (error) {
    console.error("Failed to fetch all location options", error);
    dispatch(setError(error));
  }
};

// ... (existing code)

export const fetchFilteredDataAsync = (filterUrl) => async (dispatch) => {
  try {
    const response = await fetchFilteredDataApi(filterUrl);

    const { filteredData, prices, locations, topItems } = response;

    if (filteredData.length === 0) {
      // Handle case where no data is found
      dispatch(setFilteredData([]));
      dispatch(setTopItems([]));

      // Toast notifications based on conditions
      if (selectedFilter !== "" && selectedLocation !== "") {
        toast.error(
          `No data found for ${selectedFilter} in ${selectedLocation} on ${selectedDate}.`
        );
      } else if (selectedFilter !== "" && selectedDate !== "") {
        toast.error(
          `No data found for ${selectedFilter} on ${selectedDate}.`
        );
      }
    } else {
      const mappedData = filteredData.map((row) => ({ ...row, id: row._id }));
      dispatch(setFilteredData(mappedData));

      // Set topItems based on the lowest 3 prices in the filtered data
      const sortedItems = [...filteredData].sort((a, b) => a.price - b.price);
      const topThreeItems = sortedItems.slice(0, 3);
      dispatch(setTopItems(topThreeItems));
    }
  } catch (error) {
    console.error("Failed to fetch filtered data", error);
    dispatch(setError(error));

    // Additional error handling or toast notification if needed
    toast.error("Failed to fetch filtered data. Please try again.");
  }
};

export default dashboardSlice.reducer;
