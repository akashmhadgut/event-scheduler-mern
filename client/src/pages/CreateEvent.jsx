import { useState, useContext } from "react";
import API from "../api/api";
import { AuthContext } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

export default function CreateEvent() {
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();

  const [form, setForm] = useState({
    title: "",
    description: "",
    date: "",
    location: "",
  });

  const [loading, setLoading] = useState(false);

  if (!user)
    return (
      <div className="flex items-center justify-center min-h-[70vh] text-lg font-medium text-gray-700">
        Please <span className="text-blue-600 mx-2">login</span> to create an event.
      </div>
    );

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!form.title || !form.description || !form.date || !form.location) {
      toast.warn("Please fill all fields");
      return;
    }

    try {
      setLoading(true);
      await API.post("/events", form);
      toast.success("Event created successfully!");
      navigate("/dashboard");
    } catch (error) {
      console.error("Create Event Error:", error);
      toast.error("Failed to create event. Try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-xl mx-auto p-8 mt-8 bg-white shadow-md rounded-xl">
      <h2 className="text-2xl font-semibold mb-6 text-center text-gray-800">
        ✨ Create a New Event
      </h2>

      <form onSubmit={handleSubmit} className="space-y-5">
        <div>
          <label className="block text-gray-700 font-medium mb-1">
            Event Title
          </label>
          <input
            name="title"
            type="text"
            placeholder="Enter event title"
            value={form.title}
            onChange={handleChange}
            className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          />
        </div>

        <div>
          <label className="block text-gray-700 font-medium mb-1">
            Description
          </label>
          <textarea
            name="description"
            placeholder="Write a short event description..."
            value={form.description}
            onChange={handleChange}
            rows="4"
            className="w-full border border-gray-300 rounded-md px-3 py-2 resize-none focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          ></textarea>
        </div>

        <div>
          <label className="block text-gray-700 font-medium mb-1">
            Date & Time
          </label>
          <input
            name="date"
            type="datetime-local"
            value={form.date}
            onChange={handleChange}
            className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          />
        </div>

        <div>
          <label className="block text-gray-700 font-medium mb-1">
            Location
          </label>
          <input
            name="location"
            type="text"
            placeholder="Enter location"
            value={form.location}
            onChange={handleChange}
            className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          className={`w-full py-2 text-white font-semibold rounded-md transition ${
            loading
              ? "bg-gray-500 cursor-not-allowed"
              : "bg-blue-600 hover:bg-blue-700"
          }`}
        >
          {loading ? "Creating..." : "Create Event"}
        </button>
      </form>
    </div>
  );
}
