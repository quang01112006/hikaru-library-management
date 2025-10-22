import express from "express";
import bookRoutes from "./routes/bookRoutes.js";
import { connectDB } from "./config/db.js";
import dotenv from "dotenv";

dotenv.config();
const app = express();
app.use(express.json());

connectDB();

app.use("/api/books", bookRoutes);

app.listen(5001, () => {
  console.log("server start 5001");
});
