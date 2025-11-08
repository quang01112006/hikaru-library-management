import { useState } from "react";
import Button from "../../components/button/Button";
import { Link } from "react-router-dom";
import { FaUser, FaEye, FaEyeSlash } from "react-icons/fa";
import "./Login.css";

export default function Login() {
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);
  const togglePasswordVisibility = () => {
    setIsPasswordVisible(!isPasswordVisible);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
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
              btnName="Đăng nhập"
            />
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
