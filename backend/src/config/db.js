import mongoose from "mongoose";

export const connectDB = async () => {
  try {
    await mongoose.connect(
      "mongodb+srv://hikaru:hi@cluster0.pccsc9r.mongodb.net/dev?retryWrites=true&w=majority&appName=Cluster0"
    );
    console.log("liên kết db thành công");
  } catch (error) {
    console.error("LỖI KHI KẾT NỐI DB");
  }
};
