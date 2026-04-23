import React from "react";
import "../components/Analytics.css";
import Navbar from "./Navbar";
import Footer from "./Footer";
import { motion } from "framer-motion";

import {
  LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell,
  BarChart, Bar, CartesianGrid
} from "recharts";

const lineData = [
  { day: "Mon", scans: 12 },
  { day: "Tue", scans: 18 },
  { day: "Wed", scans: 10 },
  { day: "Thu", scans: 22 },
  { day: "Fri", scans: 30 },
  { day: "Sat", scans: 25 },
  { day: "Sun", scans: 35 },
];

const pieData = [
  { name: "Bacterial", value: 40 },
  { name: "Fungal", value: 30 },
  { name: "Viral", value: 20 },
  { name: "Healthy", value: 10 },
];

const barData = [
  { name: "Low", value: 20 },
  { name: "Medium", value: 50 },
  { name: "High", value: 30 },
];

const COLORS = ["#4caf50", "#81c784", "#ffb74d", "#e57373"];

const Analytics = () => {
  return (
    <>
      <Navbar />

      <div className="analytics-container">

        {/* HERO */}
        <motion.div 
          className="analytics-hero"
          initial={{ opacity: 0, y: -30 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <h1>📊 Analytics Dashboard</h1>
          <p>Insights from your AI crop analysis</p>
        </motion.div>

        {/* STATS */}
        <div className="analytics-stats">

          {[
            { title: "Total Scans", value: "245", icon: "📷" },
            { title: "Accuracy", value: "94%", icon: "✔️" },
            { title: "Diseases Found", value: "32", icon: "🌿" },
            { title: "Healthy Crops", value: "68%", icon: "🌱" },
          ].map((item, i) => (
            <motion.div
              key={i}
              className="analytics-card"
              whileHover={{ scale: 1.05 }}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.2 }}
            >
              <div>
                <p>{item.title}</p>
                <h2>{item.value}</h2>
              </div>
              <span>{item.icon}</span>
            </motion.div>
          ))}

        </div>

        {/* CHARTS */}
        <div className="analytics-grid">

          {/* LINE */}
          <motion.div className="chart-card">
            <h3>📈 Weekly Scans</h3>
            <ResponsiveContainer width="100%" height={250}>
              <LineChart data={lineData}>
                <XAxis dataKey="day" />
                <YAxis />
                <Tooltip />
                <Line type="monotone" dataKey="scans" stroke="#4caf50" strokeWidth={3} />
              </LineChart>
            </ResponsiveContainer>
          </motion.div>

          {/* PIE */}
          <motion.div className="chart-card">
            <h3>🧪 Disease Types</h3>
            <ResponsiveContainer width="100%" height={250}>
              <PieChart>
                <Pie data={pieData} dataKey="value" outerRadius={90}>
                  {pieData.map((entry, index) => (
                    <Cell key={index} fill={COLORS[index]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </motion.div>

          {/* BAR */}
          <motion.div className="chart-card">
            <h3>⚠️ Severity Levels</h3>
            <ResponsiveContainer width="100%" height={250}>
              <BarChart data={barData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="value" fill="#66bb6a" />
              </BarChart>
            </ResponsiveContainer>
          </motion.div>

        </div>

        {/* ACTIVITY */}
        <div className="activity-card">
          <h3>🕒 Recent Activity</h3>
          <ul>
            <li>✔️ Powdery Mildew detected (Confidence: 92%)</li>
            <li>✔️ Healthy crop detected</li>
            <li>✔️ Leaf Spot detected (Confidence: 88%)</li>
            <li>✔️ Rust disease detected</li>
          </ul>
        </div>

      </div>

      <Footer />
    </>
  );
};

export default Analytics;