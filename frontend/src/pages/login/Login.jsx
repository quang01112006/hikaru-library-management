import { useState } from "react";
import Button from "../../components/button/Button";
import { Link, useNavigate } from "react-router-dom";
import { FaUser, FaEye, FaEyeSlash, FaEnvelope } from "react-icons/fa";
import "./Login.css";
import logo from "../../assets/images/hikaru-logo.png";

import { useLogin } from "../../hooks/useUser";
import { useLoginReader } from "../../hooks/useReader";
import { useAuth } from "../../context/AuthContext";

export default function Login() {
  const navigate = useNavigate();
  const { dispatch } = useAuth();

  const [isReaderMode, setIsReaderMode] = useState(() => {
    return localStorage.getItem("lastLoginMode") === "reader";
  });

  const [isPasswordVisible, setIsPasswordVisible] = useState(false);
  const [identifier, setIdentifier] = useState(""); // Dùng chung cho Username và Email
  const [password, setPassword] = useState("");

  const { mutate: loginAdmin, isPending: loadingAdmin } = useLogin();
  const { mutate: loginReader, isPending: loadingReader } = useLoginReader();

  const isPending = loadingAdmin || loadingReader;

  const togglePasswordVisibility = () => {
    setIsPasswordVisible(!isPasswordVisible);
  };

  const handleSuccess = (data) => {
    localStorage.setItem("token", data.token);
    localStorage.setItem("user", JSON.stringify(data.user));
    dispatch({ type: "LOGIN_SUCCESS", payload: data });
    if (data.user.role === "reader") {
      navigate("/library");
    } else {
      navigate("/dashboard");
    }
  };

  const handleError = (err) => {
    console.log("Login failed:", err);
    alert(err.response?.data?.message || "Đăng nhập thất bại");
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (isReaderMode) {
      loginReader(
        { email: identifier, password },
        { onSuccess: handleSuccess, onError: handleError }
      );
    } else {
      loginAdmin(
        { username: identifier, password },
        { onSuccess: handleSuccess, onError: handleError }
      );
    }
  };

  return (
    <div className="login-page">
      <div className="login-container">
        <div className="login-container-left">
          {/* --- TAB CHUYỂN ĐỔI --- */}
          <div className="login-tabs">
            <div
              className={`tab ${!isReaderMode ? "active" : ""}`}
              onClick={() => {
                setIsReaderMode(false);
                setIdentifier("");
                localStorage.setItem("lastLoginMode", "admin");
              }}
            >
              Admin
            </div>
            <div
              className={`tab ${isReaderMode ? "active" : ""}`}
              onClick={() => {
                setIsReaderMode(true);
                setIdentifier("");
                localStorage.setItem("lastLoginMode", "reader");
              }}
            >
              Reader
            </div>
          </div>

          <p>Vui lòng đăng nhập để tiếp tục.</p>

          <form className="login-form" onSubmit={handleSubmit}>
            <div className="input-box">
              <input
                type={isReaderMode ? "email" : "text"}
                required
                placeholder=" "
                value={identifier}
                onChange={(e) => setIdentifier(e.target.value)}
              />

              <label>{isReaderMode ? "Email đăng ký" : "Tên đăng nhập"}</label>
              {isReaderMode ? (
                <FaEnvelope className="icon-user" />
              ) : (
                <FaUser className="icon-user" />
              )}
            </div>

            <div className="input-box">
              <input
                type={isPasswordVisible ? "text" : "password"}
                required
                placeholder=" "
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
              <label>Mật khẩu</label>
              <div className="icon-eye" onClick={togglePasswordVisibility}>
                {isPasswordVisible ? <FaEyeSlash /> : <FaEye />}
              </div>
            </div>

            <Link
              to="/forgot-password"
              style={{
                display: "block",
                textAlign: "right",
                marginBottom: 20,
                fontSize: 14,
                color: "#116ea3ff",
              }}
            >
              Quên mật khẩu?
            </Link>

            <Button
              type="submit"
              className="login-button"
              btnName={isPending ? "Đang xử lý..." : "Đăng nhập"}
              disabled={isPending}
            />

            {/* Link đăng ký cho bạn đọc */}
            {isReaderMode && (
              <div style={{ marginTop: 15, textAlign: "center", fontSize: 14 }}>
                Chưa có tài khoản?{" "}
                <Link to="/register" style={{ color: "#131f18ff" }}>
                  Đăng ký ngay
                </Link>
              </div>
            )}
          </form>
        </div>

        <div className="login-container-right">
          <div className="brand-content">
            <img src={logo} alt="logo" className="login-logo-img" />
          </div>
        </div>
      </div>
    </div>
  );
}
