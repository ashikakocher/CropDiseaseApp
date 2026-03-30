import React, { useEffect, useState } from "react";
import API from "../services/api";
import { FaTrash } from "react-icons/fa";

function ManagePredictions() {
  const [predictions, setPredictions] = useState([]);
  const [filters, setFilters] = useState({
    crop: "",
    disease: "",
    severity: "",
    date: "",
  });
  const [previewImage, setPreviewImage] = useState(null);

  useEffect(() => {
    fetchPredictions();
  }, []);

  const getHeaders = () => ({
    Authorization: `Bearer ${localStorage.getItem("admin_token")}`,
  });

  const fetchPredictions = async () => {
    try {
      const params = {};

      if (filters.crop) params.crop = filters.crop;
      if (filters.disease) params.disease = filters.disease;
      if (filters.severity) params.severity = filters.severity;
      if (filters.date) params.date = filters.date;

      const res = await API.get("/admin/predictions", {
        headers: getHeaders(),
        params,
      });

      setPredictions(res.data);
    } catch (err) {
      console.log(err);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this prediction?")) return;

    try {
      await API.delete(`/admin/predictions/${id}`, {
        headers: getHeaders(),
      });
      fetchPredictions();
    } catch (err) {
      console.log(err);
    }
  };

  const handleFilterChange = (e) => {
    setFilters({ ...filters, [e.target.name]: e.target.value });
  };

  const applyFilters = () => {
    fetchPredictions();
  };

  const clearFilters = () => {
    const cleared = {
      crop: "",
      disease: "",
      severity: "",
      date: "",
    };
    setFilters(cleared);

    setTimeout(() => {
      fetchPredictions();
    }, 0);
  };

  return (
    <div className="admin-section">
      <div className="section-header">
        <h3>Manage Predictions</h3>
      </div>

      <div className="filter-bar">
        <input
          type="text"
          name="crop"
          placeholder="Search by crop"
          value={filters.crop}
          onChange={handleFilterChange}
        />

        <input
          type="text"
          name="disease"
          placeholder="Search by disease"
          value={filters.disease}
          onChange={handleFilterChange}
        />

        <select
          name="severity"
          value={filters.severity}
          onChange={handleFilterChange}
        >
          <option value="">All Severity</option>
          <option value="Low">Low</option>
          <option value="Medium">Medium</option>
          <option value="High">High</option>
        </select>

        <input
          type="date"
          name="date"
          value={filters.date}
          onChange={handleFilterChange}
        />

        <button className="primary-admin-btn" onClick={applyFilters}>
          Apply
        </button>

        <button className="cancel-btn" onClick={clearFilters}>
          Clear
        </button>
      </div>

      <div className="table-wrap">
        <table className="admin-table">
          <thead>
            <tr>
              <th>Crop</th>
              <th>Disease</th>
              <th>Confidence</th>
              <th>Severity</th>
              <th>Latitude</th>
              <th>Longitude</th>
              <th>Image</th>
              <th>Created At</th>
              <th>Action</th>
            </tr>
          </thead>

          <tbody>
            {predictions.map((item) => (
              <tr key={item.id}>
                <td>{item.crop}</td>
                <td>{item.disease}</td>
                <td>{item.confidence}</td>
                <td>{item.severity}</td>
                <td>{item.latitude}</td>
                <td>{item.longitude}</td>
                <td>
                  {item.image_path ? (
                    <img
                      src={`http://127.0.0.1:8000/${item.image_path}`}
                      alt="crop"
                      width="60"
                      height="60"
                      className="prediction-thumb"
                      onClick={() =>
                        setPreviewImage(
                          `http://127.0.0.1:8000/${item.image_path}`
                        )
                      }
                    />
                  ) : (
                    "No Image"
                  )}
                </td>
                <td>{new Date(item.created_at).toLocaleString()}</td>
                <td className="action-cell">
                  <button
                    className="icon-btn delete"
                    onClick={() => handleDelete(item.id)}
                  >
                    <FaTrash />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {previewImage && (
        <div
          className="image-preview-overlay"
          onClick={() => setPreviewImage(null)}
        >
          <div
            className="image-preview-modal"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              className="modal-close-btn"
              onClick={() => setPreviewImage(null)}
            >
              ×
            </button>
            <img src={previewImage} alt="Preview" className="preview-large" />
          </div>
        </div>
      )}
    </div>
  );
}

export default ManagePredictions;