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
      const token = localStorage.getItem("token");
      const response = await axios.get(`${BASE_URL}approval/adminApproval`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      return response.data.products;
    } catch (error) {
      console.error("Error fetching products:", error);
      throw new Error("Failed to fetch products");
    }
  };
  
  export const approveProduct = async (productId) => {
    try {
      const token = localStorage.getItem("token");
      await axios.put(
        `${BASE_URL}approval/${productId}/adminApproval`,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
    } catch (error) {
      console.error("Error approving product:", error.response.data.message);
      throw new Error(error.response.data.message || "Failed to approve product");
    }
  };
  
  export const rejectProduct = async (productId) => {
    try {
      const token = localStorage.getItem("token");
      await axios.put(
        `${BASE_URL}approval/${productId}/adminrejected`,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
    } catch (error) {
      console.error("Error rejecting product:", error.response.data.message);
      throw new Error(
        error.response.data.message || "Failed to reject product"
      );
    }
  };