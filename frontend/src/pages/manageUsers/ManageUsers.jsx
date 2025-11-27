import { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import "./ManageUsers.css";

import {
  useGetUsers,
  useAddUser,
  useUpdateUser,
  useDeleteUser,
} from "../../hooks/useUser";

const ManageUsers = () => {
  // Lấy danh sách nhân viên từ API
  const { data: userData, isError, isLoading } = useGetUsers();
  const users = userData || [];

  // Actions Hooks
  const { mutate: addUser } = useAddUser();
  const { mutate: updateUser } = useUpdateUser();
  const { mutate: deleteUser } = useDeleteUser();

  // UI States
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [usersPerPage] = useState(7);
  const [showForm, setShowForm] = useState(false);
  const [editingUser, setEditingUser] = useState(null);
  const [sortConfig, setSortConfig] = useState({
    key: null,
    direction: "asc",
  });

  // Form State
  const [formData, setFormData] = useState({
    username: "",
    fullName: "",
    email: "",
    phone: "",
    role: "staff",
    password: "",
  });

  const navigate = useNavigate();
  const location = useLocation();

  // SORT
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

  const sortedUsers = [...users].sort((a, b) => {
    if (!sortConfig.key) return 0;

    const aVal = a[sortConfig.key];
    const bVal = b[sortConfig.key];

    if (aVal < bVal) return sortConfig.direction === "asc" ? -1 : 1;
    if (aVal > bVal) return sortConfig.direction === "asc" ? 1 : -1;
    return 0;
  });

  // FILTER
  const filteredUsers = sortedUsers.filter(
    (u) =>
      u.username.toLowerCase().includes(searchTerm.toLowerCase()) ||
      u.fullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      u.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      u.phone.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // PAGINATION
  const indexOfLast = currentPage * usersPerPage;
  const indexOfFirst = indexOfLast - usersPerPage;
  const currentUsers = filteredUsers.slice(indexOfFirst, indexOfLast);
  const totalPages = Math.ceil(filteredUsers.length / usersPerPage);

  // INPUT CHANGE
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // SUBMIT FORM
  const handleSubmit = (e) => {
    e.preventDefault();

    if (editingUser) {
      // UPDATE USER
      updateUser(
        { id: editingUser._id, data: formData },
        {
          onSuccess: () => {
            alert("Cập nhật nhân viên thành công!");
            handleCloseForm();
          },
          onError: (err) => alert("Lỗi: " + err.response?.data?.message),
        }
      );
    } else {
      // ADD USER
      addUser(formData, {
        onSuccess: () => {
          alert("Thêm nhân viên thành công!");
          handleCloseForm();
        },
        onError: (err) => alert("Lỗi: " + err.response?.data?.message),
      });
    }
  };

  // EDIT
  const handleEdit = (user) => {
    setEditingUser(user);

    setFormData({
      username: user.username,
      fullName: user.fullName,
      email: user.email,
      phone: user.phone,
      role: user.role || "staff",
      password: "",
    });

    setShowForm(true);
  };

  // DELETE
  const handleDelete = (userId) => {
    if (window.confirm("Bạn có chắc muốn xóa nhân viên này?")) {
      deleteUser(userId, {
        onSuccess: () => alert("Xóa nhân viên thành công!"),
        onError: (err) => alert("Lỗi: " + err.response?.data?.message),
      });
    }
  };

  // OPEN FORM
  const handleAddUser = () => {
    setShowForm(true);
    navigate(location.pathname, { state: { timestamp: Date.now() } });
  };

  // CLOSE
  const handleCloseForm = () => {
    setShowForm(false);
    setEditingUser(null);
    setFormData({
      username: "",
      fullName: "",
      email: "",
      phone: "",
      role: "staff",
      password: "",
    });
  };

  if (isLoading)
    return <div className="loading">⏳ Đang tải danh sách nhân viên...</div>;
  if (isError) return <div className="error">❌ Lỗi tải dữ liệu!</div>;

  return (
    <div className="users-page">
      {/* HEADER */}
      <div className="users-header">
        <h1>Quản Lý Nhân Viên</h1>
        <button onClick={handleAddUser} className="add-user-btn">
          Thêm Nhân Viên
        </button>
      </div>

      {/* SEARCH */}
      <div className="search-container">
        <div className="search-box">
          <input
            type="text"
            placeholder="Tìm kiếm theo username, tên, email, SĐT..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="search-input"
          />
          <span className="search-icon">🔍</span>
        </div>
        <div className="search-results">
          Tìm thấy {filteredUsers.length} nhân viên
        </div>
      </div>

      {/* TABLE */}
      <div className="users-table-container">
        <table className="users-table">
          <thead>
            <tr>
              <th onClick={() => handleSort("username")} className="sortable">
                Username {getSortIcon("username")}
              </th>
              <th onClick={() => handleSort("fullName")} className="sortable">
                Họ tên {getSortIcon("fullName")}
              </th>
              <th onClick={() => handleSort("email")} className="sortable">
                Email {getSortIcon("email")}
              </th>
              <th onClick={() => handleSort("phone")} className="sortable">
                SĐT {getSortIcon("phone")}
              </th>
              <th onClick={() => handleSort("role")} className="sortable">
                Vai trò {getSortIcon("role")}
              </th>
              <th>Thao tác</th>
            </tr>
          </thead>

          <tbody>
            {currentUsers.length > 0 ? (
              currentUsers.map((user) => (
                <tr key={user._id}>
                  <td>{user.username}</td>
                  <td>{user.fullName}</td>
                  <td>{user.email}</td>
                  <td>{user.phone}</td>
                  <td>{user.role}</td>
                  <td>
                    <button
                      onClick={() => handleEdit(user)}
                      className="edit-btn"
                    >
                      Sửa
                    </button>
                    <button
                      onClick={() => handleDelete(user._id)}
                      className="delete-btn"
                    >
                      Xóa
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="6" className="no-users">
                  Không tìm thấy nhân viên phù hợp.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* PAGINATION */}
      {totalPages > 1 && (
        <div className="pagination">
          <button
            className="pagination-btn"
            disabled={currentPage === 1}
            onClick={() => setCurrentPage(currentPage - 1)}
          >
            ← Trước
          </button>

          {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
            <button
              key={p}
              className={`pagination-btn ${
                currentPage === p ? "active" : ""
              }`}
              onClick={() => setCurrentPage(p)}
            >
              {p}
            </button>
          ))}

          <button
            className="pagination-btn"
            disabled={currentPage === totalPages}
            onClick={() => setCurrentPage(currentPage + 1)}
          >
            Sau →
          </button>
        </div>
      )}

      {/* FORM MODAL */}
      {showForm && (
        <div className="modal-overlay">
          <div className="modal-content">
            <h2 className="modal-title">
              {editingUser ? "Sửa nhân viên" : "Thêm nhân viên mới"}
            </h2>

            <form onSubmit={handleSubmit}>
              <div className="form-group">
                <label>Username:</label>
                <input
                  name="username"
                  value={formData.username}
                  onChange={handleInputChange}
                  required
                />
              </div>

              <div className="form-group">
                <label>Họ tên:</label>
                <input
                  name="fullName"
                  value={formData.fullName}
                  onChange={handleInputChange}
                  required
                />
              </div>

              <div className="form-group">
                <label>Email:</label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  required
                />
              </div>

              <div className="form-group">
                <label>Số điện thoại:</label>
                <input
                  name="phone"
                  value={formData.phone}
                  onChange={handleInputChange}
                  required
                />
              </div>

              <div className="form-group">
                <label>Vai trò:</label>
                <select
                  name="role"
                  value={formData.role}
                  onChange={handleInputChange}
                >
                  <option value="admin">Admin</option>
                  <option value="staff">Staff</option>
                </select>
              </div>

              {!editingUser && (
                <div className="form-group">
                  <label>Mật khẩu:</label>
                  <input
                    type="password"
                    name="password"
                    value={formData.password}
                    onChange={handleInputChange}
                    required
                  />
                </div>
              )}

              <div className="form-actions">
                <button
                  type="button"
                  className="cancel-btn"
                  onClick={handleCloseForm}
                >
                  Hủy
                </button>
                <button type="submit" className="submit-btn">
                  {editingUser ? "Cập nhật" : "Thêm mới"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default ManageUsers;
