import {React,useState,useRef ,useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import {
  FaUser,
  FaLeaf,
  FaUserCircle,
  FaSignOutAlt,
  FaSearch,
  FaRobot
} from "react-icons/fa";
import "../components/Navbar.css";
import GoogleTranslate from "./GoogleTranslate";

function Navbar({ onAiHelpClick }) {
  const navigate = useNavigate();
  const location = useLocation();
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const profileRef = useRef(null);
  const logout = () => {
    localStorage.removeItem("supplier_token");
    navigate("/");
  };

  const isActive = (path) => location.pathname === path;
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (profileRef.current && !profileRef.current.contains(event.target)) {
        setShowProfileMenu(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <>
      {/* TOP STRIP */}
      <div className="top-strip">
        🚚 Smart Farming • AI Disease Detection • Better Yield 🌱
      </div>

      {/* MAIN NAVBAR */}
      <header className="navbar">
        {/* LOGO */}
        <div className="navbar-logo" onClick={() => navigate("/supplier-dashboard")}>
          <FaLeaf className="logo-icon" />
          <h2>CropGuard</h2>
        </div>

        {/* SEARCH */}
        <div className="navbar-search">
          <FaSearch />
          <input placeholder="Search shops,medicines..." />
        </div>

      {/* RIGHT SIDE */}
        <div className="navbar-right" ref={profileRef}>
          {/* 🌍 GOOGLE TRANSLATE DROPDOWN */}
  <GoogleTranslate />
          <div
            className="profile-dropdown-wrapper"
            onClick={() => setShowProfileMenu(!showProfileMenu)}
          >
            <div className="profile-trigger">
              <FaUserCircle className="profile-avatar-icon" />
            </div>

            {showProfileMenu && (
              <div className="profile-dropdown-menu">
                <div
                  className="profile-dropdown-item"
                  onClick={() => {
                    navigate("/supplier-profile");
                    setShowProfileMenu(false);
                  }}
                >
                  <FaUser className="profile-dropdown-icon" />
                  <span>Profile</span>
                </div>

                <div className="profile-menu-divider"></div>

                <div
                  className="profile-dropdown-item logout-item"
                  onClick={logout}
                >
                  <FaSignOutAlt className="profile-dropdown-icon logout-icon" />
                  <span>Logout</span>
                </div>
              </div>
            )}
          </div>
        </div>
      </header>

      {/* BOTTOM NAV */}
      <nav className="bottom-nav">
        <button
          className={isActive("/supplier-dashboard") ? "active" : ""}
          onClick={() => navigate("/supplier-dashboard")}
        >
          Dashboard
        </button>

        <button
          className={isActive("/my-shops") ? "active" : ""}
          onClick={() => navigate("/my-shops")}
        >
          My Shops
        </button>

        <button
          className={isActive("/add shops") ? "active" : ""}
          onClick={() => navigate("/add-shop")}
        >
          Add shops
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