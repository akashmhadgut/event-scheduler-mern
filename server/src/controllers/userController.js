import User from "../models/User.js";

// ✅ Get logged-in user's profile
export const getProfile = async (req, res) => {
  try {
    // Use the ID from JWT (attached by auth middleware)
    const user = await User.findById(req.user._id).select("-passwordHash");

    if (!user) {
      return res
        .status(404)
        .json({ success: false, error: "User not found" });
    }

    return res.json({
      success: true,
      message: "Profile fetched successfully",
      data: user,
    });
  } catch (err) {
    console.error("Profile error:", err);
    return res.status(500).json({ success: false, error: "Server error" });
  }
};
