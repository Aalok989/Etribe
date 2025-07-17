import React, { useState } from "react";
import DashboardLayout from "../components/Layout/DashboardLayout";
import { FiEdit2, FiX } from "react-icons/fi";

const initialData = {
  smtpHost: "smtp.example.com",
  smtpUser: "user@example.com",
  smtpPassword: "********",
  smtpProtocol: "TLS",
  smtpPort: "587",
  senderEmail: "noreply@example.com",
  senderName: "Etribe System",
  replyToEmail: "support@example.com",
};

export default function SMTPSettings() {
  const [data, setData] = useState(initialData);
  const [editMode, setEditMode] = useState(false);
  const [form, setForm] = useState(initialData);

  const handleEdit = () => {
    setForm(data);
    setEditMode(true);
  };
  const handleCancel = () => setEditMode(false);
  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });
  const handleSubmit = (e) => {
    e.preventDefault();
    setData(form);
    setEditMode(false);
  };

  return (
    <DashboardLayout>
      <div className="flex flex-col gap-4 py-3">
        <h1 className="text-2xl font-bold mb-4">SMTP Settings</h1>
        <div className="rounded-2xl shadow-lg bg-white max-w-7xl w-full mx-auto px-4">
          <div className="flex items-center px-0 pt-6 pb-2">
            <span className="text-lg font-semibold text-gray-800 flex-1 text-left">SMTP Configuration</span>
            {!editMode && (
              <button
                className="flex items-center gap-2 px-7 py-2 bg-indigo-600 text-white rounded-lg font-semibold shadow hover:bg-indigo-700 transition"
                onClick={handleEdit}
              >
                <FiEdit2 /> Edit
              </button>
            )}
          </div>
          <div className="pt-4 pb-6 px-0">
            {!editMode ? (
              <div className="flex flex-col gap-6 mb-8 w-full">
                <div className="flex items-center gap-6">
                  <span className="font-bold text-gray-700 w-56">SMTP Host</span>
                  <span className="text-gray-900 text-base font-normal flex-1">{data.smtpHost}</span>
                </div>
                <div className="flex items-center gap-6">
                  <span className="font-bold text-gray-700 w-56">SMTP User</span>
                  <span className="text-gray-900 text-base font-normal flex-1">{data.smtpUser}</span>
                </div>
                <div className="flex items-center gap-6">
                  <span className="font-bold text-gray-700 w-56">SMTP Password</span>
                  <span className="text-gray-900 text-base font-normal flex-1">{data.smtpPassword}</span>
                </div>
                <div className="flex items-center gap-6">
                  <span className="font-bold text-gray-700 w-56">SMTP Protocol</span>
                  <span className="text-gray-900 text-base font-normal flex-1">{data.smtpProtocol}</span>
                </div>
                <div className="flex items-center gap-6">
                  <span className="font-bold text-gray-700 w-56">SMTP Port</span>
                  <span className="text-gray-900 text-base font-normal flex-1">{data.smtpPort}</span>
                </div>
                <div className="flex items-center gap-6">
                  <span className="font-bold text-gray-700 w-56">Sender Email</span>
                  <span className="text-gray-900 text-base font-normal flex-1">{data.senderEmail}</span>
                </div>
                <div className="flex items-center gap-6">
                  <span className="font-bold text-gray-700 w-56">Sender Name</span>
                  <span className="text-gray-900 text-base font-normal flex-1">{data.senderName}</span>
                </div>
                <div className="flex items-center gap-6">
                  <span className="font-bold text-gray-700 w-56">Reply To Email</span>
                  <span className="text-gray-900 text-base font-normal flex-1">{data.replyToEmail}</span>
                </div>
              </div>
            ) : (
              <form className="flex flex-col gap-6 mb-8 w-full" onSubmit={handleSubmit}>
                <div className="flex items-center gap-6">
                  <label className="font-medium text-gray-700 w-56 mb-0">SMTP Host</label>
                  <input
                    type="text"
                    name="smtpHost"
                    value={form.smtpHost}
                    onChange={handleChange}
                    className="flex-1 px-3 py-2 rounded-lg border border-gray-200 focus:ring-2 focus:ring-indigo-400"
                    required
                  />
                </div>
                <div className="flex items-center gap-6">
                  <label className="font-medium text-gray-700 w-56 mb-0">SMTP User</label>
                  <input
                    type="text"
                    name="smtpUser"
                    value={form.smtpUser}
                    onChange={handleChange}
                    className="flex-1 px-3 py-2 rounded-lg border border-gray-200 focus:ring-2 focus:ring-indigo-400"
                    required
                  />
                </div>
                <div className="flex items-center gap-6">
                  <label className="font-medium text-gray-700 w-56 mb-0">SMTP Password</label>
                  <input
                    type="password"
                    name="smtpPassword"
                    value={form.smtpPassword}
                    onChange={handleChange}
                    className="flex-1 px-3 py-2 rounded-lg border border-gray-200 focus:ring-2 focus:ring-indigo-400"
                    required
                  />
                </div>
                <div className="flex items-center gap-6">
                  <label className="font-medium text-gray-700 w-56 mb-0">SMTP Protocol</label>
                  <input
                    type="text"
                    name="smtpProtocol"
                    value={form.smtpProtocol}
                    onChange={handleChange}
                    className="flex-1 px-3 py-2 rounded-lg border border-gray-200 focus:ring-2 focus:ring-indigo-400"
                    required
                  />
                </div>
                <div className="flex items-center gap-6">
                  <label className="font-medium text-gray-700 w-56 mb-0">SMTP Port</label>
                  <input
                    type="text"
                    name="smtpPort"
                    value={form.smtpPort}
                    onChange={handleChange}
                    className="flex-1 px-3 py-2 rounded-lg border border-gray-200 focus:ring-2 focus:ring-indigo-400"
                    required
                  />
                </div>
                <div className="flex items-center gap-6">
                  <label className="font-medium text-gray-700 w-56 mb-0">Sender Email</label>
                  <input
                    type="email"
                    name="senderEmail"
                    value={form.senderEmail}
                    onChange={handleChange}
                    className="flex-1 px-3 py-2 rounded-lg border border-gray-200 focus:ring-2 focus:ring-indigo-400"
                    required
                  />
                </div>
                <div className="flex items-center gap-6">
                  <label className="font-medium text-gray-700 w-56 mb-0">Sender Name</label>
                  <input
                    type="text"
                    name="senderName"
                    value={form.senderName}
                    onChange={handleChange}
                    className="flex-1 px-3 py-2 rounded-lg border border-gray-200 focus:ring-2 focus:ring-indigo-400"
                    required
                  />
                </div>
                <div className="flex items-center gap-6">
                  <label className="font-medium text-gray-700 w-56 mb-0">Reply To Email</label>
                  <input
                    type="email"
                    name="replyToEmail"
                    value={form.replyToEmail}
                    onChange={handleChange}
                    className="flex-1 px-3 py-2 rounded-lg border border-gray-200 focus:ring-2 focus:ring-indigo-400"
                    required
                  />
                </div>
                <div className="col-span-2 flex justify-end gap-3 mt-4">
                  <button
                    type="button"
                    className="bg-gray-200 text-gray-700 px-6 py-2 rounded-lg font-semibold hover:bg-gray-300 transition"
                    onClick={handleCancel}
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="bg-green-600 text-white px-8 py-2 rounded-lg font-semibold shadow hover:bg-green-700 transition"
                  >
                    Save
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
} 