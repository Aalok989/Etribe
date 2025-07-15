import React from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import Dashboard from "./pages/Dashboard";
import MembershipManagement from "./pages/MembershipManagement";
import AdminManagement from "./pages/AdminManagement";
import EventManagement from "./pages/EventManagement";
import ImportantContactsPage from "./pages/ImportantContacts";
import MasterSettings from "./pages/MasterSettings";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Navigate to="/dashboard" replace />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/membership-management" element={<MembershipManagement />} />
        <Route path="/admin-management" element={<AdminManagement />} />
        <Route path="/event-management" element={<EventManagement />} />
        <Route path="/important-contacts" element={<ImportantContactsPage />} />
        <Route path="/master-settings" element={<MasterSettings />} />
      </Routes>
    </Router>
  );
}

export default App;
