import express from "express";
import cors from "cors";

// Import route files
import authRoutes from "./routes/authRoutes.js";
import userRoutes from "./routes/userRoutes.js";
import eventRoutes from "./routes/eventRoutes.js";

const app = express();

// 🔧 Middlewares
app.use(cors());
app.use(express.json());

// 🧩 API Routes
app.use("/api/auth", authRoutes);   // Signup / Login
app.use("/api/users", userRoutes);  // Profile
app.use("/api/events", eventRoutes); // Events CRUD + Join/Leave

// 🔍 Test route (for health check)
app.get("/", (req, res) => {
  res.send({ message: "Server Running ✅" });
});

// 🧱 404 Handler (invalid endpoints)
app.use((req, res) => {
  res.status(404).json({ success: false, error: "Route not found" });
});

// 🧱 Global Error Handler (optional safety)
app.use((err, req, res, next) => {
  console.error("Error:", err);
  res.status(500).json({ success: false, error: "Internal server error" });
});

export default app;
