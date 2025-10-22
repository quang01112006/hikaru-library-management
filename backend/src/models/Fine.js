import mongoose from "mongoose";

const fineSchema = new mongoose.Schema(
  {
    reader: {
      type: mongoose.Schema.ObjectId,
      ref: "Reader",
      required: true,
    },
    bookCopy: {
      type: mongoose.Schema.ObjectId,
      ref: "BookCopy",
      required: true,
    },
    borrowRecord: {
      type: mongoose.Schema.ObjectId,
      ref: "BorrowRecord",
      required: true,
    },
    amount: {
      type: Number,
      required: true,
    },
    paid: {
      type: Boolean,
      default: false,
    },
    issuedDate: {
      type: Date,
      default: Date.now,
    },
    paidDate: {
      type: Date,
    },
  },
  { timestamps: true }
);

const Fine = mongoose.model("Fine", fineSchema);
export default Fine;
