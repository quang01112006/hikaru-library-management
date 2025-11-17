import mongoose from "mongoose";

const borrowRecordSchema = new mongoose.Schema(
  {
    reader: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Reader",
      required: true,
    },

    book: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Book",
      required: true,
    },

    borrowDate: {
      type: Date,
      default: Date.now,
    },

    dueDate: {
      type: Date,
      required: true,
    },

    returnDate: {
      type: Date,
      default: null,
    },
  },
  { timestamps: true }
);

const BorrowRecord = mongoose.model("BorrowRecord", borrowRecordSchema);
export default BorrowRecord;
