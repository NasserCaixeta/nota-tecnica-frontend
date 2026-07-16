import { Outlet, useLocation } from "react-router-dom";

import { PublicNav } from "./PublicNav";
import "./Shell.css";

export function PublicShell() {
  const location = useLocation();
  const isLandingRoute = location.pathname === "/";

  return (
    <div className="shell">
      {isLandingRoute ? null : (
        <header>
          <PublicNav />
        </header>
      )}
      <Outlet />
    </div>
  );
}
