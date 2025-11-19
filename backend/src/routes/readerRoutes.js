import express from "express";
import {
  getAllReaders,
  getReaderById,
  addReader,
  updateReaderInfo,
  deleteReader,
} from "../controllers/readerController.js";

const router = express.Router();

router.get("/", getAllReaders);
router.post("/", addReader);

router.get("/:id", getReaderById);
router.put("/:id", updateReaderInfo);

router.delete("/:id", deleteReader);

export default router;
