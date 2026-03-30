import React, { useEffect, useState, useCallback } from "react";
import API from "../services/api";
import { useNavigate } from "react-router-dom";
import "../components/MyShops.css";
import { FaStore, FaMapMarkerAlt, FaEdit, FaEye, FaTrash } from "react-icons/fa";

function MyShops() {
  const navigate = useNavigate();

  const [shops, setShops] = useState([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");
  const [messageType, setMessageType] = useState("");

  const supplierToken = localStorage.getItem("supplier_token");

  const fetchMyShops = useCallback(async () => {
    try {
      setLoading(true);

      const response = await API.get("/shops/my-shops", {
        headers: {
          Authorization: `Bearer ${supplierToken}`,
        },
      });

      setShops(response.data);
    } catch (error) {
      console.log(error.response?.data);
      setMessage("Failed to load shops");
      setMessageType("error");
    } finally {
      setLoading(false);
    }
  }, [supplierToken]);

  useEffect(() => {
    if (!supplierToken) {
      navigate("/supplier-login");
      return;
    }

    fetchMyShops();
  }, [fetchMyShops, navigate, supplierToken]);

  const handleDeleteShop = async (shopId) => {
    const confirmDelete = window.confirm("Are you sure you want to delete this shop?");
    if (!confirmDelete) return;

    try {
      await API.delete(`/shops/${shopId}`, {
        headers: {
          Authorization: `Bearer ${supplierToken}`,
        },
      });

      setShops((prev) => prev.filter((shop) => shop.id !== shopId));
      setMessage("Shop deleted successfully");
      setMessageType("success");
    } catch (error) {
      console.log(error.response?.data);
      setMessage("Failed to delete shop");
      setMessageType("error");
    }
  };

  return (
    <div className="my-shops-page">
      <div className="my-shops-header">
        <div>
          <h1>My Shops</h1>
          <p>View, edit, and manage all your added shops.</p>
        </div>

        <button className="add-shop-top-btn" onClick={() => navigate("/add-shop")}>
          + Add New Shop
        </button>
      </div>

      {message && (
        <div className={`my-shops-message ${messageType}`}>
          {message}
        </div>
      )}

      {loading ? (
        <div className="my-shops-empty">Loading shops...</div>
      ) : shops.length === 0 ? (
        <div className="my-shops-empty">
          <FaStore className="empty-icon" />
          <h2>No shops added yet</h2>
          <p>Start by adding your first shop.</p>
          <button onClick={() => navigate("/add-shop")}>Add Shop</button>
        </div>
      ) : (
        <div className="my-shops-grid">
          {shops.map((shop) => (
            <div key={shop.id} className="my-shop-card">
              <div className="my-shop-card-top">
                <FaStore className="shop-card-icon" />
                <div>
                  <h2>{shop.shop_name}</h2>
                  <p className="shop-location">
                    <FaMapMarkerAlt className="shop-location-icon" />
                    {shop.city}
                    {shop.area ? `, ${shop.area}` : ""}
                  </p>
                </div>
              </div>

              <div className="shop-card-body">
                <p><b>Address:</b> {shop.address}</p>
                <p><b>Total Medicines:</b> {shop.total_medicines}</p>
              </div>

              <div className="shop-card-actions">
                <button
                  className="view-btn"
                  onClick={() => navigate(`/shop/${shop.id}`)}
                >
                  <FaEye /> View
                </button>

                <button
                  className="edit-btn"
                  onClick={() => navigate(`/shop/${shop.id}`)}
                >
                  <FaEdit /> Edit
                </button>

                <button
                  className="delete-btn"
                  onClick={() => handleDeleteShop(shop.id)}
                >
                  <FaTrash /> Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default MyShops;