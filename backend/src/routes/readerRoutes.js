import express from "express";
import {
  getAllReaders,
  getReaderById,
  addReader,
  updateReaderInfo,
  deleteReader,
  registerReader,
  loginReader,
} from "../controllers/readerController.js";
import { isAdmin, protect } from "../middleware/authMiddleware.js";

const router = express.Router();


router.post("/register", registerReader); 
router.post("/login", loginReader);


router.use(protect);

router.get("/", getAllReaders);
router.get("/:id", getReaderById);

// Thêm/Sửa (Dành cho Thủ thư/Admin)
router.post("/", addReader);
router.put("/:id", updateReaderInfo);

// Xóa (Chỉ Admin mới được xóa - Thêm lớp bảo vệ isAdmin cho chắc)
router.delete("/:id", isAdmin, deleteReader);

export default router;
