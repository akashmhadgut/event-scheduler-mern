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
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const fetchEvents = async () => {
    try {
      const res = await API.get("/events");
      setEvents(res.data.data || []);
    } catch (err) {
      console.error("Error fetching events:", err);
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
      console.error("Join error:", err);
      toast.error("Error joining event");
    }
  };

  const handleLeave = async (id) => {
    try {
      await API.post(`/events/${id}/leave`);
      toast.info("You left the event");
      fetchEvents();
    } catch (err) {
      console.error("Leave error:", err);
      toast.error("Error leaving event");
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50 flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mb-4" />
          <p className="text-gray-600 text-lg font-medium">Loading events...</p>
        </div>
      </div>
    );
  }

  if (!events || events.length === 0) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50 flex items-center justify-center px-4">
        <div className="text-center">
          <div className="text-6xl mb-4">📭</div>
          <h2 className="text-2xl font-bold text-gray-800 mb-2">No Events Yet</h2>
          <p className="text-gray-600 mb-6">Be the first to create an event!</p>
          {user && (
            <Link
              to="/create"
              className="inline-block bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-medium transition"
            >
              Create Event
            </Link>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white py-6 px-6 sm:px-10">
        <div className="max-w-7xl mx-auto">
          <h1 className="text-4xl sm:text-5xl font-bold mb-3">🎉 Discover Events</h1>
          <p className="text-blue-100 text-lg">Browse and join amazing events happening near you</p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 sm:px-10 py-12">
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {events.map((e) => {
            const joined = user && e.attendees && e.attendees.some((a) => a._id === user.id);

            return (
              <div
                key={e._id}
                className="bg-white rounded-2xl shadow-md hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 overflow-hidden border border-gray-100"
              >
                <div className="h-3 bg-gradient-to-r from-blue-500 to-indigo-500" />

                <div className="p-6">
                  <h3 className="text-xl font-bold text-gray-800 mb-2 line-clamp-2">{e.title}</h3>
                  <p className="text-gray-600 text-sm mb-4 line-clamp-2">{e.description}</p>

                  <div className="bg-gray-50 rounded-lg p-3 mb-4 space-y-2">
                    <div className="flex items-center text-sm text-gray-700">
                      <span className="text-lg mr-2">📅</span>
                      <span>{new Date(e.date).toLocaleDateString()}</span>
                    </div>
                    <div className="flex items-center text-sm text-gray-700">
                      <span className="text-lg mr-2">🕐</span>
                      <span>{new Date(e.date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                    </div>
                    <div className="flex items-center text-sm text-gray-700">
                      <span className="text-lg mr-2">📍</span>
                      <span>{e.location}</span>
                    </div>
                  </div>

                  <div className="bg-blue-50 rounded-lg p-3 mb-4">
                    <div className="text-sm text-gray-700">
                      <p className="font-medium">👤 {e.createdBy?.name}</p>
                      <p className="text-gray-600 text-xs mt-1">{e.createdBy?.email}</p>
                    </div>
                    <div className="mt-2 pt-2 border-t border-blue-200">
                      <span className="text-sm font-semibold text-blue-600">👥 {e.attendees?.length || 0} {e.attendees?.length === 1 ? 'attendee' : 'attendees'}</span>
                    </div>
                  </div>

                  <div className="flex gap-3">
                    <Link
                      to={`/events/${e._id}`}
                      className="flex-1 bg-blue-100 hover:bg-blue-200 text-blue-700 font-semibold py-2.5 rounded-lg transition text-center"
                    >
                      Details
                    </Link>
                    <button
                      onClick={() => (joined ? handleLeave(e._id) : handleJoin(e._id))}
                      className={`flex-1 font-semibold py-2.5 rounded-lg transition ${
                        joined ? 'bg-red-500 hover:bg-red-600 text-white' : 'bg-green-500 hover:bg-green-600 text-white'
                      }`}
                    >
                      {joined ? 'Leave' : 'Join Now'}
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default EventsListPage;
