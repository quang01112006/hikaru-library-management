import mongoose from "mongoose";

const borrowRecordSchema = new mongoose.Schema(
  {
    reader: {
      type: mongoose.Schema.ObjectId,
      required: true,
      ref: "Reader",
    },
    borrowCopies: [
      {
        type: mongoose.Schema.ObjectId,
        required: true,
        ref: "BookCopy",
      },
    ],
    returnCopies: [
      {
        type: mongoose.Schema.ObjectId,
        ref: "BookCopy",
      },
    ],
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
    },
    status: {
      type: String,
      enum: ["returned", "borrowed", "overdue"],
      default: "borrowed",
    },
  },
  { timestamps: true }
);

const BorrowRecord = mongoose.model("BorrowRecord", borrowRecordSchema);
export default BorrowRecord;
