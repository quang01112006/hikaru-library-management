import mongoose from "mongoose";
import bcrypt from "bcryptjs"; // <--- 1. Nhớ import cái này

const readerSchema = new mongoose.Schema(
  {
    readerCode: {
      type: String,
      unique: true,
      // required: true,
    },
    name: {
      type: String,
      required: true,
      trim: true,
    },
    email: {
      type: String,
      trim: true,
      required: true,
      unique: true,
    },
    phone: {
      type: String,
      trim: true,
    },
    quota: {
      type: Number,
      default: 5,
    },

    password: {
      type: String,
      required: true,
    },

    role: {
      type: String,
      default: "reader",
    },
    isDeleted: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

readerSchema.pre("save", async function (next) {
  if (!this.isModified("password")) {
    return next();
  }
  try {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (error) {
    next(error);
  }
});

readerSchema.methods.comparePassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

const Reader = mongoose.model("Reader", readerSchema);
export default Reader;
