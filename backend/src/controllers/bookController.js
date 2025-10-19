import Book from "../models/Book.js";

export const getAllBooks = async (req, res) => {
  try {
    const books = await Book.find();
    res.status(200).json(books);
  } catch (error) {
    console.log("Lỗi khi gọi getAllBooks:", error.message);
    res.status(500).json({ message: "Lỗi hệ thống" });
  }
};

export const getBookById = async (req, res) => {
  try {
    const book = await Book.findById(req.params.id);
    if (!book) {
      return res.status(404).json({ message: "Không tìm thấy sách" });
    }
    res.status(200).json(book);
  } catch (error) {
    console.log("Lỗi khi gọi getBookById:", error.message);
    res.status(500).json({ message: "Lỗi hệ thống" });
  }
};

export const addBook = async (req, res) => {
  try {
    const newBook = new Book(req.body);
    await newBook.save();
    res.status(201).json(newBook);
  } catch (error) {
    console.log("Lỗi khi gọi addBook:", error.message);
    res.status(400).json({ message: error.message });
  }
};

export const updateBookInfo = async (req, res) => {
  try {
    const updatedBook = await Book.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    });
    if (!updatedBook) {
      return res.status(404).json({ message: "Không tìm thấy sách" });
    }
    res.status(200).json(updatedBook);
  } catch (error) {
    console.log("Lỗi khi gọi updateBookInfo:", error.message);
    res.status(400).json({ message: error.message });
  }
};

export const deleteBook = async (req, res) => {
  try {
    const deletedBook = await Book.findByIdAndDelete(req.params.id);
    if (!deletedBook) {
      return res.status(404).json({ message: "Không tìm thấy sách" });
    }
    res.status(200).json({ message: "Đã xóa sách thành công" });
  } catch (error) {
    console.log("Lỗi khi gọi deleteBook:", error.message);
    res.status(500).json({ message: "Lỗi hệ thống" });
  }
};

export const searchBooks = async (req, res) => {
  try {
    const keyword = req.query.q || "";
    const books = await Book.find({
      title: { $regex: keyword, $options: "i" },
    });
    res.status(200).json(books);
  } catch (error) {
    console.log("Lỗi khi gọi searchBooks:", error.message);
    res.status(500).json({ message: "Lỗi hệ thống" });
  }
};
