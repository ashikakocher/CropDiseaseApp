import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import "../components/Home.css";

function Home() {
  const navigate = useNavigate();
  const [offsetY, setOffsetY] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      setOffsetY(window.scrollY);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const fadeUp = {
    hidden: { opacity: 0, y: 60 },
    visible: (delay = 0) => ({
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.8,
        delay,
        ease: "easeOut",
      },
    }),
  };

  return (
    <div className="home-container">
      {/* HERO */}
      <section className="hero-section">
        <div
          className="hero-bg"
          style={{ transform: `translateY(${offsetY * 0.35}px)` }}
        ></div>

        <div className="hero-overlay"></div>

        <div className="floating-shape shape1"></div>
        <div className="floating-shape shape2"></div>
        <div className="floating-shape shape3"></div>
        <div className="floating-shape shape4"></div>

        <motion.div
          className="hero-content"
          initial="hidden"
          animate="visible"
          variants={fadeUp}
          custom={0.1}
        >
          <motion.span className="hero-badge" variants={fadeUp} custom={0.2}>
            Smart Farming • AI Powered
          </motion.span>

          <motion.h1 variants={fadeUp} custom={0.3}>
            AI Crop Disease <span>Detection</span>
          </motion.h1>

          <motion.p className="hero-subtitle" variants={fadeUp} custom={0.4}>
            Protect your crops with AI-powered disease detection, faster
            diagnosis, and easy access to agro vendors for medicines and
            support.
          </motion.p>

          <motion.div className="hero-buttons" variants={fadeUp} custom={0.5}>
            <button
              className="primary-btn"
              onClick={() => navigate("/login")}
            >
              I&apos;m a Farmer
            </button>

            <button
              className="secondary-btn"
              onClick={() => navigate("/supplier-login")}
            >
              I&apos;m an Agro Vendor
            </button>
          </motion.div>

          
        </motion.div>

    
      </section>

      
    </div>
  );
}

export default Home;