import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import "./AddBook.css";

// 1. IMPORT HOOKS XỊN
import { useAddBook, useUpdateBook, useGetBookById } from "../../hooks/useBook";
import { useGetAllCategories } from "../../hooks/useCategory";

export default function BookForm() {
  const { id } = useParams(); // Lấy ID từ URL (nếu đang Edit)
  const navigate = useNavigate();
  const isEditMode = Boolean(id);

  // 2. GỌI HOOK LẤY DỮ LIỆU (Khi Edit)
  const { data: bookData, isLoading: isLoadingBook } = useGetBookById(id);

  // 3. GỌI HOOK LẤY DANH MỤC (Để đổ vào Select Box)
  const { data: categoriesData } = useGetAllCategories();
  const categories = categoriesData || [];

  // 4. GỌI HOOK HÀNH ĐỘNG
  const { mutate: addBook, isPending: isAdding } = useAddBook();
  const { mutate: updateBook, isPending: isUpdating } = useUpdateBook();

  const isSubmitting = isAdding || isUpdating;

  const [formData, setFormData] = useState({
    title: "",
    author: "",
    bookCode: "",
    quantity: 1, // BE dùng 'quantity'
    // availableQuantity: BE tự tính, ko cần gửi lên trừ khi muốn sửa tay
    genre: "", // BE dùng 'genre' (ObjectId)
    description: "",
    image: "", // Thêm trường ảnh
  });

  const [errors, setErrors] = useState({});

  // --- EFFECT: ĐIỀN DỮ LIỆU KHI EDIT ---
  useEffect(() => {
    if (isEditMode && bookData) {
      // Map dữ liệu từ API vào Form
      setFormData({
        title: bookData.title || "",
        author: bookData.author || "",
        bookCode: bookData.bookCode || "",
        quantity: bookData.quantity || 1,
        genre: bookData.genre?._id || bookData.genre || "", // Lấy ID thể loại
        description: bookData.description || "",
        image: bookData.image || "",
      });
    }
  }, [isEditMode, bookData]);

  // --- XỬ LÝ UPLOAD ẢNH (Base64) ---
  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onloadend = () => {
      setFormData({ ...formData, image: reader.result });
    };
    reader.readAsDataURL(file);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: name === "quantity" ? parseInt(value) || 0 : value,
    });

    // Xóa lỗi khi gõ
    if (errors[name]) {
      setErrors({ ...errors, [name]: "" });
    }
  };

  // Validate
  const validateForm = () => {
    const newErrors = {};
    if (!formData.title.trim()) newErrors.title = "Tên sách bắt buộc";
    if (!formData.author.trim()) newErrors.author = "Tác giả bắt buộc";
    if (!formData.bookCode.trim()) newErrors.bookCode = "Mã sách bắt buộc";
    if (formData.quantity < 1) newErrors.quantity = "Số lượng phải > 0";
    if (!formData.genre) newErrors.genre = "Vui lòng chọn thể loại";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    // Chuẩn bị payload gửi đi
    const payload = {
      ...formData,
      // Nếu không chọn ảnh, dùng ảnh mặc định
      image:
        formData.image ||
        `https://ui-avatars.com/api/?name=${formData.title}&background=random&color=fff&size=128`,
    };

    if (isEditMode) {
      // --- GỌI API UPDATE ---
      updateBook(
        { id, data: payload },
        {
          onSuccess: () => {
            alert("Cập nhật thành công!");
            navigate("/manage/books"); // Quay về danh sách (ko cần reload)
          },
          onError: (err) => alert("Lỗi: " + err.response?.data?.message),
        }
      );
    } else {
      // --- GỌI API ADD ---
      addBook(payload, {
        onSuccess: () => {
          alert("Thêm sách thành công!");
          navigate("/manage/books");
        },
        onError: (err) => alert("Lỗi: " + err.response?.data?.message),
      });
    }
  };

  if (isEditMode && isLoadingBook) return <div>Đang tải thông tin sách...</div>;

  return (
    <div className="book-form-page">
      <div className="form-header">
        <h1>{isEditMode ? "Chỉnh Sửa Sách" : "Thêm Sách Mới"}</h1>
        <button className="back-btn" onClick={() => navigate("/manage/books")}>
          ← Quay lại
        </button>
      </div>

      <form onSubmit={handleSubmit} className="book-form">
        <div className="form-row">
          <div className="form-group">
            <label htmlFor="title">Tên sách *</label>
            <input
              type="text"
              id="title"
              name="title"
              value={formData.title}
              onChange={handleChange}
              className={errors.title ? "error" : ""}
              placeholder="Nhập tên sách"
            />
            {errors.title && (
              <span className="error-message">{errors.title}</span>
            )}
          </div>

          <div className="form-group">
            <label htmlFor="author">Tác giả *</label>
            <input
              type="text"
              id="author"
              name="author"
              value={formData.author}
              onChange={handleChange}
              className={errors.author ? "error" : ""}
              placeholder="Nhập tên tác giả"
            />
            {errors.author && (
              <span className="error-message">{errors.author}</span>
            )}
          </div>
        </div>

        <div className="form-row">
          <div className="form-group">
            <label htmlFor="genre">Thể loại *</label>
            <select
              id="genre"
              name="genre"
              value={formData.genre}
              onChange={handleChange}
              className={errors.genre ? "error" : ""}
            >
              <option value="">-- Chọn thể loại --</option>

              {categories.map((cat) => (
                <option key={cat._id} value={cat._id}>
                  {cat.name}
                </option>
              ))}
            </select>
            {errors.genre && (
              <span className="error-message">{errors.genre}</span>
            )}
          </div>
        </div>

        <div className="form-row">
          <div className="form-group">
            <label htmlFor="quantity">Tổng số lượng *</label>
            <input
              type="number"
              id="quantity"
              name="quantity"
              value={formData.quantity}
              onChange={handleChange}
              className={errors.quantity ? "error" : ""}
              min="1"
            />
            {errors.quantity && (
              <span className="error-message">{errors.quantity}</span>
            )}
          </div>

          <div className="form-group">
            <label>Ảnh bìa:</label>
            <input type="file" accept="image/*" onChange={handleImageUpload} />
            {formData.image && (
              <img
                src={formData.image}
                alt="Preview"
                style={{ width: 60, marginTop: 10 }}
              />
            )}
          </div>
        </div>

        <div className="form-group full-width">
          <label htmlFor="description">Mô tả</label>
          <textarea
            id="description"
            name="description"
            value={formData.description}
            onChange={handleChange}
            placeholder="Nhập mô tả..."
            rows="4"
          />
        </div>

        <div className="form-actions">
          <button
            type="button"
            className="cancel-btn"
            onClick={() => navigate("/manage/books")}
          >
            Hủy
          </button>
          <button type="submit" className="submit-btn" disabled={isSubmitting}>
            {isSubmitting
              ? "Đang lưu..."
              : isEditMode
              ? "Cập nhật"
              : "Thêm sách"}
          </button>
        </div>
      </form>
    </div>
  );
}
