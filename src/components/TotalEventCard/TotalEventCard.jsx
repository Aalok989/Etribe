import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { FiCalendar } from "react-icons/fi";
import api from "../../api/axiosConfig";
import { getAuthHeaders } from "../../utils/apiHeaders";

export default function TotalEventCard() {
  const [totalCount, setTotalCount] = useState(0);
  const navigate = useNavigate();

  useEffect(() => {
    fetchTotalCount();
  }, []);

  const fetchTotalCount = async () => {
    try {
      const token = localStorage.getItem('token');
      const uid = localStorage.getItem('uid');
      const response = await api.post('/event/all', {}, {
        headers: getAuthHeaders()
      });
      let backendEvents = [];
      if (Array.isArray(response.data?.data?.event)) {
        backendEvents = response.data.data.event;
      } else if (Array.isArray(response.data?.data?.events)) {
        backendEvents = response.data.data.events;
      } else if (Array.isArray(response.data?.data)) {
        backendEvents = response.data.data;
      } else if (Array.isArray(response.data)) {
        backendEvents = response.data;
      } else if (response.data?.data && typeof response.data.data === 'object') {
        backendEvents = Object.values(response.data.data);
      } else {
        backendEvents = [];
      }
      setTotalCount(backendEvents.length);
    } catch (err) {
      setTotalCount(0);
    }
  };

  return (
    <div
      className="relative h-32 rounded-2xl shadow-lg flex flex-col items-center justify-center p-3 gap-1 transition-transform duration-200 hover:scale-105 cursor-pointer overflow-hidden bg-gradient-to-br from-blue-200 via-blue-100 to-white dark:from-blue-800 dark:via-blue-900 dark:to-gray-800 border border-gray-200 dark:border-gray-700"
      onClick={() => navigate("/event-management/all")}
      title="Go to All Events"
    >
      {/* Glassmorphism overlay */}
      <div className="absolute inset-0 bg-white/30 dark:bg-gray-700/40 backdrop-blur-md border border-white/30 dark:border-gray-700 rounded-2xl pointer-events-none" />
      <div className="relative z-10 flex flex-col items-center justify-center h-full w-full">
        <FiCalendar size={32} className="text-blue-500 opacity-80 mb-1" />
        <div className="text-sm font-semibold text-gray-900 dark:text-gray-100">Total Event</div>
        <div className="text-2xl font-extrabold text-gray-900 dark:text-gray-100 drop-shadow">{totalCount}</div>
      </div>
    </div>
  );
} 