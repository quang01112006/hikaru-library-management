import { useState, useEffect } from "react";
import "./ManageCategories.css";
import {
  useGetAllCategories,
  useAddCategory,
  useUpdateCategory,
  useDeleteCategory,
} from "../../hooks/useCategory";

const ManageCategories = () => {
  // ===================================================================
  // thằng useGetAllCategories trả về object có key là data, isLoading,...
  // mình lấy các key ra và tự đặt lại tên (để tránh bị trùng )
  //===================================================================
  const {
    data: categoriesData,
    isLoading: isCategoryLoading, // Đổi tên cho dễ phân biệt
    isError: isCategoryError,
  } = useGetAllCategories();

  // mảng rỗng đề phòng lỗi khi server sập
  const categories = categoriesData || [];

  // ========== các hàm này thay cho việc dùng setState ==========
  const { mutate: addCategory } = useAddCategory();
  const { mutate: updateCategory } = useUpdateCategory();
  const { mutate: deleteCategory } = useDeleteCategory();

  // giữ nguyên các state UI
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
  const itemsPerPage = 5;

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
  const totalPages = Math.ceil(filteredCategories.length / itemsPerPage) || 1;
  const startIndex = (currentPage - 1) * itemsPerPage;
  const displayedCategories = filteredCategories.slice(
    startIndex,
    startIndex + itemsPerPage
  );

  // ====== Hàm add mới dùng react query ========
  const handleAddCategory = (e) => {
    e.preventDefault();
    addCategory(
      {
        name: newCategory.name,
        description: newCategory.description,
        image:
          newCategory.thumbnail ||
          `https://ui-avatars.com/api/?name=${newCategory.name}&background=random`,
      },
      {
        onSuccess: () => {
          showNotification("Thêm thể loại thành công!");
          setNewCategory({ name: "", description: "", thumbnail: "" });
          setShowAddForm(false);
        },
        onError: (error) => {
          showNotification(error.response?.data?.message || "Lỗi khi thêm!");
        },
      }
    );
  };

  //=== hàm delete mới =======
  const handleDelete = () => {
    if (!selectedCategory) return;
    deleteCategory(selectedCategory._id, {
      onSuccess: () => {
        showNotification("Xóa thể loại thành công!");
        setShowDeleteModal(false);
      },
      onError: (error) => {
        showNotification(error.response?.data?.message || "Không thể xóa!");
        setShowDeleteModal(false);
      },
    });
  };

  //==== hàm edit mới ======
  const handleEditSave = (e) => {
    e.preventDefault();
    if (!selectedCategory) return;
    updateCategory(
      {
        id: selectedCategory._id, // ID để tìm, mongoDB xài _id chứ ko phải id
        data: {
          name: selectedCategory.name,
          description: selectedCategory.description,
          image: selectedCategory.thumbnail,
        },
      },
      {
        onSuccess: () => {
          showNotification("Cập nhật thành công!");
          setShowEditForm(false);
        },
        onError: (error) => {
          showNotification(error.response?.data?.message || "Lỗi cập nhật!");
        },
      }
    );
  };

  useEffect(() => {
    if (showAddForm || showEditForm || showDeleteModal)
      document.body.style.overflow = "hidden";
    else document.body.style.overflow = "auto";
  }, [showAddForm, showEditForm, showDeleteModal]);

  // === XỬ LÝ LOADING ===
  if (isCategoryLoading)
    return <div className="loading-text">⏳ Đang tải dữ liệu...</div>;
  if (isCategoryError)
    return <div className="error-text">❌ Lỗi tải trang!</div>;

  const getShortCode = (name) => {
    if (!name) return "N/A";

    const cleanName = name.trim();
    const words = cleanName.split(" ");

    // Trường hợp 1: Tên nhiều từ (VD: Slice of Life) -> Lấy ký tự đầu (SOL)
    if (words.length > 1) {
      return words
        .map((w) => w[0])
        .join("")
        .substring(0, 3)
        .toUpperCase();
    }
    // Trường hợp 2: Tên 1 từ (VD: Technology) -> Lấy 3 chữ đầu (TEC)
    return cleanName.substring(0, 3).toUpperCase();
  };

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
            <th>Mô tả</th>
            <th>Hành động</th>
          </tr>
        </thead>
        <tbody>
          {displayedCategories.map((cat) => (
            <tr key={cat._id} className="row-hover">
              <td>
                <div
                  style={{ display: "flex", alignItems: "center", gap: "10px" }}
                >
                  <img
                    src={
                      cat.image ||
                      cat.thumbnail ||
                      "https://via.placeholder.com/60"
                    }
                    alt={cat.name}
                    className="thumb"
                  />
                  <span>{cat.name}</span>
                </div>
              </td>
              <td>
                <span>{getShortCode(cat.name)}</span>
              </td>
              <td>{cat.count || 0}</td>
              <td>{cat.description}</td>
              <td>
                <button
                  className="btn-edit"
                  onClick={() => {
                    setSelectedCategory({ ...cat, thumbnail: cat.image });
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
              <td colSpan="5" className="no-data">
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
                  setNewCategory({
                    ...newCategory,
                    description: e.target.value,
                  })
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
              <input type="text" value={selectedCategory._id} readOnly />
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

      {notification && (
        <div className="notification pop-up">{notification}</div>
      )}
    </div>
  );
};

export default ManageCategories;
