import './BorrowBooks.css';
import { useState, useEffect } from "react";
import { useGetBorrowHistory, useCreateBorrow, useReturnBook } from "../../hooks/useBorrow";
import { useGetBook } from "../../hooks/useBook"; // Sửa thành useGetBook
import { useGetReaders } from "../../hooks/useReader";

export default function ManageBorrows() {
  const { data: borrowsData, isLoading: borrowsLoading, error: borrowsError, refetch } = useGetBorrowHistory();
  const { mutateAsync: createBorrow, isLoading: isCreating } = useCreateBorrow();
  const { mutateAsync: returnBook, isLoading: isReturning } = useReturnBook();
  const { data: booksData, isLoading: booksLoading } = useGetBook(); // Sửa thành useGetBook
  const { data: readersData, isLoading: readersLoading } = useGetReaders();

  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [sortConfig, setSortConfig] = useState({ key: null, direction: 'asc' });
  const [newBorrow, setNewBorrow] = useState({
    reader: "",
    book: "",
    dueDate: ""
  });

  const borrowsPerPage = 10;

  // Extract data từ React Query
  const borrows = Array.isArray(borrowsData) ? borrowsData : borrowsData?.data || [];
  const books = Array.isArray(booksData) ? booksData : booksData?.data || [];
  const readers = Array.isArray(readersData) ? readersData : readersData?.data || [];

  // Lọc phiếu mượn theo từ khóa tìm kiếm
  const filteredBorrows = borrows.filter(borrow => {
    const searchLower = searchTerm.toLowerCase();
    const readerName = borrow.reader?.name?.toLowerCase() || "";
    const readerCode = borrow.reader?.readerCode?.toLowerCase() || "";
    const bookTitle = borrow.book?.title?.toLowerCase() || "";
    const bookCode = borrow.book?.bookCode?.toLowerCase() || "";
    const borrowCode = borrow._id?.slice(-6).toLowerCase() || "";

    return (
      readerName.includes(searchLower) ||
      readerCode.includes(searchLower) ||
      bookTitle.includes(searchLower) ||
      bookCode.includes(searchLower) ||
      borrowCode.includes(searchLower)
    );
  });

  // Sắp xếp
  const sortedBorrows = [...filteredBorrows].sort((a, b) => {
    if (!sortConfig.key) return 0;
    
    let aValue, bValue;

    if (sortConfig.key === 'reader') {
      aValue = a.reader?.name || "";
      bValue = b.reader?.name || "";
    } else if (sortConfig.key === 'book') {
      aValue = a.book?.title || "";
      bValue = b.book?.title || "";
    } else {
      aValue = a[sortConfig.key];
      bValue = b[sortConfig.key];
    }

    if (aValue < bValue) {
      return sortConfig.direction === 'asc' ? -1 : 1;
    }
    if (aValue > bValue) {
      return sortConfig.direction === 'asc' ? 1 : -1;
    }
    return 0;
  });

  // Tính toán phiếu mượn cho trang hiện tại
  const indexOfLastBorrow = currentPage * borrowsPerPage;
  const indexOfFirstBorrow = indexOfLastBorrow - borrowsPerPage;
  const currentBorrows = sortedBorrows.slice(indexOfFirstBorrow, indexOfLastBorrow);
  const totalPages = Math.ceil(sortedBorrows.length / borrowsPerPage);

  const handleSort = (key) => {
    let direction = 'asc';
    if (sortConfig.key === key && sortConfig.direction === 'asc') {
      direction = 'desc';
    }
    setSortConfig({ key, direction });
  };

  const getSortIcon = (key) => {
    if (sortConfig.key !== key) return '↕️';
    return sortConfig.direction === 'asc' ? '↑' : '↓';
  };

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
    setCurrentPage(1);
  };

  const handleReturnBook = async (borrowId) => {
    if (window.confirm("Xác nhận trả sách?")) {
      try {
        await returnBook(borrowId);
      } catch (error) {
        console.error("Error returning book:", error);
        alert("Có lỗi xảy ra khi trả sách");
      }
    }
  };

  const handleCreateBorrow = async (e) => {
    e.preventDefault();
    try {
      await createBorrow(newBorrow);
      setShowModal(false);
      setNewBorrow({ reader: "", book: "", dueDate: "" });
    } catch (error) {
      console.error("Error creating borrow:", error);
      alert("Có lỗi xảy ra khi tạo phiếu mượn");
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewBorrow(prev => ({
      ...prev,
      [name]: value
    }));
  };

  // Lọc sách có sẵn (availableQuantity > 0)
  const availableBooks = books.filter(book => book.availableQuantity > 0);

  // Format ngày tháng
  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('vi-VN');
  };

  // Kiểm tra quá hạn
  const isOverdue = (dueDate, returnDate) => {
    if (returnDate) return false;
    return new Date(dueDate) < new Date();
  };

  const getStatusBadge = (borrow) => {
    if (borrow.returnDate) {
      return <span className="status-badge returned">Đã trả</span>;
    } else if (isOverdue(borrow.dueDate, borrow.returnDate)) {
      return <span className="status-badge overdue">Quá hạn</span>;
    } else {
      return <span className="status-badge borrowing">Đang mượn</span>;
    }
  };

  // Tính ngày tối thiểu cho date picker (ngày mai)
  const getMinDate = () => {
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    return tomorrow.toISOString().split('T')[0];
  };

  if (borrowsLoading) return <div className="loading">Đang tải...</div>;
  if (borrowsError) return <div className="error">Có lỗi xảy ra: {borrowsError.message}</div>;

  return (
    <div className="borrows-page">
      <div className="borrows-header">
        <h1>Quản Lý Mượn Trả</h1>
        <button 
          className="add-borrow-btn" 
          onClick={() => setShowModal(true)}
        >
          Tạo Phiếu Mượn
        </button>
      </div>

      {/* Thanh tìm kiếm */}
      <div className="search-container">
        <div className="search-box">
          <input
            type="text"
            placeholder="Tìm kiếm theo mã phiếu, tên bạn đọc, tên sách..."
            value={searchTerm}
            onChange={handleSearchChange}
            className="search-input"
          />
          <span className="search-icon">🔍</span>
        </div>
        <div className="search-results">
          Tìm thấy {filteredBorrows.length} phiếu mượn
        </div>
      </div>

      {/* Bảng danh sách mượn trả */}
      <div className="borrows-table-container">
        <table className="borrows-table">
          <thead>
            <tr>
              <th onClick={() => handleSort('_id')} className="sortable">
                Mã Phiếu {getSortIcon('_id')}
              </th>
              <th onClick={() => handleSort('reader')} className="sortable">
                Bạn Đọc {getSortIcon('reader')}
              </th>
              <th onClick={() => handleSort('book')} className="sortable">
                Sách {getSortIcon('book')}
              </th>
              <th onClick={() => handleSort('borrowDate')} className="sortable">
                Ngày Mượn {getSortIcon('borrowDate')}
              </th>
              <th onClick={() => handleSort('dueDate')} className="sortable">
                Hạn Trả {getSortIcon('dueDate')}
              </th>
              <th>Trạng Thái</th>
              <th>Thao tác</th>
            </tr>
          </thead>
          <tbody>
            {currentBorrows.length > 0 ? (
              currentBorrows.map(borrow => (
                <tr key={borrow._id} className="borrow-row">
                  <td className="borrow-code">
                    #{borrow._id?.slice(-6).toUpperCase()}
                  </td>
                  <td className="borrow-reader">
                    <strong>{borrow.reader?.name}</strong>
                    <div className="reader-code">{borrow.reader?.readerCode}</div>
                  </td>
                  <td className="borrow-book">
                    <div className="book-info">
                      {borrow.book?.image && (
                        <img 
                          src={borrow.book.image} 
                          alt={borrow.book.title}
                          className="book-cover"
                        />
                      )}
                      <div className="book-details">
                        <strong>{borrow.book?.title}</strong>
                        <div className="book-code">{borrow.book?.bookCode}</div>
                      </div>
                    </div>
                  </td>
                  <td className="borrow-date">
                    {formatDate(borrow.borrowDate)}
                  </td>
                  <td className="due-date">
                    {formatDate(borrow.dueDate)}
                  </td>
                  <td className="status">
                    {getStatusBadge(borrow)}
                  </td>
                  <td className="borrow-actions">
                    {!borrow.returnDate && (
                      <button 
                        className="return-btn"
                        onClick={() => handleReturnBook(borrow._id)}
                        disabled={isReturning}
                      >
                        {isReturning ? "Đang xử lý..." : "Trả Sách"}
                      </button>
                    )}
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="7" className="no-borrows">
                  {borrows.length === 0 ? 'Chưa có phiếu mượn nào.' : 'Không tìm thấy phiếu mượn phù hợp'}
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
          
          {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
            <button
              key={page}
              className={`pagination-btn ${currentPage === page ? 'active' : ''}`}
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

      {/* Modal tạo phiếu mượn */}
      {showModal && (
        <div className="modal-overlay">
          <div className="modal">
            <div className="modal-header">
              <h2>Tạo Phiếu Mượn Mới</h2>
              <button 
                className="close-btn"
                onClick={() => setShowModal(false)}
              >
                ×
              </button>
            </div>
            <form onSubmit={handleCreateBorrow} className="modal-form">
              <div className="form-group">
                <label>Bạn Đọc *</label>
                <select
                  name="reader"
                  value={newBorrow.reader}
                  onChange={handleInputChange}
                  disabled={readersLoading}
                  required
                >
                  <option value="">{readersLoading ? "Đang tải..." : "Chọn bạn đọc"}</option>
                  {readers.map(reader => (
                    <option key={reader._id} value={reader._id}>
                      {reader.name} - {reader.readerCode}
                    </option>
                  ))}
                </select>
              </div>

              <div className="form-group">
                <label>Sách *</label>
                <select
                  name="book"
                  value={newBorrow.book}
                  onChange={handleInputChange}
                  disabled={booksLoading}
                  required
                >
                  <option value="">{booksLoading ? "Đang tải..." : "Chọn sách"}</option>
                  {availableBooks.map(book => (
                    <option key={book._id} value={book._id}>
                      {book.title} - {book.bookCode} (Còn: {book.availableQuantity})
                    </option>
                  ))}
                </select>
              </div>

        <div className="form-group">
          <label>Ngày Hẹn Trả *</label>
          <input
            type="date"
            name="dueDate"
            value={newBorrow.dueDate}
            onChange={handleInputChange}
            min={getMinDate()}
            required
          />
        </div>

        <div className="modal-actions">
          <button 
            type="button" 
            className="btn-cancel"
            onClick={() => setShowModal(false)}
          >
            Hủy
          </button>
          <button 
            type="submit" 
            className="btn-save"
            disabled={isCreating || booksLoading || readersLoading}
          >
            {isCreating ? "Đang xử lý..." : "Tạo Phiếu"}
          </button>
        </div>
      </form>
    </div>
  </div>
)}
    </div>
  );
}
