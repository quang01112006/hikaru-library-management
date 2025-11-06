import mongoose from "mongoose";
const Schema = mongoose.Schema;

const borrowRecordSchema = new Schema(
  {
    reader: {
      type: Schema.Types.ObjectId,
      ref: "Reader",
      required: true,
    },

    book: {
      type: Schema.Types.ObjectId,
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

    isReturned: {
      type: Boolean,
      default: false,
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
