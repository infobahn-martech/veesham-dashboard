import { useLocation } from "react-router-dom";
import { Menu, Search, Bell } from "lucide-react";
import { getCurrentUser } from "../utils/auth";
import { getInitials } from "../utils/initials";
import "./Header.css";

const PAGE_TITLES = {
  "/dashboard": {
    micro: "Production overview",
    title: "Dashboard",
    subtitle: "Overview of all production jobs",
  },
  "/live-job-board": {
    micro: "Real-time tracking",
    title: "Live Job Status Board",
    subtitle: "Real-time job tracking across all press lines",
  },
  "/my-account": {
    micro: "Account",
    title: "My Account",
    subtitle: "Manage your profile",
  },
};

function Header({ onOpenMobileNav }) {
  const location = useLocation();
  const user = getCurrentUser();
  const page = PAGE_TITLES[location.pathname] || { micro: "", title: "", subtitle: "" };

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
          <div className="header__micro-row" aria-hidden="true">
            <span className="header__micro-label">{page.micro}</span>
            <span className="header__cmyk">
              <span className="header__cmyk-dot header__cmyk-dot--c" />
              <span className="header__cmyk-dot header__cmyk-dot--m" />
              <span className="header__cmyk-dot header__cmyk-dot--y" />
              <span className="header__cmyk-dot header__cmyk-dot--k" />
            </span>
          </div>
          <h1 className="page-title">{page.title}</h1>
          <p className="page-subtitle">{page.subtitle}</p>
        </div>
      </div>

      <div className="header__actions">
        <button type="button" className="header__icon-btn" aria-label="Search">
          <Search size={17} strokeWidth={2} />
        </button>
        <button type="button" className="header__icon-btn" aria-label="Notifications">
          <Bell size={17} strokeWidth={2} />
        </button>

        <div className="header__user">
          <div className="header__avatar">{getInitials(user?.name)}</div>
          <div className="header__user-info">
            <span className="header__user-name">{user?.name}</span>
            <span className="header__user-role">{user?.role}</span>
          </div>
        </div>
      </div>
    </header>
  );
}

export default Header;
