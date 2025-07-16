import React from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import Dashboard from "./pages/Dashboard";
import AdminManagement from "./pages/AdminManagement";
import EventManagement from "./pages/EventManagement";
import ImportantContactsPage from "./pages/ImportantContacts";
import MasterSettings from "./pages/MasterSettings";
import ActiveMembers from "./pages/ActiveMembers";
import InactiveMembers from "./pages/InactiveMembers";
import MembershipExpired from "./pages/MembershipExpired";
import AdminAccounts from "./pages/AdminAccounts";
import UserRoles from "./pages/UserRoles";
import RoleManagement from "./pages/RoleManagement";
import GroupData from "./pages/GroupData";
import SMTPSettings from "./pages/SMTPSettings";
import MessageSettings from "./pages/MessageSettings";
import UserAdditionalFields from "./pages/UserAdditionalFields";
import CompanyAdditionalFields from "./pages/CompanyAdditionalFields";
import MembershipPlans from "./pages/MembershipPlans";
import AllEvents from "./pages/AllEvents";
import UpcomingEventsPage from "./pages/UpcomingEventsPage";
import PastEvents from "./pages/PastEvents";
import AboutUs from "./pages/AboutUs";
import OurServices from "./pages/OurServices";
import Contact from "./pages/Contact";
import Policy from "./pages/Policy";
import TermsOfService from "./pages/TermsOfService";
import CookiePolicy from "./pages/CookiePolicy";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Navigate to="/dashboard" replace />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/membership-management/active" element={<ActiveMembers />} />
        <Route path="/membership-management/inactive" element={<InactiveMembers />} />
        <Route path="/membership-management/expired" element={<MembershipExpired />} />
        <Route path="/admin-management" element={<AdminManagement />} />
        <Route path="/admin-management/accounts" element={<AdminAccounts />} />
        <Route path="/admin-management/user-roles" element={<UserRoles />} />
        <Route path="/admin-management/role-management" element={<RoleManagement />} />
        <Route path="/event-management" element={<EventManagement />} />
        <Route path="/event-management/all" element={<AllEvents />} />
        <Route path="/event-management/upcoming" element={<UpcomingEventsPage />} />
        <Route path="/event-management/past" element={<PastEvents />} />
        <Route path="/important-contacts" element={<ImportantContactsPage />} />
        <Route path="/master-settings" element={<MasterSettings />} />
        <Route path="/master-settings/group-data" element={<GroupData />} />
        <Route path="/master-settings/smtp-settings" element={<SMTPSettings />} />
        <Route path="/master-settings/message-settings" element={<MessageSettings />} />
        <Route path="/master-settings/user-additional-fields" element={<UserAdditionalFields />} />
        <Route path="/master-settings/company-additional-fields" element={<CompanyAdditionalFields />} />
        <Route path="/master-settings/membership-plans" element={<MembershipPlans />} />
        <Route path="/about" element={<AboutUs />} />
        <Route path="/services" element={<OurServices />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/policy" element={<Policy />} />
        <Route path="/terms" element={<TermsOfService />} />
        <Route path="/cookies" element={<CookiePolicy />} />
      </Routes>
    </Router>
  );
}

export default App;
