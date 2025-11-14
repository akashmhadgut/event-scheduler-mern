import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },

    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },

    passwordHash: {
      type: String,
      required: true,
      select: false, // prevents returning password in queries by default
    },
  },
  {
    timestamps: true, // adds createdAt & updatedAt
  }
);

// Export model
const User = mongoose.model("User", userSchema);
export default User;
