import "./Topbar.css";
import { Link } from "react-router-dom";
import { useState, useEffect, useRef } from "react";
import useLogout from "../hooks/useLogout";
import { FaBell, FaUserCircle, FaSignOutAlt } from "react-icons/fa";

import { useAuth } from "../context/AuthContext";
export default function Topbar() {
  const { user } = useAuth();
  const [profileDropDown, setProfileDropDown] = useState(false);
  const handleLogout = useLogout();

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

  return (
    <div className="topbar-container">
      <div className="topbar-left">
        <h2 className="page-title"> </h2>
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
            <FaUserCircle className="profile-avt-icon" size={32} color="#555" />
            <span className="profile-name">{user?.username || "Admin"}</span>
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
