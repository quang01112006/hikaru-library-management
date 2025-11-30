import Book from "../models/Book.js";
import BorrowRecord from "../models/BorrowRecord.js";
import Category from "../models/Category.js";

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
    }).populate("genre", "name");

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
    }).populate("genre", "name");
    res.status(200).json(books);
  } catch (error) {
    console.log("Lỗi khi gọi searchBooks:", error.message);
    res.status(500).json({ message: "Lỗi hệ thống" });
  }
};

export const addBook = async (req, res) => {
  try {
    let { bookCode, title, author, genre, quantity, image, description } =
      req.body;
    if (!bookCode) {
      const lastBook = await Book.findOne().sort({ bookCode: -1 });
      if (lastBook && lastBook.bookCode.startsWith("B")) {
        const lastNumber = parseInt(lastBook.bookCode.slice(1));
        const nextNumber = lastNumber + 1;
        bookCode = `B${nextNumber.toString().padStart(3, "0")}`;
      } else {
        bookCode = "B1000";
      }
    }
    const category = await Category.findById(genre);
    if (!category) {
      return res.status(400).json({ message: "Thể loại không tồn tại" });
    }

    const newBook = new Book({
      bookCode,
      title,
      author,
      genre,
      quantity: Number(quantity),
      availableQuantity: Number(quantity),
      image,
      description,
    });

    await newBook.save();
    res.status(201).json(newBook);
  } catch (error) {
    if (error.code === 11000) {
      return res.status(400).json({ message: "Mã sách đã tồn tại" });
    }
    console.log("Lỗi khi gọi addBook:", error.message);
    res.status(500).json({ message: "Lỗi hệ thống" });
  }
};

export const updateBookInfo = async (req, res) => {
  try {
    const bookId = req.params.id;
    const currentBook = await Book.findById(bookId);
    if (!currentBook) {
      return res.status(404).json({ message: "Sách không tồn tại" });
    }

    const { title, author, genre, quantity, isHidden, image, description } =
      req.body;

    // Logic tính toán số lượng tồn kho khi tổng số lượng thay đổi
    let newAvailableQuantity = currentBook.availableQuantity;
    if (quantity !== undefined && Number(quantity) !== currentBook.quantity) {
      const booksOnLoan = currentBook.quantity - currentBook.availableQuantity;

      // Không cho phép giảm tổng số lượng xuống thấp hơn số sách đang cho mượn
      if (Number(quantity) < booksOnLoan) {
        return res.status(400).json({
          message: `Không thể cập nhật. Đang có ${booksOnLoan} cuốn được mượn, tổng số mới phải >= ${booksOnLoan}`,
        });
      }

      const diff = Number(quantity) - currentBook.quantity;
      newAvailableQuantity = currentBook.availableQuantity + diff;
    }

    const updateData = {
      title,
      author,
      genre,
      quantity,
      isHidden,
      image,
      description,
      availableQuantity: newAvailableQuantity,
    };

    const updatedBook = await Book.findByIdAndUpdate(bookId, updateData, {
      new: true,
    });
    res.status(200).json(updatedBook);
  } catch (error) {
    console.log("Lỗi khi gọi updateBookInfo:", error.message);
    res.status(500).json({ message: "Lỗi hệ thống" });
  }
};

export const deleteBook = async (req, res) => {
  try {
    const bookId = req.params.id;

    // Kiểm tra xem sách này có đang bị mượn không (chưa trả)
    const outstandingBorrows = await BorrowRecord.countDocuments({
      book: bookId,
      returnDate: null,
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

    res.status(200).json({ message: "Xóa sách thành công", book: deletedBook });
  } catch (error) {
    console.log("Lỗi khi gọi deleteBook:", error.message);
    res.status(500).json({ message: "Lỗi hệ thống" });
  }
};
