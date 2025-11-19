import express from "express";
import {
  getAllBooks,
  getBookById,
  addBook,
  updateBookInfo,
  deleteBook,
  searchBooks,
} from "../controllers/bookController.js";
const router = express.Router();

router.get("/search", searchBooks);
router.get("/", getAllBooks);
router.get("/:id", getBookById);

router.post("/", addBook);

router.put("/:id", updateBookInfo);

router.delete("/:id", deleteBook);

export default router;
