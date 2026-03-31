import React from "react";
import { useNavigate, useLocation } from "react-router-dom";
import {
  FaLeaf,
  FaUserCircle,
  FaSignOutAlt,
  FaSearch,
  FaRobot
} from "react-icons/fa";
import "../components/Navbar.css";

function Navbar({ onAiHelpClick }) {
  const navigate = useNavigate();
  const location = useLocation();

  const logout = () => {
    localStorage.removeItem("token");
    navigate("/login");
  };

  const isActive = (path) => location.pathname === path;

  return (
    <>
      {/* TOP STRIP */}
      <div className="top-strip">
        🚚 Smart Farming • AI Disease Detection • Better Yield 🌱
      </div>

      {/* MAIN NAVBAR */}
      <header className="navbar">
        {/* LOGO */}
        <div className="navbar-logo" onClick={() => navigate("/dashboard")}>
          <FaLeaf className="logo-icon" />
          <h2>CropGuard</h2>
        </div>

        {/* SEARCH */}
        <div className="navbar-search">
          <FaSearch />
          <input placeholder="Search diseases, crops..." />
        </div>

        {/* RIGHT ICONS */}
        <div className="navbar-right">
          <FaUserCircle
            className="icon"
            onClick={() => navigate("/profile")}
          />
          <FaSignOutAlt className="icon logout" onClick={logout} />
        </div>
      </header>

      {/* BOTTOM NAV */}
      <nav className="bottom-nav">
        <button
          className={isActive("/learn") ? "active" : ""}
          onClick={() => navigate("/learn")}
        >
          Home
        </button>

        <button
          className={isActive("/dashboard") ? "active" : ""}
          onClick={() => navigate("/dashboard")}
        >
          Dashboard
        </button>

        <button
          className={isActive("/history") ? "active" : ""}
          onClick={() => navigate("/history")}
        >
          History
        </button>

        

        {/* AI BUTTON */}
        <button className="ai-btn" onClick={onAiHelpClick}>
          <FaRobot /> AI Help
        </button>
      </nav>
    </>
  );
}

export default Navbar;