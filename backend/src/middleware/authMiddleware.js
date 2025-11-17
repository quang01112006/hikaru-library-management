import jwt from "jsonwebtoken";
import User from "../models/User.js";

export const protect = async (req, res, next) => {
  let token;
  //lấy token từ header
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    token = req.headers.authorization.split(" ")[1];
  }
  if (!token) {
    return res.status(401).json({ message: "Không tìm thấy access token" });
  }
  try {
    const decoded = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
    const user = await User.findById(decoded.id).select("-password");
    if (!user) {
      return res
        .status(401)
        .json({ message: "Không có quyền, người dùng không còn tồn tại" });
    }
    req.user = user;
    next();
  } catch (error) {
    console.log("Lỗi khi xác minh JWT trong authMiddleware", error);
    res.status(401).json({ message: "Không có quyền, token không hợp lệ" });
  }
};

export const isAdmin = (req, res, next) => {
  if (req.user && req.user.role === "admin") {
    next();
  } else {
    res.status(403).json({ message: "Không có quyền admin" });
  }
};
