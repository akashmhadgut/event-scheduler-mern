import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import API from "../api/api";
import { useAuth } from "../context/AuthContext";
import { toast } from "react-toastify";

const EventsListPage = () => {
  const [events, setEvents] = useState([]);
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    fetchEvents();
  }, []);

  const fetchEvents = async () => {
    try {
      const res = await API.get("/events");
      setEvents(res.data.data || []);
    } catch (err) {
      toast.error("Failed to fetch events");
    } finally {
      setLoading(false);
    }
  };

  const handleJoin = async (id) => {
    if (!user) {
      toast.info("Please login to join this event.");
      navigate("/login", { state: { from: `/events/${id}` } });
      return;
    }

    try {
      await API.post(`/events/${id}/join`);
      toast.success("You joined the event!");
      fetchEvents();
    } catch (err) {
      toast.error("Error joining event");
    }
  };

  const handleLeave = async (id) => {
    try {
      await API.post(`/events/${id}/leave`);
      toast.info("You left the event");
      fetchEvents();
    } catch (err) {
      toast.error("Error leaving event");
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <div className="text-center">
          <div className="animate-spin h-12 w-12 border-b-2 border-blue-600 rounded-full mx-auto mb-4"></div>
          <p className="text-gray-600 text-lg font-medium">Loading events...</p>
        </div>
      </div>
    );
  }

  if (!events.length) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100 px-4">
        <div className="text-6xl mb-4">📭</div>
        <h2 className="text-2xl font-bold text-gray-800 mb-2">No Events Yet</h2>
        <p className="text-gray-600 mb-4">Be the first to create an event!</p>
        {user && (
          <Link
            to="/create"
            className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition"
          >
            Create Event
          </Link>
        )}
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-10 px-5">
      <h1 className="text-4xl font-bold text-gray-800 text-center mb-10">
        🎉 Discover Events
      </h1>

      <div className="max-w-7xl mx-auto grid gap-8 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {events.map((e) => {
          const joined =
            user &&
            e.attendees &&
            e.attendees.some((a) => a._id === user.id);

          return (
            <div
              key={e._id}
              className="bg-white rounded-xl shadow-lg border border-gray-200 hover:shadow-2xl transition-all"
            >
              {/* Top Accent Border */}
              <div className="h-2 w-full bg-gradient-to-r from-blue-500 to-indigo-600 rounded-t-xl"></div>

              <div className="p-6">
                {/* Title */}
                <h3 className="text-xl font-semibold text-gray-800 mb-2 line-clamp-2">
                  {e.title}
                </h3>

                {/* Description */}
                <p className="text-gray-600 text-sm mb-4 line-clamp-3">
                  {e.description}
                </p>

                {/* Event Details - Horizontal Items */}
                <div className="space-y-3 mb-5">
                  <div className="flex items-center gap-2 text-gray-700">
                    <span className="text-lg">📅</span>
                    <span>{new Date(e.date).toLocaleDateString()}</span>
                  </div>

                  <div className="flex items-center gap-2 text-gray-700">
                    <span className="text-lg">🕒</span>
                    <span>
                      {new Date(e.date).toLocaleTimeString([], {
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </span>
                  </div>

                  <div className="flex items-center gap-2 text-gray-700">
                    <span className="text-lg">📍</span>
                    <span>{e.location}</span>
                  </div>
                </div>

                {/* Creator + Attendees Row */}
                <div className="flex justify-between items-center bg-gray-100 p-3 rounded-lg mb-5">
                  <div>
                    <p className="text-sm font-semibold text-gray-800">
                      👤 {e.createdBy?.name}
                    </p>
                    <p className="text-xs text-gray-500">
                      {e.createdBy?.email}
                    </p>
                  </div>

                  <div className="text-sm font-semibold text-blue-600">
                    👥 {e.attendees?.length || 0}
                  </div>
                </div>

                {/* Buttons */}
                <div className="flex gap-3">
                  <Link
                    to={`/events/${e._id}`}
                    className="flex-1 text-center bg-blue-100 text-blue-700 hover:bg-blue-200 py-2 rounded-lg font-semibold"
                  >
                    Details
                  </Link>

                  <button
                    onClick={() =>
                      joined ? handleLeave(e._id) : handleJoin(e._id)
                    }
                    className={`flex-1 py-2 rounded-lg font-semibold text-white transition ${
                      joined
                        ? "bg-red-500 hover:bg-red-600"
                        : "bg-green-500 hover:bg-green-600"
                    }`}
                  >
                    {joined ? "Leave" : "Join"}
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default EventsListPage;
