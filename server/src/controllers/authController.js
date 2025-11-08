import User from "../models/User.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

export const signup = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    // validate input
    if (!name || !email || !password) {
      return res.status(400).json({ success: false, error: "All fields required" });
    }

    // check existing user
    const exists = await User.findOne({ email });
    if (exists) {
      return res.status(400).json({ success: false, error: "Email already registered" });
    }

    // hash password
    const passwordHash = await bcrypt.hash(password, 10);

    const user = await User.create({ name, email, passwordHash });

    return res.status(201).json({
      success: true,
      data: { id: user._id, name: user.name, email: user.email },
      message: "Signup successful"
    });

  } catch (err) {
    return res.status(500).json({ success: false, error: "Server error" });
  }
};

export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // validate input
    if (!email || !password) {
      return res.status(400).json({ success: false, error: "All fields required" });
    }

    // find user
    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ success: false, error: "Invalid credentials" });

    // compare passwords
    const match = await bcrypt.compare(password, user.passwordHash);
    if (!match) return res.status(400).json({ success: false, error: "Invalid credentials" });

    // sign token
    const token = jwt.sign(
      { id: user._id, email: user.email },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );

    return res.json({
      success: true,
      data: {
        token,
        user: { id: user._id, name: user.name, email: user.email }
      },
      message: "Login successful"
    });

  } catch (err) {
    return res.status(500).json({ success: false, error: "Server error" });
  }
};
