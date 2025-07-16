import React from "react";
import DashboardLayout from "../components/Layout/DashboardLayout";
import StatusCards from "../components/StatusCards/StatusCards";
import AnalyticsGraph from "../components/AnalyticsGraph/AnalyticsGraph";
import UpcomingEvents from "../components/UpcomingEvents/UpcomingEvents";
import ImportantContacts from "../components/ImportantContacts/ImportantContacts";
import { useNavigate } from "react-router-dom";
import { FiClock, FiCalendar } from "react-icons/fi";

function PastEventCard() {
  const navigate = useNavigate();
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
        <div className="text-2xl font-extrabold text-gray-900 drop-shadow">15</div>
      </div>
    </div>
  );
}

function TotalEventCard() {
  const navigate = useNavigate();
  return (
    <div
      className="relative h-32 rounded-2xl shadow-lg flex flex-col items-center justify-center p-3 gap-1 transition-transform duration-200 hover:scale-105 cursor-pointer overflow-hidden bg-gradient-to-br from-blue-200 via-indigo-100 to-white"
      onClick={() => navigate("/event-management/all")}
      title="Go to All Events"
    >
      {/* Glassmorphism overlay */}
      <div className="absolute inset-0 bg-white/30 backdrop-blur-md border border-white/30 rounded-2xl pointer-events-none" />
      <div className="relative z-10 flex flex-col items-center justify-center h-full w-full">
        <FiCalendar size={32} className="text-blue-500 opacity-80 mb-1" />
        <div className="text-sm font-semibold text-gray-900">Total Event</div>
        <div className="text-2xl font-extrabold text-gray-900 drop-shadow">25</div>
      </div>
    </div>
  );
}

export default function Dashboard() {
  return (
    <DashboardLayout>
      <div className="grid grid-cols-3 gap-6 py-3">
        {/* Top Row: Status Cards */}
        <div className="col-span-3">
          <StatusCards />
        </div>
        
        {/* Middle Row: Past Event, Total Event, and Upcoming Events */}
        <div className="col-span-1">
          <PastEventCard />
        </div>
        
        <div className="col-span-1">
          <TotalEventCard />
        </div>
        
        {/* Upcoming Events - tall vertical card on the right */}
        <div className="col-span-1 row-span-2">
          <UpcomingEvents containerClass="h-full p-0 mb-0" chartHeight="100%" />
        </div>
        
        {/* Bottom Section: Analytics Graph - spans under Past Event + Total Event */}
        <div className="col-span-2">
          <div className="h-80">
            <AnalyticsGraph containerClass="h-full p-0 mb-0" chartHeight="100%" />
          </div>
        </div>
      </div>
      
      {/* Important Contacts - full width */}
      <div className="mt-6">
        <div className="rounded-2xl shadow">
          <ImportantContacts />
        </div>
      </div>
    </DashboardLayout>
  );
}
