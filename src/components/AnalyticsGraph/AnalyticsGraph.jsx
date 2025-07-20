import React, { useEffect, useState } from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";
import api from '../../api/axiosConfig';

export default function AnalyticsGraph() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAnalytics = async () => {
      setLoading(true);
      try {
        const token = localStorage.getItem('token');
        const uid = localStorage.getItem('uid') || '1';
        // For demo, we fetch all three and group by month (assuming backend returns month info)
        const [activeRes, inactiveRes, expiredRes] = await Promise.all([
          api.post('/userDetail/active_members', { uid }, { headers: { token, uid } }),
          api.post('/userDetail/not_members', { uid }, { headers: { token, uid } }),
          api.post('/userDetail/membership_expired', { uid }, { headers: { token, uid } }),
        ]);
        // Group by month (assuming each member has a 'lct' or similar date field)
        const groupByMonth = (members) => {
          const monthMap = {};
          members.forEach(m => {
            const date = m.lct ? new Date(m.lct) : null;
            if (!date) return;
            const month = date.toLocaleString('default', { month: 'short' });
            if (!monthMap[month]) monthMap[month] = 0;
            monthMap[month]++;
          });
          return monthMap;
        };
        const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
        const activeByMonth = groupByMonth(Array.isArray(activeRes.data) ? activeRes.data : activeRes.data.data || []);
        const inactiveByMonth = groupByMonth(Array.isArray(inactiveRes.data) ? inactiveRes.data : inactiveRes.data.data || []);
        const expiredByMonth = groupByMonth(Array.isArray(expiredRes.data) ? expiredRes.data : expiredRes.data.data || []);
        const now = new Date();
        const currentMonthIndex = now.getMonth(); // 0-based (Jan=0)
        const chartData = months.map((month, idx) => ({
          month,
          Active: idx <= currentMonthIndex ? (activeByMonth[month] || 0) : null,
          Inactive: idx <= currentMonthIndex ? (inactiveByMonth[month] || 0) : null,
          Expired: idx <= currentMonthIndex ? (expiredByMonth[month] || 0) : null,
        }));
        setData(chartData);
      } catch (err) {
        setData([]);
      } finally {
        setLoading(false);
      }
    };
    fetchAnalytics();
    const interval = setInterval(fetchAnalytics, 10000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="rounded-2xl shadow-lg bg-white h-full w-full">
      <div className="relative rounded-t-2xl overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-indigo-200 via-blue-100 to-blue-200" />
        <div className="absolute inset-0 bg-white/30 backdrop-blur-md border-b border-white/30" />
        <h2 className="relative z-10 text-xl font-bold text-gray-900 tracking-wide px-6 py-4">Member Analytics</h2>
      </div>
      <div className="p-6 h-[calc(100%-64px)]">
        {loading ? (
          <div className="text-center text-indigo-600 font-semibold py-8">Loading analytics...</div>
        ) : (
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={data} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="month" />
              <YAxis allowDecimals={false} />
            <Tooltip />
              <Legend />
              <Line type="monotone" dataKey="Active" stroke="#6366f1" strokeWidth={3} dot={{ r: 5 }} />
              <Line type="monotone" dataKey="Inactive" stroke="#10b981" strokeWidth={3} dot={{ r: 5 }} />
              <Line type="monotone" dataKey="Expired" stroke="#f43f5e" strokeWidth={3} dot={{ r: 5 }} />
          </LineChart>
        </ResponsiveContainer>
        )}
      </div>
    </div>
  );
} 