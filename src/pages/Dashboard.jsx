import React from "react";
import DashboardLayout from "../components/Layout/DashboardLayout";
import StatusCards from "../components/StatusCards/StatusCards";
import AnalyticsGraph from "../components/AnalyticsGraph/AnalyticsGraph";
import UpcomingEvents from "../components/UpcomingEvents/UpcomingEvents";
import ImportantContacts from "../components/ImportantContacts/ImportantContacts";
import { useNavigate } from "react-router-dom";

function PastEventCard() {
  const navigate = useNavigate();
  return (
    <div
      className="h-28 rounded-2xl shadow-lg bg-gradient-to-br from-violet-400 to-indigo-500 text-white flex flex-col items-center justify-center p-3 gap-1 transition-transform duration-200 hover:scale-105 cursor-pointer"
      onClick={() => navigate("/event-management/past")}
      title="Go to Past Events"
    >
      <div className="text-sm font-semibold">Past Events</div>
      <div className="text-2xl font-extrabold">15</div>
    </div>
  );
}

function TotalEventCard() {
  const navigate = useNavigate();
  return (
    <div
      className="h-28 rounded-2xl shadow-lg bg-gradient-to-br from-blue-400 to-indigo-400 text-white flex flex-col items-center justify-center p-3 gap-1 transition-transform duration-200 hover:scale-105 cursor-pointer"
      onClick={() => navigate("/event-management/all")}
      title="Go to All Events"
    >
      <div className="text-sm font-semibold">Total Events</div>
      <div className="text-2xl font-extrabold">25</div>
    </div>
  );
}

export default function Dashboard() {
  return (
    <DashboardLayout>
      <div className="flex flex-col gap-4 py-3">
        
        {/* Status Cards with tighter margin */}
        <StatusCards />

        {/* Main Analytics + Events Grid */}
        <div className="grid grid-cols-3 gap-4">
          <div className="col-span-2 flex flex-col gap-4">
            <div className="h-[240px]">
              <AnalyticsGraph containerClass="h-full p-0 mb-0" chartHeight="100%" />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <PastEventCard />
              <TotalEventCard />
            </div>
          </div>

          <div className="h-full">
            <UpcomingEvents containerClass="h-full p-0 mb-0" />
          </div>
        </div>

        {/* Important Contacts with scrollable box */}
        <div className="max-h-[220px] overflow-y-auto rounded-2xl shadow">
          <ImportantContacts />
        </div>
      </div>
    </DashboardLayout>
  );
}
