import React, { useEffect, useState } from "react";
import API from "../services/api";
import { FaTrash, FaEdit, FaPlus } from "react-icons/fa";

function ManageSuppliers() {
  const [suppliers, setSuppliers] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [editingSupplierId, setEditingSupplierId] = useState(null);

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    city: "",
    area: "",
    password: "",
  });

  useEffect(() => {
    fetchSuppliers();
  }, []);

  const getHeaders = () => ({
    Authorization: `Bearer ${localStorage.getItem("admin_token")}`,
  });

  const fetchSuppliers = async () => {
    try {
      const res = await API.get("/admin/suppliers", {
        headers: getHeaders(),
      });
      setSuppliers(res.data);
    } catch (err) {
      console.log(err);
    }
  };

  const openAddModal = () => {
    setEditingSupplierId(null);
    setFormData({
      name: "",
      email: "",
      phone: "",
      city: "",
      area: "",
      password: "",
    });
    setShowModal(true);
  };

  const openEditModal = (supplier) => {
    setEditingSupplierId(supplier.id);
    setFormData({
      name: supplier.name || "",
      email: supplier.email || "",
      phone: supplier.phone || "",
      city: supplier.city || "",
      area: supplier.area || "",
      password: "",
    });
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setEditingSupplierId(null);
    setFormData({
      name: "",
      email: "",
      phone: "",
      city: "",
      area: "",
      password: "",
    });
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this supplier?")) return;

    try {
      await API.delete(`/admin/suppliers/${id}`, {
        headers: getHeaders(),
      });
      fetchSuppliers();
    } catch (err) {
      console.log(err);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      if (editingSupplierId) {
        await API.put(`/admin/suppliers/${editingSupplierId}`, formData, {
          headers: getHeaders(),
        });
      } else {
        await API.post("/admin/suppliers", formData, {
          headers: getHeaders(),
        });
      }

      closeModal();
      fetchSuppliers();
    } catch (err) {
      console.log(err);
      alert(err.response?.data?.detail || "Something went wrong");
    }
  };

  return (
    <div className="admin-section">
      <div className="section-header section-header-flex">
        <h3>Manage Suppliers</h3>

        <button className="primary-admin-btn" onClick={openAddModal}>
          <FaPlus style={{ marginRight: "8px" }} />
          Add Supplier
        </button>
      </div>

      <div className="table-wrap">
        <table className="admin-table">
          <thead>
            <tr>
              <th>Name</th>
              <th>Email</th>
              <th>Phone</th>
              <th>City</th>
              <th>Area</th>
              <th>Actions</th>
            </tr>
          </thead>

          <tbody>
            {suppliers.map((supplier) => (
              <tr key={supplier.id}>
                <td>{supplier.name}</td>
                <td>{supplier.email}</td>
                <td>{supplier.phone}</td>
                <td>{supplier.city}</td>
                <td>{supplier.area}</td>

                <td className="action-cell">
                  <button
                    className="icon-btn edit"
                    onClick={() => openEditModal(supplier)}
                  >
                    <FaEdit />
                  </button>

                  <button
                    className="icon-btn delete"
                    onClick={() => handleDelete(supplier.id)}
                  >
                    <FaTrash />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {showModal && (
        <div className="admin-modal-overlay">
          <div className="admin-modal">
            <div className="admin-modal-header">
              <h3>{editingSupplierId ? "Edit Supplier" : "Add Supplier"}</h3>
              <button className="modal-close-btn" onClick={closeModal}>
                ×
              </button>
            </div>

            <form onSubmit={handleSubmit}>
              <div className="admin-form-grid">
                <input
                  type="text"
                  placeholder="Name"
                  value={formData.name}
                  onChange={(e) =>
                    setFormData({ ...formData, name: e.target.value })
                  }
                  required
                />

                <input
                  type="email"
                  placeholder="Email"
                  value={formData.email}
                  onChange={(e) =>
                    setFormData({ ...formData, email: e.target.value })
                  }
                  required
                />

                <input
                  type="text"
                  placeholder="Phone"
                  value={formData.phone}
                  onChange={(e) =>
                    setFormData({ ...formData, phone: e.target.value })
                  }
                />

                <input
                  type="text"
                  placeholder="City"
                  value={formData.city}
                  onChange={(e) =>
                    setFormData({ ...formData, city: e.target.value })
                  }
                  required
                />

                <input
                  type="text"
                  placeholder="Area"
                  value={formData.area}
                  onChange={(e) =>
                    setFormData({ ...formData, area: e.target.value })
                  }
                />

                {!editingSupplierId && (
                  <input
                    type="password"
                    placeholder="Password"
                    value={formData.password}
                    onChange={(e) =>
                      setFormData({ ...formData, password: e.target.value })
                    }
                    required
                  />
                )}
              </div>

              <div className="modal-actions">
                <button type="submit" className="save-btn">
                  {editingSupplierId ? "Update Supplier" : "Add Supplier"}
                </button>

                <button
                  type="button"
                  className="cancel-btn"
                  onClick={closeModal}
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default ManageSuppliers;