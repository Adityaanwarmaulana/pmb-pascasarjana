import React from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import Login from "./pages/Login";
import Register from "./pages/Register";
import FormPendaftaran from "./pages/pendaftar/FormPendaftaran";
import PendaftarDashboard from "./pages/pendaftar/Dashboard";
import AdminDashboard from "./pages/admin/Dashboard";
import DashboardProdi from "./pages/prodi/Dashboard";

/**
 * Pelindung Rute (Route Guard)
 * Fungsi: Mengecek apakah user sudah login dan memiliki role yang sesuai.
 */
const ProtectedRoute = ({ children, allowedRoles }) => {
  const token = localStorage.getItem("token");
  const role = localStorage.getItem("role");

  // Jika tidak ada token, paksa ke halaman login
  if (!token) {
    return <Navigate to="/login" replace />;
  }

  // Jika role tidak sesuai dengan rute yang diakses, kembalikan ke login
  if (allowedRoles && !allowedRoles.includes(role)) {
    return <Navigate to="/login" replace />;
  }

  return children;
};

function App() {
  return (
    <Router>
      <Routes>
        {/* --- Public Routes --- */}
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/" element={<Navigate to="/login" replace />} />

        {/* --- Pendaftar Routes --- */}
        <Route
          path="/pendaftar/form"
          element={
            <ProtectedRoute allowedRoles={["pendaftar", "user"]}>
              <FormPendaftaran />
            </ProtectedRoute>
          }
        />
        <Route
          path="/pendaftar/dashboard"
          element={
            <ProtectedRoute allowedRoles={["pendaftar", "user"]}>
              <PendaftarDashboard />
            </ProtectedRoute>
          }
        />

        {/* --- Admin Routes --- */}
        <Route
          path="/admin/dashboard"
          element={
            <ProtectedRoute allowedRoles={["admin"]}>
              <AdminDashboard />
            </ProtectedRoute>
          }
        />

        {/* --- Prodi Routes --- */}
        <Route
          path="/prodi/dashboard"
          element={
            <ProtectedRoute allowedRoles={["prodi"]}>
              <DashboardProdi />
            </ProtectedRoute>
          }
        />

        {/* Catch all rute yang tidak terdaftar ke login */}
        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
    </Router>
  );
}

export default App;
