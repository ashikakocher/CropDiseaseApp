import React, { useEffect, useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import API from "../services/api";
import "../components/SupplierDashboard.css";

import {
  FaStore,
  FaCapsules,
  FaPlusCircle,
  FaSignOutAlt,
  FaUserCircle,
} from "react-icons/fa";

function SupplierDashboard() {
  const navigate = useNavigate();

  const supplierToken = localStorage.getItem("supplier_token");

  const [shopCount, setShopCount] = useState(0);
  const [medicineCount, setMedicineCount] = useState(0);

  const fetchDashboardCounts = useCallback(async () => {
    try {
      const response = await API.get("/shops/my-shops", {
        headers: {
          Authorization: `Bearer ${supplierToken}`,
        },
      });

      const shops = response.data || [];
      setShopCount(shops.length);

      const totalMedicines = shops.reduce(
        (sum, shop) => sum + (shop.total_medicines || 0),
        0
      );

      setMedicineCount(totalMedicines);
    } catch (error) {
      console.log(error.response?.data);
      setShopCount(0);
      setMedicineCount(0);
    }
  }, [supplierToken]);

  useEffect(() => {
    if (!supplierToken) {
      navigate("/supplier-login");
      return;
    }

    fetchDashboardCounts();
  }, [supplierToken, navigate, fetchDashboardCounts]);

  const handleLogout = () => {
    localStorage.removeItem("supplier_token");
    localStorage.removeItem("user_role");
    navigate("/supplier-login");
  };

  return (
    <div className="supplier-dashboard-page">
      <div className="supplier-dashboard-header">
        <div>
          <h1>Supplier Dashboard</h1>
          <p>
            Manage your shops, medicines, and supplier activity from one
            place.
          </p>
        </div>

        <button className="supplier-logout-btn" onClick={handleLogout}>
          <FaSignOutAlt /> Logout
        </button>
      </div>

      <div className="supplier-welcome-card">
        <div className="supplier-welcome-left">
          <FaUserCircle className="supplier-user-icon" />
          <div>
            <h2>Welcome, Supplier</h2>
            <p>
              You can add shops, manage medicines, and keep your listings
              updated for farmers.
            </p>
          </div>
        </div>
      </div>

      <div className="supplier-stats-grid">
        <div className="supplier-stat-card">
          <FaStore className="supplier-stat-icon" />
          <h3>Total Shops</h3>
          <p>{shopCount}</p>
        </div>

        <div className="supplier-stat-card">
          <FaCapsules className="supplier-stat-icon" />
          <h3>Total Medicines</h3>
          <p>{medicineCount}</p>
        </div>

        <div className="supplier-stat-card">
          <FaPlusCircle className="supplier-stat-icon" />
          <h3>Quick Actions</h3>
          <p>Manage inventory</p>
        </div>
      </div>

      <div className="supplier-actions-section">
        <h2>Quick Actions</h2>

        <div className="supplier-actions-grid">
          <div
            className="supplier-action-card"
            onClick={() => navigate("/add-shop")}
          >
            <FaStore className="supplier-action-icon" />
            <h3>Add Shop</h3>
            <p>Create and register a new medical or agri-input shop.</p>
          </div>

          <div
            className="supplier-action-card"
            onClick={() => navigate("/my-shops")}
          >
            <FaStore className="supplier-action-icon" />
            <h3>My Shops</h3>
            <p>View, edit, and manage all your shops and medicines.</p>
          </div>

          <div
            className="supplier-action-card"
            onClick={() => navigate("/supplier-profile")}
          >
            <FaUserCircle className="supplier-action-icon" />
            <h3>Supplier Profile</h3>
            <p>View and manage your supplier account details.</p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default SupplierDashboard;