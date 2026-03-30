import React, { useState } from "react";
import API from "../services/api";
import "../components/Login.css";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate } from "react-router-dom";

import { MdEmail } from "react-icons/md";
import { RiLockPasswordFill, RiMapPinLine, RiMap2Line } from "react-icons/ri";
import { FaUser, FaPhoneAlt, FaLeaf } from "react-icons/fa";

function Login() {
  const navigate = useNavigate();

  const [isRegister, setIsRegister] = useState(false);
  const [loading, setLoading] = useState(false);

  const [message, setMessage] = useState("");
  const [messageType, setMessageType] = useState("");

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [area, setArea] = useState("");
  const [city, setCity] = useState("");

  const clearForm = () => {
    setName("");
    setEmail("");
    setPhone("");
    setPassword("");
    setArea("");
    setCity("");
  };

  const toggleMode = () => {
    setIsRegister(!isRegister);
    setMessage("");
    clearForm();
  };

  const handleLogin = async () => {
    if (!email || !password) {
      setMessage("Email and password are required");
      setMessageType("error");
      return;
    }

    setLoading(true);

    try {
      const response = await API.post("/users/login", {
        email: email.trim(),
        password: password.trim(),
      });

      localStorage.setItem("token", response.data.access_token);
      navigate("/learn", { replace: true });
    } catch (error) {
      setMessage(error.response?.data?.detail || "Login failed");
      setMessageType("error");
    } finally {
      setLoading(false);
    }
  };

  const handleRegister = async () => {
    if (!name || !email || !phone || !password || !city || !area) {
      setMessage("All fields are required");
      setMessageType("error");
      return;
    }

    if (password.length < 6) {
      setMessage("Password must be at least 6 characters");
      setMessageType("error");
      return;
    }

    setLoading(true);

    try {
      await API.post("/users/register", {
        name: name.trim(),
        email: email.trim(),
        phone: phone.trim(),
        password: password.trim(),
        city: city.trim(),
        area: area.trim(),
      });

      setMessage("Registration successful! Please sign in.");
      setMessageType("success");
      setIsRegister(false);
      clearForm();
    } catch (error) {
      setMessage(error.response?.data?.detail || "Registration failed");
      setMessageType("error");
    } finally {
      setLoading(false);
    }
  };

  const formVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.45 },
    },
    exit: { opacity: 0, y: -20 },
  };

  return (
    <div className="login-page">
      <div className="login-bg"></div>
      <div className="login-overlay"></div>

      <div className="auth-layout">
        {/* LEFT PANEL */}
        <motion.div
          className="left-panel"
          initial={{ opacity: 0, x: -60 }}
          animate={{ opacity: 1, x: 0 }}
        >
          <div className="brand-badge">
            <FaLeaf />
            <span>AI Crop Disease Detection</span>
          </div>

          <h1>{isRegister ? "Create Your Account" : "Welcome Back"}</h1>

          <p className="left-description">
            Smart disease detection for healthier crops, faster action, and
            better farming decisions.
          </p>
        </motion.div>

        {/* RIGHT PANEL */}
        <motion.div className="right-panel">
          <div className="login-box">
            <div className="form-top">
              <h2>{isRegister ? "Register" : "Sign In"}</h2>
            </div>

            <AnimatePresence mode="wait">
              <motion.div
                key={isRegister ? "register" : "login"}
                variants={formVariants}
                initial="hidden"
                animate="visible"
                exit="exit"
              >
                {message && (
                  <div className={`form-message ${messageType}`}>
                    {message}
                  </div>
                )}

                {isRegister && (
                  <>
                    <div className="input-wrapper">
                      <FaUser className="input-icon" />
                      <input
                        type="text"
                        placeholder="Full Name"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                      />
                    </div>

                    <div className="input-wrapper">
                      <FaPhoneAlt className="input-icon" />
                      <input
                        type="tel"
                        maxLength={10}
                        placeholder="Phone Number"
                        value={phone}
                        onChange={(e) =>
                          setPhone(e.target.value.replace(/\D/g, ""))
                        }
                      />
                    </div>

                    <div className="input-wrapper">
                      <RiMapPinLine className="input-icon" />
                      <input
                        type="text"
                        placeholder="City"
                        value={city}
                        onChange={(e) => setCity(e.target.value)}
                      />
                    </div>

                    <div className="input-wrapper">
                      <RiMap2Line className="input-icon" />
                      <input
                        type="text"
                        placeholder="Area"
                        value={area}
                        onChange={(e) => setArea(e.target.value)}
                      />
                    </div>
                  </>
                )}

                <div className="input-wrapper">
                  <MdEmail className="input-icon" />
                  <input
                    type="email"
                    placeholder="Email Address"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                  />
                </div>

                <div className="input-wrapper">
                  <RiLockPasswordFill className="input-icon" />
                  <input
                    type="password"
                    placeholder="Password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                  />
                </div>

                <button
                  className="auth-btn"
                  onClick={isRegister ? handleRegister : handleLogin}
                  disabled={loading}
                >
                  {loading
                    ? "Please wait..."
                    : isRegister
                    ? "Create Account"
                    : "Sign In"}
                </button>

                <p className="register-text">
                  {isRegister
                    ? "Already have an account?"
                    : "New user on the platform?"}
                  <span onClick={toggleMode}>
                    {isRegister ? " Sign in" : " Register"}
                  </span>
                </p>
              </motion.div>
            </AnimatePresence>
          </div>
        </motion.div>
      </div>
    </div>
  );
}

export default Login;