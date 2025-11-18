import { useState } from "react";
import Button from "../../components/button/Button";
import { Link, useNavigate } from "react-router-dom";
import { FaUser, FaEye, FaEyeSlash } from "react-icons/fa";
import "./Login.css";
import { useLogin } from "../../hooks/useUser";
import { useAuth } from "../../context/AuthContext";

export default function Login() {
  //ẩn hiện pass
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);
  const togglePasswordVisibility = () => {
    setIsPasswordVisible(!isPasswordVisible);
  };
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();
  const { mutate: login, isError, error, isPending } = useLogin();
  const { dispatch } = useAuth();
  const handleSubmit = (e) => {
    e.preventDefault();
    login(
      { username, password },
      {
        onSuccess: (data) => {
          console.log("login xong", data);
          dispatch({ type: "LOGIN_SUCCESS", payload: data });
          navigate("/");
        },
        onError: (err) => {
          console.log("Login thất bại:", err);
        },
      }
    );
    console.log("Form submitted!");
  };

  return (
    <div className="login-page">
      <div className="login-container">
        {/* Login Form */}
        <div className="login-container-left">
          <h2>LOGIN</h2>
          <p>Welcome back! Please enter your details.</p>

          <form className="login-form" onSubmit={handleSubmit}>
            <div className="input-box">
              <input
                type="text"
                required
                placeholder=" "
                id="username"
                name="username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
              />
              <label htmlFor="username">Username</label>
              <FaUser className="icon-user" />
            </div>

            <div className="input-box">
              <input
                type={isPasswordVisible ? "text" : "password"}
                required
                placeholder=" "
                id="password"
                name="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
              <label htmlFor="password">Password</label>
              <div className="icon-eye" onClick={togglePasswordVisibility}>
                {isPasswordVisible ? <FaEyeSlash /> : <FaEye />}
              </div>
            </div>
            <Link to="/forgot-password" className="forgot-password">
              Quên mật khẩu?
            </Link>

            <Button
              type="submit"
              className="login-button"
              // btnName="Đăng nhập"
              btnName={isPending ? "Đang xử lý..." : "Đăng nhập"}
              disabled={isPending}
            />
            {isError && (
              <p
                style={{ color: "red", fontSize: "14px", marginBottom: "10px" }}
              >
                {error?.response?.data?.message || "Đăng nhập thất bại!"}
              </p>
            )}
          </form>
        </div>

        {/* Brand Name  */}
        <div className="login-container-right">
          <div className="brand-content">
            {/* <img src={YourLogo} alt="Logo" className="brand-logo" /> */}
            <h1 className="brand-logo">Hi</h1>
            <p>Quản lý Thư viện</p>
          </div>
        </div>
      </div>
    </div>
  );
}
