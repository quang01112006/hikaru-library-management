import axios from "axios";
import dotenv from "dotenv";
import Book from "./models/Book.js";
import Category from "./models/Category.js";
import Reader from "./models/Reader.js";
import BorrowRecord from "./models/BorrowRecord.js";
import { connectDB } from "./config/db.js";

dotenv.config();
connectDB();

const importData = async () => {
  try {
    console.log("Đang dọn dẹp dữ liệu cũ");
    await Book.deleteMany();
    await Category.deleteMany();
    await Reader.deleteMany();
    await BorrowRecord.deleteMany();
    console.log("Dọn db xong");

    console.log("Đang bắt đầu nhập sách.");

    const categoriesList = [
      { name: "Manga", keyword: "manga" },
      { name: "Công Nghệ", keyword: "subject:computers" },
      { name: "Tiểu Thuyết", keyword: "subject:fiction" },
      { name: "Kinh Doanh", keyword: "subject:business" },
      { name: "Lịch Sử", keyword: "subject:history" },
      { name: "Khoa Học", keyword: "subject:science" },
    ];

    let bookCounter = 1000;

    for (const category of categoriesList) {
      const createdCategory = await Category.create({
        name: category.name,
        description: `Tuyển tập sách ${category.name}`,
        image: `https://ui-avatars.com/api/?name=${category.name}&background=random&color=fff&size=128`,
      });
      console.log(`Đã tạo ${category.name}`);

      let mappedBooks = [];

      if (category.keyword === "manga") {
        const jikanUrl =
          "https://api.jikan.moe/v4/manga?genres=52&order_by=score&sort=desc&limit=10";
        const { data } = await axios.get(jikanUrl);
        const mangaList = data.data || [];

        mappedBooks = mangaList.map((m) => ({
          bookCode: `B${bookCounter++}`,
          title: m.title_english || m.title,
          author: m.authors?.[0]?.name || "Mangaka",
          image: m.images?.jpg?.image_url,
          genre: createdCategory._id,
          quantity: 10,
          availableQuantity: 10,
          isHidden: false,
        }));
      } else {
        const googleUrl = `https://www.googleapis.com/books/v1/volumes?q=${category.keyword}&maxResults=10&langRestrict=en`;
        const { data } = await axios.get(googleUrl);
        const bookList = data.items || [];

        mappedBooks = bookList.map((book) => {
          const info = book.volumeInfo;
          return {
            bookCode: `B${bookCounter++}`,
            title: info.title || "Unknown",
            author: info.authors?.[0] || "Unknown",
            image: info.imageLinks?.thumbnail,
            genre: createdCategory._id,
            quantity: 10,
            availableQuantity: 10,
            isHidden: false,
          };
        });
      }

      if (mappedBooks.length > 0) {
        await Book.insertMany(mappedBooks);
        console.log(`Đã nhập ${mappedBooks.length} cuốn.`);
      }
    }

    console.log("XONG");
    process.exit();
  } catch (error) {
    console.error(`LỖI: ${error.message}`);
    process.exit(1);
  }
};

importData();
