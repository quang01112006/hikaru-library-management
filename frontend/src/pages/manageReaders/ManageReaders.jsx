import { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import "./ManageReaders.css";
import ReaderHistoryModal from "../../components/ReaderHistoryModal";
import Loading from "../../components/loading/Loading";
import {
  useGetReaders,
  useAddReader,
  useDeleteReader,
  useUpdateReader,
} from "../../hooks/useReader";

const ManageReaders = () => {
  const { data: readerData, isError, isLoading } = useGetReaders();
  const readers = readerData || [];
  const [historyReader, setHistoryReader] = useState(null);

  const { mutate: addReader } = useAddReader();
  const { mutate: updateReader } = useUpdateReader();
  const { mutate: deleteReader } = useDeleteReader();

  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [showForm, setShowForm] = useState(false);
  const [editingReader, setEditingReader] = useState(null);
  const [sortConfig, setSortConfig] = useState({ key: null, direction: "asc" });

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    quota: 5,
    password: "",
  });

  const readersPerPage = 7;

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
    if (aValue < bValue) return sortConfig.direction === "asc" ? -1 : 1;
    if (aValue > bValue) return sortConfig.direction === "asc" ? 1 : -1;
    return 0;
  });

  const filteredReaders = sortedReaders.filter(
    (reader) =>
      reader.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      reader.readerCode?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      reader.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      reader.phone?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const indexOfLastReader = currentPage * readersPerPage;
  const indexOfFirstReader = indexOfLastReader - readersPerPage;
  const currentReaders = filteredReaders.slice(
    indexOfFirstReader,
    indexOfLastReader
  );
  const totalPages = Math.ceil(filteredReaders.length / readersPerPage) || 1;

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (editingReader) {
      updateReader(
        { id: editingReader._id, data: formData },
        {
          onSuccess: () => {
            alert("Cập nhật thành công!");
            handleCloseForm();
          },
          onError: (err) => alert("Lỗi: " + err.response?.data?.message),
        }
      );
    } else {
      addReader(formData, {
        onSuccess: () => {
          alert("Thêm bạn đọc thành công");
          handleCloseForm();
        },
        onError: (err) => alert("Lỗi: " + err.response?.data?.message),
      });
    }
  };

  const handleEdit = (reader) => {
    setEditingReader(reader);
    setFormData({
      name: reader.name,
      email: reader.email,
      phone: reader.phone,
      quota: reader.quota,
      password: "",
    });
    setShowForm(true);
  };

  const handleDelete = (readerId) => {
    if (window.confirm("Xóa bạn đọc này?")) {
      deleteReader(readerId, {
        onSuccess: () => alert("Xóa thành công"),
        onError: (err) => alert("Lỗi: " + err.response?.data?.message),
      });
    }
  };

  const handleCloseForm = () => {
    setShowForm(false);
    setEditingReader(null);
    setFormData({ name: "", email: "", phone: "", quota: 5, password: "" });
  };

  const handlePageChange = (pageNumber) => setCurrentPage(pageNumber);
  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
    setCurrentPage(1);
  };

  if (isLoading) return <Loading />;
  if (isError) return <div className="error"> Lỗi tải dữ liệu</div>;

  return (
    <div className="readers-page fade-in">
      <div className="readers-header">
        <h1>Quản Lý Bạn Đọc ({readers.length})</h1>
        <button onClick={() => setShowForm(true)} className="add-reader-btn">
          + Thêm Bạn Đọc
        </button>
      </div>

      <div className="search-container">
        <div className="search-box">
          <input
            type="text"
            placeholder="Tìm kiếm theo mã, tên, email"
            value={searchTerm}
            onChange={handleSearchChange}
            className="search-input"
          />
          {/* <span className="search-icon">🔍</span> */}
        </div>
        <div className="search-results">
          Tìm thấy {filteredReaders.length} bạn đọc
        </div>
      </div>

      <div className="readers-table-container">
        <table className="readers-table">
          <thead>
            <tr>
              <th onClick={() => handleSort("readerCode")} className="sortable">
                Mã {getSortIcon("readerCode")}
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
                Mượn/Quota {getSortIcon("borrowed")}
              </th>
              <th>Thao tác</th>
            </tr>
          </thead>
          <tbody>
            {currentReaders.length > 0 ? (
              currentReaders.map((reader) => (
                <tr key={reader._id} className="reader-row">
                  <td className="reader-code">{reader.readerCode}</td>
                  <td className="reader-name">
                    <strong>{reader.name}</strong>
                  </td>
                  <td className="reader-email">{reader.email}</td>
                  <td className="reader-phone">{reader.phone}</td>
                  <td className="reader-quota">
                    <span
                      className={`quota-badge ${
                        reader.borrowed >= reader.quota ? "full" : ""
                      }`}
                    >
                      {reader.borrowed || 0}/{reader.quota}
                    </span>
                  </td>
                  <td className="reader-actions">
                    <button
                      className="edit-btn"
                      onClick={() => setHistoryReader(reader)}
                    >
                      Lịch sử
                    </button>
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
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="6" className="no-readers">
                  Không tìm thấy bạn đọc nào.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {totalPages > 1 && (
        <div className="pagination">
          <button
            className="pagination-btn"
            disabled={currentPage === 1}
            onClick={() => handlePageChange(currentPage - 1)}
          >
            ←
          </button>
          <span>
            Trang {currentPage} / {totalPages}
          </span>
          <button
            className="pagination-btn"
            disabled={currentPage === totalPages}
            onClick={() => handlePageChange(currentPage + 1)}
          >
            →
          </button>
        </div>
      )}

      {/* MODAL FORM */}
      {showForm && (
        <div className="modal-overlay">
          <div className="modal-content">
            <h2 className="modal-title">
              {editingReader ? "Sửa thông tin" : "Thêm bạn đọc mới"}
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
                  placeholder="VD: Nguyễn Văn A"
                />
              </div>

              <div className="form-group">
                <label className="form-label">Email (Tên đăng nhập):</label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  required
                  className="form-input"
                />
              </div>

              <div className="form-group">
                <label className="form-label">
                  Mật khẩu:
                  {editingReader && (
                    <span
                      style={{
                        fontWeight: "normal",
                        fontSize: 12,
                        color: "#666",
                      }}
                    >
                      {" "}
                    </span>
                  )}
                  {!editingReader && (
                    <span
                      style={{
                        fontWeight: "normal",
                        fontSize: 12,
                        color: "#666",
                      }}
                    >
                      {" "}
                      (Để trống = 123456)
                    </span>
                  )}
                </label>
                <input
                  type="text" 
                  name="password"
                  value={formData.password}
                  onChange={handleInputChange}
                  required={false} 
                  className="form-input"
                  placeholder="Nhập mật khẩu cho bạn đọc..."
                />
              </div>

              <div className="form-group">
                <label className="form-label">Số điện thoại:</label>
                <input
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={handleInputChange}
                  className="form-input"
                />
              </div>

              <div className="form-group">
                <label className="form-label">Quota (Giới hạn mượn):</label>
                <input
                  type="number"
                  name="quota"
                  value={formData.quota}
                  onChange={handleInputChange}
                  min="1"
                  max="10"
                  required
                  className="form-input"
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
