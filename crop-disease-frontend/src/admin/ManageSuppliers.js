import React, { useEffect, useState } from "react";
import API from "../services/api";
import { FaTrash, FaEdit, FaPlus, FaTruck, FaEye } from "react-icons/fa";
import "./Admin.css";

function ManageSuppliers() {
  const [amsupSuppliers, setAmsupSuppliers] = useState([]);
  const [amsupShowModal, setAmsupShowModal] = useState(false);
  const [amsupEditingSupplierId, setAmsupEditingSupplierId] = useState(null);

  const [amsupFormData, setAmsupFormData] = useState({
    name: "",
    email: "",
    phone: "",
    city: "",
    area: "",
    password: "",
    kyc_type: "",
    kyc_status: "pending",
  });

  useEffect(() => {
    amsupFetchSuppliers();
  }, []);

  const amsupGetHeaders = () => ({
    Authorization: `Bearer ${localStorage.getItem("admin_token")}`,
  });

  const amsupFetchSuppliers = async () => {
    try {
      const res = await API.get("/admin/suppliers", {
        headers: amsupGetHeaders(),
      });
      setAmsupSuppliers(res.data || []);
    } catch (err) {
      console.log(err);
    }
  };

  const amsupOpenAddModal = () => {
    setAmsupEditingSupplierId(null);
    setAmsupFormData({
      name: "",
      email: "",
      phone: "",
      city: "",
      area: "",
      password: "",
      kyc_type: "",
      kyc_status: "pending",
    });
    setAmsupShowModal(true);
  };

  const amsupOpenEditModal = (supplier) => {
    setAmsupEditingSupplierId(supplier.id);
    setAmsupFormData({
      name: supplier.name || "",
      email: supplier.email || "",
      phone: supplier.phone || "",
      city: supplier.city || "",
      area: supplier.area || "",
      password: "",
      kyc_type: supplier.kyc_type || "",
      kyc_status: supplier.kyc_status || "pending",
    });
    setAmsupShowModal(true);
  };

  const amsupCloseModal = () => {
    setAmsupShowModal(false);
    setAmsupEditingSupplierId(null);
    setAmsupFormData({
      name: "",
      email: "",
      phone: "",
      city: "",
      area: "",
      password: "",
      kyc_type: "",
      kyc_status: "pending",
    });
  };

  const amsupHandleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this supplier?")) return;

    try {
      await API.delete(`/admin/suppliers/${id}`, {
        headers: amsupGetHeaders(),
      });
      amsupFetchSuppliers();
    } catch (err) {
      console.log(err);
      alert(err.response?.data?.detail || "Delete failed");
    }
  };

  const amsupHandleSubmit = async (e) => {
    e.preventDefault();

    try {
      if (amsupEditingSupplierId) {
        await API.put(`/admin/suppliers/${amsupEditingSupplierId}`, amsupFormData, {
          headers: amsupGetHeaders(),
        });
      } else {
        await API.post("/admin/suppliers", amsupFormData, {
          headers: amsupGetHeaders(),
        });
      }

      amsupCloseModal();
      amsupFetchSuppliers();
    } catch (err) {
      console.log(err);
      alert(err.response?.data?.detail || "Something went wrong");
    }
  };

  const amsupGetStatusClass = (status) => {
    if (status === "verified") return "amsup-status amsup-status-verified";
    if (status === "rejected") return "amsup-status amsup-status-rejected";
    return "amsup-status amsup-status-pending";
  };

  return (
    <section className="amsup-wrapper" id="amsup-wrapper">
      <div className="amsup-header-card">
        <div className="amsup-header-left">
          <div className="amsup-header-icon">
            <FaTruck />
          </div>
          <div>
            <h2 className="amsup-main-title">Manage Suppliers</h2>
          </div>
        </div>

        <button
          className="amsup-add-btn"
          id="amsup-add-btn"
          onClick={amsupOpenAddModal}
        >
          <FaPlus />
          <span>Add Supplier</span>
        </button>
      </div>

      <div className="amsup-table-card">
        <div className="amsup-table-responsive">
          <table className="amsup-table" id="amsup-table">
            <thead>
              <tr>
                <th>Name</th>
                <th>Email</th>
                <th>Phone</th>
                <th>City</th>
                <th>Area</th>
                <th>KYC Type</th>
                <th>KYC Document</th>
                <th>KYC Status</th>
                <th className="amsup-action-heading">Actions</th>
              </tr>
            </thead>

            <tbody>
              {amsupSuppliers.length > 0 ? (
                amsupSuppliers.map((supplier) => (
                  <tr key={supplier.id}>
                    <td>
                      <div className="amsup-supplier-name">
                        {supplier.name || "-"}
                      </div>
                    </td>
                    <td>{supplier.email || "-"}</td>
                    <td>{supplier.phone || "-"}</td>
                    <td>{supplier.city || "-"}</td>
                    <td>{supplier.area || "-"}</td>
                    <td>{supplier.kyc_type || "-"}</td>
                    <td>
                      {supplier.kyc_document ? (
                        <a
                          href={`http://127.0.0.1:8000${supplier.kyc_document}`}
                          target="_blank"
                          rel="noreferrer"
                          className="amsup-view-doc-btn"
                        >
                          <FaEye /> View
                        </a>
                      ) : (
                        "-"
                      )}
                    </td>
                    <td>
                      <span className={amsupGetStatusClass(supplier.kyc_status)}>
                        {supplier.kyc_status || "pending"}
                      </span>
                    </td>
                    <td>
                      <div className="amsup-action-group">
                        <button
                          className="amsup-icon-btn amsup-edit-btn"
                          id={`amsup-edit-btn-${supplier.id}`}
                          onClick={() => amsupOpenEditModal(supplier)}
                          title="Edit Supplier"
                        >
                          <FaEdit />
                        </button>

                        <button
                          className="amsup-icon-btn amsup-delete-btn"
                          id={`amsup-delete-btn-${supplier.id}`}
                          onClick={() => amsupHandleDelete(supplier.id)}
                          title="Delete Supplier"
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
                    <div className="amsup-empty-state">No suppliers found.</div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {amsupShowModal && (
        <div className="amsup-modal-overlay" id="amsup-modal-overlay">
          <div className="amsup-modal-box" id="amsup-modal-box">
            <div className="amsup-modal-header">
              <div>
                <h3 className="amsup-modal-title">
                  {amsupEditingSupplierId ? "Edit Supplier" : "Add New Supplier"}
                </h3>
                <p className="amsup-modal-subtitle">
                  {amsupEditingSupplierId
                    ? "Update supplier details below."
                    : "Fill in the details to create a new supplier."}
                </p>
              </div>

              <button
                className="amsup-modal-close-btn"
                id="amsup-modal-close-btn"
                onClick={amsupCloseModal}
                type="button"
              >
                ×
              </button>
            </div>

            <form className="amsup-form" onSubmit={amsupHandleSubmit}>
              <div className="amsup-form-grid">
                <div className="amsup-form-field">
                  <label htmlFor="amsup-name">Full Name</label>
                  <input
                    id="amsup-name"
                    type="text"
                    placeholder="Enter supplier name"
                    value={amsupFormData.name}
                    onChange={(e) =>
                      setAmsupFormData({
                        ...amsupFormData,
                        name: e.target.value,
                      })
                    }
                    required
                  />
                </div>

                <div className="amsup-form-field">
                  <label htmlFor="amsup-email">Email Address</label>
                  <input
                    id="amsup-email"
                    type="email"
                    placeholder="Enter email"
                    value={amsupFormData.email}
                    onChange={(e) =>
                      setAmsupFormData({
                        ...amsupFormData,
                        email: e.target.value,
                      })
                    }
                    required
                  />
                </div>

                <div className="amsup-form-field">
                  <label htmlFor="amsup-phone">Phone Number</label>
                  <input
                    id="amsup-phone"
                    type="text"
                    placeholder="Enter phone number"
                    value={amsupFormData.phone}
                    onChange={(e) =>
                      setAmsupFormData({
                        ...amsupFormData,
                        phone: e.target.value,
                      })
                    }
                  />
                </div>

                <div className="amsup-form-field">
                  <label htmlFor="amsup-city">City</label>
                  <input
                    id="amsup-city"
                    type="text"
                    placeholder="Enter city"
                    value={amsupFormData.city}
                    onChange={(e) =>
                      setAmsupFormData({
                        ...amsupFormData,
                        city: e.target.value,
                      })
                    }
                    required
                  />
                </div>

                <div className="amsup-form-field">
                  <label htmlFor="amsup-area">Area</label>
                  <input
                    id="amsup-area"
                    type="text"
                    placeholder="Enter area"
                    value={amsupFormData.area}
                    onChange={(e) =>
                      setAmsupFormData({
                        ...amsupFormData,
                        area: e.target.value,
                      })
                    }
                  />
                </div>

                <div className="amsup-form-field">
                  <label htmlFor="amsup-kyc-type">KYC Type</label>
                  <select
                    id="amsup-kyc-type"
                    value={amsupFormData.kyc_type}
                    onChange={(e) =>
                      setAmsupFormData({
                        ...amsupFormData,
                        kyc_type: e.target.value,
                      })
                    }
                  >
                    <option value="">Select KYC Type</option>
                    <option value="aadhaar">Aadhaar Card</option>
                    <option value="pan">PAN Card</option>
                    <option value="gst">GST Certificate</option>
                    <option value="license">Business License</option>
                  </select>
                </div>

                <div className="amsup-form-field">
                  <label htmlFor="amsup-kyc-status">KYC Status</label>
                  <select
                    id="amsup-kyc-status"
                    value={amsupFormData.kyc_status}
                    onChange={(e) =>
                      setAmsupFormData({
                        ...amsupFormData,
                        kyc_status: e.target.value,
                      })
                    }
                  >
                    <option value="pending">Pending</option>
                    <option value="verified">Verified</option>
                    <option value="rejected">Rejected</option>
                  </select>
                </div>

                {!amsupEditingSupplierId && (
                  <div className="amsup-form-field">
                    <label htmlFor="amsup-password">Password</label>
                    <input
                      id="amsup-password"
                      type="password"
                      placeholder="Enter password"
                      value={amsupFormData.password}
                      onChange={(e) =>
                        setAmsupFormData({
                          ...amsupFormData,
                          password: e.target.value,
                        })
                      }
                      required
                    />
                  </div>
                )}
              </div>

              <div className="amsup-modal-actions">
                <button
                  type="submit"
                  className="amsup-primary-btn"
                  id="amsup-primary-btn"
                >
                  {amsupEditingSupplierId ? "Update Supplier" : "Create Supplier"}
                </button>

                <button
                  type="button"
                  className="amsup-secondary-btn"
                  id="amsup-secondary-btn"
                  onClick={amsupCloseModal}
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </section>
  );
}

export default ManageSuppliers;