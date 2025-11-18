import express from "express";
import bookRoutes from "./routes/bookRoutes.js";
import readerRoutes from "./routes/readerRoutes.js";
import categoryRoutes from "./routes/categoryRoutes.js";
import userRoutes from "./routes/userRoutes.js";
import { connectDB } from "./config/db.js";
import dotenv from "dotenv";
import { protect } from "./middleware/authMiddleware.js";
import cors from "cors";
dotenv.config();
const app = express();
const PORT = process.env.PORT || 5001;

//middleware
app.use(express.json());
app.use(cors());
connectDB();

// public routes
app.use("/api/users", userRoutes);

//private routes
app.use(protect);
app.use("/api/books", bookRoutes);
app.use("/api/readers", readerRoutes);
app.use("/api/categories", categoryRoutes);

app.listen(PORT, () => {
  console.log("server chạy ở port 5001");
});
