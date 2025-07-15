import React from "react";
import { FiUserCheck, FiUserX, FiAlertCircle } from "react-icons/fi";

const statusData = [
  {
    label: "Active",
    count: 120, // Placeholder
    color: "bg-gradient-to-br from-blue-500 to-indigo-500 text-white",
    icon: <FiUserCheck size={32} className="text-white opacity-80" />,
  },
  {
    label: "Inactive",
    count: 30, // Placeholder
    color: "bg-gradient-to-br from-emerald-400 to-green-500 text-white",
    icon: <FiUserX size={32} className="text-white opacity-80" />,
  },
  {
    label: "Membership Expired",
    count: 10, // Placeholder
    color: "bg-gradient-to-br from-rose-400 to-pink-500 text-white",
    icon: <FiAlertCircle size={32} className="text-white opacity-80" />,
  },
];

export default function StatusCards() {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
      {statusData.map((status) => (
        <div
          key={status.label}
          className={`rounded-2xl shadow-lg h-32 p-4 flex flex-col items-center justify-center gap-2 ${status.color} transition-transform duration-200 hover:scale-105`}
        >
          <div className="flex-shrink-0">{status.icon}</div>
          <span className="text-sm font-semibold tracking-wide text-center leading-tight">{status.label}</span>
          <span className="text-2xl font-extrabold tracking-tight drop-shadow">{status.count}</span>
        </div>
      ))}
    </div>
  );
} 