import React, { useState } from "react";
import DashboardLayout from "../components/Layout/DashboardLayout";
import { FiEdit2, FiPlus, FiFileText, FiFile, FiX } from "react-icons/fi";

const initialRoles = [
  { role: "Admin" },
  { role: "Manager" },
  { role: "Support" },
  { role: "Finance" },
  { role: "HR" },
  { role: "IT" },
  { role: "Super Admin" },
  { role: "Custom Role 1" },
  { role: "Custom Role 2" },
  { role: "Custom Role 3" },
  { role: "Auditor" },
  { role: "Sales" },
  { role: "Marketing" },
  { role: "Developer" },
  { role: "QA" },
  { role: "Trainer" },
  { role: "Consultant" },
  { role: "Intern" },
  { role: "Guest" },
  { role: "Temp" },
];

export default function UserRoles() {
  const [roles, setRoles] = useState(initialRoles);
  const [search, setSearch] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [entriesPerPage, setEntriesPerPage] = useState(5);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showAddModal, setShowAddModal] = useState(false);
  const [selectedRoleIdx, setSelectedRoleIdx] = useState(null);
  const [editForm, setEditForm] = useState({ role: "" });
  const [addForm, setAddForm] = useState({ role: "" });

  // Filtered and paginated data
  const filtered = roles.filter(r => r.role.toLowerCase().includes(search.toLowerCase()));
  const totalEntries = filtered.length;
  const totalPages = Math.ceil(totalEntries / entriesPerPage);
  const startIdx = (currentPage - 1) * entriesPerPage;
  const paginated = filtered.slice(startIdx, startIdx + entriesPerPage);

  const handlePrev = () => setCurrentPage(p => Math.max(1, p - 1));
  const handleNext = () => setCurrentPage(p => Math.min(totalPages, p + 1));
  const handleEntriesChange = e => {
    setEntriesPerPage(Number(e.target.value));
    setCurrentPage(1);
  };

  // Edit Role Modal
  const openEditModal = (idx) => {
    setSelectedRoleIdx(idx);
    setEditForm({ role: roles[startIdx + idx].role });
    setShowEditModal(true);
  };
  const closeEditModal = () => setShowEditModal(false);
  const handleEditChange = (e) => setEditForm({ ...editForm, [e.target.name]: e.target.value });
  const handleEditSubmit = (e) => {
    e.preventDefault();
    const updated = [...roles];
    updated[startIdx + selectedRoleIdx].role = editForm.role;
    setRoles(updated);
    setShowEditModal(false);
  };

  // Add Role Modal
  const openAddModal = () => {
    setAddForm({ role: "" });
    setShowAddModal(true);
  };
  const closeAddModal = () => setShowAddModal(false);
  const handleAddChange = (e) => setAddForm({ ...addForm, [e.target.name]: e.target.value });
  const handleAddSubmit = (e) => {
    e.preventDefault();
    setRoles([...roles, { role: addForm.role }]);
    setShowAddModal(false);
  };

  return (
    <DashboardLayout>
      <div className="flex flex-col gap-4 py-3">
        <h1 className="text-2xl font-bold mb-4">User Roles</h1>
        <div className="rounded-2xl shadow-lg bg-white max-w-7xl w-full mx-auto px-4">
          {/* Controls */}
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 px-6 py-4 border-b border-gray-100">
            <input
              type="text"
              placeholder="Search by role..."
              className="border rounded-lg px-3 py-1 text-sm bg-indigo-50 text-indigo-700 focus:ring-2 focus:ring-indigo-400"
              value={search}
              onChange={e => setSearch(e.target.value)}
              style={{ maxWidth: 220 }}
            />
            <div className="flex gap-2 items-center">
              <button className="flex items-center gap-1 bg-blue-500 text-white px-3 py-1.5 rounded-lg text-sm font-medium hover:bg-blue-600 transition"><FiFileText />CSV</button>
              <button className="flex items-center gap-1 bg-emerald-500 text-white px-3 py-1.5 rounded-lg text-sm font-medium hover:bg-emerald-600 transition"><FiFile />Excel</button>
              <button className="flex items-center gap-1 bg-rose-500 text-white px-3 py-1.5 rounded-lg text-sm font-medium hover:bg-rose-600 transition"><FiFile />PDF</button>
              <button
                className="flex items-center gap-2 px-7 py-2 bg-green-600 text-white rounded-lg font-semibold shadow hover:bg-green-700 transition"
                onClick={openAddModal}
              >
                <FiPlus /> Add
              </button>
            </div>
          </div>
          {/* Table */}
          <div className="overflow-x-auto p-6 w-full">
            <table className="min-w-max text-sm w-full">
              <thead className="bg-indigo-50 text-indigo-700 sticky top-0 z-10">
                <tr>
                  <th className="px-6 py-3 rounded-l-xl text-left">Sr No</th>
                  <th className="px-6 py-3 text-left">Role</th>
                  <th className="px-6 py-3 rounded-r-xl text-center">Action</th>
                </tr>
              </thead>
              <tbody className="border-separate border-spacing-y-2">
                {paginated.map((r, idx) => (
                  <tr key={idx} className="bg-white shadow rounded-xl">
                    <td className="px-6 py-3 text-left font-semibold text-indigo-700">{startIdx + idx + 1}</td>
                    <td className="px-6 py-3 text-left">{r.role}</td>
                    <td className="px-6 py-3 flex justify-center">
                      <button
                        className="text-indigo-600 hover:text-indigo-900 p-2 rounded-full hover:bg-indigo-50 transition"
                        onClick={() => openEditModal(idx)}
                        title="Edit Role"
                      >
                        <FiEdit2 size={18} />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            {/* Pagination Controls */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 mt-4">
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
          </div>
        </div>

        {/* Edit Role Modal */}
        {showEditModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40">
            <div className="bg-white rounded-2xl shadow-xl p-8 w-full max-w-md relative">
              <button
                className="absolute top-3 right-3 text-gray-400 hover:text-rose-500"
                onClick={closeEditModal}
                title="Close"
              >
                <FiX size={22} />
              </button>
              <h2 className="text-xl font-bold mb-4 text-indigo-700">Update Role</h2>
              <form className="flex flex-col gap-6" onSubmit={handleEditSubmit}>
                <div className="flex flex-col gap-1">
                  <label className="font-medium text-gray-700">Role</label>
                  <input
                    type="text"
                    name="role"
                    value={editForm.role}
                    onChange={handleEditChange}
                    className="px-3 py-2 rounded-lg border border-gray-200 focus:ring-2 focus:ring-indigo-400"
                    required
                  />
                </div>
                <div className="flex justify-end gap-4 mt-6">
                  <button
                    type="button"
                    className="px-8 py-2 rounded-lg font-semibold shadow bg-gray-300 text-gray-700 hover:bg-gray-400 transition"
                    onClick={closeEditModal}
                  >
                    Close
                  </button>
                  <button
                    type="submit"
                    className="px-8 py-2 rounded-lg font-semibold shadow bg-green-600 text-white hover:bg-green-700 transition"
                  >
                    Update
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Add Role Modal */}
        {showAddModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40">
            <div className="bg-white rounded-2xl shadow-xl p-8 w-full max-w-md relative">
              <button
                className="absolute top-3 right-3 text-gray-400 hover:text-rose-500"
                onClick={closeAddModal}
                title="Close"
              >
                <FiX size={22} />
              </button>
              <h2 className="text-xl font-bold mb-4 text-indigo-700">Add New Role</h2>
              <form className="flex flex-col gap-6" onSubmit={handleAddSubmit}>
                <div className="flex flex-col gap-1">
                  <label className="font-medium text-gray-700">Role</label>
                  <input
                    type="text"
                    name="role"
                    value={addForm.role}
                    onChange={handleAddChange}
                    className="px-3 py-2 rounded-lg border border-gray-200 focus:ring-2 focus:ring-indigo-400"
                    required
                  />
                </div>
                <div className="flex justify-end gap-4 mt-6">
                  <button
                    type="button"
                    className="px-8 py-2 rounded-lg font-semibold shadow bg-gray-300 text-gray-700 hover:bg-gray-400 transition"
                    onClick={closeAddModal}
                  >
                    Close
                  </button>
                  <button
                    type="submit"
                    className="px-8 py-2 rounded-lg font-semibold shadow bg-green-600 text-white hover:bg-green-700 transition"
                  >
                    Submit
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
} 