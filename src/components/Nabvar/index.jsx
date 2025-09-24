import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import logoImg from "../../assets/logo_granja.png"; // Verificar ruta
import "../../Styles/Navbar.css";

const Navbar = () => {
  const navigate = useNavigate();
  const loggedInUser = JSON.parse(localStorage.getItem("loggedInUser"));
  const [darkMode, setDarkMode] = useState(() => {
    const saved = localStorage.getItem("darkMode");
    return saved ? JSON.parse(saved) : false;
  });
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  useEffect(() => {
    localStorage.setItem("darkMode", JSON.stringify(darkMode));
    const root = document.documentElement;
    if (darkMode) {
      root.classList.add("dark");
      root.classList.remove("light");
    } else {
      root.classList.add("light");
      root.classList.remove("dark");
    }
    root.style.cssText = `--transition-time: 0.3s;`;
  }, [darkMode]);

  const toggleDarkMode = () => setDarkMode(!darkMode);
  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);

  const handleLogout = () => {
    localStorage.removeItem("loggedInUser");
    navigate("/login");
  };

  return (
    <nav className={`navbar ${darkMode ? "dark" : "light"}`}>
      <div className="navbar-brand">
        <img
          src={logoImg}
          alt="Farm Manager Logo"
          className="navbar-logo"
          onError={(e) => { e.target.style.display = "none"; }} // Ocultar si no carga
          onClick={() => {
            navigate("/");
            setIsMenuOpen(false);
          }}
        />
        <span className="navbar-title">Farm Manager</span>
      </div>
      <button className="navbar-hamburger" onClick={toggleMenu}>
        {isMenuOpen ? "✕" : "☰"}
      </button>
      <div className={`navbar-links ${isMenuOpen ? "open" : ""}`}>
        <Link to="/" className="navbar-link" onClick={() => setIsMenuOpen(false)}>
          Inicio
        </Link>
        <Link
          to="/Animales"
          className="navbar-link"
          onClick={() => setIsMenuOpen(false)}
        >
          Animales
        </Link>
        {!loggedInUser && (
          <>
            <Link
              to="/login"
              className="navbar-link"
              onClick={() => setIsMenuOpen(false)}
            >
              Login
            </Link>
            <Link
              to="/register"
              className="navbar-link"
              onClick={() => setIsMenuOpen(false)}
            >
              Registro
            </Link>
          </>
        )}
        {loggedInUser && (
          <button
            className="navbar-logout"
            onClick={handleLogout}
          >
            Cerrar Sesión
          </button>
        )}
        <button
          className="navbar-toggle mobile-toggle"
          onClick={toggleDarkMode}
        >
          {darkMode ? "Claro ☀" : "Oscuro 🌙"}
        </button>
      </div>
      <button className="navbar-toggle desktop-toggle" onClick={toggleDarkMode}>
        {darkMode ? "Claro ☀" : "Oscuro 🌙"}
      </button>
    </nav>
  );
};

export default Navbar;