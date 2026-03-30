import React from "react";
import { FaLeaf, FaPhone, FaMapMarkerAlt, FaEnvelope } from "react-icons/fa";
import "../components/Footer.css";

function Footer() {
  return (
    <footer className="footer">
      <div className="footer-container">

        {/* LEFT - BRAND */}
        <div className="footer-section">
          <div className="footer-logo">
            <FaLeaf />
            <h2>CropGuard</h2>
          </div>

          <p>
            Smart farming platform using AI to detect crop diseases and
            provide accurate treatment solutions.
          </p>

          <div className="footer-contact">
            <p><FaMapMarkerAlt /> Punjab, India</p>
            <p><FaPhone /> +91 XXXXX XXXXX</p>
            <p><FaEnvelope /> support@cropguard.com</p>
          </div>
        </div>

        {/* QUICK LINKS */}
        <div className="footer-section">
          <h3>Quick Links</h3>
          <ul>
            <li>Dashboard</li>
            <li>History</li>
            <li>Learn</li>
            <li>Shops</li>
            <li>Reports</li>
          </ul>
        </div>

        {/* FEATURES */}
        <div className="footer-section">
          <h3>Features</h3>
          <ul>
            <li>Disease Detection</li>
            <li>Nearby Shops</li>
            <li>AI Assistant</li>
            <li>Crop Insights</li>
          </ul>
        </div>

        {/* NEWSLETTER */}
        <div className="footer-section">
          <h3>Get Updates</h3>
          <p>Subscribe for latest farming tips & updates 🌱</p>

          <input type="text" placeholder="Your Name" />
          <input type="email" placeholder="Your Email" />

          <button>Subscribe</button>
        </div>

      </div>

      {/* BOTTOM */}
      <div className="footer-bottom">
        © 2026 CropGuard | All Rights Reserved
      </div>
    </footer>
  );
}

export default Footer;