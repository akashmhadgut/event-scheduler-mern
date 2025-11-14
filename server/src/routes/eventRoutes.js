import express from "express";
import { auth } from "../middlewares/auth.js";
import {
  getAllEvents,
  getEventById,
  createEvent,
  updateEvent,
  deleteEvent,
  joinEvent,
  leaveEvent,
  getMyEvents,
} from "../controllers/eventController.js";

const router = express.Router();

// 🟢 Public routes
router.get("/", getAllEvents);

// 🟠 Protected routes
router.get("/my", auth, getMyEvents);          // 👈 must come BEFORE "/:id"
router.get("/:id", getEventById);
router.post("/", auth, createEvent);
router.put("/:id", auth, updateEvent);
router.delete("/:id", auth, deleteEvent);
router.post("/:id/join", auth, joinEvent);
router.post("/:id/leave", auth, leaveEvent);

export default router;
