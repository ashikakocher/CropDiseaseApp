import React, { useEffect, useState } from "react";
import API from "../services/api";
import {
  FaTrash,
  FaEdit,
  FaPlus,
  FaStore,
  FaMapMarkerAlt,
} from "react-icons/fa";
import "./Admin.css";

function ManageShops() {
  const [amshpShops, setAmshpShops] = useState([]);
  const [amshpSuppliers, setAmshpSuppliers] = useState([]);
  const [amshpShowModal, setAmshpShowModal] = useState(false);
  const [amshpEditingShopId, setAmshpEditingShopId] = useState(null);

  const [amshpFormData, setAmshpFormData] = useState({
    supplier_id: "",
    shop_name: "",
    city: "",
    area: "",
    address: "",
    latitude: "",
    longitude: "",
  });

  useEffect(() => {
    amshpFetchShops();
    amshpFetchSuppliers();
  }, []);

  const amshpGetHeaders = () => ({
    Authorization: `Bearer ${localStorage.getItem("admin_token")}`,
  });

  const amshpFetchShops = async () => {
    try {
      const res = await API.get("/admin/shops", {
        headers: amshpGetHeaders(),
      });
      setAmshpShops(res.data || []);
    } catch (err) {
      console.log(err);
    }
  };

  const amshpFetchSuppliers = async () => {
    try {
      const res = await API.get("/admin/suppliers", {
        headers: amshpGetHeaders(),
      });
      setAmshpSuppliers(res.data || []);
    } catch (err) {
      console.log(err);
    }
  };

  const amshpOpenAddModal = () => {
    setAmshpEditingShopId(null);
    setAmshpFormData({
      supplier_id: "",
      shop_name: "",
      city: "",
      area: "",
      address: "",
      latitude: "",
      longitude: "",
    });
    setAmshpShowModal(true);
  };

  const amshpOpenEditModal = (shop) => {
    setAmshpEditingShopId(shop.id);
    setAmshpFormData({
      supplier_id: shop.supplier_id || "",
      shop_name: shop.shop_name || "",
      city: shop.city || "",
      area: shop.area || "",
      address: shop.address || "",
      latitude: shop.latitude || "",
      longitude: shop.longitude || "",
    });
    setAmshpShowModal(true);
  };

  const amshpCloseModal = () => {
    setAmshpShowModal(false);
    setAmshpEditingShopId(null);
    setAmshpFormData({
      supplier_id: "",
      shop_name: "",
      city: "",
      area: "",
      address: "",
      latitude: "",
      longitude: "",
    });
  };

  const amshpHandleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this shop?")) return;

    try {
      await API.delete(`/admin/shops/${id}`, {
        headers: amshpGetHeaders(),
      });
      amshpFetchShops();
    } catch (err) {
      console.log(err);
      alert(err.response?.data?.detail || "Delete failed");
    }
  };

  const amshpHandleSubmit = async (e) => {
    e.preventDefault();

    const payload = {
      supplier_id: Number(amshpFormData.supplier_id),
      shop_name: amshpFormData.shop_name,
      city: amshpFormData.city,
      area: amshpFormData.area || null,
      address: amshpFormData.address,
      latitude: amshpFormData.latitude ? Number(amshpFormData.latitude) : null,
      longitude: amshpFormData.longitude
        ? Number(amshpFormData.longitude)
        : null,
    };

    try {
      if (amshpEditingShopId) {
        await API.put(`/admin/shops/${amshpEditingShopId}`, payload, {
          headers: amshpGetHeaders(),
        });
      } else {
        await API.post("/admin/shops", payload, {
          headers: amshpGetHeaders(),
        });
      }

      amshpCloseModal();
      amshpFetchShops();
    } catch (err) {
      console.log(err);
      alert(err.response?.data?.detail || "Something went wrong");
    }
  };

  const amshpGetSupplierName = (supplierId) => {
    const supplier = amshpSuppliers.find((item) => item.id === supplierId);
    return supplier ? supplier.name : "N/A";
  };

  return (
    <section className="amshp-wrapper" id="amshp-wrapper">
      <div className="amshp-header-card">
        <div className="amshp-header-left">
          <div className="amshp-header-icon">
            <FaStore />
          </div>
          <div>
            <h2 className="amshp-main-title">Manage Shops</h2>
          </div>
        </div>

        <button
          className="amshp-add-btn"
          id="amshp-add-btn"
          onClick={amshpOpenAddModal}
        >
          <FaPlus />
          <span>Add Shop</span>
        </button>
      </div>

      <div className="amshp-table-card">
        <div className="amshp-table-responsive">
          <table className="amshp-table" id="amshp-table">
            <thead>
              <tr>
                <th>Shop Name</th>
                <th>Supplier</th>
                <th>City</th>
                <th>Area</th>
                <th>Address</th>
                <th>Latitude</th>
                <th>Longitude</th>
                <th className="amshp-action-heading">Actions</th>
              </tr>
            </thead>

            <tbody>
              {amshpShops.length > 0 ? (
                amshpShops.map((shop) => (
                  <tr key={shop.id}>
                    <td>
                      <div className="amshp-shop-name">{shop.shop_name || "-"}</div>
                    </td>
                    <td>{amshpGetSupplierName(shop.supplier_id)}</td>
                    <td>{shop.city || "-"}</td>
                    <td>{shop.area || "-"}</td>
                    <td className="amshp-address-cell">{shop.address || "-"}</td>
                    <td>{shop.latitude ?? "-"}</td>
                    <td>{shop.longitude ?? "-"}</td>
                    <td>
                      <div className="amshp-action-group">
                        <button
                          className="amshp-icon-btn amshp-edit-btn"
                          id={`amshp-edit-btn-${shop.id}`}
                          onClick={() => amshpOpenEditModal(shop)}
                          title="Edit Shop"
                        >
                          <FaEdit />
                        </button>

                        <button
                          className="amshp-icon-btn amshp-delete-btn"
                          id={`amshp-delete-btn-${shop.id}`}
                          onClick={() => amshpHandleDelete(shop.id)}
                          title="Delete Shop"
                        >
                          <FaTrash />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="8">
                    <div className="amshp-empty-state">No shops found.</div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {amshpShowModal && (
        <div className="amshp-modal-overlay" id="amshp-modal-overlay">
          <div className="amshp-modal-box" id="amshp-modal-box">
            <div className="amshp-modal-header">
              <div>
                <h3 className="amshp-modal-title">
                  {amshpEditingShopId ? "Edit Shop" : "Add New Shop"}
                </h3>
                <p className="amshp-modal-subtitle">
                  {amshpEditingShopId
                    ? "Update shop details below."
                    : "Fill in the details to create a new shop."}
                </p>
              </div>

              <button
                className="amshp-modal-close-btn"
                id="amshp-modal-close-btn"
                onClick={amshpCloseModal}
                type="button"
              >
                ×
              </button>
            </div>

            <form className="amshp-form" onSubmit={amshpHandleSubmit}>
              <div className="amshp-form-grid">
                <div className="amshp-form-field amshp-form-field-full">
                  <label htmlFor="amshp-supplier">Supplier</label>
                  <select
                    id="amshp-supplier"
                    value={amshpFormData.supplier_id}
                    onChange={(e) =>
                      setAmshpFormData({
                        ...amshpFormData,
                        supplier_id: e.target.value,
                      })
                    }
                    required
                  >
                    <option value="">Select Supplier</option>
                    {amshpSuppliers.map((supplier) => (
                      <option key={supplier.id} value={supplier.id}>
                        {supplier.name} ({supplier.email})
                      </option>
                    ))}
                  </select>
                </div>

                <div className="amshp-form-field">
                  <label htmlFor="amshp-shop-name">Shop Name</label>
                  <input
                    id="amshp-shop-name"
                    type="text"
                    placeholder="Enter shop name"
                    value={amshpFormData.shop_name}
                    onChange={(e) =>
                      setAmshpFormData({
                        ...amshpFormData,
                        shop_name: e.target.value,
                      })
                    }
                    required
                  />
                </div>

                <div className="amshp-form-field">
                  <label htmlFor="amshp-city">City</label>
                  <input
                    id="amshp-city"
                    type="text"
                    placeholder="Enter city"
                    value={amshpFormData.city}
                    onChange={(e) =>
                      setAmshpFormData({
                        ...amshpFormData,
                        city: e.target.value,
                      })
                    }
                    required
                  />
                </div>

                <div className="amshp-form-field">
                  <label htmlFor="amshp-area">Area</label>
                  <input
                    id="amshp-area"
                    type="text"
                    placeholder="Enter area"
                    value={amshpFormData.area}
                    onChange={(e) =>
                      setAmshpFormData({
                        ...amshpFormData,
                        area: e.target.value,
                      })
                    }
                  />
                </div>

                <div className="amshp-form-field">
                  <label htmlFor="amshp-address">Address</label>
                  <input
                    id="amshp-address"
                    type="text"
                    placeholder="Enter address"
                    value={amshpFormData.address}
                    onChange={(e) =>
                      setAmshpFormData({
                        ...amshpFormData,
                        address: e.target.value,
                      })
                    }
                    required
                  />
                </div>

                <div className="amshp-form-field">
                  <label htmlFor="amshp-latitude">Latitude</label>
                  <input
                    id="amshp-latitude"
                    type="number"
                    step="any"
                    placeholder="Enter latitude"
                    value={amshpFormData.latitude}
                    onChange={(e) =>
                      setAmshpFormData({
                        ...amshpFormData,
                        latitude: e.target.value,
                      })
                    }
                  />
                </div>

                <div className="amshp-form-field">
                  <label htmlFor="amshp-longitude">Longitude</label>
                  <input
                    id="amshp-longitude"
                    type="number"
                    step="any"
                    placeholder="Enter longitude"
                    value={amshpFormData.longitude}
                    onChange={(e) =>
                      setAmshpFormData({
                        ...amshpFormData,
                        longitude: e.target.value,
                      })
                    }
                  />
                </div>
              </div>

              <div className="amshp-modal-actions">
                <button
                  type="submit"
                  className="amshp-primary-btn"
                  id="amshp-primary-btn"
                >
                  {amshpEditingShopId ? "Update Shop" : "Create Shop"}
                </button>

                <button
                  type="button"
                  className="amshp-secondary-btn"
                  id="amshp-secondary-btn"
                  onClick={amshpCloseModal}
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

export default ManageShops;