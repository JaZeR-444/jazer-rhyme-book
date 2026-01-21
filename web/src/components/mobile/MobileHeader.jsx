import React, { useEffect, useRef, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { Menu, X, Search } from "lucide-react";
import { createFocusTrap } from "../../lib/accessibility";
import { useScrollLock } from "../../contexts/ScrollLockProvider";
import "./MobileHeader.css";

export function MobileHeader() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const location = useLocation();
  const menuRef = useRef(null);
  const { lock, unlock } = useScrollLock();

  const toggleMenu = () => setIsMenuOpen((v) => !v);
  const closeMenu = () => setIsMenuOpen(false);

  // Close menu whenever route changes (prevents “stuck open”)
  useEffect(() => {
    closeMenu();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [location.pathname]);

  // Lock body scroll while menu is open
  useEffect(() => {
    if (isMenuOpen) {
      lock();
    } else {
      unlock();
    }

    return () => {
      if (isMenuOpen) unlock();
    };
  }, [isMenuOpen, lock, unlock]);

  // Close on Escape
  useEffect(() => {
    if (!isMenuOpen) return;

    const onKeyDown = (e) => {
      if (e.key === "Escape") closeMenu();
    };

    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [isMenuOpen]);

  useEffect(() => {
    if (!isMenuOpen || !menuRef.current) return undefined;
    const cleanup = createFocusTrap(menuRef.current);
    menuRef.current.focus();
    return cleanup;
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
      <div
        className={`mobile-menu-overlay ${isMenuOpen ? "active" : ""}`}
        role="dialog"
        aria-modal="true"
        aria-label="Mobile menu"
        aria-hidden={!isMenuOpen}
      >
        <nav
          id="mobile-menu"
          className="mobile-menu"
          aria-label="Mobile menu"
          ref={menuRef}
          tabIndex={-1}
        >
          <Link
            to="/"
            className="mobile-menu-item"
            onClick={closeMenu}
            aria-current={location.pathname === "/" ? "page" : undefined}
          >
            Home
          </Link>
          <Link
            to="/dictionary"
            className="mobile-menu-item"
            onClick={closeMenu}
            aria-current={location.pathname.startsWith("/dictionary") ? "page" : undefined}
          >
            Dictionary
          </Link>
          <Link
            to="/domains"
            className="mobile-menu-item"
            onClick={closeMenu}
            aria-current={location.pathname.startsWith("/domains") ? "page" : undefined}
          >
            Domains
          </Link>
          <Link
            to="/studio"
            className="mobile-menu-item"
            onClick={closeMenu}
            aria-current={location.pathname.startsWith("/studio") ? "page" : undefined}
          >
            Studio
          </Link>
          <Link
            to="/search"
            className="mobile-menu-item"
            onClick={closeMenu}
            aria-current={location.pathname.startsWith("/search") ? "page" : undefined}
          >
            Search
          </Link>
        </nav>
      </div>
    </>
  );
}
