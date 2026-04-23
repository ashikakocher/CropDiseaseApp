import React, { useState } from "react";
import API from "../services/api";
import "../components/Dashboard.css";
import Navbar from "./Navbar";
import Footer from "./Footer";
import { CircularProgressbar, buildStyles } from "react-circular-progressbar";
import "react-circular-progressbar/dist/styles.css";
import AIChatbot from "./AIchatbot";
import { useRef } from "react";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";

function Dashboard() {
  const [image, setImage] = useState(null);
  const [preview, setPreview] = useState(null);
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [isChatOpen, setIsChatOpen] = useState(false);
  const resultRef = useRef();

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
  const handleDownloadPDF = async () => {
  if (!resultRef.current) return;

  const canvas = await html2canvas(resultRef.current);
  const imgData = canvas.toDataURL("image/png");

  const pdf = new jsPDF("p", "mm", "a4");

  const imgWidth = 210;
  const pageHeight = 295;
  const imgHeight = (canvas.height * imgWidth) / canvas.width;

  let position = 0;

  pdf.addImage(imgData, "PNG", 0, position, imgWidth, imgHeight);

  pdf.save("Crop_Diagnosis_Result.pdf");
};

  return (
    <>
       <Navbar onAiHelpClick={() => setIsChatOpen(true)} />

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
{/* RIGHT SIDE */}
<div>
  {!result ? (
    /* DEFAULT CONTENT */
<div className="info-card">
  <div className="info-grid">

    {/* LEFT SIDE */}
    <div>
      <h2>🌿 How It Works</h2>

      <div className="info-steps">
        <div className="step">
          <span>1</span>
          <p>Upload a clear image of your crop</p>
        </div>

        <div className="step">
          <span>2</span>
          <p>AI analyzes the disease instantly</p>
        </div>

        <div className="step">
          <span>3</span>
          <p>Get treatments & nearby medicine shops</p>
        </div>
      </div>
    </div>

    {/* RIGHT SIDE */}
    <div className="info-tips">
      <h2>💡 Tips for Better Results</h2>

      <ul>
        <li>Use clear, well-lit images</li>
        <li>Focus on affected area</li>
        <li>Avoid blurry photos</li>
      </ul>
    </div>

  </div>
</div>
  ) : (
    /* RESULT SECTION */
    <div className="ai-result-container" ref={resultRef}>
      <div className="result-actions">
  <button className="pdf-btn" onClick={handleDownloadPDF}>
    📄 Download PDF
  </button>
</div>
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

          {result.treatments?.length > 0 ? (
            result.treatments.map((item, index) => (
              <div key={index} className="treatment-item">
                <p><b>Medicine:</b> {item.medicine_name}</p>
                <p><b>Dosage:</b> {item.dosage || "Not available"}</p>
                {index !== result.treatments.length - 1 && <hr />}
              </div>
            ))
          ) : (
            <p>No treatment found for this disease.</p>
          )}
        </div>

{/* Shops */}
<div className="ai-card shops-card">
  <h3>Available Shops in Your Area</h3>

  {result.shops?.length > 0 ? (
    result.shops.map((shop, index) => (
      <div key={index} className="shop-item">
        <p><b>{shop.shop_name}</b></p>
        <p>{shop.address}</p>
        <p>
          {shop.city}
          {shop.area ? `, ${shop.area}` : ""}
        </p>

        {/* ✅ MAP BUTTON */}
        <button
          className="map-btn"
          onClick={() => {
            const location = `${shop.shop_name}, ${shop.address}, ${shop.city}`;
            window.open(
              `https://www.google.com/maps/search/${encodeURIComponent(location)}`,
              "_blank"
            );
          }}
        >
          📍 View on Map
        </button>

        {/* MEDICINES */}
        <div className="shop-medicines">
          <p><b>Available Medicines:</b></p>

          {shop.medicines.map((med, i) => (
            <div key={i} className="shop-medicine-row">
              <p>{med.medicine_name}</p>
              <p>₹{med.price ?? "N/A"}</p>
            </div>
          ))}
        </div>

        {index !== result.shops.length - 1 && <hr />}
      </div>
    ))
  ) : (
    <p>No matching shops found.</p>
  )}
</div>
      </div>
    </div>
  )}
</div>
        </div>
      </div>
       <AIChatbot
        isOpen={isChatOpen}
        onClose={() => setIsChatOpen(false)}
      />
      <Footer />
    </>
  );
}

export default Dashboard;