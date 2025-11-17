import mongoose from "mongoose";
import BorrowRecord from "../models/BorrowRecord.js";
import Reader from "../models/Reader.js";
import Book from "../models/Book.js";

export const createBorrowRecord = async (req, res) => {
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    const { readerId, bookId, dueDate } = req.body;

    const reader = await Reader.findById(readerId).session(session);
    if (!reader) {
      throw new Error("Bạn đọc không tồn tại");
    }

    const currentBorrows = await BorrowRecord.countDocuments({
      reader: readerId,
      returnDate: null,
    }).session(session);

    if (currentBorrows >= reader.quota) {
      throw new Error("Bạn đọc đã mượn đủ quota");
    }

    const updatedBook = await Book.findOneAndUpdate(
      { _id: bookId, availableQuantity: { $gt: 0 } },
      { $inc: { availableQuantity: -1 } },
      { session, new: true }
    );

    if (!updatedBook) {
      const bookExists = await Book.findById(bookId).session(session);
      if (!bookExists) {
        throw new Error("Sách không tồn tại");
      } else {
        throw new Error("Sách đã hết hàng trong kho");
      }
    }

    const newRecord = new BorrowRecord({
      reader: readerId,
      book: bookId,
      dueDate,
    });
    await newRecord.save({ session });

    await session.commitTransaction();
    session.endSession();

    res.status(201).json(newRecord);
  } catch (error) {
    await session.abortTransaction();
    session.endSession();

    console.log("Lỗi khi mượn sách:", error.message);

    if (error.message.includes("quota") || error.message.includes("hết hàng")) {
      return res.status(400).json({ message: error.message });
    }
    if (error.message.includes("Bạn đọc") || error.message.includes("Sách")) {
      return res.status(404).json({ message: error.message });
    }
    res.status(500).json({ message: "Lỗi hệ thống" });
  }
};

export const returnBook = async (req, res) => {
  const { recordId } = req.params;

  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    const record = await BorrowRecord.findById(recordId).session(session);

    if (!record) {
      throw new Error("Không tìm thấy phiếu mượn");
    }
    if (record.returnDate) {
      throw new Error("Sách này đã được trả từ trước");
    }

    record.returnDate = new Date();
    await record.save({ session });

    await Book.updateOne(
      { _id: record.book },
      { $inc: { availableQuantity: 1 } },
      { session }
    );

    await session.commitTransaction();
    session.endSession();

    res.status(200).json(record);
  } catch (error) {
    await session.abortTransaction();
    session.endSession();

    console.log("Lỗi khi trả sách:", error.message);
    if (error.message.includes("trả từ trước")) {
      return res.status(400).json({ message: error.message });
    }
    if (error.message.includes("phiếu mượn")) {
      return res.status(404).json({ message: error.message });
    }
    res.status(500).json({ message: "Lỗi hệ thống" });
  }
};

export const getBorrowHistory = async (req, res) => {
  try {
    const records = await BorrowRecord.find()
      .populate("reader", "name readerCode")
      .populate("book", "title bookCode")
      .sort({ createdAt: -1 });

    res.status(200).json(records);
  } catch (error) {
    console.log("Lỗi khi lấy lịch sử:", error.message);
    res.status(500).json({ message: "Lỗi hệ thống" });
  }
};
