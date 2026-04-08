import React, { useEffect, useState } from "react";
import API from "../services/api";
import { FaTrash, FaFilter, FaTimes, FaLeaf } from "react-icons/fa";
import "./Admin.css";
import TablePagination from "@mui/material/TablePagination";

function ManagePredictions() {
  const [ampredPredictions, setAmpredPredictions] = useState([]);
  const [ampredFilters, setAmpredFilters] = useState({
    crop: "",
    disease: "",
    severity: "",
    date: "",
  });
  const [ampredPreviewImage, setAmpredPreviewImage] = useState(null);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);

  const handleChangePage = (event, newPage) => {
  setPage(newPage);
};

const handleChangeRowsPerPage = (event) => {
  setRowsPerPage(parseInt(event.target.value, 10));
  setPage(0);
};

  useEffect(() => {
    ampredFetchPredictions();
  }, []);

  const ampredGetHeaders = () => ({
    Authorization: `Bearer ${localStorage.getItem("admin_token")}`,
  });

  const ampredFetchPredictions = async () => {
    try {
      const params = {};

      if (ampredFilters.crop) params.crop = ampredFilters.crop;
      if (ampredFilters.disease) params.disease = ampredFilters.disease;
      if (ampredFilters.severity) params.severity = ampredFilters.severity;
      if (ampredFilters.date) params.date = ampredFilters.date;

      const res = await API.get("/admin/predictions", {
        headers: ampredGetHeaders(),
        params,
      });

      setAmpredPredictions(res.data || []);
    } catch (err) {
      console.log(err);
    }
  };

  const ampredHandleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this prediction?")) return;

    try {
      await API.delete(`/admin/predictions/${id}`, {
        headers: ampredGetHeaders(),
      });
      ampredFetchPredictions();
    } catch (err) {
      console.log(err);
    }
  };

  const ampredHandleFilterChange = (e) => {
    setAmpredFilters({
      ...ampredFilters,
      [e.target.name]: e.target.value,
    });
  };

  const ampredApplyFilters = () => {
    ampredFetchPredictions();
  };

  const ampredClearFilters = () => {
    const clearedFilters = {
      crop: "",
      disease: "",
      severity: "",
      date: "",
    };

    setAmpredFilters(clearedFilters);

    setTimeout(() => {
      ampredFetchPredictions();
    }, 0);
  };

  const ampredGetSeverityClass = (severity) => {
    if (!severity) return "";
    const value = severity.toLowerCase();

    if (value === "high") return "ampred-severity-high";
    if (value === "medium") return "ampred-severity-medium";
    if (value === "low") return "ampred-severity-low";
    return "";
  };

  return (
    <section className="ampred-wrapper" id="ampred-wrapper">
      <div className="ampred-header-card">
        <div className="ampred-header-left">
          <div className="ampred-header-icon">
            <FaLeaf />
          </div>
          <div>
            <h2 className="ampred-main-title">Manage Predictions</h2>
           
          </div>
        </div>
      </div>

      <div className="ampred-filter-card">
        <div className="ampred-filter-title-row">
          <h3 className="ampred-filter-title">
            <FaFilter />
            <span>Filter Predictions</span>
          </h3>
        </div>

        <div className="ampred-filter-grid">
          <div className="ampred-filter-field">
            <label htmlFor="ampred-crop">Crop</label>
            <input
              id="ampred-crop"
              type="text"
              name="crop"
              placeholder="Search by crop"
              value={ampredFilters.crop}
              onChange={ampredHandleFilterChange}
            />
          </div>

          <div className="ampred-filter-field">
            <label htmlFor="ampred-disease">Disease</label>
            <input
              id="ampred-disease"
              type="text"
              name="disease"
              placeholder="Search by disease"
              value={ampredFilters.disease}
              onChange={ampredHandleFilterChange}
            />
          </div>

          <div className="ampred-filter-field">
            <label htmlFor="ampred-severity">Severity</label>
            <select
              id="ampred-severity"
              name="severity"
              value={ampredFilters.severity}
              onChange={ampredHandleFilterChange}
            >
              <option value="">All Severity</option>
              <option value="Low">Low</option>
              <option value="Medium">Medium</option>
              <option value="High">High</option>
            </select>
          </div>

          <div className="ampred-filter-field">
            <label htmlFor="ampred-date">Date</label>
            <input
              id="ampred-date"
              type="date"
              name="date"
              value={ampredFilters.date}
              onChange={ampredHandleFilterChange}
            />
          </div>
        </div>

        <div className="ampred-filter-actions">
          <button
            className="ampred-primary-btn"
            id="ampred-apply-btn"
            onClick={ampredApplyFilters}
            type="button"
          >
            Apply Filters
          </button>

          <button
            className="ampred-secondary-btn"
            id="ampred-clear-btn"
            onClick={ampredClearFilters}
            type="button"
          >
            <FaTimes />
            <span>Clear</span>
          </button>
        </div>
      </div>

      <div className="ampred-table-card">
        <div className="ampred-table-responsive">
          <table className="ampred-table" id="ampred-table">
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
                <th className="ampred-action-heading">Action</th>
              </tr>
            </thead>

            <tbody>
              {ampredPredictions.length > 0 ? (
                ampredPredictions
  .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
  .map((item) => (
                  <tr key={item.id}>
                    <td>
                      <div className="ampred-crop-name">{item.crop || "-"}</div>
                    </td>
                    <td>{item.disease || "-"}</td>
                    <td>{item.confidence ?? "-"}</td>
                    <td>
                      <span
                        className={`ampred-severity-badge ${ampredGetSeverityClass(
                          item.severity
                        )}`}
                      >
                        {item.severity || "-"}
                      </span>
                    </td>
                    <td>{item.latitude ?? "-"}</td>
                    <td>{item.longitude ?? "-"}</td>
                    <td>
                      {item.image_path ? (
                        <img
                          src={`http://127.0.0.1:8000/${item.image_path}`}
                          alt="Prediction"
                          className="ampred-thumb"
                          id={`ampred-thumb-${item.id}`}
                          onClick={() =>
                            setAmpredPreviewImage(
                              `http://127.0.0.1:8000/${item.image_path}`
                            )
                          }
                        />
                      ) : (
                        <span className="ampred-no-image">No Image</span>
                      )}
                    </td>
                    <td>
                      {item.created_at
                        ? new Date(item.created_at).toLocaleString()
                        : "-"}
                    </td>
                    <td>
                      <div className="ampred-action-group">
                        <button
                          className="ampred-icon-btn ampred-delete-btn"
                          id={`ampred-delete-btn-${item.id}`}
                          onClick={() => ampredHandleDelete(item.id)}
                          title="Delete Prediction"
                        >
                          <FaTrash />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="9">
                    <div className="ampred-empty-state">
                      No prediction records found.
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {ampredPreviewImage && (
        <div
          className="ampred-image-preview-overlay"
          id="ampred-image-preview-overlay"
          onClick={() => setAmpredPreviewImage(null)}
        >
          <div
            className="ampred-image-preview-modal"
            id="ampred-image-preview-modal"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              className="ampred-modal-close-btn"
              id="ampred-modal-close-btn"
              onClick={() => setAmpredPreviewImage(null)}
              type="button"
            >
              ×
            </button>

            <img
              src={ampredPreviewImage}
              alt="Preview"
              className="ampred-preview-large"
              id="ampred-preview-large"
            />
          </div>
        </div>
        
      )}
      <TablePagination
  component="div"
  count={ampredPredictions.length}
  page={page}
  onPageChange={handleChangePage}
  rowsPerPage={rowsPerPage}
  onRowsPerPageChange={handleChangeRowsPerPage}
/>
    </section>
  );
}

export default ManagePredictions;