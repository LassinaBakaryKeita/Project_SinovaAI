import React, { useState } from "react";
import "./Header.css";
import { Link, useLocation, useNavigate } from "react-router-dom";

//  "protected: true" indique une page qui nécessite d'être connecté.
const NAV_LINKS = [
  { label: "Accueil", to: "/" },
  { label: "Explorer", to: "/explorer", protected: true },
  { label: "Chat AI", to: "/chatai", protected: true },
];

export default function Header() {
  const [menuOpen, setMenuOpen] = useState(false);

  const location = useLocation();
  const navigate = useNavigate();

  // Informations de session
  const token = localStorage.getItem("token");
  const userName = localStorage.getItem("userName");

  const isAuthenticated = !!token;

  // Génère les initiales 
  const getInitials = (fullName) => {
    if (!fullName) return "";

    return fullName
      .split(" ")
      .map((word) => word[0])
      .join("")
      .toUpperCase();
  };

  // Déconnexion
  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("userId");
    localStorage.removeItem("userName");

    //  On vide aussi l'historique du chat général : il doit disparaître
    // à la déconnexion, mais rester intact tant qu'on navigue simplement
    // entre les pages. La clé doit être strictement identique à celle
    // utilisée dans ChatMainSection.jsx (CHAT_STORAGE_KEY).
    localStorage.removeItem("sinovaai_chat_messages");

    navigate("/");
  };

  //  Intercepte le clic sur un lien protégé quand l'utilisateur n'est
  // pas connecté, et le redirige directement vers /connexion au lieu
  // de le laisser naviguer puis se faire rebondir par ProtectedRoute.
  const handleNavClick = (e, link) => {
    setMenuOpen(false);

    if (link.protected && !isAuthenticated) {
      e.preventDefault();
      navigate("/connexion");
    }
  };

  return (
    <header className="sinova-header-wrap">
      <div className="sinova-header">

        {/* Logo */}
        <Link
          to="/"
          className="sinova-logo"
          onClick={() => setMenuOpen(false)}
        >
          <span className="sinova-logo-icon">
            <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
              <path
                d="M6 5L2 9L6 13"
                stroke="white"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <path
                d="M12 5L16 9L12 13"
                stroke="white"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <path
                d="M10.5 3L7.5 15"
                stroke="#35E4FD"
                strokeWidth="2"
                strokeLinecap="round"
              />
            </svg>
          </span>

          <p className="sinova-logo-text">
            Sinova<span>AI</span>
          </p>
        </Link>

        {/* Navigation */}
        <nav className="sinova-navbar">
          {NAV_LINKS.map((link) => (
            <Link
              key={link.to}
              to={link.to}
              onClick={(e) => handleNavClick(e, link)}
              className={`sinova-nav-link ${
                location.pathname === link.to ? "active" : ""
              }`}
            >
              {link.label}
            </Link>
          ))}
        </nav>

        {/* Partie authentification */}
        {!isAuthenticated ? (
          <Link to="/connexion" className="sinova-btn-auth">
            Connexion
          </Link>
        ) : (
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "12px",
            }}
          >
            <div
              style={{
                width: "42px",
                height: "42px",
                borderRadius: "50%",
                background: "#35E4FD",
                color: "#111",
                fontWeight: "bold",
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              {getInitials(userName)}
            </div>

            <button
              className="sinova-btn-auth"
              onClick={handleLogout}
            >
              Déconnexion
            </button>
          </div>
        )}

        {/* Burger */}
        <button
          className="sinova-burger"
          aria-label="Ouvrir le menu"
          onClick={() => setMenuOpen((v) => !v)}
        >
          <span className={menuOpen ? "open" : ""} />
          <span className={menuOpen ? "open" : ""} />
          <span className={menuOpen ? "open" : ""} />
        </button>
      </div>

      {/* Menu mobile */}
      <div className={`sinova-mobile-menu ${menuOpen ? "show" : ""}`}>
        {NAV_LINKS.map((link) => (
          <Link
            key={link.to}
            to={link.to}
            className="sinova-mobile-link"
            onClick={(e) => handleNavClick(e, link)}
          >
            {link.label}
          </Link>
        ))}

        {!isAuthenticated ? (
          <Link
            to="/connexion"
            className="sinova-btn-auth mobile"
            onClick={() => setMenuOpen(false)}
          >
            Connexion
          </Link>
        ) : (
          <button
            className="sinova-btn-auth mobile"
            onClick={() => {
              handleLogout();
              setMenuOpen(false);
            }}
          >
            Déconnexion
          </button>
        )}
      </div>
    </header>
  );
}