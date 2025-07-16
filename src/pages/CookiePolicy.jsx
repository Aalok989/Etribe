import React from "react";
import DashboardLayout from "../components/Layout/DashboardLayout";

export default function CookiePolicy() {
  return (
    <DashboardLayout>
      <div className="flex flex-col gap-4 py-3">
        <h1 className="text-2xl font-bold mb-4">Cookie Policy</h1>
        <div className="rounded-2xl shadow-lg bg-white p-8 text-center text-gray-700">
          This is the Cookie Policy page. Add your organization's cookie usage policy here.
        </div>
      </div>
    </DashboardLayout>
  );
} 