import React, { useEffect, useState } from "react";
import API from "../services/api";
import { FaTrash, FaEdit, FaPlus } from "react-icons/fa";

function ManageShops() {
  const [shops, setShops] = useState([]);
  const [suppliers, setSuppliers] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [editingShopId, setEditingShopId] = useState(null);

  const [formData, setFormData] = useState({
    supplier_id: "",
    shop_name: "",
    city: "",
    area: "",
    address: "",
    latitude: "",
    longitude: "",
  });

  useEffect(() => {
    fetchShops();
    fetchSuppliers();
  }, []);

  const getHeaders = () => ({
    Authorization: `Bearer ${localStorage.getItem("admin_token")}`,
  });

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
    setEditingShopId(null);
    setFormData({
      supplier_id: "",
      shop_name: "",
      city: "",
      area: "",
      address: "",
      latitude: "",
      longitude: "",
    });
    setShowModal(true);
  };

  const openEditModal = (shop) => {
    setEditingShopId(shop.id);
    setFormData({
      supplier_id: shop.supplier_id || "",
      shop_name: shop.shop_name || "",
      city: shop.city || "",
      area: shop.area || "",
      address: shop.address || "",
      latitude: shop.latitude || "",
      longitude: shop.longitude || "",
    });
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setEditingShopId(null);
    setFormData({
      supplier_id: "",
      shop_name: "",
      city: "",
      area: "",
      address: "",
      latitude: "",
      longitude: "",
    });
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this shop?")) return;

    try {
      await API.delete(`/admin/shops/${id}`, {
        headers: getHeaders(),
      });
      fetchShops();
    } catch (err) {
      console.log(err);
      alert(err.response?.data?.detail || "Delete failed");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const payload = {
      supplier_id: Number(formData.supplier_id),
      shop_name: formData.shop_name,
      city: formData.city,
      area: formData.area || null,
      address: formData.address,
      latitude: formData.latitude ? Number(formData.latitude) : null,
      longitude: formData.longitude ? Number(formData.longitude) : null,
    };

    try {
      if (editingShopId) {
        await API.put(`/admin/shops/${editingShopId}`, payload, {
          headers: getHeaders(),
        });
      } else {
        await API.post("/admin/shops", payload, {
          headers: getHeaders(),
        });
      }

      closeModal();
      fetchShops();
    } catch (err) {
      console.log(err);
      alert(err.response?.data?.detail || "Something went wrong");
    }
  };

  const getSupplierName = (supplierId) => {
    const supplier = suppliers.find((item) => item.id === supplierId);
    return supplier ? supplier.name : "N/A";
  };

  return (
    <div className="admin-section">
      <div className="section-header section-header-flex">
        <h3>Manage Shops</h3>

        <button className="primary-admin-btn" onClick={openAddModal}>
          <FaPlus style={{ marginRight: "8px" }} />
          Add Shop
        </button>
      </div>

      <div className="table-wrap">
        <table className="admin-table">
          <thead>
            <tr>
              <th>Shop Name</th>
              <th>Supplier</th>
              <th>City</th>
              <th>Area</th>
              <th>Address</th>
              <th>Latitude</th>
              <th>Longitude</th>
              <th>Actions</th>
            </tr>
          </thead>

          <tbody>
            {shops.map((shop) => (
              <tr key={shop.id}>
                <td>{shop.shop_name}</td>
                <td>{getSupplierName(shop.supplier_id)}</td>
                <td>{shop.city}</td>
                <td>{shop.area}</td>
                <td>{shop.address}</td>
                <td>{shop.latitude}</td>
                <td>{shop.longitude}</td>

                <td className="action-cell">
                  <button
                    className="icon-btn edit"
                    onClick={() => openEditModal(shop)}
                  >
                    <FaEdit />
                  </button>

                  <button
                    className="icon-btn delete"
                    onClick={() => handleDelete(shop.id)}
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
              <h3>{editingShopId ? "Edit Shop" : "Add Shop"}</h3>
              <button className="modal-close-btn" onClick={closeModal}>
                ×
              </button>
            </div>

            <form onSubmit={handleSubmit}>
              <div className="admin-form-grid">
                <select
                  value={formData.supplier_id}
                  onChange={(e) =>
                    setFormData({ ...formData, supplier_id: e.target.value })
                  }
                  required
                >
                  <option value="">Select Supplier</option>
                  {suppliers.map((supplier) => (
                    <option key={supplier.id} value={supplier.id}>
                      {supplier.name} ({supplier.email})
                    </option>
                  ))}
                </select>

                <input
                  type="text"
                  placeholder="Shop Name"
                  value={formData.shop_name}
                  onChange={(e) =>
                    setFormData({ ...formData, shop_name: e.target.value })
                  }
                  required
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

                <input
                  type="text"
                  placeholder="Address"
                  value={formData.address}
                  onChange={(e) =>
                    setFormData({ ...formData, address: e.target.value })
                  }
                  required
                />

                <input
                  type="number"
                  step="any"
                  placeholder="Latitude"
                  value={formData.latitude}
                  onChange={(e) =>
                    setFormData({ ...formData, latitude: e.target.value })
                  }
                />

                <input
                  type="number"
                  step="any"
                  placeholder="Longitude"
                  value={formData.longitude}
                  onChange={(e) =>
                    setFormData({ ...formData, longitude: e.target.value })
                  }
                />
              </div>

              <div className="modal-actions">
                <button type="submit" className="save-btn">
                  {editingShopId ? "Update Shop" : "Add Shop"}
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

export default ManageShops;