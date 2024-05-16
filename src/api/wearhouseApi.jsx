import axios from "axios";
import { BASE_URL } from "./baseURL";

export const fetchLocations = async () => {
  try {
    const response = await axios.get(`${BASE_URL}wearhouse/locations`, {
      headers: {
        "Content-Type": "application/json",
      },
    });
    // console.log("fetchLocations response:", response.data);
    return response.data;
  } catch (error) {
    console.error("fetchLocations error:", error);
    throw error;
  }
};

export const fetchProductsByLocation = async (location) => {
  try {
    const response = await axios.get(
      `${BASE_URL}wearhouse/locations/${location}`,{
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
    return response.data.products;
  } catch (error) {
    console.error(`Error fetching products for location ${location}:`, error);
    throw error;
  }
};
