import mongoose from "mongoose";

export const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_CONNECTIONSTRING);
    console.log("liên kết db thành công");
  } catch (error) {
    console.error("lỗi khi kết nối db: ", error);
    process.exit(1); //exit with error
  }
};
