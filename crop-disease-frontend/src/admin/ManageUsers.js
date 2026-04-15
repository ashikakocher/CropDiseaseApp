import React, { useEffect, useState } from "react";
import API from "../services/api";
import { FaTrash, FaEdit, FaPlus, FaUserShield } from "react-icons/fa";
import "./Admin.css";

function ManageUsers() {
  const [users, setUsers] = useState([]);
  const [amusrShowModal, setAmusrShowModal] = useState(false);
  const [amusrEditingUserId, setAmusrEditingUserId] = useState(null);

  const [amusrFormData, setAmusrFormData] = useState({
    name: "",
    email: "",
    phone: "",
    city: "",
    area: "",
    password: "",
  });

  useEffect(() => {
    amusrFetchUsers();
  }, []);

  const amusrGetHeaders = () => ({
    Authorization: `Bearer ${localStorage.getItem("admin_token")}`,
  });

  const amusrFetchUsers = async () => {
    try {
      const res = await API.get("/admin/users", {
        headers: amusrGetHeaders(),
      });
      setUsers(res.data || []);
    } catch (err) {
      console.log(err);
    }
  };

  const amusrOpenAddModal = () => {
    setAmusrEditingUserId(null);
    setAmusrFormData({
      name: "",
      email: "",
      phone: "",
      city: "",
      area: "",
      password: "",
    });
    setAmusrShowModal(true);
  };

  const amusrOpenEditModal = (user) => {
    setAmusrEditingUserId(user.id);
    setAmusrFormData({
      name: user.name || "",
      email: user.email || "",
      phone: user.phone || "",
      city: user.city || "",
      area: user.area || "",
      password: "",
    });
    setAmusrShowModal(true);
  };

  const amusrCloseModal = () => {
    setAmusrShowModal(false);
    setAmusrEditingUserId(null);
    setAmusrFormData({
      name: "",
      email: "",
      phone: "",
      city: "",
      area: "",
      password: "",
    });
  };

  const amusrHandleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this user?")) return;

    try {
      await API.delete(`/admin/users/${id}`, {
        headers: amusrGetHeaders(),
      });
      amusrFetchUsers();
    } catch (err) {
      console.log(err);
    }
  };

  const amusrHandleSubmit = async (e) => {
    e.preventDefault();

    try {
      if (amusrEditingUserId) {
        await API.put(`/admin/users/${amusrEditingUserId}`, amusrFormData, {
          headers: amusrGetHeaders(),
        });
      } else {
        await API.post("/admin/users", amusrFormData, {
          headers: amusrGetHeaders(),
        });
      }

      amusrCloseModal();
      amusrFetchUsers();
    } catch (err) {
      console.log(err);
      alert(err.response?.data?.detail || "Something went wrong");
    }
  };

  const amusrHandleApprove = async (id) => {
  try {
    await API.put(`/admin/users/approve/${id}`, {}, {
      headers: amusrGetHeaders(),
    });
    amusrFetchUsers();
  } catch (err) {
    console.log(err);
  }
};

const amusrHandleReject = async (id) => {
  if (!window.confirm("Reject this user?")) return;

  try {
    await API.put(`/admin/users/reject/${id}`, {}, {
      headers: amusrGetHeaders(),
    });
    amusrFetchUsers();
  } catch (err) {
    console.log(err);
  }
};

  return (
    <section className="amusr-wrapper" id="amusr-wrapper">
      <div className="amusr-header-card">
        <div className="amusr-header-left">
          <div className="amusr-header-icon">
            <FaUserShield />
          </div>
          <div>
            <h2 className="amusr-main-title">Manage Users</h2>
            
          </div>
        </div>

        <button
          className="amusr-add-user-btn"
          id="amusr-add-user-btn"
          onClick={amusrOpenAddModal}
        >
          <FaPlus />
          <span>Add User</span>
        </button>
      </div>
      

      <div className="amusr-table-card">
        <div className="amusr-table-responsive">
          <table className="amusr-table" id="amusr-table">
            <thead>
              <tr>
                <th>Name</th>
                <th>Email</th>
                <th>Phone</th>
                <th>City</th>
                <th>Area</th>
                <th>Status</th>
                <th className="amusr-action-heading">Actions</th>
              </tr>
            </thead>

            <tbody>
              {users.length > 0 ? (
                users.map((user) => (
                  <tr key={user.id}>
                    <td>
                      <div className="amusr-user-name">{user.name || "-"}</div>
                    </td>
                    <td>{user.email || "-"}</td>
                    <td>{user.phone || "-"}</td>
                    <td>{user.city || "-"}</td>
                    <td>{user.area || "-"}</td>
                    <td>
  <span className={`amusr-status-badge amusr-${user.status}`}>
    {user.status || "pending"}
  </span>
</td>
                    <td>
                      <div className="amusr-action-group">
  
  {/* APPROVE BUTTON */}
  {user.status !== "approved" && (
    <button
      className="amusr-icon-btn amusr-approve-btn"
      onClick={() => amusrHandleApprove(user.id)}
      title="Approve User"
    >
      ✔
    </button>
  )}

  {/* REJECT BUTTON */}
  {user.status !== "rejected" && (
    <button
      className="amusr-icon-btn amusr-reject-btn"
      onClick={() => amusrHandleReject(user.id)}
      title="Reject User"
    >
      ✖
    </button>
  )}

  <button
    className="amusr-icon-btn amusr-edit-btn"
    onClick={() => amusrOpenEditModal(user)}
    title="Edit User"
  >
    <FaEdit />
  </button>

  <button
    className="amusr-icon-btn amusr-delete-btn"
    onClick={() => amusrHandleDelete(user.id)}
    title="Delete User"
  >
    <FaTrash />
  </button>
</div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="6">
                    <div className="amusr-empty-state">
                      No users found.
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {amusrShowModal && (
        <div className="amusr-modal-overlay" id="amusr-modal-overlay">
          <div className="amusr-modal-box" id="amusr-modal-box">
            <div className="amusr-modal-header">
              <div>
                <h3 className="amusr-modal-title">
                  {amusrEditingUserId ? "Edit User" : "Add New User"}
                </h3>
                <p className="amusr-modal-subtitle">
                  {amusrEditingUserId
                    ? "Update user details below."
                    : "Fill in the details to create a new user."}
                </p>
              </div>

              <button
                className="amusr-modal-close-btn"
                id="amusr-modal-close-btn"
                onClick={amusrCloseModal}
                type="button"
              >
                ×
              </button>
            </div>

            <form className="amusr-form" onSubmit={amusrHandleSubmit}>
              <div className="amusr-form-grid">
                <div className="amusr-form-field">
                  <label htmlFor="amusr-name">Full Name</label>
                  <input
                    id="amusr-name"
                    type="text"
                    placeholder="Enter full name"
                    value={amusrFormData.name}
                    onChange={(e) =>
                      setAmusrFormData({
                        ...amusrFormData,
                        name: e.target.value,
                      })
                    }
                    required
                  />
                </div>

                <div className="amusr-form-field">
                  <label htmlFor="amusr-email">Email Address</label>
                  <input
                    id="amusr-email"
                    type="email"
                    placeholder="Enter email"
                    value={amusrFormData.email}
                    onChange={(e) =>
                      setAmusrFormData({
                        ...amusrFormData,
                        email: e.target.value,
                      })
                    }
                    required
                  />
                </div>

                <div className="amusr-form-field">
                  <label htmlFor="amusr-phone">Phone Number</label>
                  <input
                    id="amusr-phone"
                    type="text"
                    placeholder="Enter phone number"
                    value={amusrFormData.phone}
                    onChange={(e) =>
                      setAmusrFormData({
                        ...amusrFormData,
                        phone: e.target.value,
                      })
                    }
                  />
                </div>

                <div className="amusr-form-field">
                  <label htmlFor="amusr-city">City</label>
                  <input
                    id="amusr-city"
                    type="text"
                    placeholder="Enter city"
                    value={amusrFormData.city}
                    onChange={(e) =>
                      setAmusrFormData({
                        ...amusrFormData,
                        city: e.target.value,
                      })
                    }
                  />
                </div>

                <div className="amusr-form-field">
                  <label htmlFor="amusr-area">Area</label>
                  <input
                    id="amusr-area"
                    type="text"
                    placeholder="Enter area"
                    value={amusrFormData.area}
                    onChange={(e) =>
                      setAmusrFormData({
                        ...amusrFormData,
                        area: e.target.value,
                      })
                    }
                  />
                </div>

                {!amusrEditingUserId && (
                  <div className="amusr-form-field">
                    <label htmlFor="amusr-password">Password</label>
                    <input
                      id="amusr-password"
                      type="password"
                      placeholder="Enter password"
                      value={amusrFormData.password}
                      onChange={(e) =>
                        setAmusrFormData({
                          ...amusrFormData,
                          password: e.target.value,
                        })
                      }
                      required
                    />
                  </div>
                )}
              </div>

              <div className="amusr-modal-actions">
                <button
                  type="submit"
                  className="amusr-primary-btn"
                  id="amusr-primary-btn"
                >
                  {amusrEditingUserId ? "Update User" : "Create User"}
                </button>

                <button
                  type="button"
                  className="amusr-secondary-btn"
                  id="amusr-secondary-btn"
                  onClick={amusrCloseModal}
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

export default ManageUsers;