import mongoose from "mongoose";

const bookSchema = new mongoose.Schema(
  {
    bookCode: {
      type: String,
      required: true,
      trim: true,
      unique: true,
    },
    title: {
      type: String,
      required: true,
      trim: true,
    },
    author: {
      type: String,
      trim: true,
    },
    genre: {
      type: String,
      required: true,
    },
    year: Number,
    price: Number,
    desc: {
      type: String,
      trim: true,
    },
    quantity: {
      type: Number,
      default: 0,
    },
    availableQuantity: {
      type: Number,
      default: 0,
    },
    source: {
      type: String,
      enum: ["manual", "api"],
      default: "manual",
    },
  },
  {
    timestamps: true,
  }
);
const Book = mongoose.model("Book", bookSchema);
export default Book;
