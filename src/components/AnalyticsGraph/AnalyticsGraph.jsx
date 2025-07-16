import React from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

const data = [
  { month: "Jan", members: 100 },
  { month: "Feb", members: 120 },
  { month: "Mar", members: 150 },
  { month: "Apr", members: 170 },
  { month: "May", members: 160 },
  { month: "Jun", members: 180 },
  { month: "Jul", members: 200 },
  { month: "Aug", members: 210 },
  { month: "Sep", members: 190 },
  { month: "Oct", members: 220 },
  { month: "Nov", members: 230 },
  { month: "Dec", members: 250 },
];

export default function AnalyticsGraph() {
  return (
    <div className="rounded-2xl shadow-lg bg-white h-full w-full">
      <div className="relative rounded-t-2xl overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-indigo-200 via-blue-100 to-blue-200" />
        <div className="absolute inset-0 bg-white/30 backdrop-blur-md border-b border-white/30" />
        <h2 className="relative z-10 text-xl font-bold text-gray-900 tracking-wide px-6 py-4">Member Analytics</h2>
      </div>
      <div className="p-6 h-[calc(100%-64px)]">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={data} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="month" />
            <YAxis />
            <Tooltip />
            <Line type="monotone" dataKey="members" stroke="#6366f1" strokeWidth={3} dot={{ r: 5 }} />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
} 