import "./Topbar.css";
import { Link } from "react-router-dom";
import { useState, useEffect, useRef } from "react";
import useLogout from "../utils/logout";
import { FaBell, FaUserCircle, FaSignOutAlt } from "react-icons/fa";
import { useLocation } from "react-router-dom";
export default function Topbar() {
  const [profileDropDown, setProfileDropDown] = useState(false);
  const handleLogout = useLogout();
  const location = useLocation();
  const currentPath = location.pathname;
  const dropdownRef = useRef(null);
  useEffect(() => {
    function handleClickOutside(e) {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setProfileDropDown(false);
      }
    }
    if (profileDropDown) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [profileDropDown]);
  let currentPageTitle = "Home";
  switch (currentPath) {
    case "/":
      currentPageTitle = "Home";
      break;
    case "/books":
      currentPageTitle = "Manage Books";
      break;
  }
  return (
    <div className="topbar-container">
      <div className="topbar-left">
        <h2 className="page-title">{currentPageTitle}</h2>
      </div>
      <div className="topbar-right">
        <div className="topbar-icon-wrapper">
          <FaBell className="noti-icon" />
          <span className="noti-badge">99</span>
        </div>

        <div className="profile-container" ref={dropdownRef}>
          <div
            className="profile-wrapper"
            onClick={() => setProfileDropDown(!profileDropDown)}
          >
            <img src="hta" alt="anh" className="profile-avt" />
            <span className="profile-name">NCQ</span>
          </div>

          {profileDropDown && (
            <div className="profile-dropdown">
              <Link to="/profile" className="dropdown-item">
                <FaUserCircle />
                Profile
              </Link>
              <button onClick={handleLogout} className="dropdown-item">
                <FaSignOutAlt />
                Logout
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
