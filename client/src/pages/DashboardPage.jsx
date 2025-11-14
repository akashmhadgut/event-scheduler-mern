import { useEffect, useState } from "react";
 import API from "../api/api";
 import { toast } from "react-toastify";

const DashboardPage = () => {
  const [events, setEvents] = useState([]);
  const [form, setForm] = useState({
    title: "",
    description: "",
    date: "",
    location: "",
  });
  const [editMode, setEditMode] = useState(false);
  const [editId, setEditId] = useState(null);
 
  useEffect(() => {
    fetchMyEvents();
  }, []);

  const fetchMyEvents = async () => {
    try {
      const res = await API.get("/events/my");
      setEvents(res.data.data);
    } catch (err) {
      console.error("Error fetching my events:", err);
    }
  };

  
  const handleCreate = async (e) => {
    e.preventDefault();
    try {
      if (editMode) {
        // ✅ Update event
        await API.put(`/events/${editId}`, form);
        toast.success("Event updated successfully!");
      } else {
        // ✅ Create event
        await API.post("/events", form);
        toast.success("Event created successfully!");
      }

      setForm({ title: "", description: "", date: "", location: "" });
      setEditMode(false);
      setEditId(null);
      fetchMyEvents();
    } catch (err) {
      console.error("Create/Update error:", err);
      toast.error("Failed to save event");
    }
  };

  const handleEdit = (event) => {
    setEditMode(true);
    setEditId(event._id);
    setForm({
      title: event.title,
      description: event.description,
      date: event.date.slice(0, 16), // For datetime-local
      location: event.location,
    });
    window.scrollTo({ top: 0, behavior: "smooth" }); // Smooth scroll to form
  };

  const handleDelete = async (id) => {
    try {
      await API.delete(`/events/${id}`);
      toast.success("Event deleted successfully! 🗑️");
      fetchMyEvents();
    } catch (err) {
      console.error("Delete error:", err);
      toast.error("Failed to delete event");
    }
  };

  const handleCancelEdit = () => {
    setEditMode(false);
    setEditId(null);
    setForm({ title: "", description: "", date: "", location: "" });
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-indigo-50">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white py-5 px-6 sm:px-10">
        <div className="max-w-5xl mx-auto">
          <h1 className="text-4xl sm:text-5xl font-bold mb-3 flex items-center gap-2">
            {editMode ? "✏️ Edit Event" : "🚀 Create New Event"}
          </h1>
          <p className="text-blue-100 text-lg">
            {editMode ? "Update your event details" : "Organize your amazing event and invite attendees"}
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto p-6 sm:p-10">
        {/* Form Section */}
        <div className="bg-white rounded-2xl shadow-lg p-8 mb-12 border border-blue-100">
          <div className="mb-8">
            <h2 className="text-3xl font-bold text-gray-800 flex items-center gap-2">
              {editMode ? "✏️ Update Event" : "📋 Event Details"}
            </h2>
            <div className="h-1 w-16 bg-gradient-to-r from-blue-500 to-indigo-500 rounded mt-3"></div>
          </div>

          <form onSubmit={handleCreate} className="space-y-6">
            {/* Title */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Event Title</label>
              <input
                type="text"
                placeholder="Enter your event title"
                value={form.title}
                onChange={(e) => setForm({ ...form, title: e.target.value })}
                className="w-full border-2 border-gray-300 rounded-lg p-3 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-200 transition"
                required
              />
            </div>

            {/* Description */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Description</label>
              <textarea
                placeholder="Describe your event in detail"
                value={form.description}
                onChange={(e) => setForm({ ...form, description: e.target.value })}
                className="w-full border-2 border-gray-300 rounded-lg p-3 h-28 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-200 transition resize-none"
                required
              />
            </div>

            {/* Date and Location Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Date & Time</label>
                <input
                  type="datetime-local"
                  value={form.date}
                  onChange={(e) => setForm({ ...form, date: e.target.value })}
                  className="w-full border-2 border-gray-300 rounded-lg p-3 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-200 transition"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Location</label>
                <input
                  type="text"
                  placeholder="Enter event location"
                  value={form.location}
                  onChange={(e) => setForm({ ...form, location: e.target.value })}
                  className="w-full border-2 border-gray-300 rounded-lg p-3 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-200 transition"
                  required
                />
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-4 pt-4">
              <button
                type="submit"
                className={`flex-1 text-white font-bold py-3 px-6 rounded-lg transition transform hover:scale-105 ${
                  editMode
                    ? "bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700"
                    : "bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700"
                }`}
              >
                {editMode ? "✅ Update Event" : "➕ Create Event"}
              </button>
              {editMode && (
                <button
                  type="button"
                  onClick={handleCancelEdit}
                  className="flex-1 bg-gray-500 hover:bg-gray-600 text-white font-bold py-3 px-6 rounded-lg transition"
                >
                  ❌ Cancel
                </button>
              )}
            </div>
          </form>
        </div>

        {/* Events List Section */}
        <div>
          <div className="mb-8">
            <h2 className="text-3xl font-bold text-gray-800 flex items-center gap-2">
              📅 My Events
            </h2>
            <div className="h-1 w-16 bg-gradient-to-r from-green-500 to-emerald-500 rounded mt-3"></div>
          </div>

          {events.length === 0 ? (
            <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-2xl border-2 border-dashed border-blue-300 p-12 text-center">
              <p className="text-5xl mb-4">📭</p>
              <p className="text-gray-600 text-lg font-semibold mb-6">No events created yet</p>
              <p className="text-gray-500 mb-8">Start by scrolling up and creating your first amazing event!</p>
              <button
                onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
                className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-bold py-3 px-8 rounded-lg transition transform hover:scale-105"
              >
                ⬆️ Create Event
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {events.map((e) => (
                <div
                  key={e._id}
                  className="bg-white rounded-2xl shadow-md hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 overflow-hidden border border-gray-100"
                >
                  {/* Card Header with Green Gradient (User's events) */}
                  <div className="h-3 bg-gradient-to-r from-green-500 to-emerald-500"></div>

                  {/* Card Content */}
                  <div className="p-6">
                    {/* Title */}
                    <h3 className="text-xl font-bold text-gray-800 mb-2 line-clamp-2">
                      {e.title}
                    </h3>

                    {/* Description */}
                    <p className="text-gray-600 text-sm mb-4 line-clamp-2">
                      {e.description}
                    </p>

                    {/* Event Details Box */}
                    <div className="bg-gradient-to-br from-gray-50 to-gray-100 rounded-lg p-4 mb-4 space-y-2 border border-gray-200">
                      <p className="text-gray-700 flex items-center gap-2 text-sm">
                        <span className="text-lg">📅</span>
                        {new Date(e.date).toLocaleDateString("en-US", {
                          weekday: "short",
                          month: "short",
                          day: "numeric",
                          year: "numeric"
                        })}
                      </p>
                      <p className="text-gray-700 flex items-center gap-2 text-sm">
                        <span className="text-lg">🕐</span>
                        {new Date(e.date).toLocaleTimeString("en-US", {
                          hour: "2-digit",
                          minute: "2-digit"
                        })}
                      </p>
                      <p className="text-gray-700 flex items-center gap-2 text-sm">
                        <span className="text-lg">📍</span>
                        {e.location}
                      </p>
                    </div>

                    {/* Attendees Count */}
                    <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-lg p-3 mb-4 border border-blue-200">
                      <p className="text-blue-700 font-semibold flex items-center gap-2">
                        <span className="text-lg">👥</span>
                        {e.attendees?.length || 0} attendees
                      </p>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex gap-3">
                      <button
                        onClick={() => {
                          handleEdit(e);
                          window.scrollTo({ top: 0, behavior: "smooth" });
                        }}
                        className="flex-1 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-bold py-2 rounded-lg transition transform hover:scale-105"
                      >
                        ✏️ Edit
                      </button>
                      <button
                        onClick={() => handleDelete(e._id)}
                        className="flex-1 bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white font-bold py-2 rounded-lg transition transform hover:scale-105"
                      >
                        🗑️ Delete
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default DashboardPage;
