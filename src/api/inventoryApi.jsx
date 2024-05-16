import axios from "axios";
import { BASE_URL } from "./baseURL";

export const fetchInventoryProducts = async () => {
  try {
    const response = await axios.get(`${BASE_URL}store/all`, {
      headers: {
        "Content-Type": "application/json",
        // Add any other headers if needed
      },
    });
    return response.data.products;
  } catch (error) {
    throw new Error("Failed to fetch inventory products");
  }
};


