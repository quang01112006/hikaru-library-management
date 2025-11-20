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
    image: {
      type: String,
      default:
        "https://i.pinimg.com/736x/2a/97/38/2a9738148057ff9930c23ec6ac9bdf99.jpg",
    },
    genre: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Category",
      required: true,
    },

    quantity: {
      type: Number,
      default: 0,
      required: true,
    },

    availableQuantity: {
      type: Number,
      default: 0,
      required: true,
    },

    isHidden: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

const Book = mongoose.model("Book", bookSchema);
export default Book;
