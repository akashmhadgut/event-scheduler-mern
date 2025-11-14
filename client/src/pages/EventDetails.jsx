import { useState, useEffect, useCallback } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import API from "../api/api";
import { useAuth } from "../context/AuthContext";
import { toast } from "react-toastify";

export default function EventDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [event, setEvent] = useState(null);
  const [loading, setLoading] = useState(true);

  // ✅ Fetch event details from backend
  const fetchEvent = useCallback(async () => {
    try {
      const res = await API.get(`/events/${id}`);
      setEvent(res.data.data);
    } catch (err) {
      console.error("Fetch event error:", err);
      toast.error("Failed to fetch event details");
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    fetchEvent();
  }, [fetchEvent]);

  const handleJoin = async () => {
    if (!user) {
      toast.info("Please login to join an event.");
      navigate("/login");
      return;
    }
    try {
      await API.post(`/events/${id}/join`);
      toast.success("You’ve joined this event!");
      fetchEvent();
    } catch (err) {
      console.error("Join error:", err);
      toast.error("Failed to join event");
    }
  };

  const handleLeave = async () => {
    try {
      await API.post(`/events/${id}/leave`);
      toast.info("You left the event");
      fetchEvent();
    } catch (err) {
      console.error("Leave error:", err);
      toast.error("Failed to leave event");
    }
  };

  if (loading)
    return (
      <div className="p-8 text-center text-gray-600 text-lg">
        Loading event details...
      </div>
    );

  if (!event)
    return (
      <div className="p-8 text-center text-red-600 text-lg">
        Event not found.
      </div>
    );

   const isJoined = user && event.attendees.some((a) => a._id === user.id);

  return (
    <div className="p-6 sm:p-10 max-w-3xl mx-auto bg-white shadow-lg rounded-xl mt-8">
      <h2 className="text-4xl font-bold mb-3 text-gray-800 text-center">
        {event.title}
      </h2>

      <p className="mb-4 text-gray-700 leading-relaxed text-center">
        {event.description}
      </p>

      <div className="space-y-3 text-gray-700 text-lg border-t pt-4">
        <p>
          <span className="font-semibold">📅 Date & Time:</span>{" "}
          {new Date(event.date).toLocaleString()}
        </p>
        <p>
          <span className="font-semibold">📍 Location:</span> {event.location}
        </p>
        <p>
          <span className="font-semibold">👤 Organized By:</span>{" "}
          {event.createdBy?.name}{" "}
          <span className="text-gray-500">({event.createdBy?.email})</span>
        </p>
      </div>

      <div className="mt-8 flex flex-wrap gap-3 justify-center">
        {user && (
          isJoined ? (
            <button
              onClick={handleLeave}
              className="bg-red-500 hover:bg-red-600 text-white px-6 py-2 rounded-md font-semibold transition"
            >
              Leave Event
            </button>
          ) : (
            <button
              onClick={handleJoin}
              className="bg-green-500 hover:bg-green-600 text-white px-6 py-2 rounded-md font-semibold transition"
            >
              Join Event
            </button>
          )
        )}

        
        <Link
          to="/"
          className="bg-gray-500 hover:bg-gray-600 text-white px-6 py-2 rounded-md font-semibold transition"
        >
          Back to All Events
        </Link>
      </div>

      <div className="mt-10 border-t border-gray-200 pt-6">
        <h3 className="text-2xl font-semibold mb-4 text-gray-800">
          👥 Attendees ({event.attendees.length})
        </h3>

        {event.attendees.length === 0 ? (
          <p className="text-gray-600">No one has joined this event yet.</p>
        ) : (
          <ul className="space-y-3">
            {event.attendees.map((u) => (
              <li
                key={u._id}
                className="border border-gray-200 rounded-md px-4 py-2 bg-gray-50 flex justify-between items-center"
              >
                <span className="font-medium text-gray-800">{u.name}</span>
                <span className="text-gray-600 text-sm">{u.email}</span>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
