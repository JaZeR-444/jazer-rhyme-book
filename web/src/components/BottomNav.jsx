import { NavLink } from 'react-router-dom';
import { Home, Database, BookOpen, Search, Edit3 } from 'lucide-react';
import { useLocation } from 'react-router-dom';
import { useState, useEffect } from 'react';
import './BottomNav.css';

const NAV_ITEMS = [
  { path: '/', label: 'Home', icon: Home },
  { path: '/domains', label: 'Domains', icon: Database },
  { path: '/dictionary', label: 'Dictionary', icon: BookOpen },
  { path: '/search', label: 'Search', icon: Search },
  { path: '/studio', label: 'Studio', icon: Edit3 },
];

export function BottomNav() {
  const [isMobile, setIsMobile] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };

    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  // Don't show on desktop
  if (!isMobile) {
    return null;
  }

  // Don't show on certain pages where it might interfere
  const hideOnRoutes = ['/dictionary/compare'];
  if (hideOnRoutes.some(route => location.pathname.startsWith(route))) {
    return null;
  }

  return (
    <nav className="bottom-nav" aria-label="Bottom navigation">
      <div className="bottom-nav__container">
        {NAV_ITEMS.map(({ path, label, icon: Icon }) => (
          <NavLink
            key={path}
            to={path}
            className={({ isActive }) =>
              `bottom-nav__item ${isActive ? 'bottom-nav__item--active' : ''}`
            }
            aria-label={label}
          >
            <Icon size={22} className="bottom-nav__icon" />
            <span className="bottom-nav__label">{label}</span>
          </NavLink>
        ))}
      </div>
    </nav>
  );
}
