import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { fetchItemById, Item } from "../api/items";

const ItemDetails = () => {
  const { id } = useParams<{ id: string }>(); 
  // Get item ID from URL
  const [item, setItem] = useState<Item | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const getItem = async () => {
      try {
        if (!id) throw new Error("No item ID provided.");

        const data = await fetchItemById(id);
        setItem(data);
      } catch (err: unknown) {
        if (err instanceof Error) setError(err.message);
        else setError("An unknown error occurred.");
      } finally {
        setLoading(false);
      }
    };

    getItem();
  }, [id]);

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="bg-white p-6 rounded-lg shadow-md w-96">
        <h2 className="text-2xl font-semibold text-center mb-4">Item Details</h2>

        {loading ? (
          <p className="text-gray-700 text-center">Loading...</p>
        ) : error ? (
          <p className="text-red-500 text-center">{error}</p>
        ) : item ? (
          <div className="space-y-2">
            <p><strong>Name:</strong> {item.name}</p>
            <p><strong>Description:</strong> {item.description}</p>
            <p><strong>Created At:</strong> {new Date(item.createdAt).toLocaleString()}</p>
            <p><strong>Updated At:</strong> {new Date(item.updatedAt).toLocaleString()}</p>
            <p><strong>Created By:</strong> {item.userId || "Unknown"}</p>

            {/* Back Button */}
            <button
              onClick={() => navigate("/items")}
              className="mt-4 w-full bg-green-500 text-white p-2 rounded-md hover:bg-green-700 transition"
            >
              Back to Item List
            </button>
          </div>
        ) : (
          <p className="text-gray-700 text-center">Item not found.</p>
        )}
      </div>
    </div>
  );
};

export default ItemDetails;
