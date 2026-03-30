import React, { useEffect, useState } from "react";
import API from "../services/api";
import { FaTrash, FaEdit, FaPlus } from "react-icons/fa";


function ManageMedicines() {
  const [medicines, setMedicines] = useState([]);
  const [shops, setShops] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [editingMedicineId, setEditingMedicineId] = useState(null);

  const [formData, setFormData] = useState({
    medicine_name: "",
    stock_quantity: "",
    price: "",
    treatment: "",
    dosage: "",
    shop_id: "",
  });

  useEffect(() => {
    fetchMedicines();
    fetchShops();
  }, []);

  const getHeaders = () => ({
    Authorization: `Bearer ${localStorage.getItem("admin_token")}`,
  });

  const fetchMedicines = async () => {
    try {
      const res = await API.get("/admin/medicines", {
        headers: getHeaders(),
      });
      setMedicines(res.data);
    } catch (err) {
      console.log(err);
    }
  };

  const fetchShops = async () => {
    try {
      const res = await API.get("/admin/shops", {
        headers: getHeaders(),
      });
      setShops(res.data);
    } catch (err) {
      console.log(err);
    }
  };

  const openAddModal = () => {
    setEditingMedicineId(null);
    setFormData({
      medicine_name: "",
      stock_quantity: "",
      price: "",
      treatment: "",
      dosage: "",
      shop_id: "",
    });
    setShowModal(true);
  };

  const openEditModal = (item) => {
    setEditingMedicineId(item.id);
    setFormData({
      medicine_name: item.medicine_name || "",
      stock_quantity: item.stock_quantity ?? "",
      price: item.price ?? "",
      treatment: item.treatment || "",
      dosage: item.dosage || "",
      shop_id: item.shop_id || "",
    });
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setEditingMedicineId(null);
    setFormData({
      medicine_name: "",
      stock_quantity: "",
      price: "",
      treatment: "",
      dosage: "",
      shop_id: "",
    });
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this medicine?")) return;

    try {
      await API.delete(`/admin/medicines/${id}`, {
        headers: getHeaders(),
      });
      fetchMedicines();
    } catch (err) {
      console.log(err);
      alert(err.response?.data?.detail || "Delete failed");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const payload = {
      medicine_name: formData.medicine_name,
      stock_quantity: formData.stock_quantity
        ? Number(formData.stock_quantity)
        : null,
      price: formData.price ? Number(formData.price) : null,
      treatment: formData.treatment || null,
      dosage: formData.dosage || null,
      shop_id: Number(formData.shop_id),
    };

    try {
      if (editingMedicineId) {
        await API.put(`/admin/medicines/${editingMedicineId}`, payload, {
          headers: getHeaders(),
        });
      } else {
        await API.post("/admin/medicines", payload, {
          headers: getHeaders(),
        });
      }

      closeModal();
      fetchMedicines();
    } catch (err) {
      console.log(err);
      alert(err.response?.data?.detail || "Something went wrong");
    }
  };

  const getShopName = (shopId) => {
    const shop = shops.find((s) => s.id === shopId);
    return shop ? shop.shop_name : "N/A";
  };

  return (
    <div className="admin-section">
      <div className="section-header section-header-flex">
        <h3>Manage Medicines</h3>

        <button className="primary-admin-btn" onClick={openAddModal}>
          <FaPlus style={{ marginRight: "8px" }} />
          Add Medicine
        </button>
      </div>

      <div className="table-wrap">
        <table className="admin-table">
          <thead>
            <tr>
              <th>Medicine Name</th>
              <th>Stock</th>
              <th>Price</th>
              <th>Treatment</th>
              <th>Dosage</th>
              <th>Shop Name</th>
              <th>Actions</th>
            </tr>
          </thead>

          <tbody>
            {medicines.map((item) => (
              <tr key={item.id}>
                <td>{item.medicine_name}</td>
                <td>{item.stock_quantity}</td>
                <td>{item.price}</td>
                <td>{item.treatment}</td>
                <td>{item.dosage}</td>
                <td>{getShopName(item.shop_id)}</td>
                <td className="action-cell">
                  <button
                    className="icon-btn edit"
                    onClick={() => openEditModal(item)}
                  >
                    <FaEdit />
                  </button>

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

      {showModal && (
        <div className="admin-modal-overlay">
          <div className="admin-modal">
            <div className="admin-modal-header">
              <h3>{editingMedicineId ? "Edit Medicine" : "Add Medicine"}</h3>
              <button className="modal-close-btn" onClick={closeModal}>
                ×
              </button>
            </div>

            <form onSubmit={handleSubmit}>
              <div className="admin-form-grid">
                <input
                  type="text"
                  placeholder="Medicine Name"
                  value={formData.medicine_name}
                  onChange={(e) =>
                    setFormData({ ...formData, medicine_name: e.target.value })
                  }
                  required
                />

                <input
                  type="number"
                  placeholder="Stock Quantity"
                  value={formData.stock_quantity}
                  onChange={(e) =>
                    setFormData({ ...formData, stock_quantity: e.target.value })
                  }
                />

                <input
                  type="number"
                  step="0.01"
                  placeholder="Price"
                  value={formData.price}
                  onChange={(e) =>
                    setFormData({ ...formData, price: e.target.value })
                  }
                />

                <input
                  type="text"
                  placeholder="Disease"
                  value={formData.treatment}
                  onChange={(e) =>
                    setFormData({ ...formData, treatment: e.target.value })
                  }
                />

                <input
                  type="text"
                  placeholder="Dosage"
                  value={formData.dosage}
                  onChange={(e) =>
                    setFormData({ ...formData, dosage: e.target.value })
                  }
                />

                <select
                  value={formData.shop_id}
                  onChange={(e) =>
                    setFormData({ ...formData, shop_id: e.target.value })
                  }
                  required
                >
                  <option value="">Select Shop</option>
                  {shops.map((shop) => (
                    <option key={shop.id} value={shop.id}>
                      {shop.shop_name}
                    </option>
                  ))}
                </select>
              </div>

              <div className="modal-actions">
                <button type="submit" className="save-btn">
                  {editingMedicineId ? "Update Medicine" : "Add Medicine"}
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

export default ManageMedicines;