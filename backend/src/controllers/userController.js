import User from "../models/User.js";
import jwt from "jsonwebtoken";

export const addUser = async (req, res) => {
  try {
    const { username, password, role } = req.body;
    const newUser = new User({
      username,
      password,
      role,
    });
    await newUser.save();
    res.status(201).json({
      _id: newUser._id,
      username: newUser.username,
      role: newUser.role,
    });
  } catch (error) {
    if (error.code === 11000) {
      return res.status(400).json({ message: "Username đã tồn tại" });
    }
    console.log("Lỗi khi tạo user:", error.message);
    res.status(500).json({ message: "Lỗi hệ thống" });
  }
};

export const login = async (req, res) => {
  try {
    console.log("Data nhận được:", req.body);
    const { username, password } = req.body;
    if (!username || !password) {
      return res
        .status(400)
        .json({ message: "Vui lòng nhập đủ username và password" });
    }
    const user = await User.findOne({ username: username.toLowerCase() });
    if (!user) {
      return res.status(401).json({ message: "Sai username hoặc password" });
    }
    const isMatch = await user.comparePassword(password);

    if (!isMatch) {
      return res.status(401).json({ message: "Sai username hoặc password" });
    }

    const payload = {
      id: user._id,
      role: user.role,
    };

    const token = jwt.sign(payload, process.env.ACCESS_TOKEN_SECRET, {
      expiresIn: "1d",
    });

    res.status(200).json({
      message: "Đăng nhập thành công ",
      token: token,
      user: {
        _id: user._id,
        username: user.username,
        role: user.role,
      },
    });
  } catch (error) {
    console.log("Lỗi đăng nhập:", error.message);
    res.status(500).json({ message: "Lỗi hệ thống" });
  }
};

export const getAllUsers = async (req, res) => {
  try {
    const users = await User.find().select("-password");
    res.status(200).json(users);
  } catch (error) {
    res.status(500).json({ message: "Lỗi hệ thống" });
  }
};
export const updateUser = async (req, res) => {
  try {
    const updatedUser = await User.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    });
    if (!updatedUser) {
      return res.status(404).json({ message: "User không tồn tại" });
    }
    res.status(200).json(updatedUser);
  } catch (error) {
    console.log("Lỗi khi gọi updateUser:", error.message);
    res.status(500).json({ message: "Lỗi hệ thống" });
  }
};

export const deleteUser = async (req, res) => {
  try {
    const deletedUser = await User.findByIdAndDelete(req.params.id);
    if (!deletedUser) {
      return res.status(404).json({ message: "User không tồn tại" });
    }
    res.status(200).json({ message: "Xóa user thành công" });
  } catch (error) {
    res.status(500).json({ message: "Lỗi hệ thống" });
  }
};
