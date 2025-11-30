import mongoose from "mongoose";
import BorrowRecord from "../models/BorrowRecord.js";
import Reader from "../models/Reader.js";
import Book from "../models/Book.js";

export const createBorrowRecord = async (req, res) => {
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    const { readerId, bookId, dueDate } = req.body;

    const isReader = req.user && req.user.role === "reader";
    const initialStatus = isReader ? "pending" : "borrowing";

    const finalReaderId = isReader ? req.user._id : readerId;

    const reader = await Reader.findById(finalReaderId).session(session);
    if (!reader) throw new Error("Bạn đọc không tồn tại");

    const currentBorrows = await BorrowRecord.countDocuments({
      reader: finalReaderId,
      returnDate: null,
      status: { $in: ["borrowing", "pending"] },
    }).session(session);

    if (currentBorrows >= reader.quota) {
      throw new Error("Bạn đọc đã hết hạn mức mượn sách ");
    }

    o;
    const book = await Book.findById(bookId).session(session);
    if (!book) throw new Error("Sách không tồn tại");

    if (initialStatus === "borrowing") {
      if (book.availableQuantity <= 0) {
        throw new Error("Sách đã hết hàng trong kho");
      }
      book.availableQuantity -= 1;
      await book.save({ session });
    } else {
      const pendingCount = await BorrowRecord.countDocuments({
        book: bookId,
        status: "pending",
      }).session(session);

      const effectiveStock = book.availableQuantity - pendingCount;

      if (effectiveStock <= 0) {
        throw new Error(
          "Sách này đã hết lượt đặt trước! (Đang có người chờ duyệt)"
        );
      }
    }

    // 6. Tạo Phiếu
    const newRecord = new BorrowRecord({
      reader: finalReaderId,
      book: bookId,
      dueDate,
      status: initialStatus,
    });

    await newRecord.save({ session });

    await session.commitTransaction();
    session.endSession();

    res.status(201).json(newRecord);
  } catch (error) {
    await session.abortTransaction();
    session.endSession();
    console.log("Lỗi tạo phiếu:", error.message);

    const status = error.message.includes("tồn tại") ? 404 : 400;
    res.status(status).json({ message: error.message });
  }
};

export const approveBorrow = async (req, res) => {
  const { recordId } = req.params;
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    // Tìm phiếu đang pending
    const record = await BorrowRecord.findOne({
      _id: recordId,
      status: "pending",
    }).session(session);
    if (!record)
      throw new Error(
        "Phiếu mượn không tồn tại hoặc không ở trạng thái chờ duyệt"
      );

    // Tìm sách để trừ kho
    const book = await Book.findById(record.book).session(session);
    if (!book || book.availableQuantity <= 0) {
      throw new Error("Sách đã hết hàng, không thể duyệt đơn này");
    }

    // 1. Trừ kho
    book.availableQuantity -= 1;
    await book.save({ session });

    record.status = "borrowing";
    await record.save({ session });

    await session.commitTransaction();
    session.endSession();

    res.status(200).json({ message: "Đã duyệt phiếu mượn thành công", record });
  } catch (error) {
    await session.abortTransaction();
    session.endSession();
    res.status(400).json({ message: error.message });
  }
};

export const returnBook = async (req, res) => {
  const { recordId } = req.params;
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    const record = await BorrowRecord.findById(recordId).session(session);
    if (!record) throw new Error("Không tìm thấy phiếu mượn");

    if (record.status !== "borrowing" || record.returnDate) {
      throw new Error("Phiếu này không hợp lệ để trả");
    }

    // Update phiếu
    record.returnDate = new Date();
    record.status = "returned"; //
    await record.save({ session });

    //  Cộng kho
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
    res.status(400).json({ message: error.message });
  }
};

export const getBorrowHistory = async (req, res) => {
  try {
    const records = await BorrowRecord.find()
      .populate("reader", "name readerCode")
      .populate("book", "title bookCode image")
      .sort({ createdAt: -1 });

    res.status(200).json(records);
  } catch (error) {
    res.status(500).json({ message: "Lỗi hệ thống" });
  }
};
export const getBorrowsByReaderId = async (req, res) => {
  try {
    const { readerId } = req.params;

    const records = await BorrowRecord.find({ reader: readerId })
      .populate("book", "title bookCode image") // Lấy thông tin sách
      .sort({ createdAt: -1 }); // Mới nhất lên đầu

    res.status(200).json(records);
  } catch (error) {
    res.status(500).json({ message: "Lỗi lấy lịch sử bạn đọc" });
  }
};

export const cancelBorrow = async (req, res) => {
  try {
    const { recordId } = req.params; //lấy id từ url

    const record = await BorrowRecord.findById(recordId);
    if (!record) {
      return res.status(404).json({ message: "Phiếu mượn không tồn tại" });
    }
    if (record.status !== "pending") {
      return res
        .status(400)
        .json({ message: "Chỉ được hủy phiếu chưa được duyệt" });
    }
    await BorrowRecord.findByIdAndDelete(recordId);
    res.status(200).json({ message: "Đã hủy phiếu mượn thành công." });
  } catch (error) {
    res.status(500).json({ message: "Lỗi hệ thống" });
  }
};
