import axios from "axios";


const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "https://qa-test-9di7.onrender.com";
const BASE_URL = `${API_BASE_URL}/items`; // 

const api = axios.create({
  baseURL: BASE_URL,
  headers: { "Content-Type": "application/json" },
});


const getAuthHeaders = () => {
  const token = localStorage.getItem("authToken");
  if (!token) throw new Error("Unauthorized: Please log in again.");
  return { Authorization: `Bearer ${token}` };
};


export const createItem = async (data: { name: string; description: string }) => {
  try {
    console.log("Sending POST request to:", `${BASE_URL}`);

    const response = await api.post("/", data, { headers: getAuthHeaders() });

    console.log("Item Created:", response.data);
    return response.data;
  } catch (err) {
    console.error("Create Item Error:", err);
    throw new Error("Failed to create item. Please try again.");
  }
};

//  Function to Fetch All Items
export const fetchItems = async () => {
  try {
    const response = await api.get("?join=user", { headers: getAuthHeaders() });
    return response.data;
  } catch (err) {
    console.error("Fetch Items Error:", err);
    throw new Error("Failed to load items.");
  }
};

// Function to Delete an Item
export const deleteItem = async (id: string) => {
  try {
    await api.delete(`/${id}`, { headers: getAuthHeaders() });
    console.log(`Item ${id} deleted successfully`);
  } catch (err) {
    console.error("Delete Item Error:", err);
    throw new Error("Failed to delete item.");
  }
};
