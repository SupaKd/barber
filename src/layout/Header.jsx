import { Link, useLocation } from "react-router-dom";
import { useState } from "react";
import { FiMenu, FiX } from "react-icons/fi";

const Header = () => {
  const location = useLocation();
  const [menuOpen, setMenuOpen] = useState(false);

  const toggleMenu = () => setMenuOpen((prev) => !prev);
  const closeMenu = () => setMenuOpen(false);

  return (
    <header className="header">
      <nav className="navbar">
        <div className="nav-brand">
          <Link to="/" onClick={closeMenu}>
            <img src="/logohair.png" alt="logo" />
          </Link>
        </div>

        {/* bouton burger */}
        <button
          className="burger"
          onClick={toggleMenu}
          style={{ zIndex: 999 }}
        >
          {menuOpen ? <FiX size={24} /> : <FiMenu size={24} />}
        </button>

        <ul className={`nav-links ${menuOpen ? "open" : ""}`}>
          <li>
            <Link
              to="/"
              className={location.pathname === "/" ? "active" : ""}
              onClick={closeMenu}
            >
              Accueil
            </Link>
          </li>
          <li>
            <Link
              to="/reservations"
              className={location.pathname === "/reservations" ? "active" : ""}
              onClick={closeMenu}
            >
              Prendre RDV
            </Link>
          </li>
        </ul>
      </nav>
    </header>
  );
};

export default Header;
