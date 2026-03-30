import React from "react";
import { NavLink, useNavigate } from "react-router-dom";
import {
  FaTachometerAlt,
  FaUsers,
  FaStore,
  FaPills,
  FaLeaf,
  FaSignOutAlt,
  FaUserShield,
} from "react-icons/fa";
import { FaUserMd, FaChartLine, FaComments } from "react-icons/fa";
function AdminSidebar() {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("admin_token");
    localStorage.removeItem("user_role");
    navigate("/admin-login");
  };

  return (
    <aside className="admin-sidebar">
      <div className="admin-logo">
        <FaUserShield />
        <span>Admin Panel</span>
      </div>

      <div className="admin-menu-title">Main Menu</div>

      <nav className="admin-nav">
        <NavLink to="/admin/dashboard" className="admin-link">
          <FaTachometerAlt /> <span>Dashboard</span>
        </NavLink>

        <NavLink to="/admin/users" className="admin-link">
          <FaUsers /> <span>Manage Users</span>
        </NavLink>

        <NavLink to="/admin/shops" className="admin-link">
          <FaStore /> <span>Manage Shops</span>
        </NavLink>

        <NavLink to="/admin/medicines" className="admin-link">
          <FaPills /> <span>Manage Medicines</span>
        </NavLink>

        <NavLink to="/admin/suppliers" className="admin-link">
  <FaUsers /> <span>Manage Suppliers</span>
</NavLink>


<NavLink to="/admin/predictions" className="admin-link">
  <FaChartLine /> <span>Manage Predictions</span>
</NavLink>

      </nav>
      

      <button className="admin-logout-btn" onClick={handleLogout}>
        <FaSignOutAlt /> Logout
      </button>
    </aside>
  );
}

export default AdminSidebar;