import axios from "axios"; 


const BASE_URL = import.meta.env.VITE_BASE_URL + "/items";


export type ItemData = {
  name: string;
  description: string;
};

export type ItemResponse = {
  id: string;
  name: string;
  description: string;
  userId: string;
  createdAt: string;
  updatedAt: string;
  deletedAt: string | null;
};

// ✅ Function to Create an Item
export const createItem = async (data: ItemData): Promise<ItemResponse | null> => {
  try {
    const token = localStorage.getItem("authToken");

    if (!token) throw new Error("Unauthorized: Please log in again.");

    const response = await axios.post<ItemResponse>(BASE_URL, data, {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });

    return response.data;
  } catch (err: unknown) {
    if (axios.isAxiosError(err)) {
      throw new Error(err.response?.data?.message || "Failed to create item. Please try again.");
    }
    throw new Error("An unknown error occurred.");
  }
};

// ✅ Function to Fetch All Items
export const fetchItems = async (): Promise<ItemResponse[]> => {
  try {
    const token = localStorage.getItem("authToken");

    if (!token) throw new Error("Unauthorized: Please log in again.");

    const response = await axios.get<ItemResponse[]>(`${BASE_URL}?join=user`, {
      headers: { Authorization: `Bearer ${token}` },
    });

    return response.data;
  } catch (err: unknown) {
    if (axios.isAxiosError(err)) {
      throw new Error(err.response?.data?.message || "Failed to load items.");
    }
    throw new Error("An unknown error occurred.");
  }
};

// ✅ Function to Delete an Item
export const deleteItem = async (id: string): Promise<void> => {
  try {
    const token = localStorage.getItem("authToken");

    if (!token) throw new Error("Unauthorized: Please log in again.");

    await axios.delete(`${BASE_URL}/${id}`, {
      headers: { Authorization: `Bearer ${token}` },
    });

    console.log(`✅ Item ${id} deleted successfully`);
  } catch (err: unknown) {
    if (axios.isAxiosError(err)) {
      throw new Error(err.response?.data?.message || "Failed to delete item.");
    }
    throw new Error("An unknown error occurred.");
  }
};



// ✅ Function to Fetch a Single Item by ID
export type Item = {
    id: string;
    name: string;
    description: string;
    userId: string;
    createdAt: string;
    updatedAt: string;
    deletedAt: string | null;
    // user?: {
    //   id: string;
    //   username: string;
    // };
  };
  
  // ✅ Function to Fetch a Single Item by ID
  export const fetchItemById = async (id: string): Promise<Item | null> => {
    try {
      const token = localStorage.getItem("authToken");
  
      if (!token) throw new Error("Unauthorized: Please log in again.");
  
      const response = await axios.get<Item>(`${BASE_URL}/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
  
      return response.data;
    } catch (err: unknown) {
      if (axios.isAxiosError(err)) {
        throw new Error(err.response?.data?.message || "Failed to fetch item.");
      }
      throw new Error("An unknown error occurred.");
    }
  };
  

  // ✅ Function to Update an Item
export const updateItem = async (id: string, data: ItemData): Promise<ItemResponse | null> => {
    try {
      const token = localStorage.getItem("authToken");
  
      if (!token) throw new Error("Unauthorized: Please log in again.");
  
      const response = await axios.patch<ItemResponse>(`${BASE_URL}/${id}`, data, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });
  
      return response.data;
    } catch (err: unknown) {
      if (axios.isAxiosError(err)) {
        throw new Error(err.response?.data?.message || "Failed to update item.");
      }
      throw new Error("An unknown error occurred.");
    }
  };
  