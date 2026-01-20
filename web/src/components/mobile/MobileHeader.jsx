import React, { useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { Menu, X, Search } from "lucide-react";
import "./MobileHeader.css";

export function MobileHeader() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const location = useLocation();

  const toggleMenu = () => setIsMenuOpen((v) => !v);
  const closeMenu = () => setIsMenuOpen(false);

  // Close menu whenever route changes (prevents “stuck open”)
  useEffect(() => {
    closeMenu();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [location.pathname]);

  // Lock body scroll while menu is open
  useEffect(() => {
    if (!isMenuOpen) return;

    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    return () => {
      document.body.style.overflow = prevOverflow;
    };
  }, [isMenuOpen]);

  // Close on Escape
  useEffect(() => {
    if (!isMenuOpen) return;

    const onKeyDown = (e) => {
      if (e.key === "Escape") closeMenu();
    };

    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [isMenuOpen]);

  return (
    <>
      <header className="mobile-header">
        <Link to="/" className="mobile-logo" onClick={closeMenu}>
          <span className="logo-text">JaZeR</span>
        </Link>

        <div className="mobile-header-actions">
          <button className="icon-btn" aria-label="Search" type="button">
            <Search size={20} aria-hidden="true" />
          </button>

          <button
            className="icon-btn menu-toggle"
            onClick={toggleMenu}
            aria-label="Menu"
            aria-expanded={isMenuOpen}
            aria-controls="mobile-menu"
            type="button"
          >
            {isMenuOpen ? <X size={24} aria-hidden="true" /> : <Menu size={24} aria-hidden="true" />}
          </button>
        </div>
      </header>

      {/* Backdrop (click to close) */}
      {isMenuOpen && (
        <div className="mobile-menu-backdrop" onClick={closeMenu} aria-hidden="true" />
      )}

      {/* Mobile Menu Overlay */}
      <div className={`mobile-menu-overlay ${isMenuOpen ? "active" : ""}`}>
        <nav id="mobile-menu" className="mobile-menu" aria-label="Mobile menu">
          <Link to="/" className="mobile-menu-item" onClick={closeMenu}>
            Home
          </Link>
          <Link to="/dictionary" className="mobile-menu-item" onClick={closeMenu}>
            Dictionary
          </Link>
          <Link to="/domains" className="mobile-menu-item" onClick={closeMenu}>
            Domains
          </Link>
          <Link to="/studio" className="mobile-menu-item" onClick={closeMenu}>
            Studio
          </Link>
          <Link to="/search" className="mobile-menu-item" onClick={closeMenu}>
            Search
          </Link>
        </nav>
      </div>
    </>
  );
}
