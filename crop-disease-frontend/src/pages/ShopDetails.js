import React, { useEffect, useState, useCallback } from "react";
import API from "../services/api";
import { useNavigate, useParams } from "react-router-dom";
import "../components/ShopDetails.css";
import Navbar from "./SupplierNavbar";
import {
  FaStore,
  FaMapMarkerAlt,
  FaCapsules,
  FaEdit,
  FaTrash,
  FaArrowLeft,
  FaPlusCircle,
  FaTimes,
} from "react-icons/fa";
import Footer from "./Footer";

function ShopDetails() {
  const navigate = useNavigate();
  const { id } = useParams();

  const [shop, setShop] = useState(null);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");
  const [messageType, setMessageType] = useState("");

  const [showMedicineModal, setShowMedicineModal] = useState(false);
  const [editingMedicineId, setEditingMedicineId] = useState(null);

  const [showShopEditForm, setShowShopEditForm] = useState(false);

  const [shopForm, setShopForm] = useState({
    shop_name: "",
    city: "",
    area: "",
    address: "",
    latitude: "",
    longitude: "",
  });

  const [medicineForm, setMedicineForm] = useState({
    medicine_name: "",
    stock_quantity: "",
    price: "",
    treatment: "",
    dosage: "",
  });

  const supplierToken = localStorage.getItem("supplier_token");

  const fetchShopDetails = useCallback(async () => {
    try {
      setLoading(true);

      const response = await API.get(`/shops/${id}`, {
        headers: {
          Authorization: `Bearer ${supplierToken}`,
        },
      });

      setShop(response.data);

      setShopForm({
        shop_name: response.data.shop_name || "",
        city: response.data.city || "",
        area: response.data.area || "",
        address: response.data.address || "",
        latitude: response.data.latitude ?? "",
        longitude: response.data.longitude ?? "",
      });
    } catch (error) {
      console.log(error.response?.data);
      setMessage("Failed to load shop details");
      setMessageType("error");
    } finally {
      setLoading(false);
    }
  }, [id, supplierToken]);

  useEffect(() => {
    if (!supplierToken) {
      navigate("/supplier-login");
      return;
    }

    fetchShopDetails();
  }, [fetchShopDetails, navigate, supplierToken]);

  const handleShopChange = (e) => {
    const { name, value } = e.target;
    setShopForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleMedicineChange = (e) => {
    const { name, value } = e.target;
    setMedicineForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const resetMedicineForm = () => {
    setMedicineForm({
      medicine_name: "",
      stock_quantity: "",
      price: "",
      treatment: "",
      dosage: "",
    });
    setEditingMedicineId(null);
    setShowMedicineModal(false);
  };

  const openAddMedicineModal = () => {
    setMedicineForm({
      medicine_name: "",
      stock_quantity: "",
      price: "",
      treatment: "",
      dosage: "",
    });
    setEditingMedicineId(null);
    setShowMedicineModal(true);
  };

  const handleUpdateShop = async (e) => {
    e.preventDefault();

    if (!shopForm.shop_name.trim() || !shopForm.city.trim() || !shopForm.address.trim()) {
      setMessage("Shop name, city, and address are required");
      setMessageType("error");
      return;
    }

    const payload = {
      shop_name: shopForm.shop_name.trim(),
      city: shopForm.city.trim(),
      area: shopForm.area.trim() || null,
      address: shopForm.address.trim(),
      latitude: shopForm.latitude ? parseFloat(shopForm.latitude) : null,
      longitude: shopForm.longitude ? parseFloat(shopForm.longitude) : null,
    };

    try {
      await API.put(`/shops/${id}`, payload, {
        headers: {
          Authorization: `Bearer ${supplierToken}`,
        },
      });

      setMessage("Shop updated successfully");
      setMessageType("success");
      setShowShopEditForm(false);
      fetchShopDetails();
    } catch (error) {
      console.log(error.response?.data);
      setMessage(error.response?.data?.detail || "Failed to update shop");
      setMessageType("error");
    }
  };

  const handleAddOrUpdateMedicine = async (e) => {
    e.preventDefault();

    if (!medicineForm.medicine_name.trim()) {
      setMessage("Medicine name is required");
      setMessageType("error");
      return;
    }

    const payload = {
      medicine_name: medicineForm.medicine_name.trim(),
      stock_quantity: medicineForm.stock_quantity
        ? parseInt(medicineForm.stock_quantity)
        : null,
      price: medicineForm.price ? parseFloat(medicineForm.price) : null,
      treatment: medicineForm.treatment.trim() || null,
      dosage: medicineForm.dosage.trim() || null,
    };

    try {
      if (editingMedicineId) {
        await API.put(`/shops/medicines/${editingMedicineId}`, payload, {
          headers: {
            Authorization: `Bearer ${supplierToken}`,
          },
        });

        setMessage("Medicine updated successfully");
        setMessageType("success");
      } else {
        await API.post(`/shops/${id}/medicines`, payload, {
          headers: {
            Authorization: `Bearer ${supplierToken}`,
          },
        });

        setMessage("Medicine added successfully");
        setMessageType("success");
      }

      resetMedicineForm();
      fetchShopDetails();
    } catch (error) {
      console.log(error.response?.data);
      setMessage(error.response?.data?.detail || "Operation failed");
      setMessageType("error");
    }
  };

  const handleEditMedicine = (medicine) => {
    setMedicineForm({
      medicine_name: medicine.medicine_name || "",
      stock_quantity: medicine.stock_quantity ?? "",
      price: medicine.price ?? "",
      treatment: medicine.treatment || "",
      dosage: medicine.dosage || "",
    });

    setEditingMedicineId(medicine.id);
    setShowMedicineModal(true);
  };

  const handleDeleteMedicine = async (medicineId) => {
    const confirmDelete = window.confirm("Are you sure you want to delete this medicine?");
    if (!confirmDelete) return;

    try {
      await API.delete(`/shops/medicines/${medicineId}`, {
        headers: {
          Authorization: `Bearer ${supplierToken}`,
        },
      });

      setMessage("Medicine deleted successfully");
      setMessageType("success");
      fetchShopDetails();
    } catch (error) {
      console.log(error.response?.data);
      setMessage("Failed to delete medicine");
      setMessageType("error");
    }
  };

  if (loading) {
    return (
      <>
        <Navbar />
        <div className="shop-details-page">
          <div className="no-medicine-box">Loading shop details...</div>
        </div>
        <Footer />
      </>
    );
  }

  if (!shop) {
    return (
      <>
        <Navbar />
        <div className="shop-details-page">
          <div className="no-medicine-box">Shop not found.</div>
        </div>
        <Footer />
      </>
    );
  }

  return (
    <>
      <Navbar />
      <div className="shop-details-page">
        <div className="shop-details-header">
          <div className="shop-details-title-wrap">
            <button className="back-btn-shop" onClick={() => navigate("/my-shops")}>
              <FaArrowLeft /> Back
            </button>
            <div>
              <h1>{shop.shop_name}</h1>
              <p>Manage shop details and medicines.</p>
            </div>
          </div>

          <div className="top-action-buttons">
            <button
              className="edit-shop-top-btn"
              onClick={() => setShowShopEditForm(!showShopEditForm)}
            >
              <FaEdit /> {showShopEditForm ? "Close Shop Edit" : "Edit Shop"}
            </button>

            <button
              className="add-medicine-top-btn"
              onClick={openAddMedicineModal}
            >
              <FaPlusCircle /> Add Medicine
            </button>
          </div>
        </div>

        {message && (
          <div className={`shop-details-message ${messageType}`}>
            {message}
          </div>
        )}

        <div className="shop-info-card">
          <div className="shop-info-top">
            <FaStore className="shop-info-icon" />
            <div>
              <h2>{shop.shop_name}</h2>
              <p className="shop-info-location">
                <FaMapMarkerAlt />
                {shop.city}
                {shop.area ? `, ${shop.area}` : ""}
              </p>
            </div>
          </div>

          <div className="shop-info-body">
            <p><b>Address:</b> {shop.address}</p>
            <p><b>Total Medicines:</b> {shop.medicines.length}</p>
          </div>
        </div>

        {showShopEditForm && (
          <div className="shop-edit-form-card">
            <h2>Edit Shop Details</h2>

            <form onSubmit={handleUpdateShop}>
              <div className="medicine-form-grid">
                <input
                  type="text"
                  name="shop_name"
                  placeholder="Shop Name *"
                  value={shopForm.shop_name}
                  onChange={handleShopChange}
                />

                <input
                  type="text"
                  name="city"
                  placeholder="City *"
                  value={shopForm.city}
                  onChange={handleShopChange}
                />

                <input
                  type="text"
                  name="area"
                  placeholder="Area"
                  value={shopForm.area}
                  onChange={handleShopChange}
                />

                <input
                  type="text"
                  name="address"
                  placeholder="Address *"
                  value={shopForm.address}
                  onChange={handleShopChange}
                />

                <input
                  type="number"
                  step="any"
                  name="latitude"
                  placeholder="Latitude"
                  value={shopForm.latitude}
                  onChange={handleShopChange}
                />

                <input
                  type="number"
                  step="any"
                  name="longitude"
                  placeholder="Longitude"
                  value={shopForm.longitude}
                  onChange={handleShopChange}
                />
              </div>

              <div className="medicine-form-actions">
                <button
                  type="button"
                  className="cancel-btn"
                  onClick={() => setShowShopEditForm(false)}
                >
                  Cancel
                </button>
                <button type="submit" className="save-btn">
                  Save Shop Changes
                </button>
              </div>
            </form>
          </div>
        )}

        <div className="shop-medicines-section">
          <h2>
            <FaCapsules /> Medicines in Shop
          </h2>

          {shop.medicines.length === 0 ? (
            <div className="no-medicine-box">No medicines added yet.</div>
          ) : (
            <div className="medicine-cards-grid">
              {shop.medicines.map((medicine) => (
                <div key={medicine.id} className="medicine-card-box">
                  <h3>{medicine.medicine_name}</h3>
                  <p><b>Stock:</b> {medicine.stock_quantity ?? "N/A"}</p>
                  <p><b>Price:</b> ₹{medicine.price ?? "N/A"}</p>
                  <p><b>Treatment:</b> {medicine.treatment || "Not available"}</p>
                  <p><b>Dosage:</b> {medicine.dosage || "Not available"}</p>

                  <div className="medicine-card-actions">
                    <button
                      className="edit-medicine-btn"
                      onClick={() => handleEditMedicine(medicine)}
                    >
                      <FaEdit /> Edit
                    </button>

                    <button
                      className="delete-medicine-btn"
                      onClick={() => handleDeleteMedicine(medicine.id)}
                    >
                      <FaTrash /> Delete
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {showMedicineModal && (
          <div
            className="medicine-modal-overlay"
            onClick={resetMedicineForm}
          >
            <div
              className="medicine-modal-card"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="medicine-modal-header">
                <h2>{editingMedicineId ? "Edit Medicine" : "Add Medicine"}</h2>
                <button
                  className="medicine-modal-close"
                  onClick={resetMedicineForm}
                >
                  <FaTimes />
                </button>
              </div>

              <form onSubmit={handleAddOrUpdateMedicine}>
                <div className="medicine-form-grid">
                  <input
                    type="text"
                    name="medicine_name"
                    placeholder="Medicine Name *"
                    value={medicineForm.medicine_name}
                    onChange={handleMedicineChange}
                  />

                  <input
                    type="number"
                    name="stock_quantity"
                    placeholder="Stock Quantity"
                    value={medicineForm.stock_quantity}
                    onChange={handleMedicineChange}
                  />

                  <input
                    type="number"
                    step="0.01"
                    name="price"
                    placeholder="Price"
                    value={medicineForm.price}
                    onChange={handleMedicineChange}
                  />

                  <input
                    type="text"
                    name="treatment"
                    placeholder="Treatment"
                    value={medicineForm.treatment}
                    onChange={handleMedicineChange}
                  />

                  <input
                    type="text"
                    name="dosage"
                    placeholder="Dosage"
                    value={medicineForm.dosage}
                    onChange={handleMedicineChange}
                  />
                </div>

                <div className="medicine-form-actions">
                  <button
                    type="button"
                    className="cancel-btn"
                    onClick={resetMedicineForm}
                  >
                    Cancel
                  </button>
                  <button type="submit" className="save-btn">
                    {editingMedicineId ? "Update Medicine" : "Save Medicine"}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
      <Footer />
    </>
  );
}

export default ShopDetails;