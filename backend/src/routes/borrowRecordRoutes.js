import express from "express";
import {
  createBorrowRecord,
  returnBook,
  getBorrowHistory,
  approveBorrow,
  getBorrowsByReaderId,
  cancelBorrow,
} from "../controllers/borrowRecordController.js";

const router = express.Router();

router.get("/", getBorrowHistory);
router.get("/reader/:readerId", getBorrowsByReaderId);
router.post("/", createBorrowRecord);

router.patch("/:recordId/return", returnBook);
router.patch("/:recordId/approve", approveBorrow);

router.delete("/:recordId/cancel", cancelBorrow);

export default router;
