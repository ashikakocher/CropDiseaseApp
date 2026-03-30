import React, { useState } from "react";
import API from "../services/api";
import "../components/Dashboard.css";
import Navbar from "./Navbar";
import Footer from "./Footer";
import { CircularProgressbar, buildStyles } from "react-circular-progressbar";
import "react-circular-progressbar/dist/styles.css";

function Dashboard() {
  const [image, setImage] = useState(null);
  const [preview, setPreview] = useState(null);
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);

  // Handle Image Upload
  const handleImage = (file) => {
    if (!file.type.startsWith("image/")) {
      alert("Please upload an image file");
      return;
    }

    setImage(file);
    setPreview(URL.createObjectURL(file));
    setResult(null);
  };

  // Remove Image
  const removeImage = () => {
    setImage(null);
    setPreview(null);
    setResult(null);
  };

  // Predict Disease
  const handlePredict = async () => {
    if (!image) {
      alert("Please upload an image first");
      return;
    }

    const formData = new FormData();
    formData.append("file", image);

    const token = localStorage.getItem("token");

    try {
      setLoading(true);

      const response = await API.post("/predict", formData, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });

      setResult(response.data);
    } catch (err) {
      console.log(err);
      alert("Prediction failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Navbar />

      <div className="dashboard-container">
        {/* TOP HERO */}
  <div className="top-card">
    <div className="top-icon">🌿</div>
    <h1>Crop Doctor AI</h1>
    <p>
      Our advanced AI model analyzes plant images to detect diseases and provide treatment recommendations
    </p>

    <div className="top-tags">
      <span>● AI-Powered</span>
      <span>● Expert-Verified</span>
      <span>● Fast Results</span>
    </div>
  </div>

  {/* STATS */}
  <div className="stats-row">
    <div className="stat-card green">
  <div className="stat-text">
    <p>Scans Today</p>
    <h2>42</h2>
  </div>

  <div className="stat-icon">📷</div>
</div>

    <div className="stat-card blue">
  <div className="stat-text">
    <p>Accuracy Rate</p>
    <h2>94.5%</h2>
  </div>
  <div className="stat-icon">✔️</div>
</div>

    <div className="stat-card yellow">
  <div className="stat-text">
    <p>Diseases Identified</p>
    <h2>40+</h2>
  </div>
  <div className="stat-icon">📖</div>
</div>
  </div>

 


        {/* MAIN GRID */}
        <div className="dashboard-grid">
          {/* UPLOAD */}
          <div className="upload-card">
            <h2>Upload Crop Image</h2>

            {preview ? (
              <>
                <img src={preview} className="preview-img" alt="preview" />

                <button className="remove-btn" onClick={removeImage}>
                  Remove Image
                </button>
              </>
            ) : (
              <div className="upload-placeholder">
                <p>Drag & Drop Crop Image</p>

                <label className="browse-btn">
                  Browse Image

                  <input
                    type="file"
                    hidden
                    onChange={(e) => handleImage(e.target.files[0])}
                  />
                </label>
              </div>
            )}

            <button
              className="scan-btn"
              onClick={handlePredict}
              disabled={loading}
            >
              {loading ? "Analyzing..." : "Analyze Crop"}
            </button>

            {loading && (
              <p className="loading-text">🔍 AI is analyzing crop...</p>
            )}
          </div>

          
          {/* RESULT */}
          {result && (
            <div className="ai-result-container">
              <h2 className="ai-result-title">🌿 AI Diagnosis Result</h2>

              <div className="ai-result-grid">
                {/* Confidence */}
                <div className="ai-card confidence-card">
                  <h3>Model Confidence</h3>

                  <div className="circle-wrapper">
                    <CircularProgressbar
                      value={result.confidence}
                      text={`${result.confidence}%`}
                      styles={buildStyles({
                        textSize: "18px",
                        pathColor: "#4caf50",
                        textColor: "#2e7d32",
                        trailColor: "#e0e0e0"
                      })}
                    />
                  </div>
                </div>

                {/* Disease */}
                <div className="ai-card disease-card">
                  <h3>Disease Detected</h3>

                  <div className="disease-icon">🌿</div>

                  <h2>{result.disease}</h2>

                  <p><b>Crop:</b> {result.crop}</p>

                  <p className={`severity ${result.severity?.toLowerCase()}`}>
                    Severity: {result.severity}
                  </p>
                </div>

              
                {/* Treatment */}
                <div className="ai-card treatment-card">
                  <h3>Recommended Treatments</h3>

                  {result.treatments && result.treatments.length > 0 ? (
                    <div className="treatment-list">
                      {result.treatments.map((item, index) => (
                        <div key={index} className="treatment-item">
                          <p>
                            <b>Medicine:</b> {item.medicine_name}
                          </p>
                          <p>
                            <b>Dosage:</b> {item.dosage || "Not available"}
                          </p>
                          {index !== result.treatments.length - 1 && <hr />}
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p>No treatment found for this disease.</p>
                  )}
                </div>

                {/* Shops */}
                <div className="ai-card shops-card">
  <h3>Available Shops in Your Area</h3>

  {result.shops && result.shops.length > 0 ? (
    <div className="shops-list">
      {result.shops.map((shop, index) => (
        <div key={index} className="shop-item">
          <p><b>{shop.shop_name}</b></p>
          <p>{shop.address}</p>
          <p>
            {shop.city}
            {shop.area ? `, ${shop.area}` : ""}
          </p>

          <div className="shop-medicines">
            <p><b>Available Medicines:</b></p>

            {shop.medicines.map((med, medIndex) => (
  <div key={medIndex} className="shop-medicine-row">
    <p><b>Medicine:</b> {med.medicine_name}</p>
    <p><b>Price:</b> ₹{med.price ?? "N/A"}</p>
    <p><b>Stock:</b> {med.stock_quantity ?? "N/A"}</p>
    <p><b>Dosage:</b> {med.dosage || "Not available"}</p>
  </div>
))}
          </div>

          {index !== result.shops.length - 1 && <hr />}
        </div>
      ))}
    </div>
  ) : (
    <p>No matching shops found in your city/area.</p>
  )}
</div>
              </div>
            </div>
          )}
        </div>
      </div>
      <Footer />
    </>
  );
}

export default Dashboard;