import React from "react";
import { useState, useEffect } from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard";
import History from "./pages/History";
import Profile from "./pages/Profile";
import Learn from "./pages/Learn";
import SupplierLogin from "./pages/SupplierLogin";
import SupplierDashboard from "./pages/SupplierDashboard";
import AddShop from "./pages/AddShop";
import MyShops from "./pages/MyShops";
import ShopDetails from "./pages/ShopDetails";
import DiseaseLibrary from "./pages/DiseaseLibrary";
import AdminLogin from "./admin/AdminLogin";
import AdminDashboard from "./admin/AdminDashboard";
import AdminLayout from "./admin/AdminLayout";
import ManageUsers from "./admin/ManageUsers";
import ManageShops from "./admin/ManageShops";
import ManageDiseases from "./admin/ManageDiseases";
import ManageMedicines from "./admin/ManageMedicines";
import ManageSuppliers from "./admin/ManageSuppliers";
import ManagePredictions from "./admin/ManagePredictions";
import SupplierProfile from "./pages/SupplierProfile";
import VideoLibrary from "./pages/VideoLibrary";
function App() {
  const [supplierToken, setSupplierToken] = useState(null);

  useEffect(() => {
    setSupplierToken(localStorage.getItem("supplier_token"));
  }, []);

  const token = localStorage.getItem("token");
  const adminToken = localStorage.getItem("admin_token");

  return (
    <BrowserRouter>
      <Routes>
        {/* Landing Page */}
        <Route path="/" element={<Home />} />

        {/* Farmer Auth */}
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        {/* Supplier Auth */}
        <Route
          path="/supplier-login"
          element={<SupplierLogin setSupplierToken={setSupplierToken} />}
        />

        {/* Admin Auth */}
        <Route path="/admin-login" element={<AdminLogin />} />

        {/* Farmer Protected */}
        <Route
          path="/dashboard"
          element={token ? <Dashboard /> : <Navigate to="/login" />}
        />
        <Route
          path="/history"
          element={token ? <History /> : <Navigate to="/login" />}
        />
         <Route
          path="/disease-library"
          element={token ? <DiseaseLibrary /> : <Navigate to="/login" />}
        />
         <Route
          path="/video-library"
          element={token ? <VideoLibrary /> : <Navigate to="/login" />}
        />
        <Route
          path="/profile"
          element={token ? <Profile /> : <Navigate to="/login" />}
        />
        <Route
          path="/learn"
          element={token ? <Learn /> : <Navigate to="/login" />}
        />

        {/* Supplier Protected */}
        <Route
          path="/supplier-dashboard"
          element={
            supplierToken ? (
              <SupplierDashboard />
            ) : (
              <Navigate to="/supplier-login" />
            )
          }
        />
        <Route
          path="/add-shop"
          element={supplierToken ? <AddShop /> : <Navigate to="/supplier-login" />}
        />
        <Route
          path="/my-shops"
          element={supplierToken ? <MyShops /> : <Navigate to="/supplier-login" />}
        />
        <Route
          path="/shop/:id"
          element={supplierToken ? <ShopDetails /> : <Navigate to="/supplier-login" />}
        />
        <Route path="/supplier-profile" element={<SupplierProfile />} />

        {/* Admin Protected Layout */}
        <Route
          path="/admin"
          element={adminToken ? <AdminLayout /> : <Navigate to="/admin-login" />}
        >
          <Route path="dashboard" element={<AdminDashboard />} />
          <Route path="users" element={<ManageUsers />} />
          <Route path="shops" element={<ManageShops />} />
          <Route path="medicines" element={<ManageMedicines />} />
          <Route path="suppliers" element={<ManageSuppliers />} />
<Route path="predictions" element={<ManagePredictions />} 

/>
<Route path="/admin/diseases" element={<ManageDiseases />} />
        </Route>
      </Routes>
    </BrowserRouter>
    
  );
}

export default App;