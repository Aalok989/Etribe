import React, { useState, useEffect } from "react";
import DashboardLayout from "../components/Layout/DashboardLayout";
import { FiDownload, FiFilter, FiEdit2, FiTrash2, FiChevronDown, FiChevronUp, FiFileText, FiFile, FiX, FiCopy } from "react-icons/fi";

const contactsData = [
  { id: 1, dept: "CEO", name: "Rohit Arya", contact: "1234567890", email: "rohit@company.com", address: "123 Main St" },
  { id: 2, dept: "HR", name: "Priya Singh", contact: "9876543210", email: "priya@company.com", address: "456 Park Ave" },
  { id: 3, dept: "Tech", name: "Amit Kumar", contact: "5551234567", email: "amit@company.com", address: "789 Tech Blvd" },
  { id: 4, dept: "HR", name: "Neha Verma", contact: "4445556666", email: "neha@company.com", address: "321 Lake Rd" },
  { id: 5, dept: "Finance", name: "Suresh Patel", contact: "3332221111", email: "suresh@company.com", address: "654 Finance St" },
  { id: 6, dept: "Tech", name: "Sunita Rao", contact: "2223334444", email: "sunita@company.com", address: "987 Tech Park" },
  { id: 7, dept: "Admin", name: "Vikas Sharma", contact: "1112223333", email: "vikas@company.com", address: "159 Admin Ave" },
  { id: 8, dept: "Finance", name: "Meena Joshi", contact: "8889990000", email: "meena@company.com", address: "753 Finance Blvd" },
  { id: 9, dept: "CEO", name: "Anil Kapoor", contact: "7778889999", email: "anil@company.com", address: "852 Main St" },
  { id: 10, dept: "HR", name: "Kiran Desai", contact: "6665554444", email: "kiran@company.com", address: "357 HR Lane" },
  { id: 11, dept: "Admin", name: "Ritu Singh", contact: "9998887777", email: "ritu@company.com", address: "951 Admin Rd" },
  { id: 12, dept: "Tech", name: "Deepak Mehta", contact: "1231231234", email: "deepak@company.com", address: "246 Tech Ave" },
  { id: 13, dept: "Finance", name: "Pooja Agarwal", contact: "3213214321", email: "pooja@company.com", address: "135 Finance St" },
  { id: 14, dept: "CEO", name: "Sanjay Dutt", contact: "5556667777", email: "sanjay@company.com", address: "864 Main St" },
  { id: 15, dept: "HR", name: "Asha Parekh", contact: "4443332222", email: "asha@company.com", address: "753 HR Blvd" },
];

const departments = ["All", ...Array.from(new Set(contactsData.map(c => c.dept)))];

export default function ImportantContactsPage() {
  const [filter, setFilter] = useState("All");
  const [sortAsc, setSortAsc] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [entriesPerPage, setEntriesPerPage] = useState(10);
  const [editContact, setEditContact] = useState(null);
  const [deleteContact, setDeleteContact] = useState(null);
  const [deleteConfirm, setDeleteConfirm] = useState("");

  const filteredContacts = filter === "All"
    ? contactsData
    : contactsData.filter(c => c.dept === filter);

  const sortedContacts = [...filteredContacts].sort((a, b) => {
    if (sortAsc) {
      return a.name.localeCompare(b.name);
    } else {
      return b.name.localeCompare(a.name);
    }
  });

  // Pagination logic
  const totalEntries = sortedContacts.length;
  const totalPages = Math.ceil(totalEntries / entriesPerPage);
  const startIdx = (currentPage - 1) * entriesPerPage;
  const endIdx = startIdx + entriesPerPage;
  const paginatedContacts = sortedContacts.slice(startIdx, endIdx);

  const handlePrev = () => setCurrentPage((p) => Math.max(1, p - 1));
  const handleNext = () => setCurrentPage((p) => Math.min(totalPages, p + 1));
  const handleEntriesChange = (e) => {
    setEntriesPerPage(Number(e.target.value));
    setCurrentPage(1);
  };

  // Handlers for edit form
  const [editForm, setEditForm] = useState({ id: '', dept: '', name: '', contact: '', email: '', address: '' });
  React.useEffect(() => {
    if (editContact) {
      setEditForm(editContact);
    }
  }, [editContact]);

  const handleEditChange = (e) => {
    setEditForm({ ...editForm, [e.target.name]: e.target.value });
  };

  const handleEditSave = () => {
    // Here you would update the contact in your data source
    setEditContact(null);
  };

  const handleDelete = () => {
    // Here you would delete the contact from your data source
    setDeleteContact(null);
    setDeleteConfirm("");
  };

  // Add a copy handler
  const handleCopy = (value) => {
    navigator.clipboard.writeText(value);
  };

  return (
    <DashboardLayout>
      <div className="flex flex-col gap-4 py-3">
        <h1 className="text-2xl font-bold mb-4">Important Contacts</h1>
        <div className="rounded-2xl shadow-lg bg-white">
          {/* Controls */}
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 px-6 py-4 border-b border-gray-100">
            <div className="flex gap-2 items-center">
              <FiFilter className="text-indigo-500" />
              <label htmlFor="dept-filter" className="mr-2 text-sm font-medium text-indigo-700">Dept:</label>
              <select
                id="dept-filter"
                className="border-none rounded-lg px-3 py-1 text-sm bg-indigo-100 text-indigo-700 focus:ring-2 focus:ring-indigo-400"
                value={filter}
                onChange={e => setFilter(e.target.value)}
              >
                {departments.map(dept => (
                  <option key={dept} value={dept}>{dept}</option>
                ))}
              </select>
            </div>
            <div className="flex gap-2 items-center">
              <button className="flex items-center gap-1 bg-blue-500 text-white px-3 py-1.5 rounded-lg text-sm font-medium hover:bg-blue-600 transition"><FiFileText />CSV</button>
              <button className="flex items-center gap-1 bg-emerald-500 text-white px-3 py-1.5 rounded-lg text-sm font-medium hover:bg-emerald-600 transition"><FiFile />Excel</button>
              <button className="flex items-center gap-1 bg-rose-500 text-white px-3 py-1.5 rounded-lg text-sm font-medium hover:bg-rose-600 transition"><FiFile />PDF</button>
            </div>
          </div>
          {/* Table */}
          <div className="overflow-x-auto p-6">
            <table className="min-w-full text-sm">
              <thead className="bg-indigo-50 text-indigo-700 sticky top-0 z-10">
                <tr>
                  <th className="p-3 rounded-l-xl text-left">Sr No</th>
                  <th className="p-3 text-left">Department</th>
                  <th className="p-3 text-left flex items-center gap-1">
                    <span>Person</span>
                    <button onClick={() => setSortAsc(a => !a)} className="focus:outline-none">
                      {sortAsc ? <FiChevronDown /> : <FiChevronUp />}
                    </button>
                  </th>
                  <th className="p-3 text-left">Contact</th>
                  <th className="p-3 text-left">Email ID</th>
                  <th className="p-3 text-left">Address</th>
                  <th className="p-3 rounded-r-xl text-center">Action</th>
                </tr>
              </thead>
              <tbody className="border-separate border-spacing-y-2">
                {paginatedContacts.map((c, idx) => (
                  <tr key={c.id} className="bg-white shadow rounded-xl">
                    <td className="p-3 text-center font-semibold text-indigo-700">{startIdx + idx + 1}</td>
                    <td className="p-3">{c.dept}</td>
                    <td className="p-3">{c.name}</td>
                    <td className="p-3">
                      <div className="flex items-center gap-1">
                        {c.contact}
                        <button
                          className="p-1 rounded hover:bg-indigo-100 text-indigo-500 hover:text-indigo-700 focus:outline-none"
                          title="Copy phone number"
                          onClick={() => handleCopy(c.contact)}
                          style={{ lineHeight: 0 }}
                        >
                          <FiCopy size={16} />
                        </button>
                      </div>
                    </td>
                    <td className="p-3">
                      <div className="flex items-center gap-1">
                        {c.email}
                        <button
                          className="p-1 rounded hover:bg-indigo-100 text-indigo-500 hover:text-indigo-700 focus:outline-none"
                          title="Copy email address"
                          onClick={() => handleCopy(c.email)}
                          style={{ lineHeight: 0 }}
                        >
                          <FiCopy size={16} />
                        </button>
                      </div>
                    </td>
                    <td className="p-3">{c.address}</td>
                    <td className="p-3 flex gap-2 justify-center">
                      <button
                        className="flex items-center gap-1 bg-yellow-400 text-white px-2 py-1.5 rounded-lg text-xs font-semibold hover:bg-yellow-500 transition"
                        onClick={() => setEditContact(c)}
                      >
                        <FiEdit2 />Modify
                      </button>
                      <button
                        className="flex items-center gap-1 bg-rose-500 text-white px-2 py-1.5 rounded-lg text-xs font-semibold hover:bg-rose-600 transition"
                        onClick={() => setDeleteContact(c)}
                      >
                        <FiTrash2 />Delete
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
                  {[2, 5, 10].map(num => (
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

        {/* Edit Popup */}
        {editContact && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40">
            <div className="bg-white rounded-2xl shadow-xl p-8 w-full max-w-md relative">
              <button
                className="absolute top-3 right-3 text-gray-400 hover:text-rose-500"
                onClick={() => setEditContact(null)}
                title="Close"
              >
                <FiX size={22} />
              </button>
              <h2 className="text-xl font-bold mb-4 text-indigo-700">Edit Contact</h2>
              <form className="flex flex-col gap-3">
                <label className="text-sm font-medium text-gray-700">Department
                  <input
                    type="text"
                    name="dept"
                    value={editForm.dept}
                    onChange={handleEditChange}
                    className="w-full mt-1 px-3 py-2 rounded-lg border border-gray-200 focus:ring-2 focus:ring-indigo-400"
                  />
                </label>
                <label className="text-sm font-medium text-gray-700">Person Name
                  <input
                    type="text"
                    name="name"
                    value={editForm.name}
                    onChange={handleEditChange}
                    className="w-full mt-1 px-3 py-2 rounded-lg border border-gray-200 focus:ring-2 focus:ring-indigo-400"
                  />
                </label>
                <label className="text-sm font-medium text-gray-700">Contact
                  <input
                    type="text"
                    name="contact"
                    value={editForm.contact}
                    onChange={handleEditChange}
                    className="w-full mt-1 px-3 py-2 rounded-lg border border-gray-200 focus:ring-2 focus:ring-indigo-400"
                  />
                </label>
                <label className="text-sm font-medium text-gray-700">Email ID
                  <input
                    type="email"
                    name="email"
                    value={editForm.email}
                    onChange={handleEditChange}
                    className="w-full mt-1 px-3 py-2 rounded-lg border border-gray-200 focus:ring-2 focus:ring-indigo-400"
                  />
                </label>
                <label className="text-sm font-medium text-gray-700">Address
                  <input
                    type="text"
                    name="address"
                    value={editForm.address}
                    onChange={handleEditChange}
                    className="w-full mt-1 px-3 py-2 rounded-lg border border-gray-200 focus:ring-2 focus:ring-indigo-400"
                  />
                </label>
                <button
                  type="button"
                  className="mt-4 bg-indigo-600 text-white px-4 py-2 rounded-lg font-semibold hover:bg-indigo-700 transition"
                  onClick={handleEditSave}
                >
                  Save
                </button>
              </form>
            </div>
          </div>
        )}

        {/* Delete Popup */}
        {deleteContact && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40">
            <div className="bg-white rounded-2xl shadow-xl p-8 w-full max-w-md relative">
              <button
                className="absolute top-3 right-3 text-gray-400 hover:text-rose-500"
                onClick={() => setDeleteContact(null)}
                title="Close"
              >
                <FiX size={22} />
              </button>
              <h2 className="text-xl font-bold mb-4 text-rose-600">Delete Contact</h2>
              <p className="mb-4 text-gray-700">Type <span className="font-mono bg-gray-100 px-2 py-1 rounded">Delete</span> to confirm deletion of <span className="font-semibold">{deleteContact.name}</span>.</p>
              <input
                type="text"
                className="w-full px-3 py-2 rounded-lg border border-gray-200 focus:ring-2 focus:ring-rose-400 mb-4"
                value={deleteConfirm}
                onChange={e => setDeleteConfirm(e.target.value)}
                placeholder="Type 'Delete' to confirm"
              />
              <button
                type="button"
                className={`bg-rose-600 text-white px-4 py-2 rounded-lg font-semibold hover:bg-rose-700 transition w-full ${deleteConfirm.trim().toLowerCase() === 'delete' ? 'font-bold' : 'opacity-50 cursor-not-allowed'}`}
                onClick={handleDelete}
                disabled={deleteConfirm.trim().toLowerCase() !== 'delete'}
              >
                Delete
              </button>
            </div>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
} 