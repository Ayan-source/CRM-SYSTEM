import { Outlet, NavLink, useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";

const getPageTitle = (pathname: string) => {
  if (pathname === "/") return "Dashboard";
  if (pathname.startsWith("/customers")) return "Customers";
  if (pathname.startsWith("/leads")) return "Leads";
  if (pathname.startsWith("/inbox")) return "Inbox";
  return "CRM";
};

const Sidebar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <aside className="sidebar">
      <div className="sidebar-logo">
        <h2>CRM</h2>
      </div>
      <ul className="sidebar-nav">
        <li>
          <NavLink to="/" end className={({ isActive }) => (isActive ? "active" : "")}>
            Dashboard
          </NavLink>
        </li>
        <li>
          <NavLink to="/customers" className={({ isActive }) => (isActive ? "active" : "")}>
            Customers
          </NavLink>
        </li>
        <li>
          <NavLink to="/leads" className={({ isActive }) => (isActive ? "active" : "")}>
            Leads
          </NavLink>
        </li>
        <li>
          <NavLink to="/inbox" className={({ isActive }) => (isActive ? "active" : "")}>
            Inbox
          </NavLink>
        </li>
      </ul>
      <div style={{ position: "absolute", bottom: "20px", left: "20px", right: "20px" }}>
        <div style={{ color: "#aaa", marginBottom: "10px", fontSize: "12px" }}>
          {user?.name} ({user?.role})
        </div>
        <button
          onClick={handleLogout}
          style={{
            width: "100%",
            padding: "10px",
            backgroundColor: "#dc2626",
            color: "white",
            border: "none",
            borderRadius: "4px",
            cursor: "pointer",
          }}
        >
          Logout
        </button>
      </div>
    </aside>
  );
};

const Layout = () => {
  const { user } = useAuth();
  const location = useLocation();
  const pageTitle = getPageTitle(location.pathname);
  const avatarInitial = user?.name?.charAt(0).toUpperCase() || "U";

  return (
    <div className="layout">
      <Sidebar />
      <main className="main-content">
        <div className="top-navbar">
          <h1 className="page-title">{pageTitle}</h1>
          <div className="user-info">
            <span>{user?.name}</span>
            <div className="user-avatar">{avatarInitial}</div>
          </div>
        </div>
        <Outlet />
      </main>
    </div>
  );
};

export default Layout;
