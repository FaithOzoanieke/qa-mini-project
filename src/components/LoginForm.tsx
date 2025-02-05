import React, { useState } from "react"; // Import React explicitly
import { useForm } from "react-hook-form";
import { loginUser, LoginData } from "../api/auth";
import { useNavigate } from "react-router-dom";

const LoginForm = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginData>();

  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const navigate = useNavigate(); 

  // Initialize navigation
  const onSubmit = async (data: LoginData) => {
    setLoading(true);
    setMessage(null);

    const response = await loginUser(data);

    if (response) {
      localStorage.setItem("authToken", response.accessToken);
      setMessage("Login successful! Redirecting...");
      
      //  Redirect to the ItemList page after 1 second
      setTimeout(() => {
        navigate("/items");
      }, 1000);
    } else {
      setMessage("Login failed. Please check your credentials.");
    }

    setLoading(false);
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="bg-white p-6 rounded-lg shadow-md w-96">
        <h2 className="text-2xl font-semibold text-center mb-4">Login</h2>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div>
            <label htmlFor="username" className="block text-sm font-medium text-gray-700">
              Username
            </label>
            <input
              id="username"
              {...register("username", { required: "Username is required" })}
              className="mt-1 block w-full p-2 border rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
              placeholder="Enter your username"
            />
            {errors.username && <p className="text-red-500 text-sm">{errors.username.message}</p>}
          </div>

          <div>
            <label htmlFor="password" className="block text-sm font-medium text-gray-700">
              Password
            </label>
            <input
              id="password"
              type="password"
              {...register("password", { required: "Password is required" })}
              className="mt-1 block w-full p-2 border rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
              placeholder="Enter your password"
            />
            {errors.password && <p className="text-red-500 text-sm">{errors.password.message}</p>}
          </div>

          <button
            type="submit"
            className="w-full bg-blue-500 text-white p-2 rounded-md hover:bg-blue-600 transition"
            disabled={loading}
          >
            {loading ? "Logging in..." : "Login"}
          </button>

          {message && <p className="text-center mt-2 text-gray-700">{message}</p>}
        </form>
      </div>
    </div>
  );
};

export default LoginForm;
