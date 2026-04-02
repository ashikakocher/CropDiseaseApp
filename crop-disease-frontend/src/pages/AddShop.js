import React, { useState } from "react";
import API from "../services/api";
import { useNavigate } from "react-router-dom";
import "../components/AddShop.css";
import Navbar from "./SupplierNavbar";
import Footer from "./Footer";
import {
  FaStore,
  FaMapMarkerAlt,
  FaCity,
  FaPlus,
  FaCapsules,
  FaTrash,
  FaArrowLeft,
  FaSave,
  FaMapPin,
  FaMoneyBillWave,
  FaClipboardList,
} from "react-icons/fa";

function AddShop() {
  const navigate = useNavigate();

  const [shopName, setShopName] = useState("");
  const [city, setCity] = useState("");
  const [area, setArea] = useState("");
  const [address, setAddress] = useState("");
  const [latitude, setLatitude] = useState("");
  const [longitude, setLongitude] = useState("");
  const [medicines, setMedicines] = useState([
    {
      medicine_name: "",
      stock_quantity: "",
      price: "",
      treatment: "",
      dosage: "",
    },
  ]);

  const [message, setMessage] = useState("");
  const [messageType, setMessageType] = useState("");

  const handleMedicineChange = (index, field, value) => {
    const updatedMedicines = [...medicines];
    updatedMedicines[index][field] = value;
    setMedicines(updatedMedicines);
  };

  const addMedicineField = () => {
    setMedicines([
      ...medicines,
      {
        medicine_name: "",
        stock_quantity: "",
        price: "",
        treatment: "",
        dosage: "",
      },
    ]);
  };

  const removeMedicineField = (index) => {
    const updatedMedicines = medicines.filter((_, i) => i !== index);
    setMedicines(updatedMedicines);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const supplierToken = localStorage.getItem("supplier_token");

    if (!supplierToken) {
      navigate("/supplier-login");
      return;
    }

    if (!shopName || !city || !address) {
      setMessage("Please fill all required shop fields");
      setMessageType("error");
      return;
    }

    const validMedicines = medicines.filter(
      (med) => med.medicine_name.trim() !== ""
    );

    if (validMedicines.length === 0) {
      setMessage("Please add at least one medicine");
      setMessageType("error");
      return;
    }

    try {
      const payload = {
        shop: {
          shop_name: shopName.trim(),
          city: city.trim(),
          area: area.trim() || null,
          address: address.trim(),
          latitude: latitude ? parseFloat(latitude) : null,
          longitude: longitude ? parseFloat(longitude) : null,
        },
        medicines: validMedicines.map((med) => ({
          medicine_name: med.medicine_name.trim(),
          stock_quantity: med.stock_quantity ? parseInt(med.stock_quantity) : null,
          price: med.price ? parseFloat(med.price) : null,
          treatment: med.treatment.trim() || null,
          dosage: med.dosage.trim() || null,
        })),
      };

      await API.post("/shops/with-medicines", payload, {
        headers: {
          Authorization: `Bearer ${supplierToken}`,
        },
      });

      setMessage("Shop and medicines added successfully");
      setMessageType("success");

      setShopName("");
      setCity("");
      setArea("");
      setAddress("");
      setLatitude("");
      setLongitude("");
      setMedicines([
        {
          medicine_name: "",
          stock_quantity: "",
          price: "",
          treatment: "",
          dosage: "",
        },
      ]);

      setTimeout(() => {
        navigate("/supplier-dashboard");
      }, 1000);
    } catch (error) {
      console.log(error.response?.data);

      let errorMsg = "Failed to add shop";

      if (error.response?.data?.detail) {
        if (typeof error.response.data.detail === "string") {
          errorMsg = error.response.data.detail;
        } else if (Array.isArray(error.response.data.detail)) {
          errorMsg = error.response.data.detail[0]?.msg || "Failed to add shop";
        }
      }

      setMessage(errorMsg);
      setMessageType("error");
    }
  };

  return (
    <>
      <Navbar />

      <div className="add-shop-page">
        <div className="add-shop-wrapper">
          <div className="add-shop-hero">
            <div className="add-shop-hero-left">
              <span className="form-badge">🏪 Supplier Management</span>
              <h1>Add Your Shop & Medicines</h1>
              <p>
                Register your agro medicine shop, manage inventory, and make your
                medicines available for farmers nearby.
              </p>
            </div>

            <div className="add-shop-hero-card">
              <div className="mini-stat-card">
                <FaStore className="mini-stat-icon" />
                <div>
                  <h4>Shop Setup</h4>
                  <p>Create your store profile</p>
                </div>
              </div>
              <div className="mini-stat-card">
                <FaCapsules className="mini-stat-icon" />
                <div>
                  <h4>Medicine Inventory</h4>
                  <p>Add available medicines easily</p>
                </div>
              </div>
            </div>
          </div>

          <div className="add-shop-container">
            {message && (
              <div className={`add-shop-message ${messageType}`}>
                {message}
              </div>
            )}

            <form onSubmit={handleSubmit}>
              {/* SHOP DETAILS */}
              <div className="add-shop-section">
                <div className="section-title-row">
                  <div>
                    <span className="section-chip">SHOP DETAILS</span>
                    <h2>Basic Shop Information</h2>
                    <p>Fill in your shop details so farmers can find you easily.</p>
                  </div>
                </div>

                <div className="add-shop-grid">
                  <div className="input-group">
                    <label><FaStore /> Shop Name *</label>
                    <input
                      type="text"
                      placeholder="Enter shop name"
                      value={shopName}
                      onChange={(e) => setShopName(e.target.value)}
                    />
                  </div>

                  <div className="input-group">
                    <label><FaCity /> City *</label>
                    <input
                      type="text"
                      placeholder="Enter city"
                      value={city}
                      onChange={(e) => setCity(e.target.value)}
                    />
                  </div>

                  <div className="input-group">
                    <label><FaMapMarkerAlt /> Area</label>
                    <input
                      type="text"
                      placeholder="Enter area"
                      value={area}
                      onChange={(e) => setArea(e.target.value)}
                    />
                  </div>

                  <div className="input-group full-width">
                    <label><FaMapPin /> Full Address *</label>
                    <input
                      type="text"
                      placeholder="Enter complete address"
                      value={address}
                      onChange={(e) => setAddress(e.target.value)}
                    />
                  </div>

                  <div className="input-group">
                    <label>Latitude</label>
                    <input
                      type="number"
                      step="any"
                      placeholder="e.g. 30.7333"
                      value={latitude}
                      onChange={(e) => setLatitude(e.target.value)}
                    />
                  </div>

                  <div className="input-group">
                    <label>Longitude</label>
                    <input
                      type="number"
                      step="any"
                      placeholder="e.g. 76.7794"
                      value={longitude}
                      onChange={(e) => setLongitude(e.target.value)}
                    />
                  </div>
                </div>
              </div>

              {/* MEDICINES */}
              <div className="add-shop-section">
                <div className="medicine-heading-row">
                  <div>
                    <span className="section-chip">MEDICINE INVENTORY</span>
                    <h2>Available Medicines</h2>
                    <p>Add one or more medicines available in your shop.</p>
                  </div>

                  <button
                    type="button"
                    className="add-medicine-btn"
                    onClick={addMedicineField}
                  >
                    <FaPlus /> Add Medicine
                  </button>
                </div>

                {medicines.map((medicine, index) => (
                  <div className="medicine-card" key={index}>
                    <div className="medicine-card-top">
                      <div className="medicine-number">
                        <FaCapsules />
                        <span>Medicine {index + 1}</span>
                      </div>

                      {medicines.length > 1 && (
                        <button
                          type="button"
                          className="remove-medicine-btn"
                          onClick={() => removeMedicineField(index)}
                        >
                          <FaTrash /> Remove
                        </button>
                      )}
                    </div>

                    <div className="add-shop-grid">
                      <div className="input-group">
                        <label><FaCapsules /> Medicine Name *</label>
                        <input
                          type="text"
                          placeholder="Enter medicine name"
                          value={medicine.medicine_name}
                          onChange={(e) =>
                            handleMedicineChange(index, "medicine_name", e.target.value)
                          }
                        />
                      </div>

                      <div className="input-group">
                        <label><FaClipboardList /> Stock Quantity</label>
                        <input
                          type="number"
                          placeholder="Enter stock quantity"
                          value={medicine.stock_quantity}
                          onChange={(e) =>
                            handleMedicineChange(index, "stock_quantity", e.target.value)
                          }
                        />
                      </div>

                      <div className="input-group">
                        <label><FaMoneyBillWave /> Price</label>
                        <input
                          type="number"
                          step="0.01"
                          placeholder="Enter price"
                          value={medicine.price}
                          onChange={(e) =>
                            handleMedicineChange(index, "price", e.target.value)
                          }
                        />
                      </div>

                      <div className="input-group">
                        <label>Disease / Treatment</label>
                        <input
                          type="text"
                          placeholder="e.g. Leaf Spot"
                          value={medicine.treatment}
                          onChange={(e) =>
                            handleMedicineChange(index, "treatment", e.target.value)
                          }
                        />
                      </div>

                      <div className="input-group">
                        <label>Dosage</label>
                        <input
                          type="text"
                          placeholder="e.g. 2 ml per litre"
                          value={medicine.dosage}
                          onChange={(e) =>
                            handleMedicineChange(index, "dosage", e.target.value)
                          }
                        />
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* ACTIONS */}
              <div className="add-shop-actions">
                <button
                  type="button"
                  className="back-btn"
                  onClick={() => navigate("/supplier-dashboard")}
                >
                  <FaArrowLeft /> Back
                </button>

                <button type="submit" className="submit-btn">
                  <FaSave /> Save Shop
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
}

export default AddShop;