import { Outlet } from "react-router-dom";
import Sidebar from "./Sidebar";

const Layout = () => {
  return (
    <div className="layout">
      <Sidebar />
      <main className="main-content">
        <div className="top-navbar">
          <h1 className="page-title">Dashboard</h1>
          <div className="user-info">
            <span>A</span>
            <div className="user-avatar">A</div>
          </div>
        </div>
        <Outlet />
      </main>
    </div>
  );
};

export default Layout;
