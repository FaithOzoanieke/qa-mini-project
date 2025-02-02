import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { createItem, ItemData } from "../api/items";

const ItemForm = () => {
  const [formData, setFormData] = useState<ItemData>({ name: "", description: "" });
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const navigate = useNavigate();

  // Debugging: Log Auth Token on Load
  useEffect(() => {
    console.log("🔍 Auth Token from LocalStorage:", localStorage.getItem("authToken"));
  }, []);

  // Handle Input Changes
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // Handle Form Submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.name.trim() || !formData.description.trim()) {
      setMessage("Both fields are required.");
      return;
    }

    setLoading(true);
    setMessage(null);

    try {
      const response = await createItem(formData);
      setMessage(`Item "${response?.name}" created successfully!`);
      setTimeout(() => navigate("/items"), 1000);
    } catch (error: unknown) {
      if (error instanceof Error) {
        setMessage(error.message || "Failed to create item. Please try again.");
      } else {
        setMessage("An unknown error occurred.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="bg-white p-6 rounded-lg shadow-md w-96">
        <h2 className="text-2xl font-semibold text-center mb-4">Create an Item</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="name" className="block text-sm font-medium text-gray-700">
              Item Name
            </label>
            <input
              id="name"
              name="name"
              type="text"
              value={formData.name}
              onChange={handleChange}
              className="mt-1 block w-full p-2 border rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
              placeholder="Enter item name"
              required
            />
          </div>

          <div>
            <label htmlFor="description" className="block text-sm font-medium text-gray-700">
              Description
            </label>
            <textarea
              id="description"
              name="description"
              value={formData.description}
              onChange={handleChange}
              className="mt-1 block w-full p-2 border rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
              placeholder="Enter item description"
              rows={3}
              required
            ></textarea>
          </div>

          <button
            type="submit"
            className={`w-full p-2 rounded-md text-white ${
              loading ? "bg-gray-400 cursor-not-allowed" : "bg-blue-500 hover:bg-blue-600"
            } transition`}
            disabled={loading}
          >
            {loading ? "Creating..." : "Create Item"}
          </button>

          {message && <p className="text-center mt-2 text-red-500">{message}</p>}
        </form>

        <p className="text-center text-sm mt-4">
          <button onClick={() => navigate("/items")} className="text-blue-500 hover:underline">
            Back to Item List
          </button>
        </p>
      </div>
    </div>
  );
};

export default ItemForm;
