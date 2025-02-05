import axios from "axios";

// ✅ Set Correct API Base URL
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "https://qa-test-9di7.onrender.com";
const BASE_URL = `${API_BASE_URL}/items`; // ✅ All requests go to `/items`

// ✅ Centralized Axios Instance
const api = axios.create({
  baseURL: BASE_URL,
  headers: { "Content-Type": "application/json" },
});

// ✅ Function to Get Authentication Headers
const getAuthHeaders = () => {
  const token = localStorage.getItem("authToken");
  if (!token) throw new Error("Unauthorized: Please log in again.");
  return { Authorization: `Bearer ${token}` };
};

// ✅ Type Definitions
export type ItemData = { name: string; description: string };
export type ItemResponse = {
  id: string;
  name: string;
  description: string;
  userId: string;
  createdAt: string;
  updatedAt: string;
  deletedAt: string | null;
};

// ✅ Function to Create an Item (Fixes "Cannot POST /" Error)
export const createItem = async (data: ItemData): Promise<ItemResponse | null> => {
  try {
    console.log("🔵 Sending POST request to:", `${BASE_URL}`); // ✅ Debugging

    const response = await api.post("/", data, { headers: getAuthHeaders() }); // ✅ Corrected API Call

    console.log("🟢 Item Created:", response.data);
    return response.data;
  } catch (err) {
    console.error("🔴 Create Item Error:", err);
    throw new Error("Failed to create item. Please try again.");
  }
};

// ✅ Function to Fetch All Items
export const fetchItems = async (): Promise<ItemResponse[]> => {
  try {
    const response = await api.get("?join=user", { headers: getAuthHeaders() });
    return response.data;
  } catch (err) {
    console.error("🔴 Fetch Items Error:", err);
    throw new Error("Failed to load items.");
  }
};

// ✅ Function to Delete an Item
export const deleteItem = async (id: string): Promise<void> => {
  try {
    await api.delete(`/${id}`, { headers: getAuthHeaders() });
    console.log(`✅ Item ${id} deleted successfully`);
  } catch (err) {
    console.error("🔴 Delete Item Error:", err);
    throw new Error("Failed to delete item.");
  }
};

// ✅ Function to Fetch a Single Item by ID
export const fetchItemById = async (id: string): Promise<ItemResponse | null> => {
  try {
    const response = await api.get(`/${id}`, { headers: getAuthHeaders() });
    return response.data;
  } catch (err) {
    console.error("🔴 Fetch Item Error:", err);
    throw new Error("Failed to fetch item.");
  }
};

// ✅ Function to Update an Item
export const updateItem = async (id: string, data: ItemData): Promise<ItemResponse | null> => {
  try {
    const response = await api.patch(`/${id}`, data, { headers: getAuthHeaders() });
    return response.data;
  } catch (err) {
    console.error("🔴 Update Item Error:", err);
    throw new Error("Failed to update item.");
  }
};
