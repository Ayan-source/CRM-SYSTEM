import { Outlet, NavLink } from "react-router-dom";

const Sidebar = () => {
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
    </aside>
  );
};

export default Sidebar;
