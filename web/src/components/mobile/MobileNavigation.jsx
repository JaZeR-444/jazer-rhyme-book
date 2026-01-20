import { Home, Book, Compass, Search, Edit3 } from "lucide-react";
import { useNavigate, useLocation } from "react-router-dom";
import "./MobileNavigation.css";

export function MobileNavigation() {
  const navigate = useNavigate();
  const location = useLocation();

  const navItems = [
    { icon: Home, label: "Home", path: "/" },
    { icon: Book, label: "Dictionary", path: "/dictionary" },
    { icon: Compass, label: "Domains", path: "/domains" },
    { icon: Search, label: "Search", path: "/search" },
    { icon: Edit3, label: "Studio", path: "/studio" },
  ];

  return (
    <nav className="mobile-bottom-nav">
      {navItems.map(({ icon: Icon, label, path }) => (
        <button
          key={path}
          onClick={() => navigate(path)}
          className={`nav-item ${location.pathname === path ? "active" : ""}`}
          aria-label={label}
        >
          <Icon size={24} />
          <span>{label}</span>
        </button>
      ))}
    </nav>
  );
}
