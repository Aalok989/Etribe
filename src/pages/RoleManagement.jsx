import React, { useState } from "react";
import DashboardLayout from "../components/Layout/DashboardLayout";
import { FiFileText, FiFile } from "react-icons/fi";

const roles = [
  "Admin",
  "Manager",
  "Support",
  "Finance",
  "HR",
  "IT",
  "Super Admin",
  "Custom Role 1",
  "Custom Role 2",
  "Custom Role 3",
  "Auditor",
  "Sales",
  "Marketing",
  "Developer",
  "QA",
  "Trainer",
  "Consultant",
  "Intern",
  "Guest",
  "Temp",
];

const modules = [
  "Group Setting",
  "SMTP Setting",
  "User Roles",
  "Role Manager",
  "System Account",
  "Account Password Change",
  "Message Setting",
  "Membership Plan",
  "Contact Management",
  "Membership Management",
  "Event Management",
];

const defaultPermissions = modules.map((mod) => ({
  module: mod,
  view: false,
  add: false,
  edit: false,
  delete: false,
}));

export default function RoleManagement() {
  const [selectedRole, setSelectedRole] = useState(roles[0]);
  const [permissions, setPermissions] = useState(defaultPermissions);
  const [showSuccess, setShowSuccess] = useState(false);

  const handleRoleChange = (e) => {
    setSelectedRole(e.target.value);
    setPermissions(defaultPermissions); // Reset permissions on role change (or load from backend)
  };

  const handlePermissionChange = (idx, perm) => {
    setPermissions((prev) =>
      prev.map((row, i) =>
        i === idx ? { ...row, [perm]: !row[perm] } : row
      )
    );
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Save permissions for selectedRole (send to backend)
    setShowSuccess(true);
  };

  const handleSuccessClose = () => {
    setShowSuccess(false);
    setPermissions(defaultPermissions);
  };

  return (
    <DashboardLayout>
      <div className="flex flex-col gap-4 py-3">
        <h1 className="text-2xl font-bold mb-4">Role Management</h1>
        <div className="rounded-2xl shadow-lg bg-white max-w-7xl w-full mx-auto px-4">
          {/* Controls */}
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 px-6 py-4 border-b border-gray-100">
            <div className="flex items-center gap-2">
              <label className="font-medium text-gray-700">Select Role:</label>
              <select
                className="border rounded-lg px-3 py-1 text-sm bg-indigo-50 text-indigo-700 focus:ring-2 focus:ring-indigo-400"
                value={selectedRole}
                onChange={handleRoleChange}
                style={{ minWidth: 180 }}
              >
                {roles.map((role, idx) => (
                  <option key={idx} value={role}>{role}</option>
                ))}
              </select>
            </div>
            {/* No export buttons as requested */}
          </div>
          {/* Table */}
          <div className="overflow-x-auto p-6 w-full">
            <table className="min-w-max text-sm w-full">
              <thead className="bg-indigo-50 text-indigo-700 sticky top-0 z-10">
                <tr>
                  <th className="px-6 py-3 rounded-l-xl text-left">Module</th>
                  <th className="px-6 py-3 text-center">View</th>
                  <th className="px-6 py-3 text-center">Add</th>
                  <th className="px-6 py-3 text-center">Edit</th>
                  <th className="px-6 py-3 rounded-r-xl text-center">Delete</th>
                </tr>
              </thead>
              <tbody className="border-separate border-spacing-y-2">
                {permissions.map((row, idx) => (
                  <tr key={row.module} className="bg-white shadow rounded-xl">
                    <td className="px-6 py-3 text-left font-semibold text-gray-800">{row.module}</td>
                    <td className="px-6 py-3 text-center">
                      <input
                        type="checkbox"
                        checked={row.view}
                        onChange={() => handlePermissionChange(idx, "view")}
                        className="form-checkbox h-5 w-5 text-indigo-600 rounded"
                      />
                    </td>
                    <td className="px-6 py-3 text-center">
                      <input
                        type="checkbox"
                        checked={row.add}
                        onChange={() => handlePermissionChange(idx, "add")}
                        className="form-checkbox h-5 w-5 text-indigo-600 rounded"
                      />
                    </td>
                    <td className="px-6 py-3 text-center">
                      <input
                        type="checkbox"
                        checked={row.edit}
                        onChange={() => handlePermissionChange(idx, "edit")}
                        className="form-checkbox h-5 w-5 text-indigo-600 rounded"
                      />
                    </td>
                    <td className="px-6 py-3 text-center">
                      <input
                        type="checkbox"
                        checked={row.delete}
                        onChange={() => handlePermissionChange(idx, "delete")}
                        className="form-checkbox h-5 w-5 text-indigo-600 rounded"
                      />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            <div className="flex justify-end mt-8">
              <button
                className="px-8 py-2 rounded-lg font-semibold shadow bg-green-600 text-white hover:bg-green-700 transition"
                onClick={handleSubmit}
              >
                Submit
              </button>
            </div>
          </div>
        </div>
        {/* Success Modal */}
        {showSuccess && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40">
            <div className="bg-white rounded-2xl shadow-xl p-8 w-full max-w-md relative flex flex-col items-center">
              <span className="text-green-600 text-3xl mb-4">&#10003;</span>
              <h2 className="text-xl font-bold mb-2 text-indigo-700">Roles assigned successfully</h2>
              <button
                className="mt-4 px-8 py-2 rounded-lg font-semibold shadow bg-green-600 text-white hover:bg-green-700 transition"
                onClick={handleSuccessClose}
              >
                Close
              </button>
            </div>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
} 