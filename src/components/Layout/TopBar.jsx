import React from "react";
import { FiBell, FiSun, FiUser } from "react-icons/fi";

export default function TopBar() {
  return (
    <header className="flex items-center bg-white rounded-xl shadow px-6 py-3 mb-8">
      <div className="font-bold text-xl text-gray-800 flex-1">Dashboard Overview</div>
      <div className="flex items-center gap-4">
        <button className="text-gray-400 hover:text-blue-500 transition" title="Notifications">
          <FiBell size={22} />
        </button>
        <button className="text-gray-400 hover:text-yellow-500 transition" title="Toggle theme">
          <FiSun size={22} />
        </button>
        <div className="flex items-center gap-2 pl-4 border-l border-gray-200">
          <div className="bg-blue-100 rounded-full p-1">
            <FiUser className="text-blue-500" size={22} />
          </div>
          <div className="hidden sm:block text-right">
            <div className="text-sm font-semibold text-gray-800">Rohit Arya</div>
            <div className="text-xs text-gray-400">rohit@30days.com</div>
          </div>
        </div>
      </div>
    </header>
  );
} 