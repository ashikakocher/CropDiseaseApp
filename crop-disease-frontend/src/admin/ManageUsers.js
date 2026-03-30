import React, { useEffect, useState } from "react";
import API from "../services/api";
import { FaTrash, FaEdit, FaPlus } from "react-icons/fa";

function ManageUsers() {
  const [users, setUsers] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [editingUserId, setEditingUserId] = useState(null);

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    city: "",
    area: "",
    password: "",
  });

  useEffect(() => {
    fetchUsers();
  }, []);

  const getHeaders = () => ({
    Authorization: `Bearer ${localStorage.getItem("admin_token")}`,
  });

  const fetchUsers = async () => {
    try {
      const res = await API.get("/admin/users", {
        headers: getHeaders(),
      });
      setUsers(res.data);
    } catch (err) {
      console.log(err);
    }
  };

  const openAddModal = () => {
    setEditingUserId(null);
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

  const openEditModal = (user) => {
    setEditingUserId(user.id);
    setFormData({
      name: user.name || "",
      email: user.email || "",
      phone: user.phone || "",
      city: user.city || "",
      area: user.area || "",
      password: "",
    });
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setEditingUserId(null);
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
    if (!window.confirm("Delete this user?")) return;

    try {
      await API.delete(`/admin/users/${id}`, {
        headers: getHeaders(),
      });
      fetchUsers();
    } catch (err) {
      console.log(err);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      if (editingUserId) {
        await API.put(`/admin/users/${editingUserId}`, formData, {
          headers: getHeaders(),
        });
      } else {
        await API.post("/admin/users", formData, {
          headers: getHeaders(),
        });
      }

      closeModal();
      fetchUsers();
    } catch (err) {
      console.log(err);
      alert(err.response?.data?.detail || "Something went wrong");
    }
  };

  return (
    <div className="admin-section">
      <div className="section-header section-header-flex">
        <h3>Manage Users</h3>

        <button className="primary-admin-btn" onClick={openAddModal}>
          <FaPlus style={{ marginRight: "8px" }} />
          Add User
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
            {users.map((user) => (
              <tr key={user.id}>
                <td>{user.name}</td>
                <td>{user.email}</td>
                <td>{user.phone}</td>
                <td>{user.city}</td>
                <td>{user.area}</td>

                <td className="action-cell">
                  <button
                    className="icon-btn edit"
                    onClick={() => openEditModal(user)}
                  >
                    <FaEdit />
                  </button>

                  <button
                    className="icon-btn delete"
                    onClick={() => handleDelete(user.id)}
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
              <h3>{editingUserId ? "Edit User" : "Add User"}</h3>
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
                />

                <input
                  type="text"
                  placeholder="Area"
                  value={formData.area}
                  onChange={(e) =>
                    setFormData({ ...formData, area: e.target.value })
                  }
                />

                {!editingUserId && (
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
                  {editingUserId ? "Update User" : "Add User"}
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

export default ManageUsers;