import React, { useState } from "react";
import DashboardLayout from "../components/Layout/DashboardLayout";
import { FiEdit2 } from "react-icons/fi";

const initialData = {
  messageUrl: "https://api.example.com/send-message",
  mobileNoKey: "mobile_number",
  messageKey: "msg_key_123456",
};

export default function MessageSettings() {
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
        <h1 className="text-2xl font-bold mb-4">Message Settings</h1>
        <div className="rounded-2xl shadow-lg bg-white max-w-7xl w-full mx-auto px-4">
          <div className="flex items-center px-0 pt-6 pb-2">
            <span className="text-lg font-semibold text-gray-800 flex-1 text-left">Message Configuration</span>
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
                  <span className="font-bold text-gray-700 w-48">Message Url</span>
                  <span className="text-gray-900 text-base font-normal flex-1">{data.messageUrl}</span>
                </div>
                <div className="flex items-center gap-6">
                  <span className="font-bold text-gray-700 w-48">Mobile No. Key</span>
                  <span className="text-gray-900 text-base font-normal flex-1">{data.mobileNoKey}</span>
                </div>
                <div className="flex items-center gap-6">
                  <span className="font-bold text-gray-700 w-48">Message Key</span>
                  <span className="text-gray-900 text-base font-normal flex-1">{data.messageKey}</span>
                </div>
              </div>
            ) : (
              <form className="flex flex-col gap-6 mb-8 w-full" onSubmit={handleSubmit}>
                <div className="flex items-center gap-6">
                  <label className="font-medium text-gray-700 w-48 mb-0">Message Url</label>
                  <input
                    type="text"
                    name="messageUrl"
                    value={form.messageUrl}
                    onChange={handleChange}
                    className="flex-1 px-3 py-2 rounded-lg border border-gray-200 focus:ring-2 focus:ring-indigo-400"
                    required
                  />
                </div>
                <div className="flex items-center gap-6">
                  <label className="font-medium text-gray-700 w-48 mb-0">Mobile No. Key</label>
                  <input
                    type="text"
                    name="mobileNoKey"
                    value={form.mobileNoKey}
                    onChange={handleChange}
                    className="flex-1 px-3 py-2 rounded-lg border border-gray-200 focus:ring-2 focus:ring-indigo-400"
                    required
                  />
                </div>
                <div className="flex items-center gap-6">
                  <label className="font-medium text-gray-700 w-48 mb-0">Message Key</label>
                  <input
                    type="text"
                    name="messageKey"
                    value={form.messageKey}
                    onChange={handleChange}
                    className="flex-1 px-3 py-2 rounded-lg border border-gray-200 focus:ring-2 focus:ring-indigo-400"
                    required
                  />
                </div>
                <div className="col-span-2 flex justify-end gap-4 mt-6">
                  <button
                    type="button"
                    className="px-8 py-2 rounded-lg font-semibold shadow bg-red-600 text-white hover:bg-red-700 transition"
                    onClick={handleCancel}
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-8 py-2 rounded-lg font-semibold shadow bg-green-600 text-white hover:bg-green-700 transition"
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