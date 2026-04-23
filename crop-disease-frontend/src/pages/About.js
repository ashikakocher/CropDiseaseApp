import React from "react";
import "../components/About.css";
import { FaLeaf, FaRobot, FaUsers } from "react-icons/fa";
import Footer from "./Footer";
import Navbar from "./Navbar";

const About = () => {
  return (
    <>
    <Navbar/>
    <div className="about-page">

      {/* HERO SECTION */}
      <div className="about-hero">
        <h1>About CropGuard</h1>
        <p>
          Empowering farmers with AI-driven plant disease detection and smart farming solutions.
        </p>
      </div>

      {/* CONTENT SECTION */}
      <div className="about-container">

        {/* CARD 1 */}
        <div className="about-card">
          <FaLeaf className="about-icon" />
          <h3>Our Mission</h3>
          <p>
            Our mission is to help farmers identify plant diseases early and take
            preventive actions to improve crop yield and sustainability.
          </p>
        </div>

        {/* CARD 2 */}
        <div className="about-card">
          <FaRobot className="about-icon" />
          <h3>AI Technology</h3>
          <p>
            We use advanced machine learning models to detect plant diseases
            accurately and provide instant insights for better decision-making.
          </p>
        </div>

        {/* CARD 3 */}
        <div className="about-card">
          <FaUsers className="about-icon" />
          <h3>Our Team</h3>
          <p>
            We are a passionate team of developers and innovators focused on
            building impactful solutions for modern agriculture.
          </p>
        </div>

      </div>

      {/* FOOTER TEXT */}
      <div className="about-footer">
        <p>🌱 Smart Farming • AI Powered • Better Yield</p>
      </div>

    </div>
    <Footer/>
    </>
  );
};

export default About;