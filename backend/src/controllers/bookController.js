import Book from "../models/Book.js";
import BorrowRecord from "../models/BorrowRecord.js";
import Category from "../models/Category.js"; // Cần cho addBook

export const getAllBooks = async (req, res) => {
  try {
    const books = await Book.find({ isHidden: false }).populate(
      "genre",
      "name"
    );
    res.status(200).json(books);
  } catch (error) {
    console.log("Lỗi khi gọi getAllBooks:", error.message);
    res.status(500).json({ message: "Lỗi hệ thống" });
  }
};

export const getBookById = async (req, res) => {
  try {
    const book = await Book.findOne({
      _id: req.params.id,
      isHidden: false,
    }).populate("genre", "name"); // Thêm .populate
    if (!book) {
      return res.status(404).json({ message: "Không tìm thấy sách" });
    }
    res.status(200).json(book);
  } catch (error) {
    console.log("Lỗi khi gọi getBookById:", error.message);
    res.status(500).json({ message: "Lỗi hệ thống" });
  }
};

export const searchBooks = async (req, res) => {
  try {
    const keyword = req.query.q || "";
    const books = await Book.find({
      isHidden: false,
      $or: [
        { title: { $regex: keyword, $options: "i" } },
        { author: { $regex: keyword, $options: "i" } },
      ],
    }).populate("genre", "name"); // Thêm .populate
    res.status(200).json(books);
  } catch (error) {
    console.log("Lỗi khi gọi searchBooks:", error.message);
    res.status(500).json({ message: "Lỗi hệ thống" });
  }
};

/* --- SỬA LẠI CÁC HÀM CUD (add, update, delete) --- */

// SỬA 2: "Bóc tách" req.body và check lỗi 11000
export const addBook = async (req, res) => {
  try {
    // 1. Chỉ lấy những trường mình cho phép
    const { bookCode, title, author, genre, quantity } = req.body;

    // 2. Kiểm tra xem 'genre' (thể loại) có thật không
    const category = await Category.findById(genre);
    if (!category) {
      return res.status(400).json({ message: "Thể loại không tồn tại" });
    }

    // 3. Tạo sách (Nhớ là availableQuantity sẽ tự set = quantity nhờ cái hook)
    const newBook = new Book({
      bookCode,
      title,
      author,
      genre, // Lưu ID của thể loại
      quantity,
    });
    await newBook.save();
    res.status(201).json(newBook);
  } catch (error) {
    // 4. Bẫy lỗi "trùng key"
    if (error.code === 11000) {
      return res.status(400).json({ message: "Mã sách (bookCode) đã tồn tại" });
    }
    console.log("Lỗi khi gọi addBook:", error.message);
    res.status(500).json({ message: "Lỗi hệ thống" });
  }
};

// SỬA 3: Vá lỗ hổng "chết người"
export const updateBookInfo = async (req, res) => {
  try {
    const bookId = req.params.id;

    // 1. Chỉ lấy những trường ĐƯỢC PHÉP update
    // TUYỆT ĐỐI không lấy 'availableQuantity'
    const { title, author, genre, quantity, isHidden } = req.body;

    // 2. Lấy sách hiện tại ra để tính toán
    const currentBook = await Book.findById(bookId);
    if (!currentBook) {
      return res.status(404).json({ message: "Sách không tồn tại" });
    }

    // 3. Logic "thông minh" khi admin cập nhật TỔNG SỐ LƯỢNG
    let newAvailableQuantity = currentBook.availableQuantity;
    if (quantity !== undefined && quantity !== currentBook.quantity) {
      // Ví dụ: Sách có 10 cuốn (quantity=10), đang cho mượn 2 (available=8)
      // Admin nhập thêm 5 cuốn (quantity mới = 15)
      // -> Phải check xem số lượng mới có "vô lý" không
      const booksOnLoan = currentBook.quantity - currentBook.availableQuantity; // 10 - 8 = 2
      if (quantity < booksOnLoan) {
        return res.status(400).json({
          message: `Không thể cập nhật. Sách đang cho mượn ${booksOnLoan} cuốn, không thể set tổng số lượng < ${booksOnLoan}`,
        });
      }

      // Tính chênh lệch
      const diff = quantity - currentBook.quantity; // 15 - 10 = 5
      newAvailableQuantity = currentBook.availableQuantity + diff; // 8 + 5 = 13 (chuẩn)
    }

    // 4. Tạo object update
    const updateData = {
      title,
      author,
      genre,
      quantity,
      isHidden,
      availableQuantity: newAvailableQuantity, // Update số lượng còn lại đã tính toán
    };

    const updatedBook = await Book.findByIdAndUpdate(
      bookId,
      updateData, // Chỉ update các trường đã "lọc"
      { new: true } // { new: true } để nó trả về sách sau khi update
    );
    res.status(200).json(updatedBook);
  } catch (error) {
    console.log("Lỗi khi gọi updateBookInfo:", error.message);
    res.status(500).json({ message: "Lỗi hệ thống" });
  }
};

// SỬA 1 (tiếp): Hàm delete của mày OK, chỉ thiếu import (đã thêm ở đầu file)
export const deleteBook = async (req, res) => {
  try {
    const bookId = req.params.id;
    const outstandingBorrows = await BorrowRecord.countDocuments({
      book: bookId,
      isReturned: false,
    });

    if (outstandingBorrows > 0) {
      return res.status(400).json({
        message: `Không thể xóa. Sách này đang được ${outstandingBorrows} bạn đọc mượn.`,
      });
    }

    const deletedBook = await Book.findByIdAndDelete(bookId);
    if (!deletedBook) {
      return res.status(404).json({ message: "Không tìm thấy sách" });
    }
    res.status(200).json({ message: "Xóa sách thành công", book: deletedBook }); // Sửa 'reader' thành 'book'
  } catch (error) {
    console.log("Lỗi khi gọi deleteBook:", error.message);
    res.status(500).json({ message: "Lỗi hệ thống" });
  }
};
