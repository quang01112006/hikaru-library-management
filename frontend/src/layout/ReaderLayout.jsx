import { Outlet, NavLink, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import "./ReaderLayout.css";
import logo from "../assets/images/hikaru-logo.png";

const ReaderLayout = () => {
  const { user } = useAuth();

  const navigate = useNavigate();

  const handleLogout = useLogout();

  return (
    <div className="reader-layout">
      {/* --- NAVBAR --- */}
      <header className="reader-header">
        <div className="logo-wrapper">
          <img src={logo} alt="logo" className="logo" />
        </div>

        <nav className="reader-nav">
          <NavLink to="/library" className="nav-link" end>
            Trang chủ
          </NavLink>

          <NavLink to="/library/my-history" className="nav-link">
            Lịch sử mượn
          </NavLink>
        </nav>

        <div className="user-actions">
          <strong>{user?.username || "Bạn đọc"}</strong>

          <button onClick={handleLogout} className="btn-logout-text">
            Đăng xuất
          </button>
        </div>
      </header>

      <main className="reader-content">
        <Outlet />
      </main>
    </div>
  );
};

export default ReaderLayout;
