import Reader from "../models/Reader.js";
import BorrowRecord from "../models/BorrowRecord.js";

export const getAllReaders = async (req, res) => {
  try {
    const readers = await Reader.find();
    res.status(200).json(readers);
  } catch (error) {
    console.log("Lỗi khi gọi getAllReader: ", error.message);
    res.status(500).json({ message: "Lỗi hệ thống" });
  }
};

export const getReaderById = async (req, res) => {
  try {
    const reader = await Reader.findById(req.params.id);
    if (!reader) {
      return res.status(404).json({ message: "Không tìm thấy bạn đọc" });
    }
    res.status(200).json(reader);
  } catch (error) {
    console.log("Lỗi khi gọi getReaderById:", error.message);
    res.status(500).json({ message: "Lỗi hệ thống" });
  }
};

export const addReader = async (req, res) => {
  try {
    const newReader = new Reader(req.body);
    await newReader.save();
    res.status(201).json(newReader);
  } catch (error) {
    console.log("Lỗi khi gọi addReader: ", error.message);
    res.status(500).json({ message: "Lỗi hệ thống" });
  }
};

export const updateReaderInfo = async (req, res) => {
  try {
    const updatedReader = await Reader.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );
    if (!updatedReader) {
      return res.status(404).json({ message: "Bạn đọc không tồn tại" });
    }
    res.status(200).json(updatedReader);
  } catch (error) {
    console.log("Lỗi khi gọi updateReaderInfo:", error.message);
    res.status(500).json({ message: "Lỗi hệ thống" });
  }
};

export const deleteReader = async (req, res) => {
  try {
    const readerId = req.params.id;

    const deletedReader = await Reader.findByIdAndDelete(readerId);
    if (!deletedReader) {
      return res.status(404).json({ message: "Bạn đọc không tồn tại" });
    }

    const outstandingBorrows = await BorrowRecord.countDocuments({
      reader: readerId,
      returnDate: null,
    });

    if (outstandingBorrows > 0) {
      return res.status(400).json({
        message: `Không thể xóa. Bạn đọc này vẫn đang mượn ${outstandingBorrows} cuốn sách.`,
      });
    }

    res
      .status(200)
      .json({ message: "Xóa bạn đọc thành công", reader: deletedReader });
  } catch (error) {
    console.log("Lỗi khi gọi deleteReader:", error.message);
    res.status(500).json({ message: "Lỗi hệ thống" });
  }
};
