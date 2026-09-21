
import mongoose from "mongoose";

const ROLES = ["student", "teacher"];

const userSchema = new mongoose.Schema(
  {
    email: {
      type: String,
      required: true,
      unique: true,   // creates index automatically
      trim: true,
      lowercase: true,
    },
    name: {
      type: String,
      required: true,
      trim: true,
    },
    role: {
      type: String,
      enum: ROLES,
      default: "student",
    },
    xp: {            
      type: Number,
      default: 0,
      index: true,   // Helps with sorting the leaderboard faster
    },
    passwordHash: {
      type: String,
      select: false,
    },
  },
  {
    timestamps: true,
    toJSON: {
      transform(_doc, ret) {
        delete ret.passwordHash;
        return ret;
      },
    },
  }
);

userSchema.index({ role: 1 });

export const User = mongoose.model("User", userSchema);
export { ROLES };
