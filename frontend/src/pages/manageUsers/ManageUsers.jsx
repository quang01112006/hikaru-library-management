import { useState } from "react";
import { useAuth } from "../../context/AuthContext";
import Loading from "../../components/loading/Loading";
import {
  useGetUsers,
  useAddUser,
  useUpdateUser,
  useDeleteUser,
} from "../../hooks/useUser";
import "./ManageUsers.css";

const ManageUsers = () => {
  // 1. Lấy thông tin người đang đăng nhập
  const { user: currentUser } = useAuth();

  const { data: userData, isError, isLoading } = useGetUsers();
  const users = userData || [];

  const { mutate: addUser } = useAddUser();
  const { mutate: updateUser } = useUpdateUser();
  const { mutate: deleteUser } = useDeleteUser();

  const [searchTerm, setSearchTerm] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [editingUser, setEditingUser] = useState(null);

  const [formData, setFormData] = useState({
    username: "",
    password: "",
    role: "librarian",
  });

  const filteredUsers = users.filter((u) =>
    u.username.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (editingUser) {
      updateUser(
        { id: editingUser._id, data: formData },
        {
          onSuccess: () => {
            alert("Cập nhật thành công!");
            handleCloseForm();
          },
          onError: (err) => alert("Lỗi: " + err.response?.data?.message),
        }
      );
    } else {
      addUser(formData, {
        onSuccess: () => {
          alert("Thêm nhân viên thành công!");
          handleCloseForm();
        },
        onError: (err) => alert("Lỗi: " + err.response?.data?.message),
      });
    }
  };

  const handleEdit = (user) => {
    setEditingUser(user);
    setFormData({
      username: user.username,
      role: user.role,
      password: "",
    });
    setShowForm(true);
  };

  const handleDelete = (userId) => {
    if (window.confirm("Bạn có chắc muốn xóa nhân viên này?")) {
      deleteUser(userId, {
        onSuccess: () => alert("Đã xóa nhân viên!"),
        onError: (err) => alert("Lỗi: " + err.response?.data?.message),
      });
    }
  };

  const handleCloseForm = () => {
    setShowForm(false);
    setEditingUser(null);
    setFormData({ username: "", password: "", role: "librarian" });
  };

  if (isLoading) return <Loading />;
  if (isError) return <div className="error">Lỗi tải dữ liệu~</div>;

  return (
    <div className="users-page fade-in">
      {/* HEADER */}
      <div className="users-header">
        <h1>Quản Lý Nhân Viên</h1>
        <button onClick={() => setShowForm(true)} className="btn-add-user">
          + Thêm Nhân Viên
        </button>
      </div>

      {/* SEARCH */}
      <div className="search-container">
        <input
          className="search-input"
          type="text"
          placeholder="Tìm kiếm theo username..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      {/* TABLE */}
      <div className="users-table-container">
        <table className="users-table">
          <thead>
            <tr>
              <th>Username</th>
              <th>Vai trò</th>
              <th>Ngày tạo</th>
              <th>Hành động</th>
            </tr>
          </thead>
          <tbody>
            {filteredUsers.map((u) => (
              <tr key={u._id}>
                <td>
                  <strong>{u.username}</strong>
                  {currentUser && u._id === currentUser._id && (
                    <span className="you-badge">(Bạn)</span>
                  )}
                </td>
                <td>
                  <span className={`role-badge ${u.role}`}>
                    {u.role.toUpperCase()}
                  </span>
                </td>
                <td>{new Date(u.createdAt).toLocaleDateString("vi-VN")}</td>
                <td>
                  <button onClick={() => handleEdit(u)} className="btn-edit">
                    Sửa
                  </button>

                  {/* Ẩn nút xóa nếu là chính mình */}
                  {currentUser && u._id !== currentUser._id && (
                    <button
                      onClick={() => handleDelete(u._id)}
                      className="btn-delete"
                    >
                      Xóa
                    </button>
                  )}
                </td>
              </tr>
            ))}
            {filteredUsers.length === 0 && (
              <tr>
                <td colSpan="4" style={{ textAlign: "center", padding: 20 }}>
                  Không tìm thấy nhân viên.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* MODAL FORM */}
      {showForm && (
        <div className="modal-overlay">
          <div className="modal-content">
            <h2>{editingUser ? "Sửa Nhân Viên" : "Thêm Nhân Viên"}</h2>

            <form onSubmit={handleSubmit} className="user-form">
              <div className="form-group">
                <label>Username</label>
                <input
                  className="form-input"
                  name="username"
                  value={formData.username}
                  onChange={handleInputChange}
                  required
                />
              </div>

              <div className="form-group">
                <label>
                  Mật khẩu
                  {editingUser && (
                    <span className="password-hint">
                      (Để trống nếu không đổi)
                    </span>
                  )}
                </label>
                <input
                  className="form-input"
                  type="text" // Để text cho dễ nhìn lúc tạo
                  name="password"
                  value={formData.password}
                  onChange={handleInputChange}
                  required={!editingUser} // Chỉ bắt buộc khi Thêm mới
                  placeholder={
                    editingUser
                      ? "Nhập để đổi mật khẩu mới"
                      : "Nhập mật khẩu..."
                  }
                />
              </div>

              <div className="form-group">
                <label>Vai trò</label>
                <select
                  className="form-select"
                  name="role"
                  value={formData.role}
                  onChange={handleInputChange}
                >
                  <option value="librarian">Thủ thư (Librarian)</option>
                  <option value="admin">Quản trị viên (Admin)</option>
                </select>
              </div>

              <div className="modal-actions">
                <button
                  type="button"
                  onClick={handleCloseForm}
                  className="btn-cancel"
                >
                  Hủy
                </button>
                <button type="submit" className="btn-save">
                  Lưu
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
