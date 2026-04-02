import React from "react";
import { useNavigate } from "react-router-dom";
import {
  FaStore,
  FaCapsules,
  FaChartLine,
  FaBoxes,
  FaExclamationTriangle,
  FaMapMarkedAlt,
  FaUserMd,
  FaClipboardList,
} from "react-icons/fa";
import "../components/SupplierDashboard.css";
import Navbar from "./SupplierNavbar";
import Footer from "./Footer";
function SupplierDashboard() {
  const navigate = useNavigate();

  return (
    <>
    <Navbar />
    
    <div className="supplier-dashboard-page">
      {/* HERO SECTION */}
      <section className="supplier-hero">
        <div className="supplier-hero-content">
          <span className="supplier-badge">🏪 Agro Supplier Management Panel</span>

          <h1>
            Manage Your <span>Shops, Medicines</span> & Stock Easily
          </h1>

          <p>
            Keep track of your agricultural medicine inventory, add new shops,
            update stock levels, and help farmers find the right treatments near them.
          </p>

          <div className="supplier-hero-buttons">
            <button onClick={() => navigate("/add-shop")} className="primary-btn">
              Add Shop
            </button>
            <button onClick={() => navigate("/my-shops")} className="secondary-btn">
              View My Shops
            </button>
          </div>
        </div>

        <div className="supplier-hero-image-card">
          <img
            src="https://images.unsplash.com/photo-1586771107445-d3ca888129ff?q=80&w=1200&auto=format&fit=crop"
            alt="Supplier Dashboard"
          />
          <div className="supplier-image-overlay">
            <p>📦 Smart Stock Management</p>
            <small>Organize medicines, track availability, and support farmers better.</small>
          </div>
        </div>
      </section>

      {/* FEATURES SECTION */}
      <section className="supplier-section white-section">
        <div className="section-heading">
          <span className="section-badge">💊 SUPPLIER FEATURES</span>
          <h2>How This Dashboard Helps Suppliers</h2>
          <p>
            This panel is designed to make shop and medicine management simple,
            fast, and organized.
          </p>
        </div>

        <div className="supplier-card-grid">
          <div className="supplier-feature-card">
            <FaStore className="feature-icon" />
            <h3>Manage Shops</h3>
            <p>
              Add multiple shops, update addresses, and manage all your store details from one place.
            </p>
          </div>

          <div className="supplier-feature-card">
            <FaCapsules className="feature-icon" />
            <h3>Medicine Inventory</h3>
            <p>
              Add medicines with dosage, treatment details, stock quantity, and price information.
            </p>
          </div>

          <div className="supplier-feature-card">
            <FaExclamationTriangle className="feature-icon" />
            <h3>Low Stock Alerts</h3>
            <p>
              Quickly identify medicines that are running low so you can restock on time.
            </p>
          </div>
        </div>
      </section>

      {/* WORKFLOW SECTION */}
      <section className="supplier-section green-section">
        <div className="section-heading">
          <span className="section-badge">⚙️ WORKFLOW</span>
          <h2>How Supplier Dashboard Works</h2>
          <p>
            Manage your medicine business in a few simple steps.
          </p>
        </div>

        <div className="workflow-steps">
          <div className="workflow-step">
            <div className="step-number">1</div>
            <h4>Create Shop</h4>
            <p>Add your shop details like name, city, area, and address.</p>
          </div>

          <div className="workflow-step">
            <div className="step-number">2</div>
            <h4>Add Medicines</h4>
            <p>Upload medicine information, stock quantity, dosage, and price.</p>
          </div>

          <div className="workflow-step">
            <div className="step-number">3</div>
            <h4>Manage Inventory</h4>
            <p>Update existing stock and maintain correct availability.</p>
          </div>

          <div className="workflow-step">
            <div className="step-number">4</div>
            <h4>Support Farmers</h4>
            <p>Your listed medicines can help farmers find treatment options nearby.</p>
          </div>
        </div>
      </section>

      {/* BENEFITS SECTION */}
      <section className="supplier-section white-section benefits-flex">
        <div className="benefits-left">
          <span className="section-badge">📈 BUSINESS BENEFITS</span>
          <h2>Grow Your Agro Medicine Business</h2>
          <p>
            Use this dashboard to improve inventory control, increase visibility,
            and provide better service to nearby farmers.
          </p>

          <ul className="benefits-list">
            <li>✅ Easy medicine and stock management</li>
            <li>✅ Better visibility for your shops</li>
            <li>✅ Faster updates for price and availability</li>
            <li>✅ Reduced manual record-keeping</li>
            <li>✅ Organized supplier operations</li>
          </ul>
        </div>

        <div className="benefits-right">
          <img
            src="https://images.unsplash.com/photo-1574943320219-553eb213f72d?q=80&w=1200&auto=format&fit=crop"
            alt="Agro business"
          />
        </div>
      </section>

      {/* QUICK ACTIONS */}
      <section className="supplier-section blue-section">
        <div className="section-heading">
          <span className="section-badge">🚀 QUICK ACTIONS</span>
          <h2>Supplier Dashboard Shortcuts</h2>
          <p>Access your most important actions quickly.</p>
        </div>

        <div className="supplier-card-grid">
          <div className="supplier-action-card" onClick={() => navigate("/add-shop")}>
            <FaMapMarkedAlt className="feature-icon" />
            <h3>Add New Shop</h3>
            <p>Create a new agro medicine shop and make it available for farmers.</p>
          </div>

          <div className="supplier-action-card" onClick={() => navigate("/my-shops")}>
            <FaBoxes className="feature-icon" />
            <h3>Manage Inventory</h3>
            <p>Check stock, update medicines, and edit shop details.</p>
          </div>

          <div className="supplier-action-card" onClick={() => navigate("/supplier-profile")}>
            <FaClipboardList className="feature-icon" />
            <h3>Supplier Profile</h3>
            <p>View and manage your supplier account details.</p>
          </div>

          <div className="supplier-action-card" onClick={() => navigate("/supplier-analytics")}>
            <FaChartLine className="feature-icon" />
            <h3>Business Analytics</h3>
            <p>Track total shops, medicines, and inventory insights.</p>
          </div>
        </div>
      </section>
    </div>
    <Footer />
    </>
  );
}

export default SupplierDashboard;