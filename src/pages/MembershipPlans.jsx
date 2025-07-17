import React, { useState } from "react";
import DashboardLayout from "../components/Layout/DashboardLayout";
import { FiPlus, FiX } from "react-icons/fi";

const initialPlans = [
  { name: "Basic", description: "Basic membership plan", price: "1000", validity: "12" },
  { name: "Premium", description: "Premium plan with extra features", price: "2500", validity: "24" },
  { name: "Gold", description: "Gold plan with all features", price: "5000", validity: "36" },
  { name: "Silver", description: "Silver plan for small businesses", price: "1500", validity: "12" },
  { name: "Platinum", description: "Platinum plan for enterprises", price: "10000", validity: "48" },
  { name: "Startup", description: "Startup plan for new companies", price: "800", validity: "6" },
  { name: "Enterprise", description: "Enterprise plan with priority support", price: "20000", validity: "60" },
  { name: "Student", description: "Student plan with limited features", price: "500", validity: "6" },
  { name: "Family", description: "Family plan for up to 5 users", price: "3000", validity: "24" },
  { name: "Corporate", description: "Corporate plan for large teams", price: "12000", validity: "36" },
  { name: "Trial", description: "Trial plan for 1 month", price: "0", validity: "1" },
  { name: "Annual", description: "Annual plan with discount", price: "9000", validity: "12" },
  { name: "Monthly", description: "Monthly plan for flexibility", price: "900", validity: "1" },
  { name: "Quarterly", description: "Quarterly plan for short term", price: "2500", validity: "3" },
  { name: "Half-Yearly", description: "Half-yearly plan for medium term", price: "4500", validity: "6" },
  { name: "VIP", description: "VIP plan with exclusive features", price: "15000", validity: "24" },
  { name: "Partner", description: "Partner plan for affiliates", price: "7000", validity: "18" },
  { name: "NGO", description: "Special plan for NGOs", price: "500", validity: "12" },
  { name: "Lifetime", description: "Lifetime access plan", price: "50000", validity: "999" },
  { name: "Custom", description: "Custom plan for special needs", price: "0", validity: "0" },
];

export default function MembershipPlans() {
  const [plans, setPlans] = useState(initialPlans);
  const [addMode, setAddMode] = useState(false);
  const [form, setForm] = useState({ name: "", description: "", price: "", validity: "" });
  const [currentPage, setCurrentPage] = useState(1);
  const [entriesPerPage, setEntriesPerPage] = useState(5);

  const totalEntries = plans.length;
  const totalPages = Math.ceil(totalEntries / entriesPerPage);
  const startIdx = (currentPage - 1) * entriesPerPage;
  const paginated = plans.slice(startIdx, startIdx + entriesPerPage);

  const handlePrev = () => setCurrentPage(p => Math.max(1, p - 1));
  const handleNext = () => setCurrentPage(p => Math.min(totalPages, p + 1));
  const handleEntriesChange = e => {
    setEntriesPerPage(Number(e.target.value));
    setCurrentPage(1);
  };

  const handleAdd = () => {
    setForm({ name: "", description: "", price: "", validity: "" });
    setAddMode(true);
  };
  const handleCancel = () => setAddMode(false);
  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });
  const handleSubmit = (e) => {
    e.preventDefault();
    setPlans([...plans, form]);
    setAddMode(false);
  };

  return (
    <DashboardLayout>
      <div className="flex flex-col gap-4 py-3">
        <h1 className="text-2xl font-bold mb-4">Membership Plans</h1>
        <div className="rounded-2xl shadow-lg bg-white max-w-7xl w-full mx-auto px-4">
          <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
            <span className="text-lg font-semibold text-gray-800 flex-1 text-left">Plan List</span>
            {!addMode && (
              <button
                className="flex items-center gap-2 px-7 py-2 bg-green-600 text-white rounded-lg font-semibold shadow hover:bg-green-700 transition"
                onClick={handleAdd}
              >
                <FiPlus /> Add Plan
              </button>
            )}
          </div>
          <div className="overflow-x-auto p-6 w-full">
            <table className="min-w-full text-sm">
              <thead className="bg-indigo-50 text-indigo-700">
                <tr>
                  <th className="p-3 text-left">Sr No.</th>
                  <th className="p-3 text-left">Plan Name</th>
                  <th className="p-3 text-left">Description</th>
                  <th className="p-3 text-left">Price</th>
                  <th className="p-3 text-left">Validity (In Months)</th>
                </tr>
              </thead>
              <tbody className="border-separate border-spacing-y-2">
                {paginated.map((plan, idx) => (
                  <tr key={idx} className="bg-white shadow rounded-xl">
                    <td className="p-3">{startIdx + idx + 1}</td>
                    <td className="p-3">{plan.name}</td>
                    <td className="p-3">{plan.description}</td>
                    <td className="p-3">{plan.price}</td>
                    <td className="p-3">{plan.validity}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          {/* Pagination Controls */}
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 mt-4 mb-8">
            <div className="flex items-center gap-2">
              <span className="text-sm text-gray-600">Show</span>
              <select
                className="border-none rounded-lg px-2 py-1 text-sm bg-indigo-100 text-indigo-700 focus:ring-2 focus:ring-indigo-400"
                value={entriesPerPage}
                onChange={handleEntriesChange}
              >
                {[3, 5, 10, 20].map(num => (
                  <option key={num} value={num}>{num}</option>
                ))}
              </select>
              <span className="text-sm text-gray-600">entries</span>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={handlePrev}
                disabled={currentPage === 1}
                className={`px-2 py-1 rounded-lg text-indigo-600 hover:bg-indigo-100 transition ${currentPage === 1 ? 'opacity-50 cursor-not-allowed' : ''}`}
                title="Previous"
              >
                &lt;
              </button>
              <span className="text-sm font-semibold text-gray-700">Page {currentPage} of {totalPages}</span>
              <button
                onClick={handleNext}
                disabled={currentPage === totalPages}
                className={`px-2 py-1 rounded-lg text-indigo-600 hover:bg-indigo-100 transition ${currentPage === totalPages ? 'opacity-50 cursor-not-allowed' : ''}`}
                title="Next"
              >
                &gt;
              </button>
            </div>
          </div>
          {addMode && (
            <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40">
              <div className="bg-white rounded-2xl shadow-xl p-8 w-full max-w-lg relative">
                <button
                  className="absolute top-3 right-3 text-gray-400 hover:text-rose-500"
                  onClick={handleCancel}
                  title="Close"
                >
                  <FiX size={22} />
                </button>
                <h2 className="text-xl font-bold mb-4 text-indigo-700">Add Membership Plan</h2>
                <form className="grid grid-cols-1 gap-y-6" onSubmit={handleSubmit}>
                  <div className="flex flex-col gap-1">
                    <label className="font-medium text-gray-700 flex items-center gap-1">
                      Plan Name <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      name="name"
                      value={form.name}
                      onChange={handleChange}
                      className="px-3 py-2 rounded-lg border border-gray-200 focus:ring-2 focus:ring-indigo-400"
                      required
                    />
                  </div>
                  <div className="flex flex-col gap-1">
                    <label className="font-medium text-gray-700 flex items-center gap-1">
                      Plan Description <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      name="description"
                      value={form.description}
                      onChange={handleChange}
                      className="px-3 py-2 rounded-lg border border-gray-200 focus:ring-2 focus:ring-indigo-400"
                      required
                    />
                  </div>
                  <div className="flex flex-col gap-1">
                    <label className="font-medium text-gray-700 flex items-center gap-1">
                      Plan Price <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="number"
                      name="price"
                      value={form.price}
                      onChange={handleChange}
                      className="px-3 py-2 rounded-lg border border-gray-200 focus:ring-2 focus:ring-indigo-400"
                      required
                    />
                  </div>
                  <div className="flex flex-col gap-1">
                    <label className="font-medium text-gray-700 flex items-center gap-1">
                      Plan Validity (In Months) <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="number"
                      name="validity"
                      value={form.validity}
                      onChange={handleChange}
                      className="px-3 py-2 rounded-lg border border-gray-200 focus:ring-2 focus:ring-indigo-400"
                      required
                    />
                  </div>
                  <div className="flex justify-end gap-4 mt-6">
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
              </div>
            </div>
          )}
        </div>
      </div>
    </DashboardLayout>
  );
} 