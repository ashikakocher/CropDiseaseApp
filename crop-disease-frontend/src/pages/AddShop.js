import React, { useState } from "react";
import API from "../services/api";
import { useNavigate } from "react-router-dom";
import "../components/AddShop.css";

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
    <div className="add-shop-page">
      <div className="add-shop-container">
        <div className="add-shop-header">
          <h1>Add Shop</h1>
          <p>Register your shop and add available medicines.</p>
        </div>

        {message && (
          <div className={`add-shop-message ${messageType}`}>
            {message}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div className="add-shop-section">
            <h2>Shop Details</h2>

            <div className="add-shop-grid">
              <input
                type="text"
                placeholder="Shop Name *"
                value={shopName}
                onChange={(e) => setShopName(e.target.value)}
              />

              <input
                type="text"
                placeholder="City *"
                value={city}
                onChange={(e) => setCity(e.target.value)}
              />

              <input
                type="text"
                placeholder="Area"
                value={area}
                onChange={(e) => setArea(e.target.value)}
              />

              <input
                type="text"
                placeholder="Full Address *"
                value={address}
                onChange={(e) => setAddress(e.target.value)}
              />

              <input
                type="number"
                step="any"
                placeholder="Latitude"
                value={latitude}
                onChange={(e) => setLatitude(e.target.value)}
              />

              <input
                type="number"
                step="any"
                placeholder="Longitude"
                value={longitude}
                onChange={(e) => setLongitude(e.target.value)}
              />
            </div>
          </div>

          <div className="add-shop-section">
            <div className="medicine-heading-row">
              <h2>Available Medicines</h2>
              <button
                type="button"
                className="add-medicine-btn"
                onClick={addMedicineField}
              >
                + Add Medicine
              </button>
            </div>

            {medicines.map((medicine, index) => (
              <div className="medicine-card" key={index}>
                <div className="add-shop-grid">
                  <input
                    type="text"
                    placeholder="Medicine Name *"
                    value={medicine.medicine_name}
                    onChange={(e) =>
                      handleMedicineChange(index, "medicine_name", e.target.value)
                    }
                  />

                  <input
                    type="number"
                    placeholder="Stock Quantity"
                    value={medicine.stock_quantity}
                    onChange={(e) =>
                      handleMedicineChange(index, "stock_quantity", e.target.value)
                    }
                  />

                  <input
                    type="number"
                    step="0.01"
                    placeholder="Price"
                    value={medicine.price}
                    onChange={(e) =>
                      handleMedicineChange(index, "price", e.target.value)
                    }
                  />

                  <input
  type="text"
  placeholder="Disease"
  value={medicine.treatment}
  onChange={(e) =>
    handleMedicineChange(index, "treatment", e.target.value)
  }
/>

<input
  type="text"
  placeholder="Dosage"
  value={medicine.dosage}
  onChange={(e) =>
    handleMedicineChange(index, "dosage", e.target.value)
  }
/>
                </div>

                {medicines.length > 1 && (
                  <button
                    type="button"
                    className="remove-medicine-btn"
                    onClick={() => removeMedicineField(index)}
                  >
                    Remove
                  </button>
                )}
              </div>
            ))}
          </div>

          <div className="add-shop-actions">
            <button
              type="button"
              className="back-btn"
              onClick={() => navigate("/supplier-dashboard")}
            >
              Back
            </button>

            <button type="submit" className="submit-btn">
              Save Shop
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default AddShop;