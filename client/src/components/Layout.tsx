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
    <aside className="w-64 bg-gray-900 text-white h-screen fixed py-5 flex flex-col">
      <div className="px-5 pb-5 border-b border-gray-700 mb-5">
        <h2 className="text-2xl font-bold text-green-400">CRM</h2>
      </div>
      <nav className="flex-1">
        <ul className="space-y-1">
          <li>
            <NavLink
              to="/"
              end
              className={({ isActive }) =>
                `block px-5 py-3 transition-colors ${
                  isActive
                    ? "bg-gray-800 text-white border-l-3 border-green-400"
                    : "text-gray-400 hover:bg-gray-800 hover:text-white"
                }`
              }
            >
              Dashboard
            </NavLink>
          </li>
          <li>
            <NavLink
              to="/customers"
              className={({ isActive }) =>
                `block px-5 py-3 transition-colors ${
                  isActive
                    ? "bg-gray-800 text-white border-l-3 border-green-400"
                    : "text-gray-400 hover:bg-gray-800 hover:text-white"
                }`
              }
            >
              Customers
            </NavLink>
          </li>
          <li>
            <NavLink
              to="/leads"
              className={({ isActive }) =>
                `block px-5 py-3 transition-colors ${
                  isActive
                    ? "bg-gray-800 text-white border-l-3 border-green-400"
                    : "text-gray-400 hover:bg-gray-800 hover:text-white"
                }`
              }
            >
              Leads
            </NavLink>
          </li>
          <li>
            <NavLink
              to="/inbox"
              className={({ isActive }) =>
                `block px-5 py-3 transition-colors ${
                  isActive
                    ? "bg-gray-800 text-white border-l-3 border-green-400"
                    : "text-gray-400 hover:bg-gray-800 hover:text-white"
                }`
              }
            >
              Inbox
            </NavLink>
          </li>
        </ul>
      </nav>
      <div className="px-5 py-4 border-t border-gray-700">
        <div className="text-gray-400 text-xs mb-2">
          {user?.name} ({user?.role})
        </div>
        <button
          onClick={handleLogout}
          className="w-full py-2.5 bg-red-600 text-white rounded hover:bg-red-700 transition-colors cursor-pointer"
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
    <div className="flex min-h-screen">
      <Sidebar />
      <main className="ml-64 flex-1 p-5">
        <div className="bg-white p-4 rounded-lg mb-5 shadow-sm flex justify-between items-center">
          <h1 className="text-xl font-semibold text-gray-800">{pageTitle}</h1>
          <div className="flex items-center gap-3">
            <span className="text-sm text-gray-600">{user?.name}</span>
            <div className="w-9 h-9 rounded-full bg-green-400 flex items-center justify-center text-white font-bold">
              {avatarInitial}
            </div>
          </div>
        </div>
        <Outlet />
      </main>
    </div>
  );
};

export default Layout;
