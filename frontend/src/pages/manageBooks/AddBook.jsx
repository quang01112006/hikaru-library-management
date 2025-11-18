import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import "./AddBook.css";

export default function BookForm() {
  const { id } = useParams();
  const navigate = useNavigate();
  const isEditMode = Boolean(id);

  const [formData, setFormData] = useState({
    title: "",
    author: "",
    code: "",
    totalQuantity: 1,
    availableQuantity: 1,
    category: "",
    description: ""
  });

  const [errors, setErrors] = useState({});

  // Hàm tìm mã sách tiếp theo
  const getNextAvailableCode = (existingBooks) => {
    const existingCodes = existingBooks.map(book => book.code);
    
    for (let i = 1; i <= 999; i++) {
      const potentialCode = `B${String(i).padStart(3, '0')}`;
      if (!existingCodes.includes(potentialCode)) {
        return potentialCode;
      }
    }
    
    return `B${String(existingBooks.length + 1).padStart(3, '0')}`;
  };

  useEffect(() => {
    if (isEditMode) {
      const savedBooks = JSON.parse(localStorage.getItem('libraryBooks') || '[]');
      const bookToEdit = savedBooks.find(book => book.id === parseInt(id));
      if (bookToEdit) {
        setFormData(bookToEdit);
      }
    } else {
      const savedBooks = JSON.parse(localStorage.getItem('libraryBooks') || '[]');
      const nextCode = getNextAvailableCode(savedBooks);
      setFormData(prev => ({ 
        ...prev, 
        code: nextCode,
        totalQuantity: 1,
        availableQuantity: 1 
      }));
    }
  }, [id, isEditMode]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    
    setFormData(prev => {
      const newFormData = {
        ...prev,
        [name]: name.includes('Quantity') ? parseInt(value) || 0 : value
      };
      
      if (name === 'totalQuantity') {
        const total = parseInt(value) || 0;
        const available = Math.min(prev.availableQuantity, total);
        newFormData.availableQuantity = available;
      }
      
      return newFormData;
    });
    
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ""
      }));
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.title.trim()) {
      newErrors.title = "Tên sách không được để trống";
    }

    if (!formData.author.trim()) {
      newErrors.author = "Tác giả không được để trống";
    }

    if (!formData.code.trim()) {
      newErrors.code = "Mã sách không được để trống";
    }

    // Kiểm tra mã sách trùng (chỉ khi thêm mới)
    if (!isEditMode) {
      const savedBooks = JSON.parse(localStorage.getItem('libraryBooks') || '[]');
      const isCodeDuplicate = savedBooks.some(book => book.code === formData.code);
      if (isCodeDuplicate) {
        newErrors.code = "Mã sách đã tồn tại";
      }
    }

    if (formData.totalQuantity < 1) {
      newErrors.totalQuantity = "Tổng số lượng phải lớn hơn 0";
    }

    if (formData.availableQuantity < 0) {
      newErrors.availableQuantity = "Số lượng còn lại không được âm";
    }

    if (formData.availableQuantity > formData.totalQuantity) {
      newErrors.availableQuantity = "Số lượng còn lại không được lớn hơn tổng số lượng";
    }

    if (!formData.category.trim()) {
      newErrors.category = "Thể loại không được để trống";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (validateForm()) {
      const savedBooks = JSON.parse(localStorage.getItem('libraryBooks') || '[]');
      
      if (isEditMode) {
        const updatedBooks = savedBooks.map(book => 
          book.id === parseInt(id) ? { ...formData, id: parseInt(id) } : book
        );
        localStorage.setItem('libraryBooks', JSON.stringify(updatedBooks));
      } else {
        const newBook = {
          ...formData,
          id: Date.now(),
        };
        const updatedBooks = [...savedBooks, newBook];
        localStorage.setItem('libraryBooks', JSON.stringify(updatedBooks));
      }
      
      alert(isEditMode ? "Cập nhật sách thành công!" : "Thêm sách thành công!");
      
      // Force reload bằng cách truyền state
      navigate("/manage/books", { state: { timestamp: Date.now() } });
    }
  };

  const handleCancel = () => {
    navigate("/manage/books");
  };

  return (
    <div className="book-form-page">
      <div className="form-header">
        <h1>{isEditMode ? "Chỉnh Sửa Sách" : "Thêm Sách Mới"}</h1>
        <button className="back-btn" onClick={handleCancel}>
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
            {errors.title && <span className="error-message">{errors.title}</span>}
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
            {errors.author && <span className="error-message">{errors.author}</span>}
          </div>
        </div>

        <div className="form-row">
          <div className="form-group">
            <label htmlFor="code">Mã sách *</label>
            <input
              type="text"
              id="code"
              name="code"
              value={formData.code}
              onChange={handleChange}
              className={errors.code ? "error" : ""}
              placeholder="Nhập mã sách"
              disabled={isEditMode}
            />
            {errors.code && <span className="error-message">{errors.code}</span>}
          </div>

          <div className="form-group">
            <label htmlFor="category">Thể loại *</label>
            <select
              id="category"
              name="category"
              value={formData.category}
              onChange={handleChange}
              className={errors.category ? "error" : ""}
            >
              <option value="">Chọn thể loại</option>
              <option value="Văn học">Văn học</option>
              <option value="Khoa học">Khoa học</option>
              <option value="Kỹ năng">Kỹ năng</option>
              <option value="Lịch sử">Lịch sử</option>
              <option value="Kinh tế">Kinh tế</option>
              <option value="Thiếu nhi">Thiếu nhi</option>
              <option value="Trinh thám">Trinh thám</option>
              <option value="Fantasy">Fantasy</option>
              <option value="Khoa học viễn tưởng">Khoa học viễn tưởng</option>
            </select>
            {errors.category && <span className="error-message">{errors.category}</span>}
          </div>
        </div>

        <div className="form-row">
          <div className="form-group">
            <label htmlFor="totalQuantity">Tổng số lượng *</label>
            <input
              type="number"
              id="totalQuantity"
              name="totalQuantity"
              value={formData.totalQuantity}
              onChange={handleChange}
              className={errors.totalQuantity ? "error" : ""}
              placeholder="Tổng số sách"
              min="1"
            />
            {errors.totalQuantity && <span className="error-message">{errors.totalQuantity}</span>}
          </div>

          <div className="form-group">
            <label htmlFor="availableQuantity">Số lượng còn lại *</label>
            <input
              type="number"
              id="availableQuantity"
              name="availableQuantity"
              value={formData.availableQuantity}
              onChange={handleChange}
              className={errors.availableQuantity ? "error" : ""}
              placeholder="Số sách có sẵn"
              min="0"
              max={formData.totalQuantity}
            />
            {errors.availableQuantity && <span className="error-message">{errors.availableQuantity}</span>}
          </div>
        </div>

        <div className="form-group full-width">
          <label htmlFor="description">Mô tả</label>
          <textarea
            id="description"
            name="description"
            value={formData.description}
            onChange={handleChange}
            placeholder="Nhập mô tả về sách"
            rows="4"
          />
        </div>

        <div className="form-actions">
          <button type="button" className="cancel-btn" onClick={handleCancel}>
            Hủy
          </button>
          <button type="submit" className="submit-btn">
            {isEditMode ? "Cập nhật" : "Thêm sách"}
          </button>
        </div>
      </form>
    </div>
  );
}