import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { Eye, Edit, Trash, Plus } from "lucide-react";

const BASE_URL = "https:qa-test-9di7.onrender.com/items?join=user";

export type Item = {
  id: string;
  name: string;
  description: string;
  userId: string;
  user?: {
    id: string;
    username: string;
  };
};

const ItemList = () => {
  const [items, setItems] = useState<Item[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  // Fetch items with user info
  useEffect(() => {
    const fetchItems = async () => {
      try {
        const token = localStorage.getItem("authToken");

        if (!token) {
          setError("Unauthorized. Please log in.");
          return;
        }

        const response = await axios.get<Item[]>(BASE_URL, {
          headers: { Authorization: `Bearer ${token}` },
        });

        setItems(response.data);
      } catch (err) {
        console.error("Fetch Error:", err);
        setError("Failed to load items. Please try again.");
      } finally {
        setLoading(false);
      }
    };

    fetchItems();
  }, []);

  // Handle delete action
  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this item?")) return;

    try {
      const token = localStorage.getItem("authToken");

      if (!token) throw new Error("Unauthorized. Please log in.");

      await axios.delete(`https:qa-test-9di7.onrender.com/items/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      setItems((prev) => prev.filter((item) => item.id !== id));
      console.log(`Item ${id} deleted successfully`);
    } catch (err: unknown) {
      console.error("Delete Error:", err);
      setError("Failed to delete item. Please try again.");
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 p-4">
      <div className="bg-white p-6 rounded-lg shadow-md w-full max-w-4xl">
        <h2 className="text-2xl font-semibold text-center mb-4">Item List</h2>

        {/* Display Errors */}
        {error && <p className="text-red-500 text-center">{error}</p>}

        {/* Loading State */}
        {loading ? (
          <p className="text-center text-gray-700">Loading items...</p>
        ) : items.length === 0 ? (
          <p className="text-center text-gray-700">No items found.</p>
        ) : (
          <table className="w-full border-collapse border border-gray-300">
            <thead>
              <tr className="bg-gray-200">
                <th className="border border-gray-300 px-4 py-2">SN</th>
                <th className="border border-gray-300 px-4 py-2">Name</th>
                <th className="border border-gray-300 px-4 py-2">Description</th>
                <th className="border border-gray-300 px-4 py-2">Created By</th>
                <th className="border border-gray-300 px-4 py-2">Action</th>
              </tr>
            </thead>
            <tbody>
              {items.map((item, index) => (
                <tr key={item.id} className="text-center hover:bg-gray-100">
                  <td className="border border-gray-300 px-4 py-2">
                    {index + 1}
                  </td>
                  <td className="border border-gray-300 px-4 py-2">
                    {item.name}
                  </td>
                  <td className="border border-gray-300 px-4 py-2">
                    {item.description}
                  </td>
                  <td className="border border-gray-300 px-4 py-2">
                    {item.user ? item.user.username : "Unknown"}
                  </td>
                  <td className="border border-gray-300 px-4 py-2 space-x-2">
                    {/* View Button */}
                    <button
                      onClick={() => navigate(`/items/${item.id}`)}
                      className="text-blue-500 hover:text-blue-700"
                      aria-label="View Item"
                    >
                      <Eye aria-hidden="true" />
                    </button>
                    {/* Edit Button */}
                    <button
                      onClick={() => navigate(`/edit-item/${item.id}`)}
                      className="text-yellow-500 hover:text-yellow-700"
                      aria-label="Edit Item"
                    >
                      <Edit aria-hidden="true" />
                    </button>
                    {/* Delete Button */}
                    <button
                      onClick={() => handleDelete(item.id)}
                      className="text-red-500 hover:text-red-700"
                      aria-label="Delete Item"
                    >
                      <Trash aria-hidden="true" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}

        {/* Button to Create New Item */}
        <button
          onClick={() => navigate("/create-item")}
          className="mt-4 w-full bg-green-500 text-white p-2 rounded-md hover:bg-green-600 transition flex items-center justify-center"
          aria-label="Create New Item"
        >
          <Plus aria-hidden="true" className="mr-2" />
          <span>Create New Item</span>
        </button>
      </div>
    </div>
  );
};

export default ItemList;
