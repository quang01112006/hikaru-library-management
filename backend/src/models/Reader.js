import mongoose from "mongoose";

const readerSchema = new mongoose.Schema(
  {
    readerCode: {
      type: String,
      unique: true,
      required: true,
      trim: true,
    },
    name: {
      type: String,
      required: true,
      trim: true,
    },
    phone: {
      type: String,
      trim: true,
    },
    email: {
      type: String,
      trim: true,
      unique: true,
      sparse: true,
    },

    quota: {
      type: Number,
      default: 5,
    },
  },
  { timestamps: true }
);

const Reader = mongoose.model("Reader", readerSchema);
export default Reader;
