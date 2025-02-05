import axios from "axios";

// ✅ Fix the API Base URL using environment variables
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "https://qa-test-9di7.onrender.com";

export type SignupData = {
  username: string;
  password: string;
};

export type SignupResponse = {
  username: string;
  password: string;
  createdAt: string;
  updatedAt: string;
  id: string;
  deletedAt: string | null;
};

export const signupUser = async (data: SignupData): Promise<SignupResponse | null> => {
  try {
    console.log("🔵 Sending Signup Request to:", `${API_BASE_URL}/auth/signup`);

    const response = await axios.post<SignupResponse>(`${API_BASE_URL}/auth/signup`, data, {
      headers: {
        "Content-Type": "application/json",
      },
    });

    console.log("🟢 Signup Success:", response.data);
    return response.data;
  } catch (error: any) {
    console.error("🔴 Signup failed:", error.response?.data || error.message);
    return null;
  }
};


const LOGIN_URL = "https:qa-test-9di7.onrender.com/auth/login"


export type LoginData = {
  username: string;
  password: string;
};

export type LoginResponse = {
  accessToken: string; 
  // Change from `token` to `accessToken`
  user: {
    id: string;
    username: string;
  };
};

export const loginUser = async (data: LoginData): Promise<LoginResponse | null> => {
  try {
    console.log("Sending login request to:", LOGIN_URL);
    console.log("Request Body:", data);

    const response = await axios.post<LoginResponse>(LOGIN_URL, data, {
      headers: {
        "Content-Type": "application/json",
      },
    });

    console.log("API Response Data:", response.data);

    if (response.data.accessToken) {
      localStorage.setItem("authToken", response.data.accessToken);
      console.log("Token stored:", response.data.accessToken);
    } else {
      console.error("No access token received in response.");
      return null;
    }

    return response.data;
  } catch (error) {
    console.error("Login failed:", error);
    throw new Error("Login failed. Please try again.");
  }
};
