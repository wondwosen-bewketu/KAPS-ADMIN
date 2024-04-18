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

export const changePassword = async (formData, token) => {
  try {
    // Set authorization header with token
    api.defaults.headers.common["Authorization"] = `Bearer ${token}`;
    const response = await api.put("/user/changepassword", formData);
    return response.data;
  } catch (error) {
    console.error("Error changing password:", error.message);
    throw new Error("Failed to change password");
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

export const fetchStores = async () => {
  try {
    setAuthHeaders();
    const response = await api.get(`${BASE_URL}store/all`);
    return response.data.products;
  } catch (error) {
    console.error("Error fetching stores:", error);
    return [];
  }
};