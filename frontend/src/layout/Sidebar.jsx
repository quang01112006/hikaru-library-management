import "./Sidebar.css";
import useLogout from "../hooks/useLogout";
import { NavLink } from "react-router-dom";
import {
  TbLayoutSidebarLeftCollapse,
  TbLayoutSidebarLeftExpand,
} from "react-icons/tb";
import {
  FiHome,
  FiBookOpen,
  FiCheckSquare,
  FiPieChart,
  FiUsers,
  FiBook,
  FiLogOut,
} from "react-icons/fi";
import logo from "../assets/images/hikaru-logo.png";
const menuItems = [
  { path: "/", name: "Trang Chủ", icon: <FiHome /> },
  { path: "/return-borrow", name: "Mượn & Trả", icon: <FiCheckSquare /> },
  { path: "/manage/books", name: "Quản Lý Sách", icon: <FiBookOpen /> },
  { path: "/manage/categories", name: "Quản Lý Thể Loại", icon: <FiBook /> },
  { path: "/manage/readers", name: "Quản Lý Bạn Đọc", icon: <FiUsers /> },
  { path: "/stats", name: "Thống Kê", icon: <FiPieChart /> },
  { path: "/manage/users", name: "Quản lý nhân viên", icon: <FiUsers /> },
];
export default function Sidebar({ isCollapsed, toggleSidebar }) {
  const handleLogout = useLogout();
  return (
    <div className="sidebar-container">
      {/*=========== logo + button========== */}
      <div className="sidebar-header">
        <div className="logo-text">
          <img src={logo} alt="logo" />{" "}
        </div>
        <button className="toggle-btn" onClick={toggleSidebar}>
          {isCollapsed ? (
            <TbLayoutSidebarLeftExpand />
          ) : (
            <TbLayoutSidebarLeftCollapse />
          )}
        </button>
      </div>

      {/*======== main menu =========== */}

      {menuItems.map((item) => (
        <NavLink
          key={item.path}
          to={item.path}
          className={({ isActive }) =>
            isActive ? "menu-item active" : "menu-item"
          }
        >
          <div className="menu-icon">{item.icon}</div>
          <div className="menu-text">{item.name}</div>
        </NavLink>
      ))}
      {/*======= log out ==========  */}
      <button className="menu-item logout-link" onClick={handleLogout}>
        <FiLogOut className="menu-icon" />
        <span className="menu-text">Logout</span>
      </button>
    </div>
  );
}
