import Book from "../models/Book.js";
import Reader from "../models/Reader.js";
import BorrowRecord from "../models/BorrowRecord.js";
import User from "../models/User.js";

export const getDashboardStats = async (req, res) => {
  try {
    // Dùng Promise.all để chạy 4 lệnh đếm SONG SONG
    const [
      totalBooks,
      totalReaders,
      totalUsers,
      activeBorrows,
      overdueBorrows,
    ] = await Promise.all([
      Book.countDocuments(),
      Reader.countDocuments(),
      User.countDocuments(),
      BorrowRecord.countDocuments({ returnDate: null }),
      BorrowRecord.countDocuments({
        returnDate: null,
        dueDate: { $lt: new Date() },
      }),
    ]);

    res.status(200).json({
      totalBooks,
      totalReaders,
      totalUsers,
      activeBorrows,
      overdueBorrows,
    });
  } catch (error) {
    console.error("Lỗi thống kê:", error);
    res.status(500).json({ message: "Lỗi hệ thống khi lấy thống kê" });
  }
};
