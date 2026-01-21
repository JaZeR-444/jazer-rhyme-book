import { Home, Book, Compass, Search, Edit3 } from "lucide-react";
import { useNavigate, useLocation } from "react-router-dom";
import "./MobileNavigation.css";

export function MobileNavigation() {
  const navigate = useNavigate();
  const location = useLocation();

  // Full-screen routes where navigation should be hidden
  const fullScreenRoutes = ['/studio', '/dictionary/compare', '/dictionary/galaxy'];
  const isFullScreen = fullScreenRoutes.some(route => location.pathname.startsWith(route));

  // Hide navigation on full-screen routes
  if (isFullScreen) {
    return null;
  }

  const navItems = [
    { icon: Home, label: "Home", path: "/" },
    { icon: Book, label: "Dictionary", path: "/dictionary" },
    { icon: Compass, label: "Domains", path: "/domains" },
    { icon: Search, label: "Search", path: "/search" },
    { icon: Edit3, label: "Studio", path: "/studio" },
  ];

  return (
    <nav className="mobile-bottom-nav">
      {navItems.map(({ icon: Icon, label, path }) => {
        const isActive = location.pathname === path;
        return (
          <button
            key={path}
            onClick={() => navigate(path)}
            className={`nav-item ${isActive ? "active" : ""}`}
            aria-label={label}
            aria-current={isActive ? "page" : undefined}
          >
            <Icon size={24} aria-hidden="true" />
            <span>{label}</span>
          </button>
        );
      })}
    </nav>
  );
}
