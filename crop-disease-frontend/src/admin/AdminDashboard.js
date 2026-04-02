import React, { useEffect, useState } from "react";
import API from "../services/api";
import {
  FaUsers,
  FaTruck,
  FaStore,
  FaPills,
  FaChartLine,
  FaLeaf,
  FaSeedling,
  FaFlask,
} from "react-icons/fa";
import "./AdminDashboard.css";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  ArcElement,
  Tooltip,
  Legend,
} from "chart.js";
import { Bar, Doughnut } from "react-chartjs-2";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  ArcElement,
  Tooltip,
  Legend
);

function AdminDashboard() {
  const [stats, setStats] = useState(null);
  const [analytics, setAnalytics] = useState(null);

  useEffect(() => {
    fetchStats();
    fetchAnalytics();
  }, []);

  const getHeaders = () => ({
    Authorization: `Bearer ${localStorage.getItem("admin_token")}`,
  });

  const fetchStats = async () => {
    try {
      const res = await API.get("/admin/dashboard-stats", {
        headers: getHeaders(),
      });
      setStats(res.data);
    } catch (err) {
      console.log(err);
    }
  };

  const fetchAnalytics = async () => {
    try {
      const res = await API.get("/admin/analytics", {
        headers: getHeaders(),
      });
      setAnalytics(res.data);
    } catch (err) {
      console.log(err);
    }
  };

  if (!stats || !analytics) {
    return <div className="admin-loading">Loading...</div>;
  }

  const diseaseChartData = {
    labels: analytics.disease_labels,
    datasets: [
      {
        label: "Disease Count",
        data: analytics.disease_counts,
        backgroundColor: [
          "#ef4444",
          "#3b82f6",
          "#14b8a6",
          "#f59e0b",
          "#8b5cf6",
          "#10b981",
          "#f97316",
        ],
        borderRadius: 8,
      },
    ],
  };

  const cropChartData = {
    labels: analytics.crop_labels,
    datasets: [
      {
        label: "Crop Count",
        data: analytics.crop_counts,
        backgroundColor: [
          "#22c55e",
          "#0ea5e9",
          "#a855f7",
          "#f97316",
          "#e11d48",
          "#06b6d4",
          "#84cc16",
        ],
        borderWidth: 1,
      },
    ],
  };

  const diseaseChartOptions = {
    responsive: true,
    plugins: {
      legend: { display: false },
    },
  };

  const cropChartOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: "bottom",
      },
    },
  };

  return (
    <div>
      <div className="welcome-banner">
        <h2>Welcome Back, Admin</h2>
        <p>Manage your crop disease system from one place</p>
      </div>

      <div className="stats-grid">
        <div className="stat-card orange">
          <div className="stat-top">
            <FaUsers className="stat-icon" />
            <h4>Total Users</h4>
          </div>
          <p>{stats.total_users}</p>
        </div>

        <div className="stat-card purple">
          <div className="stat-top">
            <FaTruck className="stat-icon" />
            <h4>Total Suppliers</h4>
          </div>
          <p>{stats.total_suppliers}</p>
        </div>

        <div className="stat-card blue">
          <div className="stat-top">
            <FaStore className="stat-icon" />
            <h4>Total Shops</h4>
          </div>
          <p>{stats.total_shops}</p>
        </div>

        <div className="stat-card green">
          <div className="stat-top">
            <FaPills className="stat-icon" />
            <h4>Total Medicines</h4>
          </div>
          <p>{stats.total_medicines}</p>
        </div>

        <div className="stat-card red">
          <div className="stat-top">
            <FaChartLine className="stat-icon" />
            <h4>Total Predictions</h4>
          </div>
          <p>{stats.total_predictions}</p>
        </div>

        <div className="stat-card navy">
          <div className="stat-top">
            <FaFlask className="stat-icon" />
            <h4>Total Treatments</h4>
          </div>
          <p>{stats.total_treatments}</p>
        </div>

        <div className="stat-card teal">
          <div className="stat-top">
            <FaLeaf className="stat-icon" />
            <h4>Most Common Disease</h4>
          </div>
          <p className="stat-text">{stats.most_common_disease}</p>
          <span className="stat-subtext">
            {stats.most_common_disease_count} cases
          </span>
        </div>

        <div className="stat-card gold">
          <div className="stat-top">
            <FaSeedling className="stat-icon" />
            <h4>Most Affected Crop</h4>
          </div>
          <p className="stat-text">{stats.most_affected_crop}</p>
          <span className="stat-subtext">
            {stats.most_affected_crop_count} cases
          </span>
        </div>
      </div>

      <div className="chart-grid">
        <div className="chart-card">
          <h3>Disease Frequency</h3>
          <Bar data={diseaseChartData} options={diseaseChartOptions} />
        </div>

        <div className="chart-card">
          <h3>Crop-wise Predictions</h3>
          <Doughnut data={cropChartData} options={cropChartOptions} />
        </div>
      </div>
    </div>
  );
}

export default AdminDashboard;