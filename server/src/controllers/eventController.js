import mongoose from "mongoose";
import Event from "../models/Event.js";

// ✅ Get all events (public)
export const getAllEvents = async (req, res) => {
  try {
    const events = await Event.find()
      .populate("createdBy", "name email")
      .populate("attendees", "name email")
      .sort({ date: 1 });

    return res.json({ success: true, data: events });
  } catch (err) {
    console.error("GetAllEvents error:", err);
    return res.status(500).json({ success: false, error: "Server error" });
  }
};

 // ✅ Get event by ID (public)
export const getEventById = async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ success: false, error: "Invalid event ID" });
    }

    const event = await Event.findById(id)
      .populate("createdBy", "name email")
      .populate("attendees", "name email");

    if (!event) {
      return res.status(404).json({ success: false, error: "Event not found" });
    }

    // ✅ Consistent response shape for frontend
    return res.status(200).json({
      success: true,
      data: {
        _id: event._id,
        title: event.title,
        description: event.description,
        date: event.date,
        location: event.location,
        createdBy: event.createdBy,
        attendees: event.attendees,
        createdAt: event.createdAt,
        updatedAt: event.updatedAt,
      },
    });
  } catch (err) {
    console.error("GetEventById error:", err);
    return res.status(500).json({ success: false, error: "Server error" });
  }
};


// ✅ Create event (protected)
export const createEvent = async (req, res) => {
  try {
    const { title, description, date, location } = req.body;

    if (!title || !date) {
      return res
        .status(400)
        .json({ success: false, error: "Title and date required" });
    }

    const event = await Event.create({
      title,
      description,
      date,
      location,
      createdBy: req.user._id,
      attendees: [],
    });

    return res.status(201).json({
      success: true,
      message: "Event created successfully",
      data: event,
    });
  } catch (err) {
    console.error("CreateEvent error:", err);
    return res.status(500).json({ success: false, error: "Server error" });
  }
};

// ✅ Update event (only creator)
export const updateEvent = async (req, res) => {
  try {
    const { title, description, date, location } = req.body;

    const event = await Event.findById(req.params.id);
    if (!event)
      return res.status(404).json({ success: false, error: "Event not found" });

    // check ownership
    if (event.createdBy.toString() !== req.user._id.toString()) {
      return res
        .status(403)
        .json({ success: false, error: "Not authorized to edit this event" });
    }

    // update fields
    if (title) event.title = title;
    if (description) event.description = description;
    if (date) event.date = date;
    if (location) event.location = location;

    await event.save();

    const updatedEvent = await Event.findById(req.params.id)
      .populate("createdBy", "name email")
      .populate("attendees", "name email");

    return res.json({
      success: true,
      message: "Event updated successfully",
      data: updatedEvent,
    });
  } catch (err) {
    console.error("UpdateEvent error:", err);
    return res.status(500).json({ success: false, error: "Server error" });
  }
};

// ✅ Delete event (only creator)
export const deleteEvent = async (req, res) => {
  try {
    const event = await Event.findById(req.params.id);
    if (!event)
      return res.status(404).json({ success: false, error: "Event not found" });

    if (event.createdBy.toString() !== req.user._id.toString()) {
      return res
        .status(403)
        .json({ success: false, error: "Not authorized to delete this event" });
    }

    await event.deleteOne();

    return res.json({
      success: true,
      message: "Event deleted successfully",
    });
  } catch (err) {
    console.error("DeleteEvent error:", err);
    return res.status(500).json({ success: false, error: "Server error" });
  }
};

// ✅ Join event (protected)
export const joinEvent = async (req, res) => {
  try {
    const event = await Event.findById(req.params.id);
    if (!event)
      return res.status(404).json({ success: false, error: "Event not found" });

    // prevent creator from joining twice
    if (event.attendees.includes(req.user._id)) {
      return res
        .status(400)
        .json({ success: false, error: "Already joined this event" });
    }

    event.attendees.push(req.user._id);
    await event.save();

    const updatedEvent = await Event.findById(req.params.id)
      .populate("createdBy", "name email")
      .populate("attendees", "name email");

    return res.json({
      success: true,
      message: "Joined the event successfully",
      data: updatedEvent,
    });
  } catch (err) {
    console.error("JoinEvent error:", err);
    return res.status(500).json({ success: false, error: "Server error" });
  }
};

// ✅ Leave event (protected)
export const leaveEvent = async (req, res) => {
  try {
    const event = await Event.findById(req.params.id);
    if (!event)
      return res.status(404).json({ success: false, error: "Event not found" });

    event.attendees = event.attendees.filter(
      (userId) => userId.toString() !== req.user._id.toString()
    );
    await event.save();

    const updatedEvent = await Event.findById(req.params.id)
      .populate("createdBy", "name email")
      .populate("attendees", "name email");

    return res.json({
      success: true,
      message: "Left the event successfully",
      data: updatedEvent,
    });
  } catch (err) {
    console.error("LeaveEvent error:", err);
    return res.status(500).json({ success: false, error: "Server error" });
  }
};
// ✅ Get events created by the logged-in user
export const getMyEvents = async (req, res) => {
  try {
    const events = await Event.find({ createdBy: req.user._id })
      .populate("createdBy", "name email")
      .populate("attendees", "name email")
      .sort({ date: 1 });

    return res.json({
      success: true,
      message: "Fetched your events successfully",
      data: events,
    });
  } catch (err) {
    console.error("GetMyEvents error:", err);
    return res.status(500).json({ success: false, error: "Server error" });
  }
};
