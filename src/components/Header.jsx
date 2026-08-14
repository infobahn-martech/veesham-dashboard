import { useLocation } from "react-router-dom";
import { UserCircle } from "lucide-react";
import { getCurrentUser } from "../utils/auth";
import "./Header.css";

const PAGE_TITLES = {
  "/dashboard": { title: "Dashboard", subtitle: "Overview of all production jobs" },
  "/live-job-board": { title: "Live Job Status Board", subtitle: "Real-time job tracking" },
  "/my-account": { title: "My Account", subtitle: "Manage your profile" },
};

function Header() {
  const location = useLocation();
  const user = getCurrentUser();
  const page = PAGE_TITLES[location.pathname] || { title: "", subtitle: "" };

  return (
    <header className="header">
      <div>
        <h1 className="page-title">{page.title}</h1>
        <p className="page-subtitle">{page.subtitle}</p>
      </div>

      <div className="header__user">
        <div className="header__user-info">
          <span className="header__user-name">{user?.name}</span>
          <span className="header__user-role">{user?.role}</span>
        </div>
        <UserCircle size={34} strokeWidth={1.5} color="var(--color-primary)" />
      </div>
    </header>
  );
}

export default Header;
