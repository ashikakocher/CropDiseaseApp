import React, { useState } from "react";
import API from "../services/api";
import "../components/Login.css";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate } from "react-router-dom";

import { MdEmail } from "react-icons/md";
import {
  RiLockPasswordFill,
  RiMapPinLine,
  RiMap2Line,
  RiFileUploadLine,
} from "react-icons/ri";
import { FaUser, FaPhoneAlt, FaLeaf, FaIdCard } from "react-icons/fa";

function SupplierLogin({ setSupplierToken }) {
  const navigate = useNavigate();

  const [isRegister, setIsRegister] = useState(false);
  const [loading, setLoading] = useState(false);
  const [registerStep, setRegisterStep] = useState(1);

  const [message, setMessage] = useState("");
  const [messageType, setMessageType] = useState("");

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [city, setCity] = useState("");
  const [area, setArea] = useState("");
  const [password, setPassword] = useState("");

  const [kycType, setKycType] = useState("");
  const [kycFile, setKycFile] = useState(null);

  const clearForm = () => {
    setName("");
    setEmail("");
    setPhone("");
    setCity("");
    setArea("");
    setPassword("");
    setKycType("");
    setKycFile(null);
    setRegisterStep(1);
  };

  const toggleMode = () => {
    setIsRegister(!isRegister);
    setMessage("");
    setMessageType("");
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
      const response = await API.post("/suppliers/login", {
        email: email.trim(),
        password: password.trim(),
      });

      localStorage.setItem("supplier_token", response.data.access_token);
      setSupplierToken(response.data.access_token);
      navigate("/supplier-dashboard");
    } catch (error) {
      setMessage(error.response?.data?.detail || "Login failed");
      setMessageType("error");
    } finally {
      setLoading(false);
    }
  };

  const nextStep = () => {
    setMessage("");
    setMessageType("");

    if (registerStep === 1) {
      if (!name || !phone || !city || !area) {
        setMessage("Please fill all Step 1 fields");
        setMessageType("error");
        return;
      }

      if (phone.length !== 10) {
        setMessage("Phone number must be 10 digits");
        setMessageType("error");
        return;
      }
    }

    if (registerStep === 2) {
      if (!email || !password) {
        setMessage("Please fill all Step 2 fields");
        setMessageType("error");
        return;
      }

      if (password.length < 6) {
        setMessage("Password must be at least 6 characters");
        setMessageType("error");
        return;
      }
    }

    setRegisterStep((prev) => prev + 1);
  };

  const prevStep = () => {
    setMessage("");
    setMessageType("");
    setRegisterStep((prev) => prev - 1);
  };

  const handleRegister = async () => {
    if (!kycType || !kycFile) {
      setMessage("Please select KYC type and upload document");
      setMessageType("error");
      return;
    }

    const allowedTypes = ["application/pdf", "image/png", "image/jpeg"];
    if (!allowedTypes.includes(kycFile.type)) {
      setMessage("Only PDF, PNG, and JPG files are allowed");
      setMessageType("error");
      return;
    }

    setLoading(true);

    try {
      const formData = new FormData();
      formData.append("name", name.trim());
      formData.append("email", email.trim());
      formData.append("phone", phone.trim());
      formData.append("city", city.trim());
      formData.append("area", area.trim());
      formData.append("password", password.trim());
      formData.append("kyc_type", kycType);
      formData.append("kyc_file", kycFile);

      await API.post("/suppliers/register", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
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
    visible: { opacity: 1, y: 0 },
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
            <span>Supplier Portal</span>
          </div>

          <h1>{isRegister ? "Register as Supplier" : "Supplier Login"}</h1>

          <p className="left-description">
            Manage your medicines, connect with farmers, and grow your
            agri-business.
          </p>

          {isRegister && (
            <div className="register-step-indicator" style={{ marginTop: "20px" }}>
              <p style={{ color: "#fff", fontWeight: "600" }}>
                Step {registerStep} of 3
              </p>
            </div>
          )}
        </motion.div>

        {/* RIGHT PANEL */}
        <motion.div className="right-panel">
          <div className="login-box">
            <div className="form-top">
              <h2>{isRegister ? "Register" : "Sign In"}</h2>
            </div>

            <AnimatePresence mode="wait">
              <motion.div
                key={isRegister ? `register-${registerStep}` : "login"}
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

                {/* REGISTER FORM */}
                {isRegister ? (
                  <>
                    {registerStep === 1 && (
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

                        <button
                          className="auth-btn"
                          type="button"
                          onClick={nextStep}
                          disabled={loading}
                        >
                          Next
                        </button>
                      </>
                    )}

                    {registerStep === 2 && (
                      <>
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

                        <div
                          style={{
                            display: "flex",
                            gap: "10px",
                            marginTop: "10px",
                          }}
                        >
                          <button
                            className="auth-btn"
                            type="button"
                            onClick={prevStep}
                            disabled={loading}
                          >
                            Back
                          </button>

                          <button
                            className="auth-btn"
                            type="button"
                            onClick={nextStep}
                            disabled={loading}
                          >
                            Next
                          </button>
                        </div>
                      </>
                    )}

                    {registerStep === 3 && (
                      <>
                        <div className="input-wrapper">
                          <FaIdCard className="input-icon" />
                          <select
                            value={kycType}
                            onChange={(e) => setKycType(e.target.value)}
                            className="login-select"
                          >
                            <option value="">Select KYC Type</option>
                            <option value="aadhaar">Aadhaar Card</option>
                            <option value="pan">PAN Card</option>
                            <option value="gst">GST Certificate</option>
                            <option value="license">Business License</option>
                          </select>
                        </div>

                        <div className="input-wrapper">
                          <RiFileUploadLine className="input-icon" />
                          <input
                            type="file"
                            accept=".pdf,.png,.jpg,.jpeg"
                            onChange={(e) => setKycFile(e.target.files[0])}
                            style={{ padding: "12px" }}
                          />
                        </div>

                        {kycFile && (
                          <p style={{ fontSize: "13px", marginTop: "8px" }}>
                            Selected file: {kycFile.name}
                          </p>
                        )}

                        <div
                          style={{
                            display: "flex",
                            gap: "10px",
                            marginTop: "10px",
                          }}
                        >
                          <button
                            className="auth-btn"
                            type="button"
                            onClick={prevStep}
                            disabled={loading}
                          >
                            Back
                          </button>

                          <button
                            className="auth-btn"
                            type="button"
                            onClick={handleRegister}
                            disabled={loading}
                          >
                            {loading ? "Please wait..." : "Create Account"}
                          </button>
                        </div>
                      </>
                    )}
                  </>
                ) : (
                  <>
                    {/* LOGIN FORM */}
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
                      onClick={handleLogin}
                      disabled={loading}
                    >
                      {loading ? "Please wait..." : "Sign In"}
                    </button>
                  </>
                )}

                <p className="register-text">
                  {isRegister ? "Already have an account?" : "New supplier?"}
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

export default SupplierLogin;