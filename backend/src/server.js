import express from "express";
import bookRoutes from "./routes/bookRoutes.js";
import readerRoutes from "./routes/readerRoutes.js";
import categoriRoutes from "/routes/categoryRoutes";
import { connectDB } from "./config/db.js";
import dotenv from "dotenv";

dotenv.config();
const app = express();
app.use(express.json());

connectDB();

app.use("/api/books", bookRoutes);
app.use("/api/readers", readerRoutes);
app.use("/api/categories", categoryRoutes);

app.listen(5001, () => {
  console.log("server chạy ở port 5001");
});
