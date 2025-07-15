import React from "react";
import Sidebar from "../Sidebar/Sidebar";
import TopBar from "./TopBar";

export default function DashboardLayout({ children }) {
  return (
    <div className="bg-gray-50 font-sans min-h-screen">
      {/* Fixed Sidebar */}
      <Sidebar className="fixed left-0 top-0 h-screen z-30" />
      {/* Main content area with left padding for sidebar */}
      <main className="pl-64 min-h-screen overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 py-8">
          <TopBar />
          {children}
        </div>
      </main>
    </div>
  );
} 