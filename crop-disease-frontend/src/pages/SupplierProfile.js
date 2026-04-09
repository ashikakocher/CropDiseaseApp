import React, { useEffect, useState } from "react";
import API from "../services/api";
import "../components/SupplierProfile.css";
import Navbar from "./Navbar";
import {
  FaUserCircle,
  FaEdit,
  FaSave,
  FaPhone,
  FaMapMarkerAlt,
  FaEnvelope,
  FaStore,
} from "react-icons/fa";
import Footer from "./Footer";

function SupplierProfile() {
  const supplierToken = localStorage.getItem("supplier_token");

  const [profile, setProfile] = useState({
    name: "",
    email: "",
    phone: "",
    city: "",
    area: "",
  });

  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("profile");

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await API.get("/suppliers/profile", {
          headers: {
            Authorization: `Bearer ${supplierToken}`,
          },
        });

        setProfile({
          name: res.data.name || "",
          email: res.data.email || "",
          phone: res.data.phone || "",
          city: res.data.city || "",
          area: res.data.area || "",
        });
      } catch (err) {
        console.log(err);
      } finally {
        setLoading(false);
      }
    };

    if (supplierToken) fetchProfile();
  }, [supplierToken]);

  const handleChange = (e) => {
    setProfile({ ...profile, [e.target.name]: e.target.value });
  };

  const handleSave = async () => {
    try {
      await API.put("/suppliers/profile", profile, {
        headers: {
          Authorization: `Bearer ${supplierToken}`,
        },
      });

      setIsEditing(false);
      alert("Profile updated successfully ✅");
    } catch (err) {
      console.log(err);
      alert("Failed to update profile");
    }
  };

  if (loading) {
    return (
      <>
        <Navbar />
        <div className="supplier-profile-wrapper">
          <p className="supplier-loading">Loading profile...</p>
        </div>
      </>
    );
  }

  return (
    <>
      <Navbar />

      <div className="supplier-profile-wrapper">
        <div className="supplier-profile-layout">
          {/* LEFT SIDEBAR CARD */}
          <div className="supplier-sidebar-card">
            <div className="supplier-avatar-wrap">
              <FaUserCircle className="supplier-avatar-icon" />
            </div>

            <h2>{profile.name || "Supplier Name"}</h2>
            <p className="supplier-location-text">
              {profile.city || profile.area
                ? `${profile.city || ""}${profile.city && profile.area ? ", " : ""}${profile.area || ""}`
                : "Location not set"}
            </p>

            <div className="supplier-plan-box">
              <span>Account Type</span>
              <h3>Supplier Account</h3>
            </div>

            <button className="supplier-side-btn">
              <FaStore /> Manage Account
            </button>
          </div>

          {/* RIGHT CONTENT */}
          <div className="supplier-main-content">
            {/* TABS */}
            <div className="supplier-top-tabs">
              <button
                className={activeTab === "profile" ? "active" : ""}
                onClick={() => setActiveTab("profile")}
              >
                Profile
              </button>

              
            </div>

            {/* PROFILE TAB */}
            {activeTab === "profile" && (
              <div className="supplier-content-card">
                <div className="supplier-content-header">
                  <h1>Profile Information</h1>
                  <p>Manage your supplier information and preferences.</p>
                </div>

                <div className="supplier-form-grid">
                  <div className="supplier-input-group">
                    <label>Full Name</label>
                    <div className="input-icon-wrap">
                      <input
                        type="text"
                        name="name"
                        value={profile.name}
                        onChange={handleChange}
                        disabled={!isEditing}
                        placeholder="Enter full name"
                      />
                    </div>
                  </div>

                  <div className="supplier-input-group">
                    <label>Email</label>
                    <div className="input-icon-wrap">
                      <FaEnvelope className="field-icon" />
                      <input
                        type="email"
                        value={profile.email}
                        disabled
                        placeholder="Email"
                      />
                    </div>
                  </div>

                  <div className="supplier-input-group">
                    <label>Phone Number</label>
                    <div className="input-icon-wrap">
                      <FaPhone className="field-icon" />
                      <input
                        type="text"
                        name="phone"
                        value={profile.phone}
                        onChange={handleChange}
                        disabled={!isEditing}
                        placeholder="Enter phone number"
                      />
                    </div>
                  </div>

                  <div className="supplier-input-group">
                    <label>City</label>
                    <div className="input-icon-wrap">
                      <FaMapMarkerAlt className="field-icon" />
                      <input
                        type="text"
                        name="city"
                        value={profile.city}
                        onChange={handleChange}
                        disabled={!isEditing}
                        placeholder="Enter city"
                      />
                    </div>
                  </div>

                  <div className="supplier-input-group supplier-full-width">
                    <label>Area</label>
                    <div className="input-icon-wrap">
                      <FaMapMarkerAlt className="field-icon" />
                      <input
                        type="text"
                        name="area"
                        value={profile.area}
                        onChange={handleChange}
                        disabled={!isEditing}
                        placeholder="Enter area"
                      />
                    </div>
                  </div>
                </div>

                <div className="supplier-action-row">
                  {!isEditing ? (
                    <button
                      className="supplier-edit-btn"
                      onClick={() => setIsEditing(true)}
                    >
                      <FaEdit /> Edit Profile
                    </button>
                  ) : (
                    <button className="supplier-save-btn" onClick={handleSave}>
                      <FaSave /> Save Changes
                    </button>
                  )}
                </div>
              </div>
            )}

           
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
}

export default SupplierProfile;