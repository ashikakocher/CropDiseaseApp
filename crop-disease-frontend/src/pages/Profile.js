import React, { useState, useEffect } from "react";
import Navbar from "./Navbar";
import Footer from "./Footer";
import API from "../services/api";
import "../components/Profile.css";

function Profile() {

  const [profile, setProfile] = useState({
    name: "",
    email: "",
    phone: "",
    farmName: "",
    location: "",
    farmSize: "",
    crop: ""
  });

  // Handle form change
  const handleChange = (e) => {
    setProfile({
      ...profile,    //spread operator
      [e.target.name]: e.target.value 
    });
  };

  // Fetch user info when page loads
  useEffect(() => {
     //UseEffect is used for API calls,fetching data,loading user info
    const fetchProfile = async () => {

      const token = localStorage.getItem("token");  //gets the JWT token after login

      try {

        const response = await API.get(
          "/users/me",  // sends get req to backend and gets current-logged inn user data
          {
            headers: {
              Authorization: `Bearer ${token}`    //sends token to backend and verifies the user
            }
          }
        );

        setProfile(prev => ({   //load previous profile state
          ...prev,              //keep existing values
          name: response.data.name,  
          email: response.data.email,
          phone: response.data.phone
        }));

      } catch (error) {
        console.log("Profile load error:", error);
      }

    };

    fetchProfile();

  }, []);   //[] depicts run only once when page loads ,[profile] would run everytime profile changes

  // Save profile (for future update feature)
  const handleSave = () => {
    alert("Profile saved successfully!");
    console.log(profile);
  };

  return (
    <>
      <Navbar />

      <div className="profile-container">

        <h1>👤 My Profile</h1>
        <p className="profile-subtitle">
          Manage your personal information and farm details
        </p>

        {/* BASIC INFO */}

        <div className="profile-card">

          <h2>Basic Information</h2>

          <div className="profile-grid">

            <div>
              <label>Full Name</label>
              <input
                name="name"
                value={profile.name}
                onChange={handleChange}
              />
            </div>

            <div>
              <label>Email</label>
              <input
                name="email"
                value={profile.email}
                onChange={handleChange}
              />
            </div>

            <div>
              <label>Phone Number</label>
              <input
                name="phone"
                value={profile.phone}
                onChange={handleChange}
              />
            </div>

          </div>

        </div>


        {/* FARM INFO */}

        <div className="profile-card">

          <h2>Farm Information</h2>

          <div className="profile-grid">

            <div>
              <label>Farm Name</label>
              <input
                name="farmName"
                value={profile.farmName}
                onChange={handleChange}
                placeholder="Enter farm name"
              />
            </div>

            <div>
              <label>Location</label>
              <input
                name="location"
                value={profile.location}
                onChange={handleChange}
                placeholder="City, State"
              />
            </div>

            <div>
              <label>Farm Size</label>
              <input
                name="farmSize"
                value={profile.farmSize}
                onChange={handleChange}
                placeholder="e.g. 10 acres"
              />
            </div>

            <div>
              <label>Primary Crop</label>
              <input
                name="crop"
                value={profile.crop}
                onChange={handleChange}
                placeholder="e.g. Tomato"
              />
            </div>

          </div>

        </div>


        {/* SAVE BUTTON */}

        <button className="save-btn" onClick={handleSave}>
          Save Changes
        </button>

      </div>
      <Footer />
    </>
  );
}

export default Profile;