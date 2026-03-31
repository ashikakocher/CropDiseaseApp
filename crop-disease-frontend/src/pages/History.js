import React, { useEffect, useState } from "react";
import API from "../services/api";
import "../components/History.css";
import Navbar from "./Navbar";
import Footer from "./Footer";
import {
  FaSearch,
  FaLeaf,
  FaTrashAlt,
  FaCalendarAlt,
  FaTimes,
} from "react-icons/fa";
import { CircularProgressbar, buildStyles } from "react-circular-progressbar";
import "react-circular-progressbar/dist/styles.css";

function History() {
  const [predictions, setPredictions] = useState([]);
  const [search, setSearch] = useState("");
  const [selectedPrediction, setSelectedPrediction] = useState(null);

  const fetchHistory = async () => {
    const token = localStorage.getItem("token");

    try {
      const response = await API.get("/my-history", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      setPredictions(response.data);
    } catch (error) {
      console.log(error);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this prediction?")) {
      return;
    }

    const token = localStorage.getItem("token");

    try {
      await API.delete(`/delete-prediction/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      setPredictions(predictions.filter((item) => item.id !== id));

      if (selectedPrediction?.id === id) {
        setSelectedPrediction(null);
      }
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    fetchHistory();
  }, []);

  const filtered = predictions.filter(
    (item) =>
      item.crop?.toLowerCase().includes(search.toLowerCase()) ||
      item.disease?.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <>
      <Navbar />

      <div className="history-page">
        <section className="history-hero">
          <div className="history-hero-left">
            <span className="history-badge">🌿 Smart Scan Records</span>
            <h1>Your Prediction History</h1>
            <p>
              View all your crop disease diagnoses in one place. Search previous
              scans, track disease trends, and manage your plant health records
              easily.
            </p>

            <div className="history-search-box">
              <FaSearch className="search-icon" />
              <input
                type="text"
                placeholder="Search by crop or disease..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>
          </div>

          <div className="history-hero-right">
            <div className="history-hero-card">
              <div className="history-hero-card-content">
                <h3>📋 Stored AI Diagnoses</h3>
                <p>
                  Click any prediction card to view full diagnosis details in a
                  popup modal.
                </p>
              </div>
            </div>
          </div>
        </section>

        <section className="history-stats">
          <div className="history-stat-card">
            <h3>{predictions.length}</h3>
            <p>Total Predictions</p>
          </div>

          <div className="history-stat-card">
            <h3>{[...new Set(predictions.map((item) => item.crop))].length}</h3>
            <p>Crops Scanned</p>
          </div>

          <div className="history-stat-card">
            <h3>
              {[...new Set(predictions.map((item) => item.disease))].length}
            </h3>
            <p>Diseases Found</p>
          </div>
        </section>

        <section className="history-section">
          <div className="section-heading">
            <span>🕒 RECENT RECORDS</span>
            <h2>Your Scan History</h2>
            <p>Click on any card to view the complete prediction result.</p>
          </div>

          {filtered.length === 0 ? (
            <div className="empty-state">
              <div className="empty-icon">🕒</div>
              <h3>No scans found</h3>
              <p>Upload a crop photo to get started</p>
            </div>
          ) : (
            <div className="history-grid">
              {filtered.map((item) => (
                <div
                  key={item.id}
                  className="history-card clickable-card"
                  onClick={() => setSelectedPrediction(item)}
                >
                  <div className="history-image-wrap">
                    {item.image_path ? (
                      <img
                        src={`http://127.0.0.1:8000/${item.image_path}`}
                        alt="leaf"
                      />
                    ) : (
                      <div className="history-no-image">
                        <FaLeaf />
                        <span>No Image</span>
                      </div>
                    )}
                  </div>

                  <div className="history-info">
                    <div className="history-top-row">
                      <h3>{item.disease}</h3>
                      <span className={`severity ${item.severity?.toLowerCase()}`}>
                        {item.severity}
                      </span>
                    </div>

                    <p className="history-crop">
                      <b>Crop:</b> {item.crop}
                    </p>

                    <p className="history-confidence">
                      <b>Confidence:</b> {item.confidence}%
                    </p>

                    <p className="date">
                      <FaCalendarAlt className="date-icon" />
                      {new Date(item.created_at).toLocaleString()}
                    </p>

                    <button
                      className="delete-btn"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleDelete(item.id);
                      }}
                    >
                      <FaTrashAlt />
                      Delete
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>
      </div>

      {/* MODAL */}
      {selectedPrediction && (
        <div
          className="prediction-modal-overlay"
          onClick={() => setSelectedPrediction(null)}
        >
          <div
            className="prediction-modal"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              className="modal-close-btn"
              onClick={() => setSelectedPrediction(null)}
            >
              <FaTimes />
            </button>

            <h2 className="modal-title">🌿 AI Diagnosis Result</h2>

            <div className="modal-result-grid">
              {/* Confidence */}
              <div className="ai-card confidence-card">
                <h3>Model Confidence</h3>
                <div className="circle-wrapper">
                  <CircularProgressbar
                    value={selectedPrediction.confidence || 0}
                    text={`${selectedPrediction.confidence || 0}%`}
                    styles={buildStyles({
                      textSize: "18px",
                      pathColor: "#4caf50",
                      textColor: "#2e7d32",
                      trailColor: "#e0e0e0",
                    })}
                  />
                </div>
              </div>

              {/* Disease */}
              <div className="ai-card disease-card">
                <h3>Disease Detected</h3>
                <div className="disease-icon">🌿</div>
                <h2>{selectedPrediction.disease}</h2>
                <p><b>Crop:</b> {selectedPrediction.crop}</p>
                <p
                  className={`severity ${selectedPrediction.severity?.toLowerCase()}`}
                >
                  Severity: {selectedPrediction.severity}
                </p>
                <p className="date">
                  <FaCalendarAlt className="date-icon" />
                  {new Date(selectedPrediction.created_at).toLocaleString()}
                </p>
              </div>

              {/* Treatments */}
              <div className="ai-card treatment-card">
                <h3>Recommended Treatments</h3>

                {selectedPrediction.treatments &&
                selectedPrediction.treatments.length > 0 ? (
                  <div className="treatment-list">
                    {selectedPrediction.treatments.map((item, index) => (
                      <div key={index} className="treatment-item">
                        <p>
                          <b>Medicine:</b> {item.medicine_name}
                        </p>
                        <p>
                          <b>Dosage:</b> {item.dosage || "Not available"}
                        </p>
                        {item.description && (
                          <p>
                            <b>Description:</b> {item.description}
                          </p>
                        )}
                        {index !== selectedPrediction.treatments.length - 1 && <hr />}
                      </div>
                    ))}
                  </div>
                ) : (
                  <p>No treatment data available for this history item.</p>
                )}
              </div>

              {/* Shops */}
              <div className="ai-card shops-card">
                <h3>Available Shops in Your Area</h3>

                {selectedPrediction.shops &&
                selectedPrediction.shops.length > 0 ? (
                  <div className="shops-list">
                    {selectedPrediction.shops.map((shop, index) => (
                      <div key={index} className="shop-item">
                        <p><b>{shop.shop_name}</b></p>
                        <p>{shop.address}</p>
                        <p>
                          {shop.city}
                          {shop.area ? `, ${shop.area}` : ""}
                        </p>

                        <div className="shop-medicines">
                          <p><b>Available Medicines:</b></p>

                          {shop.medicines && shop.medicines.length > 0 ? (
                            shop.medicines.map((med, medIndex) => (
                              <div key={medIndex} className="shop-medicine-row">
                                <p><b>Medicine:</b> {med.medicine_name}</p>
                                <p><b>Price:</b> ₹{med.price ?? "N/A"}</p>
                                <p><b>Stock:</b> {med.stock_quantity ?? "N/A"}</p>
                                <p><b>Dosage:</b> {med.dosage || "Not available"}</p>
                              </div>
                            ))
                          ) : (
                            <p>No medicine details available.</p>
                          )}
                        </div>

                        {index !== selectedPrediction.shops.length - 1 && <hr />}
                      </div>
                    ))}
                  </div>
                ) : (
                  <p>No matching shops data available for this history item.</p>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      <Footer />
    </>
  );
}

export default History;