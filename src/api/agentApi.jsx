import axios from "axios";
import { BASE_URL } from "./baseURL";

export const fetchAgentInfo = async (phone) => {
  try {
    const response = await axios.get(`${BASE_URL}agent/${phone}`, {
      headers: {
        "Content-Type": "application/json", // Example header
      },
    });
    return response.data;
  } catch (error) {
    console.error("fetchAgentInfo error:", error);
    throw error;
  }
};

export const updateAgentInfo = async (phone, formData) => {
  try {
    const token = localStorage.getItem("token");
    const response = await axios.put(`${BASE_URL}agent/${phone}`, formData, {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "multipart/form-data",
      },
    });
    return response.data;
  } catch (error) {
    console.error("updateAgentInfo error:", error); // Add this line
    throw error;
  }
};
