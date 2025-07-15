import React from "react";
import { FiClock, FiHash } from "react-icons/fi";

const eventsStats = [
  {
    label: "Past Events",
    count: 15, // Placeholder
    color: "bg-gradient-to-br from-violet-400 to-indigo-500 text-white",
    icon: <FiClock size={28} className="text-white opacity-80" />,
  },
  {
    label: "Total Events",
    count: 25, // Placeholder
    color: "bg-gradient-to-br from-blue-400 to-indigo-400 text-white",
    icon: <FiHash size={28} className="text-white opacity-80" />,
  },
];

export default function EventsSection() {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-8">
      {eventsStats.map((stat) => (
        <div
          key={stat.label}
          className={`rounded-2xl shadow-lg p-7 flex flex-col items-center gap-2 ${stat.color} transition-transform duration-200 hover:scale-105`}
        >
          <div className="mb-2">{stat.icon}</div>
          <span className="text-lg font-semibold tracking-wide">{stat.label}</span>
          <span className="text-3xl font-extrabold tracking-tight drop-shadow">{stat.count}</span>
        </div>
      ))}
    </div>
  );
} 