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
    let { readerCode, name, email, phone, quota } = req.body;

    if (!readerCode) {
      // Tìm bạn đọc có mã lớn nhất hiện tại (Sắp xếp giảm dần theo readerCode)
      const lastReader = await Reader.findOne().sort({ readerCode: -1 });

      if (lastReader && lastReader.readerCode.startsWith("R")) {
        // Cắt chữ R, lấy phần số
        const lastNumber = parseInt(lastReader.readerCode.slice(1));

        // Cộng thêm 1 và format lại thành 3 chữ số
        const nextNumber = lastNumber + 1;
        readerCode = `R${nextNumber.toString().padStart(3, "0")}`;
      } else {
        readerCode = "R000";
      }
    }

    if (!name) {
      return res.status(400).json({ message: "Tên bạn đọc là bắt buộc!" });
    }

    const newReader = new Reader({
      readerCode,
      name,
      email,
      phone,
      quota: Number(quota) || 5,
    });
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
