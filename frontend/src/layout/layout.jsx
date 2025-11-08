import { useState } from "react";
import { Outlet } from "react-router-dom";
import Sidebar from "./Sidebar";
import Topbar from "./Topbar";
import "./Layout.css";
export default function Layout() {
  function toggleSidebar() {
    setIsCollapsed(!isCollapsed);
  }
  const [isCollapsed, setIsCollapsed] = useState(false);
  return (
    <div className={`container ${isCollapsed ? "sidebar-collapsed" : ""}`}>
      <Sidebar isCollapsed={isCollapsed} toggleSidebar={toggleSidebar} />

      <div className="main-wrapper">
        <Topbar />

        <main className="content">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
