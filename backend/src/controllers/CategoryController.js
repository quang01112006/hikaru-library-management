import Book from "../models/Book.js";
import Category from "../models/Category.js";

export const getAllCategories = async (req, res) => {
  try {
    const categories = await Category.find();
    res.status(200).json(categories);
  } catch (error) {
    console.log("Lỗi khi gọi getAllCategories: ", error.message);
    res.status(500).json({ message: "Lỗi hệ thống" });
  }
};

export const addCategory = async (req, res) => {
  try {
    const { name, description } = req.body;
    const newCategory = new Category({ name, description });
    await newCategory.save();
    res.status(201).json(newCategory);
  } catch (error) {
    if (error.code === 11000) {
      return res.status(400).json({ message: "Thể loại đã tồn tại" });
    }
    console.log("Lỗi khi gọi addCategory: ", error.message);
    res.status(500).json({ message: "Lỗi hệ thống" });
  }
};

export const updateCategory = async (req, res) => {
  try {
    const { name, description } = req.body;
    const updatedCategory = await Category.findByIdAndUpdate(
      req.params.id,
      { name, description },
      { new: true, runValidators: true } // trả về bản ghi sau khi update, check ràng buộc
    );
    if (!updatedCategory) {
      return res.status(404).json({ message: "Thể loại không tồn tại" });
    }
    res.status(200).json(updatedCategory);
  } catch (error) {
    if (error.code === 11000) {
      return res.status(400).json({ message: "Thể loại đã tồn tại" });
    }
    console.log("Lỗi khi gọi updateCategory: ", error.message);
    res.status(500).json({ message: "Lỗi hệ thống" });
  }
};

export const deleteCategory = async (req, res) => {
  try {
    const categoryId = req.params.id;
    const bookCount = await Book.countDocuments({ genre: categoryId });
    if (bookCount > 0) {
      return res.status(400).json({
        message: `Không thể xóa, còn ${bookCount} sách thuộc thể loại này.`,
      });
    }
    console.log("💥 Đang thử xóa Category ID:", categoryId);
    const deletedCategory = await Category.findByIdAndDelete(categoryId);
    if (!deletedCategory) {
      return res.status(404).json({ message: "Thể loại không tồn tại" });
    }

    console.log("🔍 Tìm thấy số sách liên quan:", bookCount);

    res.status(200).json({ message: "Xóa thể loại thành công" });
  } catch (error) {
    console.log("Lỗi khi gọi deleteCategory: ", error.message);
    res.status(500).json({ message: "Lỗi hệ thống" });
  }
};
