import React from "react";

function AdminTopbar() {
  return (
    <div className="admin-topbar">
      <div>
        <h2 className="admin-page-title">Admin Dashboard</h2>
        <p className="admin-breadcrumb">Dashboard / Admin Panel</p>
      </div>

      <div className="admin-topbar-right">
        <div className="admin-avatar">A</div>
      </div>
    </div>
  );
}

export default AdminTopbar;