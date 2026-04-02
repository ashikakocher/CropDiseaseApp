import React, { useEffect, useMemo, useState } from "react";
import API from "../services/api";
import {
  FaSearch,
  FaFilter,
  FaExclamationTriangle,
  FaLeaf,
  FaHeartbeat,
  FaCheck,
} from "react-icons/fa";
import "../components/DiseaseLibrary.css";
import Navbar from "./Navbar";
import Footer from "./Footer";


function DiseaseLibrary() {
  const [diseases, setDiseases] = useState([]);
  const [selectedDisease, setSelectedDisease] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [category, setCategory] = useState("All Categories");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDiseases();
  }, []);

  const fetchDiseases = async () => {
    try {
      setLoading(true);
      const res = await API.get("/diseases");
      const data = res.data || [];
      setDiseases(data);

      if (data.length > 0) {
        setSelectedDisease(data[0]);
      }
    } catch (error) {
      console.error("Error fetching diseases:", error);
    } finally {
      setLoading(false);
    }
  };

  const categories = useMemo(() => {
    const uniqueCategories = [...new Set(diseases.map((d) => d.category).filter(Boolean))];
    return ["All Categories", ...uniqueCategories];
  }, [diseases]);

  const filteredDiseases = useMemo(() => {
    return diseases.filter((disease) => {
      const text = `${disease.name || ""} ${disease.short_description || ""} ${disease.full_description || ""}`.toLowerCase();

      const matchesSearch = text.includes(searchTerm.toLowerCase());
      const matchesCategory =
        category === "All Categories" || disease.category === category;

      return matchesSearch && matchesCategory;
    });
  }, [diseases, searchTerm, category]);

  useEffect(() => {
    if (filteredDiseases.length === 0) {
      setSelectedDisease(null);
      return;
    }

    const stillExists = filteredDiseases.find((d) => d.id === selectedDisease?.id);
    if (!stillExists) {
      setSelectedDisease(filteredDiseases[0]);
    }
  }, [filteredDiseases, selectedDisease]);

  const renderSeverityDots = (severity = 0) => {
    return (
      <div className="severity-dots">
        {[1, 2, 3, 4, 5].map((dot) => (
          <span
            key={dot}
            className={`severity-dot ${dot <= severity ? "active" : ""}`}
          />
        ))}
      </div>
    );
  };

  const renderList = (items) => {
    if (!items || items.length === 0) {
      return <p className="empty-text">No details available.</p>;
    }

    return (
      <ul className="detail-list">
        {items.map((item, index) => (
          <li key={index}>{item}</li>
        ))}
      </ul>
    );
  };

  return (
    <>
    <Navbar />
    <div className="disease-library-page">
      <div className="disease-library-hero">
        <h1>Plant Disease Library</h1>
        <p>
          Search through our comprehensive database of plant diseases, learn
          about symptoms, causes, and treatment options.
        </p>

        <div className="library-controls">
          <div className="library-search-box">
            <FaSearch className="control-icon" />
            <input
              type="text"
              placeholder="Search by disease name, symptoms, or description..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          <div className="library-filter-box">
            <FaFilter className="control-icon" />
            <span>Filter by:</span>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
            >
              {categories.map((cat, i) => (
                <option key={i} value={cat}>
                  {cat}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      <div className="library-main-card">
        <div className="disease-list-panel">
          <h2>Disease List</h2>

          {loading ? (
            <p className="panel-message">Loading diseases...</p>
          ) : filteredDiseases.length === 0 ? (
            <p className="panel-message">No diseases found.</p>
          ) : (
            <div className="disease-list-scroll">
              {filteredDiseases.map((disease) => (
                <div
                  key={disease.id}
                  className={`disease-list-card ${
                    selectedDisease?.id === disease.id ? "selected" : ""
                  }`}
                  onClick={() => setSelectedDisease(disease)}
                >
                  <div className="disease-list-top">
                    <h3>{disease.name}</h3>
                    <span
                      className={`category-badge ${String(
                        disease.category || ""
                      ).toLowerCase().replace(/\s+/g, "-")}`}
                    >
                      {disease.category}
                    </span>
                  </div>

                  <p>{disease.short_description || "No short description available."}</p>

                  <div className="disease-list-bottom">
                    <span className="severity-label">Severity:</span>
                    {renderSeverityDots(disease.severity)}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="disease-details-panel">
          <h2>Disease Details</h2>

          {!selectedDisease ? (
            <p className="panel-message">Select a disease to view details.</p>
          ) : (
            <>
              <div className="details-header">
                <div>
                  <h3>{selectedDisease.name}</h3>
                  <div className="details-meta">
                    <span
                      className={`category-badge ${String(
                        selectedDisease.category || ""
                      ).toLowerCase().replace(/\s+/g, "-")}`}
                    >
                      {selectedDisease.category}
                    </span>

                    <div className="details-severity">
                      <span>Severity:</span>
                      {renderSeverityDots(selectedDisease.severity)}
                    </div>
                  </div>
                </div>
              </div>

              <p className="details-description">
                {selectedDisease.full_description || "No full description available."}
              </p>

              <div className="detail-section">
                <div className="section-title">
                  <FaExclamationTriangle />
                  <h4>Symptoms</h4>
                </div>
                {renderList(selectedDisease.symptoms)}
              </div>

              <div className="detail-section">
                <div className="section-title">
                  <FaLeaf />
                  <h4>Affected Plants</h4>
                </div>

                {selectedDisease.affected_plants?.length ? (
                  <div className="tag-list">
                    {selectedDisease.affected_plants.map((plant, index) => (
                      <span key={index} className="plant-tag">
                        {plant}
                      </span>
                    ))}
                  </div>
                ) : (
                  <p className="empty-text">No affected plants available.</p>
                )}
              </div>

              <div className="detail-section green-section">
                <div className="section-title">
                  <FaHeartbeat />
                  <h4>Causes</h4>
                </div>
                {renderList(selectedDisease.causes)}
              </div>

              <div className="detail-section">
                <div className="section-title">
                  <FaCheck />
                  <h4>Treatment Options</h4>
                </div>

                {selectedDisease.treatments?.length ? (
                  <ol className="numbered-list">
                    {selectedDisease.treatments.map((item, index) => (
                      <li key={index}>{item}</li>
                    ))}
                  </ol>
                ) : (
                  <p className="empty-text">No treatment options available.</p>
                )}
              </div>

              <div className="detail-section">
                <div className="section-title">
                  <FaCheck />
                  <h4>Prevention</h4>
                </div>
                {renderList(selectedDisease.prevention)}
              </div>
            </>
          )}
        </div>
      </div>
    </div>
    <Footer />
    </>
  );
}

export default DiseaseLibrary;