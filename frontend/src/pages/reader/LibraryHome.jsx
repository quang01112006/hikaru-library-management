import { useState, useEffect } from "react";
import { useGetBook } from "../../hooks/useBook";
import { useCreateBorrow } from "../../hooks/useBorrow";
import { useAuth } from "../../context/AuthContext";
import { useGetAllCategories } from "../../hooks/useCategory";
import "./LibraryHome.css";
import Loading from "../../components/loading/Loading";

export default function LibraryHome() {
  const { data: booksData, isLoading } = useGetBook();
  const books = booksData || [];

  //lọc theo thể loại
  const { data: categoriesData } = useGetAllCategories();
  const categories = categoriesData || [];
  // 2. State lưu thể loại đang chọn (Rỗng = Tất cả)
  const [selectedCategory, setSelectedCategory] = useState("");

  const { user } = useAuth();
  const { mutate: createBorrow, isPending } = useCreateBorrow();

  const [selectedBook, setSelectedBook] = useState(null);
  const [dueDate, setDueDate] = useState("");

  //lọc
  const [search, setSearch] = useState("");
  const filteredBooks = books.filter((book) => {
    const matchSearch =
      book.title.toLowerCase().includes(search.toLowerCase()) ||
      book.author.toLowerCase().includes(search.toLowerCase());

    const matchCategory = selectedCategory
      ? book.genre?._id === selectedCategory
      : true;

    return matchSearch && matchCategory;
  });

  //pagination
  const [currentPage, setCurrentPage] = useState(1);
  const LIMIT = 15;

  const totalPage = Math.ceil(filteredBooks.length / LIMIT);
  const startIdx = (currentPage - 1) * LIMIT;
  const endIdx = startIdx + LIMIT;
  const currentBooks = filteredBooks.slice(startIdx, endIdx);
  useEffect(() => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  }, [currentPage]);

  // Mở Modal
  const handleClickBorrow = (book) => {
    setSelectedBook(book);
    const nextWeek = new Date();
    nextWeek.setDate(nextWeek.getDate() + 7);
    setDueDate(nextWeek.toISOString().split("T")[0]);
  };

  // Xử lý Mượn
  const handleConfirmBorrow = (e) => {
    e.preventDefault();
    createBorrow(
      {
        readerId: user._id,
        bookId: selectedBook._id,
        dueDate: dueDate,
      },
      {
        onSuccess: () => {
          alert(`Đăng ký mượn cuốn "${selectedBook.title}" thành công!`);
          setSelectedBook(null);
        },
        onError: (err) => {
          alert("Lỗi: " + (err.response?.data?.message || err.message));
        },
      }
    );
  };

  if (isLoading) return <Loading />;

  return (
    <div className="library-home">
      <header className="library-header">
        Chào mừng bạn đến với&nbsp; <span> HikaruLib</span>. Hãy chọn sách để
        đăng ký mượn nhé!
      </header>
      <div className="filter-search">
        <div className="search-bar">
          <input
            type="text"
            value={search}
            placeholder="Nhập tên sách hoặc tên tác giả..."
            onChange={(e) => {
              setSearch(e.target.value);
              setCurrentPage(1);
            }}
          />
        </div>
        <div className="filter">
          <select
            value={selectedCategory}
            onChange={(e) => {
              setSelectedCategory(e.target.value);
              setCurrentPage(1);
            }}
          >
            <option value="">Tất cả</option>
            {categories.map((cat) => (
              <option key={cat._id} value={cat._id}>
                {cat.name}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Grid Sách */}
      <div className="book-grid">
        {currentBooks.map((book) => (
          <div key={book._id} className="reader-book-card">
            <div className="card-image-wrapper">
              <img src={book.image} alt={book.title} />
              <span
                className={`status-badge ${
                  book.availableQuantity > 0 ? "in-stock" : "out-stock"
                }`}
              >
                {book.availableQuantity > 0
                  ? `Còn ${book.availableQuantity}`
                  : "Hết hàng"}
              </span>
            </div>

            <div className="card-content">
              <h3 title={book.title}>{book.title}</h3>
              <p className="card-author">{book.author}</p>

              <div className="card-actions">
                <button
                  className="btn-borrow"
                  disabled={book.availableQuantity <= 0}
                  onClick={() => handleClickBorrow(book)}
                >
                  {book.availableQuantity > 0 ? "Đăng ký mượn sách" : "Tạm hết"}
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* --- MODAL XÁC NHẬN --- */}
      {selectedBook && (
        <div className="modal-overlay" onClick={() => setSelectedBook(null)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <h3>Xác nhận mượn sách</h3>

            <div className="modal-book-info">
              <img src={selectedBook.image} alt={selectedBook.title} />
              <div>
                <h4>{selectedBook.title}</h4>
                <p>{selectedBook.author}</p>
                <span className="text-success">Còn sách tại thư viện</span>
              </div>
            </div>

            <form onSubmit={handleConfirmBorrow} className="modal-form">
              <label>Chọn ngày trả sách</label>
              <input
                type="date"
                required
                value={dueDate}
                onChange={(e) => setDueDate(e.target.value)}
                min={new Date().toISOString().split("T")[0]}
              />

              <div className="modal-buttons">
                <button
                  type="button"
                  className="btn-cancel"
                  onClick={() => setSelectedBook(null)}
                >
                  Hủy
                </button>
                <button
                  type="submit"
                  className="btn-confirm"
                  disabled={isPending}
                >
                  {isPending ? "Đang gửi..." : "Xác Nhận"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      <div className="library-pagination">
        <button
          disabled={currentPage == 1}
          onClick={() => setCurrentPage((p) => p - 1)}
        >
          Prev
        </button>
        <div className="page-number">{`${currentPage} / ${totalPage}`}</div>
        <button onClick={() => setCurrentPage((p) => p + 1)}>next</button>
      </div>
    </div>
  );
}
