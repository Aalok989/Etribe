import React from "react";
import DashboardLayout from "../components/Layout/DashboardLayout";
import StatusCards from "../components/StatusCards/StatusCards";
import AnalyticsGraph from "../components/AnalyticsGraph/AnalyticsGraph";
import UpcomingEvents from "../components/UpcomingEvents/UpcomingEvents";
import ImportantContacts from "../components/ImportantContacts/ImportantContacts";

function PastEventCard() {
  return (
    <div className="h-28 rounded-2xl shadow-lg bg-gradient-to-br from-violet-400 to-indigo-500 text-white flex flex-col items-center justify-center p-3 gap-1 transition-transform duration-200 hover:scale-105">
      <div className="text-sm font-semibold">Past Events</div>
      <div className="text-2xl font-extrabold">15</div>
    </div>
  );
}

function TotalEventCard() {
  return (
    <div className="h-28 rounded-2xl shadow-lg bg-gradient-to-br from-blue-400 to-indigo-400 text-white flex flex-col items-center justify-center p-3 gap-1 transition-transform duration-200 hover:scale-105">
      <div className="text-sm font-semibold">Total Events</div>
      <div className="text-2xl font-extrabold">25</div>
    </div>
  );
}

export default function Dashboard() {
  return (
    <DashboardLayout>
      <div className="flex flex-col gap-4 max-w-7xl mx-auto px-4 py-3">
        
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

        <footer className="text-center text-gray-400 text-xs py-2 border-t bg-white rounded-xl shadow">
          &copy; 2025 Etribe. All rights reserved.
        </footer>
      </div>
    </DashboardLayout>
  );
}
