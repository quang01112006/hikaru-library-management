import express from "express";
import {
  createBorrowRecord,
  returnBook,
  getBorrowHistory,
} from "../controllers/borrowRecordController.js";

const router = express.Router();

router.get("/", getBorrowHistory);

router.post("/", createBorrowRecord);

router.patch("/:recordId/return", returnBook);

export default router;
