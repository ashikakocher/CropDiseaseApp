import React, { useState } from "react";
import API from "../services/api";
import { useNavigate } from "react-router-dom";
import "../components/Login.css";

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
    <div className="login-page">
      <div className="login-bg"></div>
      <div className="login-overlay"></div>

      <div className="auth-center-wrap">
        <div className="login-box">

          <div className="form-top">
            <h2>Admin Login</h2>
            <p>Superuser access panel</p>
          </div>

          {message && (
            <div className="form-message error">{message}</div>
          )}

          <div className="input-wrapper">
            <input
              type="email"
              placeholder="Admin Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>

          <div className="input-wrapper">
            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>

          <button className="auth-btn" onClick={handleLogin}>
            Login as Admin
          </button>

        </div>
      </div>
    </div>
  );
}

export default AdminLogin;