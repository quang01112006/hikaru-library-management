import React, { useState, useEffect } from "react";
import "./ManageCategories.css";

const ManageCategories = () => {
  const [categories, setCategories] = useState([
    {
      id: 1,
      name: "Văn học",
      count: 15,
      description: "Sách truyện, tiểu thuyết, thơ ca Việt Nam và thế giới.",
      thumbnail: "https://via.placeholder.com/60x60?text=VH",
    },
    {
      id: 2,
      name: "Khoa học",
      count: 10,
      description: "Tài liệu nghiên cứu, khoa học tự nhiên và công nghệ.",
      thumbnail: "https://via.placeholder.com/60x60?text=KH",
    },
    {
      id: 3,
      name: "Thiếu nhi",
      count: 8,
      description: "Sách dành cho trẻ em, truyện tranh, giáo dục thiếu nhi.",
      thumbnail: "https://via.placeholder.com/60x60?text=TN",
    },
  ]);

  const [searchTerm, setSearchTerm] = useState("");
  const [showAddForm, setShowAddForm] = useState(false);
  const [showEditForm, setShowEditForm] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [newCategory, setNewCategory] = useState({
    name: "",
    description: "",
    thumbnail: "",
  });
  const [notification, setNotification] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 3;

  const showNotification = (message) => {
    setNotification(message);
    setTimeout(() => setNotification(""), 2000);
  };

  const handleImageUpload = (e, type) => {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onloadend = () => {
      if (type === "new") {
        setNewCategory({ ...newCategory, thumbnail: reader.result });
      } else if (type === "edit") {
        setSelectedCategory({ ...selectedCategory, thumbnail: reader.result });
      }
    };
    reader.readAsDataURL(file);
  };

  const filteredCategories = categories.filter((cat) =>
    cat.name.toLowerCase().includes(searchTerm.toLowerCase())
  );
  const totalPages = Math.ceil(filteredCategories.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const displayedCategories = filteredCategories.slice(
    startIndex,
    startIndex + itemsPerPage
  );

  const handleAddCategory = (e) => {
    e.preventDefault();
    const newCat = {
      id: categories.length + 1,
      name: newCategory.name,
      description: newCategory.description,
      thumbnail:
        newCategory.thumbnail || "https://via.placeholder.com/60x60?text=IMG",
      count: 0,
    };
    setCategories([...categories, newCat]);
    setNewCategory({ name: "", description: "", thumbnail: "" });
    setShowAddForm(false);
    showNotification("Thêm thể loại thành công!");
  };

  const handleDelete = () => {
    setCategories(categories.filter((c) => c.id !== selectedCategory.id));
    setShowDeleteModal(false);
    showNotification("Xóa thể loại thành công!");
  };

  const handleEditSave = (e) => {
    e.preventDefault();
    setCategories(
      categories.map((c) =>
        c.id === selectedCategory.id ? selectedCategory : c
      )
    );
    setShowEditForm(false);
    showNotification("Cập nhật thể loại thành công!");
  };

  useEffect(() => {
    if (showAddForm || showEditForm || showDeleteModal)
      document.body.style.overflow = "hidden";
    else document.body.style.overflow = "auto";
  }, [showAddForm, showEditForm, showDeleteModal]);

  return (
    <div className="category-page fade-in">
      <div className="category-header slide-down">
        <h2>Quản lý thể loại</h2>
        <div className="category-actions">
          <input
            type="text"
            placeholder="Tìm kiếm thể loại..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <button className="btn-add" onClick={() => setShowAddForm(true)}>
            + Thêm thể loại
          </button>
        </div>
      </div>

      <table className="category-table fade-in">
        <thead>
          <tr>
            <th>Tên thể loại</th>
            <th>ID</th>
            <th>Số lượng</th>
            <th>Hành động</th>
          </tr>
        </thead>
        <tbody>
          {displayedCategories.map((cat) => (
            <tr key={cat.id} className="row-hover">
              <td>
                <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                  <img src={cat.thumbnail} alt={cat.name} className="thumb" />
                  <span>{cat.name}</span>
                </div>
              </td>
              <td>{cat.id}</td>
              <td>{cat.count}</td>
              <td>
                <button
                  className="btn-edit"
                  onClick={() => {
                    setSelectedCategory({ ...cat });
                    setShowEditForm(true);
                  }}
                >
                  Sửa
                </button>
                <button
                  className="btn-delete"
                  onClick={() => {
                    setSelectedCategory(cat);
                    setShowDeleteModal(true);
                  }}
                >
                  Xóa
                </button>
              </td>
            </tr>
          ))}
          {displayedCategories.length === 0 && (
            <tr>
              <td colSpan="4" className="no-data">
                Không có dữ liệu phù hợp
              </td>
            </tr>
          )}
        </tbody>
      </table>

      <div className="pagination">
        <button
          onClick={() => setCurrentPage((p) => Math.max(p - 1, 1))}
          disabled={currentPage === 1}
        >
          ⬅ Trước
        </button>
        <span>
          Trang {currentPage} / {totalPages}
        </span>
        <button
          onClick={() => setCurrentPage((p) => Math.min(p + 1, totalPages))}
          disabled={currentPage === totalPages}
        >
          Tiếp ➡
        </button>
      </div>

      {showAddForm && (
        <div className="overlay fade-in">
          <div className="form-popup pop-up">
            <h3>Thêm thể loại mới</h3>
            <form onSubmit={handleAddCategory}>
              <label>Tên thể loại:</label>
              <input
                type="text"
                value={newCategory.name}
                onChange={(e) =>
                  setNewCategory({ ...newCategory, name: e.target.value })
                }
                required
              />
              <label>Ảnh thumbnail:</label>
              <input
                type="file"
                accept="image/*"
                onChange={(e) => handleImageUpload(e, "new")}
              />
              {newCategory.thumbnail && (
                <img
                  src={newCategory.thumbnail}
                  alt="Preview"
                  className="preview-img"
                />
              )}
              <label>Mô tả:</label>
              <textarea
                value={newCategory.description}
                onChange={(e) =>
                  setNewCategory({ ...newCategory, description: e.target.value })
                }
              />
              <div className="form-buttons">
                <button type="submit">Lưu</button>
                <button
                  type="button"
                  className="btn-cancel"
                  onClick={() => setShowAddForm(false)}
                >
                  Hủy
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {showEditForm && selectedCategory && (
        <div className="overlay fade-in">
          <div className="form-popup pop-up">
            <h3>Sửa thể loại</h3>
            <form onSubmit={handleEditSave}>
              <label>ID:</label>
              <input type="text" value={selectedCategory.id} readOnly />
              <label>Tên thể loại:</label>
              <input
                type="text"
                value={selectedCategory.name}
                onChange={(e) =>
                  setSelectedCategory({
                    ...selectedCategory,
                    name: e.target.value,
                  })
                }
              />
              <label>Số lượng sách:</label>
              <input type="text" value={selectedCategory.count} readOnly />
              <label>Ảnh thumbnail:</label>
              <input
                type="file"
                accept="image/*"
                onChange={(e) => handleImageUpload(e, "edit")}
              />
              {selectedCategory.thumbnail && (
                <img
                  src={selectedCategory.thumbnail}
                  alt="Preview"
                  className="preview-img"
                />
              )}
              <label>Mô tả:</label>
              <textarea
                value={selectedCategory.description}
                onChange={(e) =>
                  setSelectedCategory({
                    ...selectedCategory,
                    description: e.target.value,
                  })
                }
              />
              <div className="form-buttons">
                <button type="submit">Lưu</button>
                <button
                  type="button"
                  className="btn-cancel"
                  onClick={() => setShowEditForm(false)}
                >
                  Hủy
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {showDeleteModal && selectedCategory && (
        <div className="overlay fade-in">
          <div className="confirm-modal pop-up">
            <h3>Xác nhận xóa</h3>
            <p>
              Bạn có chắc chắn muốn xóa thể loại{" "}
              <strong>{selectedCategory.name}</strong>?
            </p>
            <div className="form-buttons">
              <button onClick={handleDelete}>Xóa</button>
              <button
                className="btn-cancel"
                onClick={() => setShowDeleteModal(false)}
              >
                Hủy
              </button>
            </div>
          </div>
        </div>
      )}

      {notification && <div className="notification pop-up">{notification}</div>}
    </div>
  );
};

export default ManageCategories;
