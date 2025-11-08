import mongoose from "mongoose";
const Schema = mongoose.Schema;

const userSchema = new Schema(
  {
    username: {
      type: String,
      required: true,
      trim: true,
      unique: true,
      lowercase: true,
    },
    password: {
      type: String,
      required: true,
    },
    role: {
      type: String,
      enum: ["librarian", "admin"],
      default: "librarian",
    },
  },
  { timestamps: true }
);

const User = mongoose.model("User", userSchema);
export default User;
