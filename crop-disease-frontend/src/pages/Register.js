import React, { useState } from "react";
import API from "../services/api";
import "../components/Login.css";

import { useNavigate } from "react-router-dom";

import { MdEmail } from "react-icons/md";
import { RiLockPasswordFill } from "react-icons/ri";
import { FaUser } from "react-icons/fa";
import { FaPhoneAlt } from "react-icons/fa";

function Register() {

  const navigate = useNavigate();

  const [message, setMessage] = useState("");
  const [messageType, setMessageType] = useState("");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");

  const handleRegister = async () => {

    try {

      await API.post("/users/register", {
        name: name,
        email: email,
        phone: phone,
        password: password
      });

      setMessage("Registration successful! Redirecting to login...");
      setMessageType("success");

      setTimeout(() => {
        navigate("/login");
      }, 1500);

    } catch (error) {

      if (error.response) {

        const errorMsg =
          typeof error.response.data.detail === "string"
            ? error.response.data.detail
            : error.response.data.detail[0].msg;

        setMessage(errorMsg);
        setMessageType("error");

      } else {

        setMessage("Registration failed");
        setMessageType("error");

      }

    }

  };

  return (

    <div className="login-page">

      <div className="overlay">

        <div className="left-section">

          <h1>Create Account</h1>

          <p>
            Join our AI-powered crop disease detection platform
            and protect your crops with intelligent diagnostics.
          </p>

        </div>

        <div className="login-box">

          <h2>Register</h2>

          {message && (
            <div className={`form-message ${messageType}`}>
              {message}
            </div>
          )}

          <div className="input-wrapper">
            <FaUser className="input-icon" />
            <input
              type="text"
              placeholder="Full Name"
              onChange={(e)=>setName(e.target.value)}
            />
          </div>

          <div className="input-wrapper">
            <FaPhoneAlt className="input-icon" />
            <input
              type="text"
              placeholder="Phone Number"
              onChange={(e)=>setPhone(e.target.value)}
            />
          </div>

          <div className="input-wrapper">
            <MdEmail className="input-icon" />
            <input
              type="email"
              placeholder="Email Address"
              onChange={(e)=>setEmail(e.target.value)}
            />
          </div>

          <div className="input-wrapper">
            <RiLockPasswordFill className="input-icon" />
            <input
              type="password"
              placeholder="Password"
              onChange={(e)=>setPassword(e.target.value)}
            />
          </div>

          <button onClick={handleRegister}>
            Register
          </button>

          <p className="register-text">

            Already have an account?

            <span onClick={() => navigate("/login")}>
              Login here
            </span>

          </p>

        </div>

      </div>

    </div>

  );

}

export default Register;