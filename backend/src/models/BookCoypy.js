import mongoose from "mongoose";

const bookCopySchema = new mongoose.Schema(
  {
    book: {
      type: mongoose.Schema.ObjectId,
      ref: "Book",
      required: true,
    },
    barcode: {
      type: String,
      required: true,
      trim: true,
      unique: true,
    },
    status: {
      type: String,
      enum: ["available", "borrowed"],
      default: "available",
    },
  },
  { timestamps: true }
);
const BookCopy = mongoose.model("BookCopy", bookCopySchema);
export default BookCopy;
