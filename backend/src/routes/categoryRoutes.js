import express from "express";
import {
  getAllCategories,
  addCategory,
  updateCategory,
  deleteCategory,
} from "../controllers/CategoryController.js";

const router = express.Router();
router.get("/", getAllCategories);
router.post("/", addCategory);
router.put("/:id", updateCategory);
router.delete("/:id", deleteCategory);
export default router;
