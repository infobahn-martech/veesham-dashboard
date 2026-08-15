import { Routes, Route, Navigate } from "react-router-dom";
import ProtectedRoute from "./ProtectedRoute";
import DashboardLayout from "../layouts/DashboardLayout";
import Login from "../pages/Login";
import Dashboard from "../pages/Dashboard";
import LiveJobBoard from "../pages/LiveJobBoard";
import MyAccount from "../pages/MyAccount";
import Items from "../pages/Items";
import Jobs from "../pages/Jobs";

function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<Navigate to="/login" replace />} />
      <Route path="/login" element={<Login />} />

      <Route
        element={
          <ProtectedRoute>
            <DashboardLayout />
          </ProtectedRoute>
        }
      >
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/job-management/items" element={<Items />} />
        <Route path="/job-management/jobs" element={<Jobs />} />
        <Route path="/live-job-board" element={<LiveJobBoard />} />
        <Route path="/my-account" element={<MyAccount />} />
      </Route>

      <Route path="*" element={<Navigate to="/login" replace />} />
    </Routes>
  );
}

export default AppRoutes;
