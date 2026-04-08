import React, { useEffect, useState } from "react";
import API from "../services/api";
import {
  FaTrash,
  FaEdit,
  FaPlus,
  FaCapsules,
  FaClinicMedical,
} from "react-icons/fa";
import "./Admin.css";

function ManageMedicines() {
  const [ammedMedicines, setAmmedMedicines] = useState([]);
  const [ammedShops, setAmmedShops] = useState([]);
  const [ammedShowModal, setAmmedShowModal] = useState(false);
  const [ammedEditingMedicineId, setAmmedEditingMedicineId] = useState(null);

  const [ammedFormData, setAmmedFormData] = useState({
    medicine_name: "",
    stock_quantity: "",
    price: "",
    treatment: "",
    dosage: "",
    shop_id: "",
  });

  useEffect(() => {
    ammedFetchMedicines();
    ammedFetchShops();
  }, []);

  const ammedGetHeaders = () => ({
    Authorization: `Bearer ${localStorage.getItem("admin_token")}`,
  });

  const ammedFetchMedicines = async () => {
    try {
      const res = await API.get("/admin/medicines", {
        headers: ammedGetHeaders(),
      });
      setAmmedMedicines(res.data || []);
    } catch (err) {
      console.log(err);
    }
  };

  const ammedFetchShops = async () => {
    try {
      const res = await API.get("/admin/shops", {
        headers: ammedGetHeaders(),
      });
      setAmmedShops(res.data || []);
    } catch (err) {
      console.log(err);
    }
  };

  const ammedOpenAddModal = () => {
    setAmmedEditingMedicineId(null);
    setAmmedFormData({
      medicine_name: "",
      stock_quantity: "",
      price: "",
      treatment: "",
      dosage: "",
      shop_id: "",
    });
    setAmmedShowModal(true);
  };

  const ammedOpenEditModal = (item) => {
    setAmmedEditingMedicineId(item.id);
    setAmmedFormData({
      medicine_name: item.medicine_name || "",
      stock_quantity: item.stock_quantity ?? "",
      price: item.price ?? "",
      treatment: item.treatment || "",
      dosage: item.dosage || "",
      shop_id: item.shop_id || "",
    });
    setAmmedShowModal(true);
  };

  const ammedCloseModal = () => {
    setAmmedShowModal(false);
    setAmmedEditingMedicineId(null);
    setAmmedFormData({
      medicine_name: "",
      stock_quantity: "",
      price: "",
      treatment: "",
      dosage: "",
      shop_id: "",
    });
  };

  const ammedHandleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this medicine?")) return;

    try {
      await API.delete(`/admin/medicines/${id}`, {
        headers: ammedGetHeaders(),
      });
      ammedFetchMedicines();
    } catch (err) {
      console.log(err);
      alert(err.response?.data?.detail || "Delete failed");
    }
  };

  const ammedHandleSubmit = async (e) => {
    e.preventDefault();

    const payload = {
      medicine_name: ammedFormData.medicine_name,
      stock_quantity: ammedFormData.stock_quantity
        ? Number(ammedFormData.stock_quantity)
        : null,
      price: ammedFormData.price ? Number(ammedFormData.price) : null,
      treatment: ammedFormData.treatment || null,
      dosage: ammedFormData.dosage || null,
      shop_id: Number(ammedFormData.shop_id),
    };

    try {
      if (ammedEditingMedicineId) {
        await API.put(`/admin/medicines/${ammedEditingMedicineId}`, payload, {
          headers: ammedGetHeaders(),
        });
      } else {
        await API.post("/admin/medicines", payload, {
          headers: ammedGetHeaders(),
        });
      }

      ammedCloseModal();
      ammedFetchMedicines();
    } catch (err) {
      console.log(err);
      alert(err.response?.data?.detail || "Something went wrong");
    }
  };

  const ammedGetShopName = (shopId) => {
    const shop = ammedShops.find((s) => s.id === shopId);
    return shop ? shop.shop_name : "N/A";
  };

  return (
    <section className="ammed-wrapper" id="ammed-wrapper">
      <div className="ammed-header-card">
        <div className="ammed-header-left">
          <div className="ammed-header-icon">
            <FaCapsules />
          </div>
          <div>
            <h2 className="ammed-main-title">Manage Medicines</h2>
          </div>
        </div>

        <button
          className="ammed-add-btn"
          id="ammed-add-btn"
          onClick={ammedOpenAddModal}
        >
          <FaPlus />
          <span>Add Medicine</span>
        </button>
      </div>

      <div className="ammed-table-card">
        <div className="ammed-table-responsive">
          <table className="ammed-table" id="ammed-table">
            <thead>
              <tr>
                <th>Medicine Name</th>
                <th>Stock</th>
                <th>Price</th>
                <th>Treatment</th>
                <th>Dosage</th>
                <th>Shop Name</th>
                <th className="ammed-action-heading">Actions</th>
              </tr>
            </thead>

            <tbody>
              {ammedMedicines.length > 0 ? (
                ammedMedicines.map((item) => (
                  <tr key={item.id}>
                    <td>
                      <div className="ammed-medicine-name">
                        {item.medicine_name || "-"}
                      </div>
                    </td>
                    <td>{item.stock_quantity ?? "-"}</td>
                    <td>{item.price ?? "-"}</td>
                    <td>{item.treatment || "-"}</td>
                    <td>{item.dosage || "-"}</td>
                    <td>{ammedGetShopName(item.shop_id)}</td>
                    <td>
                      <div className="ammed-action-group">
                        <button
                          className="ammed-icon-btn ammed-edit-btn"
                          id={`ammed-edit-btn-${item.id}`}
                          onClick={() => ammedOpenEditModal(item)}
                          title="Edit Medicine"
                        >
                          <FaEdit />
                        </button>

                        <button
                          className="ammed-icon-btn ammed-delete-btn"
                          id={`ammed-delete-btn-${item.id}`}
                          onClick={() => ammedHandleDelete(item.id)}
                          title="Delete Medicine"
                        >
                          <FaTrash />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="7">
                    <div className="ammed-empty-state">No medicines found.</div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {ammedShowModal && (
        <div className="ammed-modal-overlay" id="ammed-modal-overlay">
          <div className="ammed-modal-box" id="ammed-modal-box">
            <div className="ammed-modal-header">
              <div>
                <h3 className="ammed-modal-title">
                  {ammedEditingMedicineId ? "Edit Medicine" : "Add New Medicine"}
                </h3>
                <p className="ammed-modal-subtitle">
                  {ammedEditingMedicineId
                    ? "Update medicine details below."
                    : "Fill in the details to create a new medicine."}
                </p>
              </div>

              <button
                className="ammed-modal-close-btn"
                id="ammed-modal-close-btn"
                onClick={ammedCloseModal}
                type="button"
              >
                ×
              </button>
            </div>

            <form className="ammed-form" onSubmit={ammedHandleSubmit}>
              <div className="ammed-form-grid">
                <div className="ammed-form-field">
                  <label htmlFor="ammed-medicine-name">Medicine Name</label>
                  <input
                    id="ammed-medicine-name"
                    type="text"
                    placeholder="Enter medicine name"
                    value={ammedFormData.medicine_name}
                    onChange={(e) =>
                      setAmmedFormData({
                        ...ammedFormData,
                        medicine_name: e.target.value,
                      })
                    }
                    required
                  />
                </div>

                <div className="ammed-form-field">
                  <label htmlFor="ammed-stock">Stock Quantity</label>
                  <input
                    id="ammed-stock"
                    type="number"
                    placeholder="Enter stock quantity"
                    value={ammedFormData.stock_quantity}
                    onChange={(e) =>
                      setAmmedFormData({
                        ...ammedFormData,
                        stock_quantity: e.target.value,
                      })
                    }
                  />
                </div>

                <div className="ammed-form-field">
                  <label htmlFor="ammed-price">Price</label>
                  <input
                    id="ammed-price"
                    type="number"
                    step="0.01"
                    placeholder="Enter price"
                    value={ammedFormData.price}
                    onChange={(e) =>
                      setAmmedFormData({
                        ...ammedFormData,
                        price: e.target.value,
                      })
                    }
                  />
                </div>

                <div className="ammed-form-field">
                  <label htmlFor="ammed-treatment">Disease / Treatment</label>
                  <input
                    id="ammed-treatment"
                    type="text"
                    placeholder="Enter disease or treatment"
                    value={ammedFormData.treatment}
                    onChange={(e) =>
                      setAmmedFormData({
                        ...ammedFormData,
                        treatment: e.target.value,
                      })
                    }
                  />
                </div>

                <div className="ammed-form-field">
                  <label htmlFor="ammed-dosage">Dosage</label>
                  <input
                    id="ammed-dosage"
                    type="text"
                    placeholder="Enter dosage"
                    value={ammedFormData.dosage}
                    onChange={(e) =>
                      setAmmedFormData({
                        ...ammedFormData,
                        dosage: e.target.value,
                      })
                    }
                  />
                </div>

                <div className="ammed-form-field">
                  <label htmlFor="ammed-shop">Shop</label>
                  <select
                    id="ammed-shop"
                    value={ammedFormData.shop_id}
                    onChange={(e) =>
                      setAmmedFormData({
                        ...ammedFormData,
                        shop_id: e.target.value,
                      })
                    }
                    required
                  >
                    <option value="">Select Shop</option>
                    {ammedShops.map((shop) => (
                      <option key={shop.id} value={shop.id}>
                        {shop.shop_name}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="ammed-modal-actions">
                <button
                  type="submit"
                  className="ammed-primary-btn"
                  id="ammed-primary-btn"
                >
                  {ammedEditingMedicineId ? "Update Medicine" : "Create Medicine"}
                </button>

                <button
                  type="button"
                  className="ammed-secondary-btn"
                  id="ammed-secondary-btn"
                  onClick={ammedCloseModal}
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

export default ManageMedicines;