import React from "react";
import DashboardLayout from "../components/Layout/DashboardLayout";

export default function ActiveMembers() {
  return (
    <DashboardLayout>
      <div className="flex flex-col gap-4 py-3">
        <h1 className="text-2xl font-bold mb-4">Active Members</h1>
        <div className="rounded-2xl shadow-lg bg-white p-8 text-center text-gray-500">
          Active members content goes here.
        </div>
      </div>
    </DashboardLayout>
  );
} 