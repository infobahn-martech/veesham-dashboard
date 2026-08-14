import { useState } from "react";
import { Outlet, useLocation } from "react-router-dom";
import clsx from "clsx";
import Sidebar from "../components/Sidebar";
import Header from "../components/Header";
import "./DashboardLayout.css";

function DashboardLayout() {
  const location = useLocation();
  const [isMobileNavOpen, setIsMobileNavOpen] = useState(false);
  const [isChromeHidden, setIsChromeHidden] = useState(false);
  const [lastPathname, setLastPathname] = useState(location.pathname);

  if (location.pathname !== lastPathname) {
    setLastPathname(location.pathname);
    setIsMobileNavOpen(false);
  }

  return (
    <div className={clsx("dashboard-layout", isChromeHidden && "dashboard-layout--chrome-hidden")}>
      <Sidebar isMobileNavOpen={isMobileNavOpen} onCloseMobileNav={() => setIsMobileNavOpen(false)} />
      <div
        className="dashboard-layout__overlay"
        data-open={isMobileNavOpen}
        onClick={() => setIsMobileNavOpen(false)}
      />
      <div className="dashboard-layout__main">
        <Header onOpenMobileNav={() => setIsMobileNavOpen(true)} />
        <main className="dashboard-layout__content">
          <Outlet context={{ setIsChromeHidden }} />
        </main>
      </div>
    </div>
  );
}

export default DashboardLayout;
