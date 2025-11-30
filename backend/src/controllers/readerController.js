import Reader from "../models/Reader.js";
import BorrowRecord from "../models/BorrowRecord.js";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs"; // Đảm bảo đã import bcrypt

// --- 1. LẤY DANH SÁCH (CÓ ĐẾM SỐ SÁCH ĐANG MƯỢN) ---
export const getAllReaders = async (req, res) => {
  try {
    const readers = await Reader.aggregate([
      {
        // Join với bảng BorrowRecord để tìm phiếu chưa trả
        $lookup: {
          from: "borrowrecords", // Tên collection trong DB (số nhiều, viết thường)
          let: { readerId: "$_id" },
          pipeline: [
            {
              $match: {
                $expr: {
                  $and: [
                    { $eq: ["$reader", "$$readerId"] },
                    { $eq: ["$returnDate", null] }, // Chỉ đếm phiếu chưa trả
                  ],
                },
              },
            },
          ],
          as: "activeBorrows",
        },
      },
      {
        // Thêm trường 'borrowed' bằng cách đếm mảng trên
        $addFields: {
          borrowed: { $size: "$activeBorrows" },
        },
      },
      {
        $project: {
          activeBorrows: 0,
          password: 0, // Không trả về password
          __v: 0,
        },
      },
      { $sort: { createdAt: -1 } }, // Mới nhất lên đầu
    ]);

    res.status(200).json(readers);
  } catch (error) {
    console.log("Lỗi getAllReaders:", error.message);
    res.status(500).json({ message: "Lỗi hệ thống" });
  }
};

// --- 2. LẤY CHI TIẾT ---
export const getReaderById = async (req, res) => {
  try {
    const reader = await Reader.findById(req.params.id).select("-password");
    if (!reader) {
      return res.status(404).json({ message: "Không tìm thấy bạn đọc" });
    }
    res.status(200).json(reader);
  } catch (error) {
    console.log("Lỗi getReaderById:", error.message);
    res.status(500).json({ message: "Lỗi hệ thống" });
  }
};

// --- 3. THÊM MỚI (ADMIN DÙNG) ---
export const addReader = async (req, res) => {
  try {
    let { readerCode, name, email, phone, quota, password } = req.body;

    // Logic tự sinh mã Rxxx
    if (!readerCode) {
      const lastReader = await Reader.findOne().sort({ readerCode: -1 });
      if (lastReader && lastReader.readerCode.startsWith("R")) {
        const lastNumber = parseInt(lastReader.readerCode.slice(1));
        readerCode = `R${(lastNumber + 1).toString().padStart(3, "0")}`;
      } else {
        readerCode = "R000";
      }
    }

    if (!name) {
      return res.status(400).json({ message: "Tên bạn đọc là bắt buộc!" });
    }

    // Nếu Admin không nhập pass, gán mặc định "123456"
    if (!password) {
      password = "123456";
    }

    const newReader = new Reader({
      readerCode,
      name,
      email,
      phone,
      quota: Number(quota) || 5,
      password,
      role: "reader",
    });

    await newReader.save();
    const readerResponse = newReader.toObject();
    delete readerResponse.password;

    res.status(201).json(readerResponse);
  } catch (error) {
    if (error.code === 11000) {
      const field = Object.keys(error.keyPattern)[0];
      return res.status(400).json({ message: `${field} này đã tồn tại!` });
    }
    console.log("Lỗi addReader:", error.message);
    res.status(500).json({ message: "Lỗi hệ thống" });
  }
};

export const updateReaderInfo = async (req, res) => {
  try {
    const { readerCode, name, email, phone, quota, password } = req.body;

    const reader = await Reader.findById(req.params.id);
    if (!reader) {
      return res.status(404).json({ message: "Bạn đọc không tồn tại" });
    }

    if (readerCode) reader.readerCode = readerCode;
    if (name) reader.name = name;
    if (email) reader.email = email;
    if (phone) reader.phone = phone;
    if (quota) reader.quota = quota;

    if (password && password.trim() !== "") {
      reader.password = password;
    }

    const updatedReader = await reader.save();

    const readerResponse = updatedReader.toObject();
    delete readerResponse.password;

    res.status(200).json(readerResponse);
  } catch (error) {
    if (error.code === 11000) {
      return res
        .status(400)
        .json({ message: "Thông tin (Mã/Email) bị trùng lặp!" });
    }
    console.log("Lỗi updateReaderInfo:", error.message);
    res.status(500).json({ message: "Lỗi hệ thống" });
  }
};

export const deleteReader = async (req, res) => {
  try {
    const readerId = req.params.id;

    // Kiểm tra ràng buộc TRƯỚC khi xóa
    const outstandingBorrows = await BorrowRecord.countDocuments({
      reader: readerId,
      returnDate: null,
    });

    if (outstandingBorrows > 0) {
      return res.status(400).json({
        message: `Không thể xóa. Bạn đọc này đang mượn ${outstandingBorrows} cuốn sách.`,
      });
    }

    // Xóa
    const deletedReader = await Reader.findByIdAndDelete(readerId);
    if (!deletedReader) {
      return res.status(404).json({ message: "Bạn đọc không tồn tại" });
    }

    res.status(200).json({ message: "Xóa bạn đọc thành công" });
  } catch (error) {
    console.log("Lỗi deleteReader:", error.message);
    res.status(500).json({ message: "Lỗi hệ thống" });
  }
};

export const registerReader = async (req, res) => {
  try {
    const { name, email, password, phone } = req.body;

    if (!password) {
      return res.status(400).json({ message: "Mật khẩu là bắt buộc!" });
    }

    const userExists = await Reader.findOne({ email });
    if (userExists) {
      return res.status(400).json({ message: "Email này đã được đăng ký!" });
    }

    // Tự sinh mã Rxxx
    let readerCode = "R000";
    const lastReader = await Reader.findOne().sort({ readerCode: -1 });
    if (lastReader && lastReader.readerCode.startsWith("R")) {
      const lastNumber = parseInt(lastReader.readerCode.slice(1));
      readerCode = `R${(lastNumber + 1).toString().padStart(3, "0")}`;
    }

    const newReader = await Reader.create({
      readerCode,
      name,
      email,
      password, 
      phone,
      quota: 5,
      role: "reader",
    });

    // Tạo token luôn để đăng ký xong tự login
    // const token = jwt.sign(
    //   { id: newReader._id, role: "reader" },
    //   process.env.ACCESS_TOKEN_SECRET,
    //   { expiresIn: "30d" }
    // );

    res.status(201).json({
      _id: newReader._id,
      name: newReader.name,
      email: newReader.email,
      role: "reader",
      // token: token,
    });
  } catch (error) {
    console.log("Lỗi đăng ký:", error);
    res.status(500).json({ message: "Lỗi hệ thống" });
  }
};

// --- 7. ĐĂNG NHẬP CHO BẠN ĐỌC ---
export const loginReader = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res
        .status(400)
        .json({ message: "Vui lòng nhập email và mật khẩu" });
    }

    // 1. Tìm trong bảng READER (Không phải User)
    const reader = await Reader.findOne({ email });

    if (!reader) {
      return res.status(401).json({ message: "Email chưa đăng ký" });
    }

    // 2. Check Pass
    const isMatch = await reader.comparePassword(password);
    if (!isMatch) {
      return res.status(401).json({ message: "Sai mật khẩu" });
    }

    // 3. Cấp thẻ (Role: reader)
    const token = jwt.sign(
      { id: reader._id, role: "reader" },
      process.env.ACCESS_TOKEN_SECRET,
      { expiresIn: "1d" }
    );

    res.status(200).json({
      message: "Đăng nhập thành công",
      token,
      user: {
        _id: reader._id,
        username: reader.name,
        email: reader.email,
        role: "reader",
        readerCode: reader.readerCode,
      },
    });
  } catch (error) {
    console.log("Lỗi login reader:", error);
    res.status(500).json({ message: "Lỗi hệ thống" });
  }
};
