import './ManageBooks.css';
import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";

export default function BooksPage() {
  const [books, setBooks] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState("");
  const [sortConfig, setSortConfig] = useState({ key: null, direction: 'asc' });
  const booksPerPage = 10;
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    // Load books từ localStorage
    const loadBooks = () => {
      const savedBooks = localStorage.getItem('libraryBooks');
      if (savedBooks) {
        try {
          const parsedBooks = JSON.parse(savedBooks);
          if (Array.isArray(parsedBooks)) {
            setBooks(parsedBooks);
          }
        } catch (error) {
          console.error('Error parsing books:', error);
          setBooks([]);
        }
      } else {
        setBooks([]);
      }
    };

    loadBooks();
  }, []);

  // Reload books khi nhận được signal từ navigation
  useEffect(() => {
    if (location.state?.timestamp) {
      const savedBooks = localStorage.getItem('libraryBooks');
      if (savedBooks) {
        try {
          const parsedBooks = JSON.parse(savedBooks);
          if (Array.isArray(parsedBooks)) {
            setBooks(parsedBooks);
          }
        } catch (error) {
          console.error('Error parsing books:', error);
          setBooks([]);
        }
      }
      // Clear state để không reload liên tục
      window.history.replaceState({}, document.title);
    }
  }, [location]);

  // Lọc sách theo từ khóa tìm kiếm
  const filteredBooks = books.filter(book =>
    book.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    book.author.toLowerCase().includes(searchTerm.toLowerCase()) ||
    book.code.toLowerCase().includes(searchTerm.toLowerCase()) ||
    book.category?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Sắp xếp
  const sortedBooks = [...filteredBooks].sort((a, b) => {
    if (!sortConfig.key) return 0;
    
    const aValue = a[sortConfig.key];
    const bValue = b[sortConfig.key];
    
    if (aValue < bValue) {
      return sortConfig.direction === 'asc' ? -1 : 1;
    }
    if (aValue > bValue) {
      return sortConfig.direction === 'asc' ? 1 : -1;
    }
    return 0;
  });

  // Tính toán books cho trang hiện tại
  const indexOfLastBook = currentPage * booksPerPage;
  const indexOfFirstBook = indexOfLastBook - booksPerPage;
  const currentBooks = sortedBooks.slice(indexOfFirstBook, indexOfLastBook);
  const totalPages = Math.ceil(sortedBooks.length / booksPerPage);

  const handleDelete = (bookId) => {
    if (window.confirm("Bạn có chắc muốn xóa sách này?")) {
      const updatedBooks = books.filter(book => book.id !== bookId);
      setBooks(updatedBooks);
      localStorage.setItem('libraryBooks', JSON.stringify(updatedBooks));
    }
  };

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
            placeholder="Tìm kiếm theo tên, tác giả, mã sách, thể loại..."
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
              <th onClick={() => handleSort('code')} className="sortable">
                Mã sách {getSortIcon('code')}
              </th>
              <th onClick={() => handleSort('title')} className="sortable">
                Tên sách {getSortIcon('title')}
              </th>
              <th onClick={() => handleSort('author')} className="sortable">
                Tác giả {getSortIcon('author')}
              </th>
              <th onClick={() => handleSort('category')} className="sortable">
                Thể loại {getSortIcon('category')}
              </th>
              <th onClick={() => handleSort('totalQuantity')} className="sortable quantity-header">
                Số lượng {getSortIcon('totalQuantity')}
              </th>
              <th>Thao tác</th>
            </tr>
          </thead>
          <tbody>
            {currentBooks.length > 0 ? (
              currentBooks.map(book => (
                <tr key={book.id} className="book-row">
                  <td className="book-code">{book.code}</td>
                  <td className="book-title">
                    <div>
                      <strong>{book.title}</strong>
                      {book.description && (
                        <div className="book-description">{book.description}</div>
                      )}
                    </div>
                  </td>
                  <td className="book-author">{book.author}</td>
                  <td className="book-category">{book.category}</td>
                  <td className="book-quantity">
                    <div className="quantity-display">
                      {book.availableQuantity}/{book.totalQuantity}
                    </div>
                  </td>
                  <td className="book-actions">
                    <button 
                      className="edit-btn"
                      onClick={() => handleEdit(book.id)}
                    >
                      Sửa
                    </button>
                    <button 
                      className="delete-btn"
                      onClick={() => handleDelete(book.id)}
                    >
                      Xóa
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="6" className="no-books">
                  {books.length === 0 ? 'Chưa có sách nào. Hãy thêm sách mới!' : 'Không tìm thấy sách phù hợp'}
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
    </div>
  );
}
}
