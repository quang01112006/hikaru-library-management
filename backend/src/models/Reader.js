import mongoose from "mongoose";

const readerSchema = new mongoose.Schema({
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
  dob: Date,
  address: {
    type: String,
    trim: true,
  },
  phone: {
    type: String,
    trim: true,
  },
  barcode: {
    type: String,
    trim: true,
    unique: true,
  },
  quota: {
    type: Number,
    default: 5,
  },
});

const Reader = mongoose.model("Reader", readerSchema);
export default Reader;
