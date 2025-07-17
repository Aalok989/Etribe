import React, { useState } from "react";
import DashboardLayout from "../components/Layout/DashboardLayout";
import { FiEdit2 } from "react-icons/fi";

const initialData = {
  companyField1: "GST No",
  companyField2: "IEC No",
  companyField3: "PAN",
  companyField4: "CIN No",
  companyField5: "Website",
  companyField6: "Helpline",
  companyField7: "Aadhar No",
  companyField8: "TAN No",
  companyField9: "MSME No",
  companyField10: "FSSAI No",
};

export default function CompanyAdditionalFields() {
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
        <h1 className="text-2xl font-bold mb-4">Company Additional Fields</h1>
        <div className="rounded-2xl shadow-lg bg-white max-w-7xl w-full mx-auto px-4">
          <div className="flex items-center px-0 pt-6 pb-2">
            <span className="text-lg font-semibold text-gray-800 flex-1 text-left">Configuration</span>
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
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-12 gap-y-8 mb-8 w-full">
                {Array.from({ length: 10 }).map((_, i) => (
                  <div key={i}>
                    <span className="font-bold text-gray-700 block mb-1">Company Field {i + 1}</span>
                    <span className="text-gray-900 text-base font-normal">{data[`companyField${i + 1}`]}</span>
                  </div>
                ))}
              </div>
            ) : (
              <form className="grid grid-cols-1 sm:grid-cols-2 gap-x-12 gap-y-8 mb-8 w-full" onSubmit={handleSubmit}>
                {Array.from({ length: 10 }).map((_, i) => (
                  <div className="flex flex-col gap-1" key={i}>
                    <label className="font-medium text-gray-700">Company Field {i + 1}</label>
                    <input
                      type="text"
                      name={`companyField${i + 1}`}
                      value={form[`companyField${i + 1}`]}
                      onChange={handleChange}
                      className="px-3 py-2 rounded-lg border border-gray-200 focus:ring-2 focus:ring-indigo-400"
                      required
                    />
                  </div>
                ))}
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