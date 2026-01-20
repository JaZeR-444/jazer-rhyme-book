import { NavLink, useLocation } from 'react-router-dom';
import { Home, Database, BookOpen, Search, Edit3 } from 'lucide-react';
import './BottomNav.css';

const NAV_ITEMS = [
  { path: '/', label: 'Home', icon: Home, end: true },
  { path: '/domains', label: 'Domains', icon: Database },
  { path: '/dictionary', label: 'Dictionary', icon: BookOpen },
  { path: '/search', label: 'Search', icon: Search },
  { path: '/studio', label: 'Studio', icon: Edit3 },
];

const HIDE_ON_ROUTES = ['/dictionary/compare'];

export function BottomNav() {
  const location = useLocation();

  // Hide on certain pages where it might interfere
  if (HIDE_ON_ROUTES.some((route) => location.pathname.startsWith(route))) {
    return null;
  }

  return (
    <nav className="bottom-nav" aria-label="Bottom navigation">
      <div className="bottom-nav__container">
        {NAV_ITEMS.map(({ path, label, icon: Icon, end }) => (
          <NavLink
            key={path}
            to={path}
            end={end}
            className={({ isActive }) =>
              `bottom-nav__item${isActive ? ' bottom-nav__item--active' : ''}`
            }
            aria-label={label}
          >
            <Icon size={22} className="bottom-nav__icon" aria-hidden="true" />
            <span className="bottom-nav__label">{label}</span>
          </NavLink>
        ))}
      </div>
    </nav>
  );
}
