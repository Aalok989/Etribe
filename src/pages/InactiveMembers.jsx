import React from "react";
import DashboardLayout from "../components/Layout/DashboardLayout";

export default function InactiveMembers() {
  return (
    <DashboardLayout>
      <div className="flex flex-col gap-4 py-3">
        <h1 className="text-2xl font-bold mb-4">Inactive Members</h1>
        <div className="rounded-2xl shadow-lg bg-white p-8 text-center text-gray-500">
          Inactive members content goes here.
        </div>
      </div>
    </DashboardLayout>
  );
} 