import { useLocation } from "react-router-dom";
import { Menu, UserCircle } from "lucide-react";
import { getCurrentUser } from "../utils/auth";
import "./Header.css";

const PAGE_TITLES = {
  "/dashboard": { title: "Dashboard", subtitle: "Overview of all production jobs" },
  "/live-job-board": { title: "Live Job Status Board", subtitle: "Real-time job tracking" },
  "/my-account": { title: "My Account", subtitle: "Manage your profile" },
};

function Header({ onOpenMobileNav }) {
  const location = useLocation();
  const user = getCurrentUser();
  const page = PAGE_TITLES[location.pathname] || { title: "", subtitle: "" };

  return (
    <header className="header">
      <div className="header__title-group">
        <button
          type="button"
          className="header__menu-btn"
          onClick={onOpenMobileNav}
          aria-label="Open navigation"
        >
          <Menu size={20} strokeWidth={2} />
        </button>
        <div>
          <h1 className="page-title">{page.title}</h1>
          <p className="page-subtitle">{page.subtitle}</p>
        </div>
      </div>

      <div className="header__user">
        <div className="header__user-info">
          <span className="header__user-name">{user?.name}</span>
          <span className="header__user-role">{user?.role}</span>
        </div>
        <div className="header__avatar">
          <UserCircle size={22} strokeWidth={1.8} />
        </div>
      </div>
    </header>
  );
}

export default Header;
