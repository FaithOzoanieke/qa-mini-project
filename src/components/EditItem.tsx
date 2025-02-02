import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { fetchItemById, updateItem, ItemData, ItemResponse } from "../api/items";

const EditItem = () => {
  const { id } = useParams<{ id: string }>(); // Get item ID from URL
  const [formData, setFormData] = useState<ItemData>({ name: "", description: "" });
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState<string | null>(null);
  const navigate = useNavigate();

  // Fetch existing item data
  useEffect(() => {
    const getItem = async () => {
      try {
        if (!id) throw new Error("No item ID provided.");

        const data: ItemResponse | null = await fetchItemById(id);
        if (data) {
          setFormData({ name: data.name, description: data.description });
        }
      } catch (err: unknown) {
        if (err instanceof Error) setMessage(err.message);
      } finally {
        setLoading(false);
      }
    };

    getItem();
  }, [id]);

  // Handle input changes
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage(null);

    try {
      await updateItem(id!, formData); 
      //  Call update function
      setMessage("Item updated successfully!");
      setTimeout(() => navigate("/items"), 1000);
    } catch (error: unknown) {
      if (error instanceof Error) {
        setMessage(error.message || "Failed to update item. Please try again.");
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
        <h2 className="text-2xl font-semibold text-center mb-4">Edit Item</h2>
        {loading ? (
          <p className="text-center text-gray-700">Loading...</p>
        ) : (
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
              {loading ? "Updating..." : "Update Item"}
            </button>

            {message && <p className="text-center mt-2 text-red-500">{message}</p>}
          </form>
        )}

        <p className="text-center text-sm mt-4">
          <button onClick={() => navigate("/items")} className="text-blue-500 hover:underline">
            Back to Item List
          </button>
        </p>
      </div>
    </div>
  );
};

export default EditItem;
