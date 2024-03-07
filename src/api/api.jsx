import axios from "axios";

import { BASE_URL } from "./baseURL";

const api = axios.create({
  baseURL: BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

// Function to set Authorization header
export const setAuthHeaders = () => {
  const token = localStorage.getItem("token");
  if (token) {
    api.defaults.headers.common["Authorization"] = `Bearer ${token}`;
  } else {
    delete api.defaults.headers.common["Authorization"];
  }
};

export const postAgent = async (formData) => {
  try {
    setAuthHeaders(); // Set Authorization header
    const response = await api.post("/agent/signup", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
    return response.data;
  } catch (error) {
    console.error("Error posting agent:", error.message);
    throw new Error("Failed to post agent");
  }
};

export const postProduct = async (formData) => {
  try {
    setAuthHeaders();
    const response = await api.post(`product/postitem`, formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
    return response.data;
  } catch (error) {
    console.error("Error posting product:", error.message);
    console.error("Server response:", error.response.data); // Log the detailed error response
    throw new Error("Failed to post product");
  }
};

export const postUser = async (userData) => {
  try {
    setAuthHeaders();
    const response = await api.post("user/postuser", userData);
    return response.data;
  } catch (error) {
    console.error("Error posting user:", error.message);
    throw new Error("Failed to post user");
  }
};

export const loginUser = async (loginData) => {
  try {
    const response = await api.post(`user/login`, loginData);
    const { token } = response.data;
    localStorage.setItem("token", token);
    setAuthHeaders(); // Add this line
    return response.data;
  } catch (error) {
    console.error("Error logging in:", error.message);
    throw new Error("Failed to login");
  }
};

export const blockEmployeeApi = async (employeeId) => {
  // setAuthHeaders();
  const response = await api.put(`${BASE_URL}agent/block/${employeeId}`);
  return response.data;
};

export const unblockEmployeeApi = async (employeeId) => {
  // setAuthHeaders();
  const response = await api.put(`${BASE_URL}agent/unblock/${employeeId}`);
  return response.data;
};

export const fetchEmployeesApi = async () => {
  try {
    setAuthHeaders();
    const response = await api.get(`${BASE_URL}agent/agents`);

    const employeesWithIds = response.data
      .map((employee) => ({
        ...employee,
        id: employee._id,
      }))
      .reverse();

    const allRowsHaveId = employeesWithIds.every(
      (employee) => typeof employee.id !== "undefined"
    );

    if (!allRowsHaveId) {
      throw new Error("Not all rows have a unique `id` property.");
    }

    return employeesWithIds;
  } catch (error) {
    console.error("Error fetching employees:", error.message);
    throw new Error("Failed to fetch employees");
  }
};
export const fetchItemsApi = async (page, pageSize) => {
  try {
    setAuthHeaders();
    const response = await api.get(
      `${BASE_URL}product/getallItems?page=${page}&pageSize=${pageSize}`
    );

    // Log the entire response
    console.log(
      "Response:",
      `${BASE_URL}product/getallItems?page=${page}&pageSize=${pageSize}`
    );

    // Access the 'data' property of the response
    const responseData = response.data.data;
    const totalPage = response.data.totalPages; // Change to totalPage
    console.log("Response data:", responseData); // Log response data
    console.log("Response data totalPage:", totalPage); // Log response data
    // Check if responseData is an array
    if (!Array.isArray(responseData)) {
      throw new Error("Response data is not an array.");
    }

    const itemsWithIds = responseData.map((item) => ({
      ...item,
      id: item._id,
    }));

    // Check if all items have an `id` property
    const allRowsHaveId = itemsWithIds.every(
      (item) => typeof item.id !== "undefined"
    );

    if (!allRowsHaveId) {
      throw new Error("Not all rows have a unique `id` property.");
    }

    return { data: itemsWithIds, totalPage }; // Return totalPage
  } catch (error) {
    console.error("Error fetching items:", error.message);
    throw new Error("Failed to fetch items");
  }
};

export const addItemApi = async (itemData) => {
  try {
    setAuthHeaders();
    const response = await api.post("/adminitem/postadminitem", itemData);
    return response.data;
  } catch (error) {
    console.error("Error adding item:", error.message);
    throw new Error("Failed to add item");
  }
};
export const updateItemApi = async (updatedItem) => {
  try {
    setAuthHeaders();
    const response = await api.put(
      `${BASE_URL}adminitem/updateitem/${updatedItem.id}`,
      updatedItem
    );
    return response.data;
  } catch (error) {
    console.error("Error updating item:", error.message);
    throw new Error("Failed to update item");
  }
};

export const fetchOverallChartDataApi = async () => {
  try {
    setAuthHeaders();
    const overallChartResponse = await api.get(
      `${BASE_URL}product/getchartData`
    );

    if (overallChartResponse.data.chartData) {
      return overallChartResponse.data.chartData;
    } else {
      throw new Error("Invalid overall chart data format");
    }
  } catch (error) {
    console.error("Failed to fetch overall chart data", error);
    throw new Error("Failed to fetch overall chart data");
  }
};

export const fetchChartDataApi = async (filterParams) => {
  try {
    setAuthHeaders();
    const chartResponse = await api.get(
      `${BASE_URL}product/filteredData?${filterParams}`
    );

    if (chartResponse.data.chartData) {
      return chartResponse.data.chartData;
    } else {
      throw new Error("Invalid chart data format");
    }
  } catch (error) {
    console.error("Failed to fetch chart data", error);
    throw new Error("Failed to fetch chart data");
  }
};

export const fetchAllItemsApi = async () => {
  try {
    setAuthHeaders();
    const allItemsResponse = await api.get(`${BASE_URL}product/getallItems`);
    const { data } = allItemsResponse;
    return data.map((row) => ({ ...row, id: row._id })) || [];
  } catch (error) {
    console.error("Failed to fetch all items", error);
    throw new Error("Failed to fetch all items");
  }
};

export const fetchFilterOptionsApi = async () => {
  try {
    setAuthHeaders();
    const response = await api.get(`${BASE_URL}product/getallitmesforFilter`);
    return response.data || [];
  } catch (error) {
    console.error("Failed to fetch filter options", error);
    throw new Error("Failed to fetch filter options");
  }
};

export const fetchAllLocationsApi = async (selectedItem) => {
  try {
    setAuthHeaders();
    const response = await api.get(
      `${BASE_URL}product/getitemsbyLocations?item=${selectedItem || ""}`
    );
    return response.data || [];
  } catch (error) {
    console.error("Failed to fetch all location options", error);
    throw new Error("Failed to fetch all location options");
  }
};

export const fetchFilteredDataApi = async (filterUrl) => {
  try {
    setAuthHeaders();
    const response = await api.get(filterUrl);
    const { tableData } = response.data;

    if (tableData.length === 0) {
      return { filteredData: [], prices: [], locations: [], topItems: [] };
    } else {
      // Set topItems based on the lowest 3 prices in the filtered data
      const sortedItems = [...tableData].sort((a, b) => a.price - b.price);
      const topThreeItems = sortedItems.slice(0, 3);
      return {
        filteredData: tableData.map((row) => ({ ...row, id: row._id })) || [],
        prices: tableData.prices || [],
        locations: tableData.locations || [],
        topItems: topThreeItems,
      };
    }
  } catch (error) {
    console.error("Failed to fetch filtered data", error);
    throw new Error("Failed to fetch filtered data");
  }
};

export const fetchAdminItemsApi = async () => {
  try {
    setAuthHeaders();
    const response = await api.get(`${BASE_URL}adminitem/getallItems`);

    const itemsWithIds = response.data
      .map((item) => ({
        ...item,
        id: item._id,
      }))
      .reverse();

    const allRowsHaveId = itemsWithIds.every(
      (item) => typeof item.id !== "undefined"
    );

    if (!allRowsHaveId) {
      throw new Error("Not all rows have a unique `id` property.");
    }

    return itemsWithIds;
  } catch (error) {
    console.error("Error fetching items:", error.message);
    throw new Error("Failed to fetch items");
  }
};

export const fetchLowestPriceItemApi = async () => {
  try {
    setAuthHeaders();
    const response = await fetch(`${BASE_URL}/product/lowestPriceItem`);
    return await response.json();
  } catch (error) {
    console.error("Failed to fetch lowest price item", error);
    throw error;
  }
};

export const fetchBestLocationApi = async () => {
  try {
    setAuthHeaders();
    const response = await fetch(`${BASE_URL}/product/bestLocationItem`);
    return await response.json();
  } catch (error) {
    console.error("Failed to fetch best location item", error);
    throw error;
  }
};

export const fetchLatestAddedItemApi = async () => {
  try {
    setAuthHeaders();
    const response = await fetch(`${BASE_URL}/product/latestAddedItem`);
    return await response.json();
  } catch (error) {
    console.error("Failed to fetch latest added item", error);
    throw error;
  }
};

export const fetchMostExpensiveItemApi = async () => {
  try {
    setAuthHeaders();
    const response = await fetch(`${BASE_URL}/product/mostExpensiveItem`);
    return await response.json();
  } catch (error) {
    console.error("Failed to fetch most expensive item", error);
    throw error;
  }
};

export const fetchTotalAgentsApi = async () => {
  try {
    setAuthHeaders();
    const response = await fetch(`${BASE_URL}/agent/total`);
    return await response.json();
  } catch (error) {
    console.error("Failed to fetch total agents", error);
    throw error;
  }
};

export const fetchTotalItemsApi = async () => {
  try {
    setAuthHeaders();
    const response = await fetch(`${BASE_URL}/adminitem/total`);
    return await response.json();
  } catch (error) {
    console.error("Failed to fetch total items", error);
    throw error;
  }
};

export const fetchLocationReportsApi = async (location, selectedReport) => {
  try {
    setAuthHeaders();
    const response = await api.get(
      `${BASE_URL}product/getLocationReports/${location}?reportType=${selectedReport}`
    );
    return response.data;
  } catch (error) {
    console.error("Error fetching location reports:", error);
    throw new Error("Failed to fetch location reports");
  }
};

export const fetchLocationSummaryApi = async (location, selectedReport) => {
  try {
    setAuthHeaders();
    const response = await api.get(
      `${BASE_URL}product/getLocationSummary/${location}/${selectedReport}`
    );

    return response.data;
  } catch (error) {
    console.error("Error fetching location summary:", error);
    throw new Error("Failed to fetch location summary");
  }
};

// New API functions for item-based reports
export const fetchItemReportsApi = async (item, selectedReport) => {
  try {
    setAuthHeaders();
    const response = await api.get(
      `${BASE_URL}product/getItemReports/${item}?reportType=${selectedReport}`
    );
    return response.data;
  } catch (error) {
    console.error("Error fetching item reports:", error);
    throw new Error("Failed to fetch item reports");
  }
};

export const fetchItemSummaryApi = async (item, selectedReport) => {
  try {
    setAuthHeaders();
    const response = await api.get(
      `${BASE_URL}product/getItemSummary/${item}/${selectedReport}`
    );

    console.log(response.data); // Log the response

    return response.data;
  } catch (error) {
    console.error("Error fetching item summary:", error);
    throw new Error("Failed to fetch item summary");
  }
};

export const fetchLocations = async () => {
  try {
    setAuthHeaders();
    const response = await api.get(`${BASE_URL}product/getitemsbyLocations`);
    return response.data;
  } catch (error) {
    console.error("Error fetching locations:", error);
    return [];
  }
};

export const fetchItems = async () => {
  try {
    setAuthHeaders();
    const response = await api.get(`${BASE_URL}product/getuniqueItems`);
    return response.data;
  } catch (error) {
    console.error("Error fetching items:", error);
    return [];
  }
};
