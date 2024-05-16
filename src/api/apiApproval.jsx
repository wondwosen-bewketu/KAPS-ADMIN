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

export const fetchAdminApprovalProducts = async () => {
  try {
    setAuthHeaders(); // Set authorization headers before making the request
    const response = await api.get("approval/products");
    const products = response.data.products;
    return products.reverse(); // Reverse the array to display newest to oldest
  } catch (error) {
    console.error("Error fetching products:", error);
    throw new Error("Failed to fetch products");
  }
};

export const approveProduct = async (productId, adminReferral) => {
  try {
    setAuthHeaders();
    const response = await api.put(`approval/${productId}/adminApproval`, { adminReferral });
    // Assuming the response contains the updated product
    return response.data;
  } catch (error) {
    console.error("Error approving product:", error.response.data.message);
    throw new Error(error.response.data.message || "Failed to approve product");
  }
};

export const rejectProduct = async (productId, adminReferral) => {
  try {
    setAuthHeaders();
    const response = await api.put(`approval/${productId}/adminrejected`, { adminReferral });
    // Assuming the response contains the updated product
    return response.data;
  } catch (error) {
    console.error("Error rejecting product:", error.response.data.message);
    throw new Error(error.response.data.message || "Failed to reject product");
  }
};

export default api;
