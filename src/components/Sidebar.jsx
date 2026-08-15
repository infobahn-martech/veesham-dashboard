import { useState } from "react";
import { NavLink, useLocation, useNavigate } from "react-router-dom";
import {
  LayoutDashboard,
  Radio,
  UserCircle,
  LogOut,
  X,
  Boxes,
  Package,
  ClipboardList,
  ChevronDown,
  Users,
} from "lucide-react";
import clsx from "clsx";
import { logout } from "../utils/auth";
import logo from "../assets/images/logo.png";
import "./Sidebar.css";

const NAV_ITEMS = [
  { to: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
    { to: "/user-management", label: "User Management", icon: Users },
  {
    label: "Job Management",
    icon: Boxes,
    children: [
      { to: "/job-management/items", label: "Items", icon: Package },
      { to: "/job-management/jobs", label: "Jobs", icon: ClipboardList },
    ],
  },
  { to: "/live-job-board", label: "Live Job Status", icon: Radio },
  { to: "/my-account", label: "My Account", icon: UserCircle },
];

function isGroupActive(item, pathname) {
  return item.children?.some((child) => pathname.startsWith(child.to)) ?? false;
}

function Sidebar({ isMobileNavOpen, onCloseMobileNav }) {
  const navigate = useNavigate();
  const location = useLocation();
  const [expandedGroups, setExpandedGroups] = useState(() =>
    new Set(NAV_ITEMS.filter((item) => isGroupActive(item, location.pathname)).map((item) => item.label))
  );

  function toggleGroup(label) {
    setExpandedGroups((prev) => {
      const next = new Set(prev);
      next.has(label) ? next.delete(label) : next.add(label);
      return next;
    });
  }

  function handleLogout() {
    logout();
    navigate("/login", { replace: true });
  }

  return (
    <aside className={clsx("sidebar", isMobileNavOpen && "sidebar--open")}>
      <div className="sidebar__brand">
        <div className="sidebar__logo">
          <img src={logo} alt="Veesham" className="sidebar__logo-img" />
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

      {/* <span className="sidebar__section-label">Main</span> */}

      <nav className="sidebar__nav">
        {NAV_ITEMS.map((item) => {
          if (item.children) {
            const groupActive = isGroupActive(item, location.pathname);
            const open = expandedGroups.has(item.label);
            return (
              <div key={item.label} className="sidebar__group">
                <button
                  type="button"
                  className={clsx("sidebar__link", "sidebar__link--toggle", groupActive && "sidebar__link--active")}
                  onClick={() => toggleGroup(item.label)}
                  aria-expanded={open}
                >
                  <item.icon size={18} strokeWidth={2} />
                  <span>{item.label}</span>
                  <ChevronDown size={15} strokeWidth={2} className={clsx("sidebar__chevron", open && "sidebar__chevron--open")} />
                </button>
                {open && (
                  <div className="sidebar__submenu animate-in">
                    {item.children.map(({ to, label, icon: Icon }) => (
                      <NavLink
                        key={to}
                        to={to}
                        className={({ isActive }) =>
                          clsx("sidebar__link", "sidebar__sublink", isActive && "sidebar__link--active")
                        }
                      >
                        <Icon size={16} strokeWidth={2} />
                        <span>{label}</span>
                      </NavLink>
                    ))}
                  </div>
                )}
              </div>
            );
          }

          return (
            <NavLink
              key={item.to}
              to={item.to}
              className={({ isActive }) =>
                clsx("sidebar__link", isActive && "sidebar__link--active")
              }
            >
              <item.icon size={18} strokeWidth={2} />
              <span>{item.label}</span>
            </NavLink>
          );
        })}
      </nav>

      <button type="button" className="sidebar__logout" onClick={handleLogout}>
        <LogOut size={18} strokeWidth={2} />
        <span>Logout</span>
      </button>
    </aside>
  );
}

export default Sidebar;
