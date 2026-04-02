import React, { useState } from "react";
import API from "../services/api";
import { useNavigate } from "react-router-dom";
import "../components/AdminLogin.css";

function AdminLogin() {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");

  const handleLogin = async () => {
    if (!email || !password) {
      setMessage("Email and password required");
      return;
    }

    try {
      const res = await API.post("/admin/login", {
        email,
        password,
      });

      const token = res.data.access_token;

      localStorage.setItem("admin_token", token);
      localStorage.setItem("user_role", "admin");

      navigate("/admin/dashboard" , { replace: true });

    } catch (err) {
      setMessage("Invalid admin credentials");
      console.log(err.response?.data);
    }
  };

  return (
  <div className="admin-login-page">

    {/* LEFT SIDE */}
    <div className="left-section">
      <img
        src="https://cdn-icons-png.flaticon.com/512/2909/2909763.png"
        alt="crop"
      />
      <h2>AI Crop Disease Detection</h2>
      <p>
        Detect crop diseases early and take smart actions for better yield.
      </p>
    </div>

    {/* RIGHT SIDE */}
    <div className="right-section">

      <div className="login-card">
        <h2>Admin Login</h2>
        <p className="sub-text">Enter your credentials to continue</p>

        {message && <div className="error">{message}</div>}

        <input
          type="email"
          placeholder="Email Address"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />

        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />

        <button onClick={handleLogin}>Login</button>

        <p className="footer-text">
          Secure admin access panel
        </p>
      </div>

    </div>
  </div>
);
}

export default AdminLogin;