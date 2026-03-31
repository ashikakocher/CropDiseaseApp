import React, { useState, useEffect } from "react";
import Navbar from "./Navbar";
import Footer from "./Footer";
import API from "../services/api";
import "../components/Profile.css";
import {
  FaUserCircle,
  FaEnvelope,
  FaPhoneAlt,
  FaMapMarkerAlt,
  FaSeedling,
  FaTractor,
  FaLeaf,
  FaSave,
} from "react-icons/fa";

function Profile() {
  const [profile, setProfile] = useState({
    name: "",
    email: "",
    phone: "",
    farmName: "",
    location: "",
    farmSize: "",
    crop: "",
  });

  const [loadingLocation, setLoadingLocation] = useState(false);

  const handleChange = (e) => {
    setProfile({
      ...profile,
      [e.target.name]: e.target.value,
    });
  };

  useEffect(() => {
    const fetchProfile = async () => {
      const token = localStorage.getItem("token");

      try {
        const response = await API.get("/users/me", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        setProfile((prev) => ({
          ...prev,
          name: response.data.name || "",
          email: response.data.email || "",
          phone: response.data.phone || "",
        }));
      } catch (error) {
        console.log("Profile load error:", error);
      }
    };

    fetchProfile();
  }, []);

  useEffect(() => {
    fetchLocation();
  }, []);

  const fetchLocation = () => {
    if (!navigator.geolocation) {
      console.log("Geolocation is not supported by this browser.");
      return;
    }

    setLoadingLocation(true);

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const latitude = position.coords.latitude.toFixed(4);
        const longitude = position.coords.longitude.toFixed(4);

        setProfile((prev) => ({
          ...prev,
          location: `Lat: ${latitude}, Lng: ${longitude}`,
        }));

        setLoadingLocation(false);
      },
      (error) => {
        console.log("Location error:", error);
        setLoadingLocation(false);
      }
    );
  };

  const handleSave = () => {
    alert("Profile saved successfully!");
    console.log(profile);
  };

  return (
    <>
      <Navbar />

      <div className="profile-page">
        {/* HERO */}
        <section className="profile-hero">
          <div className="profile-hero-left">
            <span className="profile-badge">🌿 Farmer Profile</span>
            <h1>Manage Your CropGuard Profile</h1>
            <p>
              Keep your personal details and farm information updated so
              CropGuard can serve you better.
            </p>
          </div>

          <div className="profile-hero-right">
            <div className="profile-summary-card">
              <div className="profile-avatar">
                <FaUserCircle />
              </div>
              <h3>{profile.name || "Farmer"}</h3>
              <p>{profile.email || "No email available"}</p>
              <span className="profile-role">CropGuard User</span>
            </div>
          </div>
        </section>

        {/* MAIN CONTENT */}
        <div className="profile-container">
          {/* BASIC INFO */}
          <div className="profile-card">
            <div className="card-heading">
              <h2>Basic Information</h2>
              <p>Your account details</p>
            </div>

            <div className="profile-grid">
              <div className="input-group">
                <label>
                  <FaUserCircle className="input-icon" /> Full Name
                </label>
                <input
                  name="name"
                  value={profile.name}
                  onChange={handleChange}
                  placeholder="Enter your full name"
                />
              </div>

              <div className="input-group">
                <label>
                  <FaEnvelope className="input-icon" /> Email
                </label>
                <input
                  name="email"
                  value={profile.email}
                  onChange={handleChange}
                  placeholder="Enter your email"
                />
              </div>

              <div className="input-group">
                <label>
                  <FaPhoneAlt className="input-icon" /> Phone Number
                </label>
                <input
                  name="phone"
                  value={profile.phone}
                  onChange={handleChange}
                  placeholder="Enter your phone number"
                />
              </div>

              <div className="input-group">
                <label>
                  <FaMapMarkerAlt className="input-icon" /> Current Location
                </label>
                <div className="location-row">
                  <input
                    name="location"
                    value={profile.location}
                    onChange={handleChange}
                    placeholder="Fetching location..."
                  />
                  <button
                    type="button"
                    className="location-btn"
                    onClick={fetchLocation}
                  >
                    {loadingLocation ? "Fetching..." : "Fetch"}
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* FARM INFO */}
          <div className="profile-card">
            <div className="card-heading">
              <h2>Farm Information</h2>
              <p>Your agricultural details</p>
            </div>

            <div className="profile-grid">
              <div className="input-group">
                <label>
                  <FaTractor className="input-icon" /> Farm Name
                </label>
                <input
                  name="farmName"
                  value={profile.farmName}
                  onChange={handleChange}
                  placeholder="Enter farm name"
                />
              </div>

              <div className="input-group">
                <label>
                  <FaMapMarkerAlt className="input-icon" /> Farm Location
                </label>
                <input
                  name="location"
                  value={profile.state}
                  onChange={handleChange}
                  placeholder="Location"
                />
              </div>

              <div className="input-group">
                <label>
                  <FaSeedling className="input-icon" /> Farm Size
                </label>
                <input
                  name="farmSize"
                  value={profile.farmSize}
                  onChange={handleChange}
                  placeholder="e.g. 10 acres"
                />
              </div>

              <div className="input-group">
                <label>
                  <FaLeaf className="input-icon" /> Primary Crop
                </label>
                <input
                  name="crop"
                  value={profile.crop}
                  onChange={handleChange}
                  placeholder="e.g. Tomato"
                />
              </div>
            </div>
          </div>

          {/* ACTION */}
          <div className="profile-action-wrap">
            <button className="save-btn" onClick={handleSave}>
              <FaSave /> Save Changes
            </button>
          </div>
        </div>
      </div>

      <Footer />
    </>
  );
}

export default Profile;