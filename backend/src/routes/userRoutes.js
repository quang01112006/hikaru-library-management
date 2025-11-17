import express from "express";
import {
  addUser,
  login,
  getAllUsers,
  deleteUser,
} from "../controllers/userController.js";
import { protect, isAdmin } from "../middleware/authMiddleware.js";

const router = express.Router();

router.post("/login", login);
router.use(protect);
router.post("/", isAdmin, addUser);
router.get("/", isAdmin, getAllUsers);
router.delete("/:id", isAdmin, deleteUser);

export default router;
