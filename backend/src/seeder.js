import axios from "axios";
import dotenv from "dotenv";
import Book from "./models/Book.js";
import Reader from "./models/Reader.js";
import BorrowRecord from "./models/BorrowRecord.js";
import Category from "./models/Category.js";
import { connectDB } from "./config/db.js";

dotenv.config();
connectDB();

const importData = async () => {
  try {
    await Book.deleteMany();
    await Category.deleteMany();
    console.log(" Database đã sạch bong");
    console.log(" Đang bắt đầu quy trình nhập dữ liệu...");
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
        description: `this is desc of ${category.name}`,
        image: `https://ui-avatars.com/api/?name=${category.name}&background=random&color=fff&size=128`,
      });
      console.log(`Đã tạo: ${category.name}`);

      let mappedBooks = [];
      if (category.keyword === "manga") {
        const jikanUrl =
          "https://api.jikan.moe/v4/manga?genres=52&order_by=score&sort=desc&limit=10";
        const { data } = await axios.get(jikanUrl);
        const mangaList = data.data || [];
        mappedBooks = mangaList.map((m) => {
          return {
            bookCode: `B${bookCounter++}`,
            title: m.title,
            author: m.authors?.[0]?.name || "unknown",
            image:
              m.images?.jpg?.image_url ||
              "https://i.pinimg.com/736x/2a/97/38/2a9738148057ff9930c23ec6ac9bdf99.jpg",
            genre: createdCategory._id,
            quantity: 10,
            availableQuantity: 10,
            isHidden: false,
          };
        });
        await Reader.deleteMany();
        await BorrowRecord.deleteMany();
        const readers = [];
        for (let i = 0; i <= 20; i++) {
          readers.push({
            readerCode: `R${1000 + i}`, // BD1001, BD1002...
            name: `Bạn Đọc Số ${i}`, // Hoặc dùng faker.person.fullName()
            email: `docgia${i}@gmail.com`,
            phone: `090${Math.floor(Math.random() * 10000000)}`,
            quota: 5, // Mỗi người được mượn 5 cuốn
          });
        }

        await Reader.insertMany(readers);
        console.log(`✅ Đã thêm ${readers.length} bạn đọc.`);
      } else {
        console.log(`Đang gọi Google Books...`);
        const googleUrl = `https://www.googleapis.com/books/v1/volumes?q=${category.keyword}&maxResults=10`;
        const { data } = await axios.get(googleUrl);
        const bookList = data.items || [];
        mappedBooks = bookList.map((book) => {
          const info = book.volumeInfo;
          return {
            bookCode: `B${bookCounter++}`,
            title: info.title || "unknown",
            author: info.authors?.[0] || "unknown",
            image:
              info.imageLinks?.thumbnail ||
              "https://i.pinimg.com/736x/2a/97/38/2a9738148057ff9930c23ec6ac9bdf99.jpg",
            genre: createdCategory._id,
            quantity: 10,
            availableQuantity: 10,
            isHidden: false,
          };
        });
      }

      if (mappedBooks.length > 0) {
        await Book.insertMany(mappedBooks);
        console.log(
          ` Đã nhập thành công tổng cộng ${mappedBooks.length} cuốn sách`
        );
      } else {
        console.log("Không tìm thấy sách nào .");
      }
    }
    console.log("TẤT CẢ ĐÃ XONG!");
    process.exit();
  } catch (error) {
    console.error(` LỖI: ${error.message}`);
    process.exit(1);
  }
};
importData();
