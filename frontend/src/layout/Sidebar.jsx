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
const menuItems = [
  { path: "/", name: "Home", icon: <FiHome /> },
  { path: "/return-borrow", name: "Return & Borrow", icon: <FiCheckSquare /> },
  { path: "/manage/books", name: "Manage Books", icon: <FiBookOpen /> },
  { path: "/manage/categories", name: "Manage Categories", icon: <FiBook /> },
  { path: "/manage/readers", name: "Manage Readers", icon: <FiUsers /> },
  // { path: "/stats/users", name: "Thống kê người mượn", icon: <FiUsers /> },
  { path: "/stats", name: "Statistics", icon: <FiPieChart /> },
];
export default function Sidebar({ isCollapsed, toggleSidebar }) {
  const handleLogout = useLogout();
  return (
    <div className="sidebar-container">
      {/*=========== logo + button========== */}
      <div className="sidebar-header">
        <div className="logo-text">Logo</div>
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
