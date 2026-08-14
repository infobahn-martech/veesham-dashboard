import { NavLink, useNavigate } from "react-router-dom";
import { LayoutDashboard, Radio, UserCircle, LogOut, Printer, X } from "lucide-react";
import clsx from "clsx";
import { logout } from "../utils/auth";
import "./Sidebar.css";

const NAV_ITEMS = [
  { to: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { to: "/live-job-board", label: "Live Job Status", icon: Radio },
  { to: "/my-account", label: "My Account", icon: UserCircle },
];

function Sidebar({ isMobileNavOpen, onCloseMobileNav }) {
  const navigate = useNavigate();

  function handleLogout() {
    logout();
    navigate("/login", { replace: true });
  }

  return (
    <aside className={clsx("sidebar", isMobileNavOpen && "sidebar--open")}>
      <div className="sidebar__brand">
        <div className="sidebar__logo">
          <Printer size={20} strokeWidth={2.2} />
        </div>
        <div className="sidebar__brand-text">
          <span className="sidebar__brand-name">Veesham</span>
          <span className="sidebar__brand-subtitle">Production systems</span>
        </div>
        <button
          type="button"
          className="sidebar__close"
          onClick={onCloseMobileNav}
          aria-label="Close navigation"
        >
          <X size={18} strokeWidth={2} />
        </button>
      </div>

      <span className="sidebar__section-label">Main</span>

      <nav className="sidebar__nav">
        {NAV_ITEMS.map(({ to, label, icon: Icon }) => (
          <NavLink
            key={to}
            to={to}
            className={({ isActive }) =>
              clsx("sidebar__link", isActive && "sidebar__link--active")
            }
          >
            <Icon size={18} strokeWidth={2} />
            <span>{label}</span>
          </NavLink>
        ))}
      </nav>

      <button type="button" className="sidebar__logout" onClick={handleLogout}>
        <LogOut size={18} strokeWidth={2} />
        <span>Logout</span>
      </button>
    </aside>
  );
}

export default Sidebar;
