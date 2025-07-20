import React from "react";
import Sidebar from "../Sidebar/Sidebar";
import TopBar from "./TopBar";
import Footer from "./Footer";

export default function DashboardLayout({ children }) {
  return (
    <div className="bg-gray-50 font-sans min-h-screen flex">
      {/* Fixed Sidebar */}
      <Sidebar className="fixed left-0 top-0 h-screen z-30" />
      {/* Main content area with left padding for sidebar */}
      <div className="flex flex-col flex-1 min-h-screen pl-72">
        {/* TopBar and content centered */}
        <div className="max-w-7xl mx-auto w-full px-4 pt-8 flex flex-col flex-1">
          <TopBar />
          <div className="flex-1 py-4">
            {children}
          </div>
        </div>
        {/* Sticky Footer */}
        <div className="max-w-7xl mx-auto w-full px-4 pb-4">
          <Footer />
        </div>
      </div>
    </div>
  );
}