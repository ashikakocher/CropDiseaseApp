import React, { useEffect, useState } from "react";
import API from "../services/api";
import { FaPlus, FaEdit, FaTrash, FaTimes ,FaLeaf } from "react-icons/fa";
import "./Admin.css";

function ManageDiseases() {
  const [diseases, setDiseases] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editId, setEditId] = useState(null);

  const [form, setForm] = useState({
    name: "",
    category: "",
    severity: 1,
    short_description: "",
    full_description: "",
    symptoms: "",
    causes: "",
    treatments: "",
    affected_plants: "",
    prevention: "",
    image_url: "",
  });

  const getHeaders = () => ({
    Authorization: `Bearer ${localStorage.getItem("admin_token")}`,
  });

  const fetchDiseases = async () => {
    try {
      setLoading(true);
      const res = await API.get("/diseases");
      setDiseases(res.data || []);
    } catch (error) {
      console.error("Error fetching diseases:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDiseases();
  }, []);

  const resetForm = () => {
    setForm({
      name: "",
      category: "",
      severity: 1,
      short_description: "",
      full_description: "",
      symptoms: "",
      causes: "",
      treatments: "",
      affected_plants: "",
      prevention: "",
      image_url: "",
    });
    setEditId(null);
  };

  const openAddModal = () => {
    resetForm();
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    resetForm();
  };

  const handleChange = (e) => {
    setForm((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const convertToArray = (value) =>
    value
      .split("\n")
      .map((item) => item.trim())
      .filter((item) => item !== "");

  const handleSubmit = async (e) => {
    e.preventDefault();

    const payload = {
      name: form.name,
      category: form.category,
      severity: Number(form.severity),
      short_description: form.short_description,
      full_description: form.full_description,
      symptoms: convertToArray(form.symptoms),
      causes: convertToArray(form.causes),
      treatments: convertToArray(form.treatments),
      affected_plants: convertToArray(form.affected_plants),
      prevention: convertToArray(form.prevention),
      image_url: form.image_url,
    };

    try {
      if (editId) {
        await API.put(`/diseases/admin/${editId}`, payload, {
          headers: getHeaders(),
        });
      } else {
        await API.post("/diseases/admin", payload, {
          headers: getHeaders(),
        });
      }

      fetchDiseases();
      closeModal();
    } catch (error) {
      console.error("Error saving disease:", error);
      alert(error?.response?.data?.detail || "Failed to save disease");
    }
  };

  const handleEdit = (disease) => {
    setEditId(disease.id);
    setForm({
      name: disease.name || "",
      category: disease.category || "",
      severity: disease.severity || 1,
      short_description: disease.short_description || "",
      full_description: disease.full_description || "",
      symptoms: (disease.symptoms || []).join("\n"),
      causes: (disease.causes || []).join("\n"),
      treatments: (disease.treatments || []).join("\n"),
      affected_plants: (disease.affected_plants || []).join("\n"),
      prevention: (disease.prevention || []).join("\n"),
      image_url: disease.image_url || "",
    });
    setShowModal(true);
  };

  const handleDelete = async (id) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this disease?"
    );
    if (!confirmDelete) return;

    try {
      await API.delete(`/diseases/admin/${id}`, {
        headers: getHeaders(),
      });
      fetchDiseases();
    } catch (error) {
      console.error("Error deleting disease:", error);
      alert("Failed to delete disease");
    }
  };

  return (
    <div className="manage-diseases-page">
        <div className="manage-diseases-header-card">
  <div className="manage-diseases-header-left">
    <div className="manage-diseases-header-icon">
      <FaLeaf />
    </div>
    <div>
      <h2 className="manage-diseases-main-title">Manage Diseases</h2>
     
    </div>
  </div>
 

  <button className="add-disease-btn" onClick={openAddModal}>
    <FaPlus />
    <span>Add Disease</span>
  </button>
</div>
 <div className="manage-diseases-card">
        {loading ? (
          <p className="disease-status-text">Loading diseases...</p>
        ) : diseases.length === 0 ? (
          <p className="disease-status-text">No diseases found.</p>
        ) : (
          <div className="disease-table-wrapper">
            <table className="disease-table">
              <thead>
                <tr>
                  <th>Disease Name</th>
                  <th>Category</th>
                  <th>Severity</th>
                  <th>Short Description</th>
                  <th>Symptoms</th>
                  <th>Treatments</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {diseases.map((disease) => (
                  <tr key={disease.id}>
                    <td>{disease.name}</td>
                    <td>
                      <span className={`disease-badge ${disease.category?.toLowerCase()}`}>
                        {disease.category}
                      </span>
                    </td>
                    <td>{disease.severity}/5</td>
                    <td>{disease.short_description || "-"}</td>
                    <td>{disease.symptoms?.length || 0}</td>
                    <td>{disease.treatments?.length || 0}</td>
                    <td>
                      <div className="disease-action-buttons">
                        <button
                          className="edit-btn"
                          onClick={() => handleEdit(disease)}
                        >
                          <FaEdit />
                        </button>
                        <button
                          className="delete-btn"
                          onClick={() => handleDelete(disease.id)}
                        >
                          <FaTrash />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {showModal && (
        <div className="disease-modal-overlay">
          <div className="disease-modal">
            <div className="disease-modal-header">
              <h3>{editId ? "Edit Disease" : "Add Disease"}</h3>
              <button className="modal-close-btn" onClick={closeModal}>
                <FaTimes />
              </button>
            </div>

            <form className="disease-form" onSubmit={handleSubmit}>
              <div className="disease-form-grid">
                <div className="form-group">
                  <label>Disease Name</label>
                  <input
                    type="text"
                    name="name"
                    value={form.name}
                    onChange={handleChange}
                    required
                  />
                </div>

                <div className="form-group">
                  <label>Category</label>
                  <select
                    name="category"
                    value={form.category}
                    onChange={handleChange}
                    required
                  >
                    <option value="">Select Category</option>
                    <option value="Fungal">Fungal</option>
                    <option value="Bacterial">Bacterial</option>
                    <option value="Viral">Viral</option>
                    <option value="Nutritional">Nutritional</option>
                    <option value="Pest Related">Pest Related</option>
                  </select>
                </div>

                <div className="form-group">
                  <label>Severity (1-5)</label>
                  <input
                    type="number"
                    name="severity"
                    min="1"
                    max="5"
                    value={form.severity}
                    onChange={handleChange}
                    required
                  />
                </div>

                <div className="form-group">
                  <label>Image URL</label>
                  <input
                    type="text"
                    name="image_url"
                    value={form.image_url}
                    onChange={handleChange}
                    placeholder="https://..."
                  />
                </div>
              </div>

              <div className="form-group">
                <label>Short Description</label>
                <input
                  type="text"
                  name="short_description"
                  value={form.short_description}
                  onChange={handleChange}
                  placeholder="Short summary for disease card"
                />
              </div>

              <div className="form-group">
                <label>Full Description</label>
                <textarea
                  name="full_description"
                  value={form.full_description}
                  onChange={handleChange}
                  rows="4"
                />
              </div>

              <div className="disease-form-grid two-columns">
                <div className="form-group">
                  <label>Symptoms (one per line)</label>
                  <textarea
                    name="symptoms"
                    value={form.symptoms}
                    onChange={handleChange}
                    rows="5"
                  />
                </div>

                <div className="form-group">
                  <label>Causes (one per line)</label>
                  <textarea
                    name="causes"
                    value={form.causes}
                    onChange={handleChange}
                    rows="5"
                  />
                </div>

                <div className="form-group">
                  <label>Treatments (one per line)</label>
                  <textarea
                    name="treatments"
                    value={form.treatments}
                    onChange={handleChange}
                    rows="5"
                  />
                </div>

                <div className="form-group">
                  <label>Affected Plants (one per line)</label>
                  <textarea
                    name="affected_plants"
                    value={form.affected_plants}
                    onChange={handleChange}
                    rows="5"
                  />
                </div>
              </div>

              <div className="form-group">
                <label>Prevention (one per line)</label>
                <textarea
                  name="prevention"
                  value={form.prevention}
                  onChange={handleChange}
                  rows="4"
                />
              </div>

              <div className="disease-form-actions">
                <button type="button" className="cancel-btn" onClick={closeModal}>
                  Cancel
                </button>
                <button type="submit" className="save-btn">
                  {editId ? "Update Disease" : "Save Disease"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default ManageDiseases;