import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { FiClock } from "react-icons/fi";
import api from "../../api/axiosConfig";

export default function PastEventCard() {
  const [pastEventsCount, setPastEventsCount] = useState(0);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchPastEvents = async () => {
      try {
        const token = localStorage.getItem('token');
        const uid = localStorage.getItem('uid');
        const response = await api.post('/event/past', {}, {
          headers: {
            'Client-Service': 'COHAPPRT',
            'Auth-Key': '4F21zrjoAASqz25690Zpqf67UyY',
            'uid': uid,
            'token': token,
            'rurl': 'login.etribes.in',
            'Content-Type': 'application/json',
          }
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
        setPastEventsCount(backendEvents.length);
      } catch (err) {
        setPastEventsCount(0);
      }
    };

    fetchPastEvents();
    const interval = setInterval(fetchPastEvents, 10000); // Poll every 10 seconds
    return () => clearInterval(interval);
  }, []);

  return (
    <div
      className="relative h-32 rounded-2xl shadow-lg flex flex-col items-center justify-center p-3 gap-1 transition-transform duration-200 hover:scale-105 cursor-pointer overflow-hidden bg-gradient-to-br from-violet-200 via-indigo-100 to-white"
      onClick={() => navigate("/event-management/past")}
      title="Go to Past Events"
    >
      {/* Glassmorphism overlay */}
      <div className="absolute inset-0 bg-white/30 backdrop-blur-md border border-white/30 rounded-2xl pointer-events-none" />
      <div className="relative z-10 flex flex-col items-center justify-center h-full w-full">
        <FiClock size={32} className="text-violet-500 opacity-80 mb-1" />
        <div className="text-sm font-semibold text-gray-900">Past Event</div>
        <div className="text-2xl font-extrabold text-gray-900 drop-shadow">{pastEventsCount}</div>
      </div>
    </div>
  );
} 