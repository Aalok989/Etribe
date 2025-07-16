import React from "react";
import { FiUserCheck, FiUserX, FiAlertCircle } from "react-icons/fi";
import { useNavigate } from "react-router-dom";

const statusData = [
  {
    label: "Active",
    count: 120, // Placeholder
    gradient: "bg-gradient-to-br from-blue-200 via-indigo-200 to-white",
    icon: <FiUserCheck size={32} className="text-blue-600 opacity-80" />, // Adjust icon color for contrast
    path: "/membership-management/active",
  },
  {
    label: "Inactive",
    count: 30, // Placeholder
    gradient: "bg-gradient-to-br from-emerald-200 via-green-100 to-white",
    icon: <FiUserX size={32} className="text-emerald-600 opacity-80" />, // Adjust icon color for contrast
    path: "/membership-management/inactive",
  },
  {
    label: "Membership Expired",
    count: 10, // Placeholder
    gradient: "bg-gradient-to-br from-rose-200 via-pink-100 to-white",
    icon: <FiAlertCircle size={32} className="text-rose-600 opacity-80" />, // Adjust icon color for contrast
    path: "/membership-management/expired",
  },
];

export default function StatusCards() {
  const navigate = useNavigate();
  return (
    <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
      {statusData.map((status) => (
        <div
          key={status.label}
          className={
            `relative rounded-2xl shadow-lg h-32 p-4 flex flex-col items-center justify-center gap-2 overflow-hidden transition-transform duration-200 hover:scale-105 cursor-pointer ${status.gradient}`
          }
          onClick={() => navigate(status.path)}
          title={`Go to ${status.label} Members`}
        >
          {/* Glassmorphism overlay */}
          <div className="absolute inset-0 bg-white/30 backdrop-blur-md border border-white/30 rounded-2xl pointer-events-none" />
          <div className="relative z-10 flex flex-col items-center justify-center h-full w-full">
            <div className="flex-shrink-0">{status.icon}</div>
            <span className="text-sm font-semibold tracking-wide text-center leading-tight text-gray-900">{status.label}</span>
            <span className="text-2xl font-extrabold tracking-tight drop-shadow text-gray-900">{status.count}</span>
          </div>
        </div>
      ))}
    </div>
  );
} 