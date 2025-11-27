import "./ManageBooks.css";
import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import {
  useGetBook,
  useAddBook,
  useDeleteBook,
  useUpdateBook,
} from "../../hooks/useBook";

export default function BooksPage() {
  const { data: bookData, isLoading, isError, error } = useGetBook();
  const books = bookData || []; //đề phòng lỗi server
  console.log(books);

  // Gọi Hook Xóa
  const { mutate: deleteBook } = useDeleteBook();

  const handleDelete = (bookId) => {
    if (window.confirm("Bạn có chắc muốn xóa sách này?")) {
      // Gọi mutation, React Query tự refetch
      deleteBook(bookId, {
        onSuccess: () => alert("Xóa thành công!"),
        onError: (err) => alert("Lỗi: " + err.message),
      });
    }
  };

  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState("");
  const [sortConfig, setSortConfig] = useState({ key: null, direction: "asc" });
  const booksPerPage = 5;
  const navigate = useNavigate();
  const location = useLocation();

  // Lọc sách theo từ khóa tìm kiếm
  const filteredBooks = books.filter(
    (book) =>
      book.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      book.author.toLowerCase().includes(searchTerm.toLowerCase()) ||
      book.bookCode.toLowerCase().includes(searchTerm.toLowerCase()) ||
      book.genres?.name?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Sắp xếp
  const sortedBooks = [...filteredBooks].sort((a, b) => {
    if (!sortConfig.key) return 0;

    // Map key sort từ UI sang BE
    let key = sortConfig.key;
    if (key === "code") key = "bookCode";
    if (key === "totalQuantity") key = "quantity";
    if (key === "category") key = "genre.name";

    const aValue = key.includes(".") ? a.genre?.name : a[key];
    const bValue = key.includes(".") ? b.genre?.name : b[key];

    if (aValue < bValue) return sortConfig.direction === "asc" ? -1 : 1;
    if (aValue > bValue) return sortConfig.direction === "asc" ? 1 : -1;
    return 0;
  });

  // Tính toán books cho trang hiện tại
  const indexOfLastBook = currentPage * booksPerPage;
  const indexOfFirstBook = indexOfLastBook - booksPerPage;
  const currentBooks = sortedBooks.slice(indexOfFirstBook, indexOfLastBook);
  const totalPages = Math.ceil(sortedBooks.length / booksPerPage);

  const handleEdit = (bookId) => {
    navigate(`/manage/books/edit/${bookId}`);
  };

  const handleAddBook = () => {
    navigate("/manage/books/add");
  };

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
    setCurrentPage(1);
  };

  const handleSort = (key) => {
    let direction = "asc";
    if (sortConfig.key === key && sortConfig.direction === "asc") {
      direction = "desc";
    }
    setSortConfig({ key, direction });
  };

  const getSortIcon = (key) => {
    if (sortConfig.key !== key) return "↕️";
    return sortConfig.direction === "asc" ? "↑" : "↓";
  };

  // --- LOADING UI, đợi có component Loading , error thì thay vô ---
  if (isLoading) return <div className="loading">⏳ Đang tải sách...</div>;
  if (isError) return <div className="error">❌ Lỗi: {error.message}</div>;
  return (
    <div className="books-page">
      <div className="books-header">
        <h1>Quản Lý Sách</h1>
        <button className="add-book-btn" onClick={handleAddBook}>
          Thêm Sách Mới
        </button>
      </div>

      {/* Thanh tìm kiếm */}
      <div className="search-container">
        <div className="search-box">
          <input
            type="text"
            placeholder="Tìm kiếm theo tên sách hoặc tác giả"
            value={searchTerm}
            onChange={handleSearchChange}
            className="search-input"
          />
          <span className="search-icon">🔍</span>
        </div>
        <div className="search-results">
          Tìm thấy {filteredBooks.length} sách
        </div>
      </div>

      {/* Bảng sách */}
      <div className="books-table-container">
        <table className="books-table">
          <thead>
            <tr>
              <th onClick={() => handleSort("code")} className="sortable">
                Mã sách {getSortIcon("code")}
              </th>
              <th>Ảnh </th>
              <th onClick={() => handleSort("title")} className="sortable">
                Tên sách {getSortIcon("title")}
              </th>
              <th onClick={() => handleSort("author")} className="sortable">
                Tác giả {getSortIcon("author")}
              </th>
              <th onClick={() => handleSort("category")} className="sortable">
                Thể loại {getSortIcon("category")}
              </th>
              <th
                onClick={() => handleSort("totalQuantity")}
                className="sortable quantity-header"
              >
                Số lượng {getSortIcon("totalQuantity")}
              </th>
              <th>Thao tác</th>
            </tr>
          </thead>
          <tbody>
            {currentBooks.length > 0 ? (
              currentBooks.map((book) => (
                // sửa id thành _id vì db nó lưu _id
                <tr key={book._id} className="book-row">
                  <td className="book-code">{book.bookCode}</td>
                  <td className="col-image">
                    <img
                      src={
                        book.image ||
                        `https://ui-avatars.com/api/?name=${book.title}&background=random&color=fff&size=128`
                      }
                      alt={book.title}
                      className="book-cover-thumb"
                    />
                  </td>
                  <td className="book-title">
                    <div>
                      <strong>{book.title}</strong>
                      {book.description && (
                        <div className="book-description">
                          {book.description}
                        </div>
                      )}
                    </div>
                  </td>
                  <td className="book-author">{book.author}</td>
                  <td className="book-category">
                    {book.genre?.name || "Chưa phân loại"}
                  </td>
                  <td className="book-quantity">
                    <div className="quantity-display">
                      {book.availableQuantity}/{book.quantity}
                    </div>
                  </td>
                  <td className="book-actions">
                    <button
                      className="edit-btn"
                      onClick={() => handleEdit(book._id)}
                    >
                      Sửa
                    </button>
                    <button
                      className="delete-btn"
                      onClick={() => handleDelete(book._id)}
                    >
                      Xóa
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="6" className="no-books">
                  {books.length === 0
                    ? "Chưa có sách nào. Hãy thêm sách mới!"
                    : "Không tìm thấy sách phù hợp"}
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Phân trang */}
      {totalPages > 1 && (
        <div className="pagination">
          <button
            className="pagination-btn"
            disabled={currentPage === 1}
            onClick={() => handlePageChange(currentPage - 1)}
          >
            ← Trước
          </button>

          {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
            <button
              key={page}
              className={`pagination-btn ${
                currentPage === page ? "active" : ""
              }`}
              onClick={() => handlePageChange(page)}
            >
              {page}
            </button>
          ))}

          <button
            className="pagination-btn"
            disabled={currentPage === totalPages}
            onClick={() => handlePageChange(currentPage + 1)}
          >
            Sau →
          </button>
        </div>
      )}
    </div>
  );
}
