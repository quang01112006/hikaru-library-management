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
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

router.post("/register", registerReader);
router.post("/login", loginReader);

router.use(protect);

router.get("/", getAllReaders);
router.get("/:id", getReaderById);

router.post("/", addReader);
router.put("/:id", updateReaderInfo);
router.delete("/:id", deleteReader);

export default router;
