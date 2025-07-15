import React from "react";
import Sidebar from "../Sidebar/Sidebar";
import TopBar from "./TopBar";

export default function DashboardLayout({ children }) {
  return (
    <div className="bg-gray-50 font-sans min-h-screen">
      {/* Fixed Sidebar */}
      <Sidebar className="fixed left-0 top-0 h-screen z-30" />
      {/* Main content area with left padding for sidebar */}
      <main className="pl-72 min-h-screen overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 py-8">
          <TopBar />
          {children}
          <footer className="text-center text-gray-400 text-xs py-2 border-t bg-white rounded-xl shadow mt-8">
            &copy; 2025 Etribe. All rights reserved.
          </footer>
        </div>
      </main>
    </div>
  );
} 