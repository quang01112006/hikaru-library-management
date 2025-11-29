import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import Button from "../../components/button/Button";
import logo from "../../assets/images/hikaru-logo.png";
import {
  FaUser,
  FaEnvelope,
  FaPhone,
  FaLock,
  FaEye,
  FaEyeSlash,
} from "react-icons/fa";

import "./Login.css"; // Dùng chung file CSS với Login

// Import Hook & Context
import { useRegisterReader } from "../../hooks/useReader";
import { useAuth } from "../../context/AuthContext";

export default function Register() {
  const navigate = useNavigate();
  const { dispatch } = useAuth();

  const { mutate: register, isPending, isError, error } = useRegisterReader();

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    password: "",
    confirmPassword: "",
  });

  const [showPass, setShowPass] = useState(false);
  const [showConfirmPass, setShowConfirmPass] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (formData.password !== formData.confirmPassword) {
      alert("Mật khẩu xác nhận không khớp!");
      return;
    }

    register(
      {
        name: formData.name,
        email: formData.email,
        phone: formData.phone,
        password: formData.password,
      },
      {
        onSuccess: (data) => {
          console.log("Đăng ký thành công:", data);

          dispatch({ type: "LOGIN_SUCCESS", payload: data });

          alert(`Đăng ký thành công`);
        },
        onError: (err) => {
          console.error(err);
        },
      }
    );
  };

  return (
    <div className="login-page">
      <div className="login-container">
        {/* CỘT TRÁI: FORM */}
        <div className="login-container-left">
          <h2>ĐĂNG KÝ</h2>
          <p>Tạo tài khoản bạn đọc mới để mượn sách.</p>

          {/* Hiển thị lỗi từ Backend */}
          {isError && (
            <p style={{ color: "red", fontSize: "14px", marginBottom: "10px" }}>
              {error?.response?.data?.message || "Đăng ký thất bại!"}
            </p>
          )}

          <form className="login-form" onSubmit={handleSubmit}>
            {/* --- HỌ TÊN --- */}
            <div className="input-box">
              <input
                type="text"
                required
                placeholder=" "
                name="name"
                value={formData.name}
                onChange={handleChange}
              />
              <label>Họ và tên</label>
              <FaUser className="icon-user" />
            </div>

            {/* --- EMAIL --- */}
            <div className="input-box">
              <input
                type="email"
                required
                placeholder=" "
                name="email"
                value={formData.email}
                onChange={handleChange}
              />
              <label>Email</label>
              <FaEnvelope className="icon-user" />
            </div>

            {/* --- SĐT --- */}
            <div className="input-box">
              <input
                type="tel"
                required
                placeholder=" "
                name="phone"
                value={formData.phone}
                onChange={handleChange}
              />
              <label>Số điện thoại</label>
              <FaPhone className="icon-user" />
            </div>

            {/* --- MẬT KHẨU --- */}
            <div className="input-box">
              <input
                type={showPass ? "text" : "password"}
                required
                placeholder=" "
                name="password"
                value={formData.password}
                onChange={handleChange}
              />
              <label>Mật khẩu</label>
              <div className="icon-eye" onClick={() => setShowPass(!showPass)}>
                {showPass ? <FaEyeSlash /> : <FaEye />}
              </div>
            </div>

            {/* --- NHẬP LẠI MẬT KHẨU --- */}
            <div className="input-box">
              <input
                type={showConfirmPass ? "text" : "password"}
                required
                placeholder=" "
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleChange}
              />
              <label>Nhập lại mật khẩu</label>
              <div
                className="icon-eye"
                onClick={() => setShowConfirmPass(!showConfirmPass)}
              >
                {showConfirmPass ? <FaEyeSlash /> : <FaEye />}
              </div>
            </div>

            {/* Nút Submit */}
            <Button
              type="submit"
              className="login-button"
              btnName={isPending ? "Đang xử lý..." : "Đăng Ký Ngay"}
              disabled={isPending}
            />

            {/* Link quay lại Login */}
            <div
              style={{
                marginTop: 20,
                textAlign: "center",
                fontSize: 14,
                color: "var(--n-500)",
              }}
            >
              Đã có tài khoản?{" "}
              <Link
                to="/login"
                style={{
                  color: "var(--p-500)",
                  fontWeight: "bold",
                  textDecoration: "none",
                }}
              >
                Đăng nhập ngay
              </Link>
            </div>
          </form>
        </div>

        {/* CỘT PHẢI */}
        <div className="login-container-right">
          <div className="brand-content">
            <img src={logo} alt="logo" className="login-logo-img" />
          </div>
        </div>
      </div>
    </div>
  );
}
