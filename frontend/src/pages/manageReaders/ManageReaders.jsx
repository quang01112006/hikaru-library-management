import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import "./ManageReaders.css";
import ReaderHistoryModal from "../../components/ReaderHistoryModal";
import {
  useGetReaders,
  useAddReader,
  useDeleteReader,
  useUpdateReader,
} from "../../hooks/useReader";
import Loading from "../../components/loading/Loading";
const ManageReaders = () => {
  // lấy data
  const { data: readerData, isError, isLoading } = useGetReaders();
  const readers = readerData || [];
  const [historyReader, setHistoryReader] = useState(null);

  // Gọi các Hook Hành động
  const { mutate: addReader } = useAddReader();
  const { mutate: updateReader } = useUpdateReader();
  const { mutate: deleteReader } = useDeleteReader();

  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [readersPerPage] = useState(7);
  const [showForm, setShowForm] = useState(false);
  const [editingReader, setEditingReader] = useState(null);
  const [sortConfig, setSortConfig] = useState({ key: null, direction: "asc" });
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    quota: 5,
  });

  const navigate = useNavigate();
  const location = useLocation();

  // Tạo ID mới duy nhất
  const generateNewId = () => {
    const existingIds = readers.map((reader) => reader.id);
    let newId = "";
    let counter = 1;

    do {
      newId = `RD${String(counter).padStart(3, "0")}`;
      counter++;
    } while (existingIds.includes(newId));

    return newId;
  };

  // Xử lý sắp xếp
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

  const sortedReaders = [...readers].sort((a, b) => {
    if (!sortConfig.key) return 0;

    const aValue = a[sortConfig.key];
    const bValue = b[sortConfig.key];

    if (aValue < bValue) {
      return sortConfig.direction === "asc" ? -1 : 1;
    }
    if (aValue > bValue) {
      return sortConfig.direction === "asc" ? 1 : -1;
    }
    return 0;
  });

  const filteredReaders = sortedReaders.filter(
    (reader) =>
      reader.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      reader.readerCode.toLowerCase().includes(searchTerm.toLowerCase()) ||
      reader.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      reader.phone.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const indexOfLastReader = currentPage * readersPerPage;
  const indexOfFirstReader = indexOfLastReader - readersPerPage;
  const currentReaders = filteredReaders.slice(
    indexOfFirstReader,
    indexOfLastReader
  );
  const totalPages = Math.ceil(filteredReaders.length / readersPerPage);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // --- 3. SỬA LOGIC SUBMIT (GỌI API) ---
  const handleSubmit = (e) => {
    e.preventDefault();

    if (editingReader) {
      // GỌI UPDATE
      updateReader(
        {
          id: editingReader._id, // Dùng _id của MongoDB
          data: formData,
        },
        {
          onSuccess: () => {
            alert("Cập nhật thành công!");
            handleCloseForm();
          },
          onError: (err) => alert("Lỗi: " + err.response?.data?.message),
        }
      );
    } else {
      // GỌI ADD
      addReader(formData, {
        onSuccess: () => {
          alert("Thêm bạn đọc thành công!");
          handleCloseForm();
        },
        onError: (err) => alert("Lỗi: " + err.response?.data?.message),
      });
    }
  };

  // Sửa logic Edit: Map data vào form
  const handleEdit = (reader) => {
    setEditingReader(reader);
    setFormData({
      readerCode: reader.readerCode,
      name: reader.name,
      email: reader.email,
      phone: reader.phone,
      quota: reader.quota,
    });
    setShowForm(true);
  };

  // Sửa logic Delete: Gọi API
  const handleDelete = (readerId) => {
    if (window.confirm("Bạn có chắc chắn muốn xóa bạn đọc này?")) {
      deleteReader(readerId, {
        onSuccess: () => alert("Xóa thành công!"),
        onError: (err) => alert("Lỗi: " + err.response?.data?.message),
      });
    }
  };

  const handleCloseForm = () => {
    setShowForm(false);
    setEditingReader(null);
    setFormData({
      name: "",
      email: "",
      phone: "",
      quota: 5,
    });
  };

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
    setCurrentPage(1);
  };

  // Thêm navigation signal khi thêm/sửa (giống ManageBooks)
  const handleAddReader = () => {
    setShowForm(true);
    // Thêm signal để reload khi quay lại
    navigate(location.pathname, { state: { timestamp: Date.now() } });
  };

  // --- LOADING UI ---
  if (isLoading) return <Loading />;
  if (isError) return <div className="error">❌ Lỗi tải dữ liệu!</div>;

  return (
    <div className="readers-page">
      <div className="readers-header">
        <h1>Quản Lý Bạn Đọc</h1>
        <button onClick={handleAddReader} className="add-reader-btn">
          Thêm Bạn Đọc Mới
        </button>
      </div>

      {/* Thanh tìm kiếm */}
      <div className="search-container">
        <div className="search-box">
          <input
            type="text"
            placeholder="Tìm kiếm theo tên, mã, email hoặc số điện thoại..."
            value={searchTerm}
            onChange={handleSearchChange}
            className="search-input"
          />
          <span className="search-icon">🔍</span>
        </div>
        <div className="search-results">
          Tìm thấy {filteredReaders.length} bạn đọc
        </div>
      </div>

      {/* Bảng bạn đọc */}
      <div className="readers-table-container">
        <table className="readers-table">
          <thead>
            <tr>
              <th onClick={() => handleSort("readerCode")} className="sortable">
                Mã bạn đọc {getSortIcon("readerCode")}
              </th>
              <th onClick={() => handleSort("name")} className="sortable">
                Họ tên {getSortIcon("name")}
              </th>
              <th onClick={() => handleSort("email")} className="sortable">
                Email {getSortIcon("email")}
              </th>
              <th onClick={() => handleSort("phone")} className="sortable">
                SĐT {getSortIcon("phone")}
              </th>
              <th
                onClick={() => handleSort("borrowed")}
                className="sortable quota-header"
              >
                Số sách đang mượn / Quota {getSortIcon("borrowed")}
              </th>
              <th>Thao tác</th>
            </tr>
          </thead>
          <tbody>
            {Array.isArray(currentReaders) && currentReaders.length > 0 ? (
              currentReaders.map((reader) => (
                <tr key={reader._id} className="reader-row">
                  <td className="reader-code">{reader.readerCode}</td>
                  <td className="reader-name">{reader.name}</td>
                  <td className="reader-email">{reader.email}</td>
                  <td className="reader-phone">{reader.phone}</td>
                  <td className="reader-quota">
                    <div
                      className={`quota-display ${
                        reader.borrowed > reader.quota ? "over-quota" : ""
                      }`}
                    >
                      {reader.borrowed}/{reader.quota}
                    </div>
                  </td>
                  <td className="reader-actions">
                    <button
                      onClick={() => handleEdit(reader)}
                      className="edit-btn"
                    >
                      Sửa
                    </button>
                    <button
                      onClick={() => handleDelete(reader._id)}
                      className="delete-btn"
                    >
                      Xóa
                    </button>
                    <button
                      className="edit-btn"
                      style={{ backgroundColor: "#3498db", marginRight: 5 }}
                      onClick={() => setHistoryReader(reader)} // Set state để mở modal
                    >
                      📜 Lịch sử
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="6" className="no-readers">
                  {readers.length === 0
                    ? "Chưa có bạn đọc nào. Hãy thêm bạn đọc mới!"
                    : "Không tìm thấy bạn đọc phù hợp"}
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

      {/* Modal form */}
      {showForm && (
        <div className="modal-overlay">
          <div className="modal-content">
            <h2 className="modal-title">
              {editingReader ? "Sửa thông tin bạn đọc" : "Thêm bạn đọc mới"}
            </h2>

            <form onSubmit={handleSubmit}>
              <div className="form-group">
                <label className="form-label">Họ tên:</label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  required
                  className="form-input"
                  placeholder="Nhập họ tên đầy đủ"
                />
              </div>

              <div className="form-group">
                <label className="form-label">Email:</label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  required
                  className="form-input"
                  placeholder="Nhập địa chỉ email"
                />
              </div>

              <div className="form-group">
                <label className="form-label">Số điện thoại:</label>
                <input
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={handleInputChange}
                  required
                  className="form-input"
                  placeholder="Nhập số điện thoại"
                />
              </div>

              <div className="form-group">
                <label className="form-label">Quota (số sách tối đa):</label>
                <input
                  type="number"
                  name="quota"
                  value={formData.quota}
                  onChange={handleInputChange}
                  min="1"
                  max="10"
                  required
                  className="form-input"
                  placeholder="Nhập số sách tối đa được mượn"
                />
              </div>

              <div className="form-actions">
                <button
                  type="button"
                  onClick={handleCloseForm}
                  className="cancel-btn"
                >
                  Hủy
                </button>
                <button type="submit" className="submit-btn">
                  {editingReader ? "Cập nhật" : "Thêm mới"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
      {historyReader && (
        <ReaderHistoryModal
          reader={historyReader}
          onClose={() => setHistoryReader(null)}
        />
      )}
    </div>
  );
};

export default ManageReaders;
